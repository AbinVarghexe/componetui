const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync, spawn } = require('child_process')

const repoRoot = path.resolve(__dirname, '..')
const cliPath = path.join(repoRoot, 'bin', 'gamin-ui.js')

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: false,
    ...options,
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    const message = [
      `Command failed: ${command} ${args.join(' ')}`,
      `stdout:\n${result.stdout || ''}`,
      `stderr:\n${result.stderr || ''}`,
    ].join('\n')
    throw new Error(message)
  }

  return result
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function ensureTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'componetui-smoke-'))
}

function writeOldHeroProject(destDir) {
  const componentsDir = path.join(destDir, 'components', 'hero-modern')
  fs.mkdirSync(componentsDir, { recursive: true })

  const sourcePath = path.join(repoRoot, 'registry', 'hero-modern', 'hero-modern.tsx')
  const targetPath = path.join(componentsDir, 'hero-modern.tsx')
  fs.copyFileSync(sourcePath, targetPath)

  const manifestPath = path.join(destDir, 'gamin-ui.json')
  fs.writeFileSync(
    manifestPath,
    JSON.stringify({ installed: { 'hero-modern': '1.0.0' } }, null, 2),
    'utf8',
  )

  return manifestPath
}

function testMcpServer() {
  return new Promise((resolve, reject) => {
    console.log('Testing MCP Server...')
    const mcpProc = spawn('node', [cliPath, 'mcp'], {
      cwd: repoRoot,
      stdio: ['pipe', 'pipe', 'pipe']
    })

    let stdoutData = ''
    let stderrData = ''

    mcpProc.stdout.on('data', (data) => {
      stdoutData += data.toString()
      handleStdout()
    })

    mcpProc.stderr.on('data', (data) => {
      stderrData += data.toString()
    })

    mcpProc.on('error', (err) => {
      reject(err)
    })

    const steps = [
      {
        // Step 1: Initialize handshake
        send: {
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'test-client', version: '1.0' }
          }
        },
        verify: (res) => {
          assert.strictEqual(res.id, 1)
          assert.ok(res.result, 'Response should contain result')
          assert.strictEqual(res.result.protocolVersion, '2024-11-05')
          assert.strictEqual(res.result.serverInfo.name, 'gamin-ui-mcp')
        }
      },
      {
        // Step 2: Tools list
        send: {
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list',
          params: {}
        },
        verify: (res) => {
          assert.strictEqual(res.id, 2)
          const tools = res.result.tools
          assert.ok(Array.isArray(tools), 'Result should contain tools array')
          const names = tools.map(t => t.name)
          assert.ok(names.includes('gamin_list_components'), 'Should list components tool')
          assert.ok(names.includes('gamin_search_components'), 'Should list search tool')
          assert.ok(names.includes('gamin_get_component'), 'Should list get component tool')
          assert.ok(names.includes('gamin_install_component'), 'Should list install tool')
        }
      },
      {
        // Step 3: Get component button details
        send: {
          jsonrpc: '2.0',
          id: 3,
          method: 'tools/call',
          params: {
            name: 'gamin_get_component',
            arguments: { id: 'button' }
          }
        },
        verify: (res) => {
          assert.strictEqual(res.id, 3)
          assert.ok(res.result.content && res.result.content[0], 'Response should contain content')
          const content = JSON.parse(res.result.content[0].text)
          assert.strictEqual(content.metadata.id, 'button')
          assert.ok(content.files.some(f => f.name === 'button.tsx'))
          assert.match(content.files.find(f => f.name === 'button.tsx').content, /export/i)
        }
      },
      {
        // Step 4: Install pricing-card component
        send: {
          jsonrpc: '2.0',
          id: 4,
          method: 'tools/call',
          params: {
            name: 'gamin_install_component',
            arguments: {
              id: 'pricing-card',
              dest: ensureTempDir(),
              installDeps: false
            }
          }
        },
        verify: (res) => {
          assert.strictEqual(res.id, 4)
          assert.ok(res.result.content && res.result.content[0], 'Response should contain content')
          assert.match(res.result.content[0].text, /Successfully installed/i)
        }
      }
    ]

    let currentStep = 0

    function sendNext() {
      if (currentStep >= steps.length) {
        mcpProc.kill()
        console.log('MCP Server tests passed successfully')
        resolve()
        return
      }
      const payload = JSON.stringify(steps[currentStep].send) + '\n'
      mcpProc.stdin.write(payload)
    }

    function handleStdout() {
      const lines = stdoutData.split('\n')
      while (lines.length > 1) {
        const line = lines.shift()
        if (!line.trim()) continue
        try {
          const res = JSON.parse(line)
          const step = steps[currentStep]
          step.verify(res)
          currentStep++
          stdoutData = lines.join('\n')
          sendNext()
        } catch (err) {
          mcpProc.kill()
          reject(new Error(`MCP test failed at step ${currentStep}: ${err.message}\nLine: ${line}\nStderr: ${stderrData}`))
        }
      }
    }

    // Start the test sequence
    sendNext()
  })
}

async function main() {
  const searchResult = run('node', [cliPath, 'search', 'hero'])
  assert.match(searchResult.stdout, /hero-modern/i)

  const addDest = ensureTempDir()
  run('node', [cliPath, 'add', 'button', '--dest', addDest])
  assert.ok(fs.existsSync(path.join(addDest, 'components', 'button', 'button.tsx')))
  const addManifest = readJson(path.join(addDest, 'gamin-ui.json'))
  assert.strictEqual(addManifest.installed.button, '1.0.0')

  const upgradeDest = ensureTempDir()
  const manifestPath = writeOldHeroProject(upgradeDest)
  const checkResult = run('node', [cliPath, 'upgrade', '--check', '--dest', upgradeDest])
  assert.match(checkResult.stdout, /hero-modern 1\.0\.0 -> 1\.1\.0/)
  const manifestBefore = readJson(manifestPath)
  assert.strictEqual(manifestBefore.installed['hero-modern'], '1.0.0')

  run('node', [cliPath, 'upgrade', '--dest', upgradeDest])
  const manifestAfter = readJson(manifestPath)
  assert.strictEqual(manifestAfter.installed['hero-modern'], '1.1.0')

  console.log('Standard smoke tests passed')

  // Run MCP server tests
  await testMcpServer()

  console.log('All smoke tests passed successfully')
}

main().catch(err => {
  console.error('Smoke tests failed:', err)
  process.exit(1)
})
