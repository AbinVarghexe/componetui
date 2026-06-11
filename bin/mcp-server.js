const fs = require('fs')
const path = require('path')
const readline = require('readline')

const REGISTRY_DIR = path.resolve(__dirname, '..', 'registry')

function logError(...args) {
  console.error('[MCP Error]', ...args)
}

function logInfo(...args) {
  console.error('[MCP Info]', ...args)
}

// Custom implementation of MCP stdio transport using JSON-RPC 2.0
async function startMcpServer(helpers) {
  logInfo('Starting Gamin UI MCP Server...')

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })

  rl.on('line', (line) => {
    if (!line.trim()) return
    try {
      const request = JSON.parse(line)
      handleRequest(request)
    } catch (err) {
      logError('Failed to parse request line:', err)
      sendError(null, -32700, 'Parse error')
    }
  })

  function sendResponse(id, result) {
    const response = {
      jsonrpc: '2.0',
      id,
      result
    }
    process.stdout.write(JSON.stringify(response) + '\n')
  }

  function sendError(id, code, message, data) {
    const response = {
      jsonrpc: '2.0',
      id,
      error: { code, message, data }
    }
    process.stdout.write(JSON.stringify(response) + '\n')
  }

  function handleRequest(req) {
    const { jsonrpc, id, method, params } = req
    if (jsonrpc !== '2.0') {
      return sendError(id, -32600, 'Invalid Request: jsonrpc must be "2.0"')
    }

    switch (method) {
      case 'initialize':
        return handleInitialize(id, params)
      case 'notifications/initialized':
        // Handshake complete, no response required
        logInfo('MCP handshake completed successfully.')
        return
      case 'tools/list':
        return handleToolsList(id)
      case 'tools/call':
        return handleToolsCall(id, params)
      case 'ping':
        return sendResponse(id, {})
      default:
        return sendError(id, -32601, `Method not found: ${method}`)
    }
  }

  function handleInitialize(id, params) {
    sendResponse(id, {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: 'gamin-ui-mcp',
        version: '1.0.0'
      }
    })
  }

  function handleToolsList(id) {
    const tools = [
      {
        name: 'gamin_list_components',
        description: 'List all available components in the Gamin UI registry, including their names, descriptions, versions, and dependencies.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'gamin_search_components',
        description: 'Search the component registry by keyword or framework capability.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search query to match against component IDs, names, or descriptions.'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'gamin_get_component',
        description: 'Retrieve detailed metadata and full file contents for a specific component. Use this to inspect a component\'s code or imports before installing.',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique component ID (e.g. "button", "hero-modern").'
            }
          },
          required: ['id']
        }
      },
      {
        name: 'gamin_install_component',
        description: 'Install a component directly into a local project directory. This copies the source files and automatically resolves and installs package dependencies.',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique ID of the component to install.'
            },
            dest: {
              type: 'string',
              description: 'Absolute path to the destination project root. Defaults to the current working directory.'
            },
            installDeps: {
              type: 'boolean',
              description: 'Automatically resolve and install dependencies. Defaults to true.'
            }
          },
          required: ['id']
        }
      }
    ]
    sendResponse(id, { tools })
  }

  async function handleToolsCall(id, params) {
    const { name, arguments: args } = params
    logInfo(`Calling tool: ${name} with args:`, args)

    try {
      switch (name) {
        case 'gamin_list_components': {
          const comps = getRegistryComponents()
          return sendResponse(id, {
            content: [
              {
                type: 'text',
                text: JSON.stringify(comps, null, 2)
              }
            ]
          })
        }
        case 'gamin_search_components': {
          const query = (args?.query || '').toLowerCase()
          const comps = getRegistryComponents()
          const matches = comps.filter(c => {
            const hay = [c.id, c.name, c.description, (c.frameworks || []).join(' '), (c.dependencies || []).join(' ')].filter(Boolean).join(' ').toLowerCase()
            return hay.includes(query)
          })
          return sendResponse(id, {
            content: [
              {
                type: 'text',
                text: JSON.stringify(matches, null, 2)
              }
            ]
          })
        }
        case 'gamin_get_component': {
          const compId = args?.id
          if (!compId) {
            return sendError(id, -32602, 'Invalid params: "id" is required')
          }
          const compDir = helpers ? helpers.resolveRegistryPath(REGISTRY_DIR, compId) : path.join(REGISTRY_DIR, compId)
          if (!fs.existsSync(compDir)) {
            return sendError(id, 404, `Component "${compId}" not found in registry`)
          }
          const metadataPath = path.join(compDir, 'metadata.json')
          let metadata = {}
          if (fs.existsSync(metadataPath)) {
            metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
          }

          const files = Array.isArray(metadata.files) && metadata.files.length 
            ? metadata.files 
            : fs.readdirSync(compDir).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx') || f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.json'))

          const componentDetails = {
            metadata,
            files: []
          }

          for (const file of files) {
            if (file === 'metadata.json') continue
            const filePath = path.join(compDir, file)
            if (fs.existsSync(filePath)) {
              componentDetails.files.push({
                name: file,
                content: fs.readFileSync(filePath, 'utf8')
              })
            }
          }

          return sendResponse(id, {
            content: [
              {
                type: 'text',
                text: JSON.stringify(componentDetails, null, 2)
              }
            ]
          })
        }
        case 'gamin_install_component': {
          const compId = args?.id
          if (!compId) {
            return sendError(id, -32602, 'Invalid params: "id" is required')
          }
          const dest = args?.dest ? path.resolve(args.dest) : process.cwd()
          const installDeps = args?.installDeps !== false

          if (!helpers || typeof helpers.addComponent !== 'function') {
            return sendError(id, 500, 'CLI helpers are not loaded or incomplete')
          }

          logInfo(`Installing component "${compId}" to "${dest}" (installDeps: ${installDeps})...`)
          // Redirect console outputs of the installation process to stderr
          const result = await helpers.addComponent(compId, dest, installDeps, logInfo, ['ignore', process.stderr, process.stderr])
          
          return sendResponse(id, {
            content: [
              {
                type: 'text',
                text: `Successfully installed component "${compId}" into: ${dest}\nFiles copied:\n${(result.files || []).map(f => '- ' + f).join('\n')}\nManifest updated: ${result.manifestPath}`
              }
            ]
          })
        }
        default:
          return sendError(id, -32601, `Unknown tool: ${name}`)
      }
    } catch (err) {
      logError(`Error executing tool ${name}:`, err)
      return sendError(id, 500, `Execution error: ${err.message || err}`)
    }
  }
}

function getRegistryComponents() {
  const idxPath = path.join(REGISTRY_DIR, 'index.json')
  if (!fs.existsSync(idxPath)) {
    return []
  }
  const idx = JSON.parse(fs.readFileSync(idxPath, 'utf8'))
  const result = []

  for (const c of idx.components) {
    const compDir = path.join(REGISTRY_DIR, c.path)
    const metaPath = path.join(compDir, 'metadata.json')
    let meta = {}
    try {
      if (fs.existsSync(metaPath)) {
        meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
      }
    } catch (e) {
      logError(`Error reading metadata for ${c.id}:`, e)
    }

    result.push({
      id: c.id,
      name: meta.name || c.id,
      description: meta.description || '',
      version: c.version,
      frameworks: meta.frameworks || [],
      dependencies: meta.dependencies || [],
      files: meta.files || []
    })
  }

  return result
}

module.exports = {
  startMcpServer
}
