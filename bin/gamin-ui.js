#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

function usage() {
  console.log('gamin-ui CLI\n')
  console.log('Usage: gamin-ui add <component-id> [--dest <project-path>]')
  console.log('       gamin-ui search <query>')
  console.log('       gamin-ui upgrade [component-id] [--dest <project-path>] [--all] [--check] [--install]')
  process.exit(1)
}

async function main() {
  const argv = process.argv.slice(2)
  if (argv.length === 0) return usage()

  const cmd = argv[0]
  if (cmd === 'add') {
    const comp = argv[1]
    if (!comp) return usage()
    const destFlagIndex = argv.indexOf('--dest')
    const dest = destFlagIndex !== -1 && argv[destFlagIndex + 1] ? path.resolve(argv[destFlagIndex + 1]) : process.cwd()

    const registryDir = path.resolve(__dirname, '..', 'registry')
    const compDir = resolveRegistryPath(registryDir, comp)
    if (!fs.existsSync(compDir)) {
      console.error('Component not found in local registry:', comp)
      process.exit(2)
    }

    const metadataPath = path.join(compDir, 'metadata.json')
    if (!fs.existsSync(metadataPath)) {
      console.error('metadata.json missing for', comp)
      process.exit(3)
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
    const files = Array.isArray(metadata.files) && metadata.files.length ? metadata.files : fs.readdirSync(compDir).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx') || f.endsWith('.ts') || f.endsWith('.js'))

    const outDir = path.join(dest, 'components', comp)
    fs.mkdirSync(outDir, { recursive: true })

    for (const fname of files) {
      const src = path.join(compDir, fname)
      const destPath = path.join(outDir, fname)
      if (!fs.existsSync(src)) {
        console.warn('Skipping missing file', fname)
        continue
      }
      if (fs.existsSync(destPath)) {
        console.log('Skipping existing file', path.relative(dest, destPath))
        continue
      }
      fs.copyFileSync(src, destPath)
      console.log('Wrote', path.relative(dest, destPath))
    }

    // update gamin-ui.json manifest in dest
    const manifestPath = path.join(dest, 'gamin-ui.json')
    let manifest = { installed: {} }
    if (fs.existsSync(manifestPath)) {
      try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) } catch (e) { /* ignore */ }
    }
    manifest.installed = manifest.installed || {}
    manifest.installed[comp] = metadata.version || 'unknown'
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')
    console.log('Updated manifest:', path.relative(dest, manifestPath))
    // Optionally install dependencies
    const installFlag = argv.includes('--install')
    if (installFlag) {
      const deps = Array.isArray(metadata.dependencies) ? metadata.dependencies : []
      if (deps.length > 0) {
        console.log('Installing dependencies:', deps.join(', '))
        try {
          installDependencies(dest, deps)
          console.log('Dependencies installed')
        } catch (e) {
          console.error('Dependency installation failed:', e.message || e)
          process.exit(4)
        }
      } else {
        console.log('No dependencies to install for', comp)
      }
    }

    process.exit(0)
  }

  if (cmd === 'search') {
    const query = argv[1] || ''
    const registryDir = path.resolve(__dirname, '..', 'registry')
    const idxPath = path.join(registryDir, 'index.json')
    if (!fs.existsSync(idxPath)) {
      console.error('registry index not found')
      process.exit(1)
    }
    const idx = JSON.parse(fs.readFileSync(idxPath, 'utf8'))
    const q = query.toLowerCase()
    const matches = []
    for (const c of idx.components) {
      const metaPath = resolveRegistryPath(registryDir, path.join(c.path, 'metadata.json'))
      let meta = null
      try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')) } catch (e) { meta = null }
      const hay = [c.id, meta?.name, meta?.description, (meta?.frameworks || []).join(' ')].filter(Boolean).join(' ').toLowerCase()
      if (!q || hay.includes(q)) matches.push({ id: c.id, version: c.version, description: meta?.description })
    }
    if (matches.length === 0) {
      console.log('No components found for query:', query)
      process.exit(0)
    }
    for (const m of matches) console.log(m.id + ' — ' + (m.description || '') + ' (' + m.version + ')')
    process.exit(0)
  }

  if (cmd === 'upgrade') {
    const destFlagIndex = argv.indexOf('--dest')
    const dest = destFlagIndex !== -1 && argv[destFlagIndex + 1] ? path.resolve(argv[destFlagIndex + 1]) : process.cwd()
    const checkOnly = argv.includes('--check')
    const installFlag = argv.includes('--install')
    const upgradeAll = argv.includes('--all')
    const targetId = argv[1] && !argv[1].startsWith('--') ? argv[1] : null

    const manifestPath = path.join(dest, 'gamin-ui.json')
    if (!fs.existsSync(manifestPath)) {
      console.error('gamin-ui.json not found in destination:', dest)
      process.exit(2)
    }

    const registryDir = path.resolve(__dirname, '..', 'registry')
    const idxPath = path.join(registryDir, 'index.json')
    const idx = JSON.parse(fs.readFileSync(idxPath, 'utf8'))
    const manifest = readManifest(manifestPath)
    const installed = manifest.installed || {}

    const selectedIds = upgradeAll
      ? Object.keys(installed)
      : targetId
        ? [targetId]
        : Object.keys(installed)

    if (selectedIds.length === 0) {
      console.log('No installed components found in manifest.')
      process.exit(0)
    }

    const updates = []
    for (const id of selectedIds) {
      const entry = idx.components.find((c) => c.id === id)
      if (!entry) {
        updates.push({ id, status: 'missing-from-registry' })
        continue
      }
      const installedVersion = installed[id]
      const latestVersion = entry.version
      if (!installedVersion) {
        updates.push({ id, status: 'not-installed', latestVersion })
        continue
      }
      if (compareVersions(latestVersion, installedVersion) > 0) {
        updates.push({ id, status: 'outdated', installedVersion, latestVersion, path: entry.path })
      }
    }

    if (updates.length === 0) {
      console.log('All selected components are up to date.')
      process.exit(0)
    }

    let didUpgrade = false
    for (const update of updates) {
      if (update.status === 'missing-from-registry') {
        console.log(update.id + ' is installed but missing from the registry index.')
        continue
      }
      if (update.status === 'not-installed') {
        console.log(update.id + ' is not installed. Latest version:', update.latestVersion)
        continue
      }
      console.log(update.id + ' ' + update.installedVersion + ' -> ' + update.latestVersion)
      if (checkOnly) continue
      const compDir = resolveRegistryPath(registryDir, update.path)
      const metaPath = path.join(compDir, 'metadata.json')
      const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
      const files = Array.isArray(metadata.files) && metadata.files.length ? metadata.files : fs.readdirSync(compDir).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx') || f.endsWith('.ts') || f.endsWith('.js'))
      const outDir = path.join(dest, 'components', update.id)
      fs.mkdirSync(outDir, { recursive: true })

      for (const fname of files) {
        const src = path.join(compDir, fname)
        const destPath = path.join(outDir, fname)
        if (!fs.existsSync(src)) {
          console.warn('Skipping missing file', fname)
          continue
        }
        fs.copyFileSync(src, destPath)
        console.log('Updated', path.relative(dest, destPath))
      }

      installed[update.id] = update.latestVersion
      didUpgrade = true
      console.log('Upgraded', update.id, 'to', update.latestVersion)

      if (installFlag) {
        const deps = Array.isArray(metadata.dependencies) ? metadata.dependencies : []
        if (deps.length > 0) {
          console.log('Installing dependencies:', deps.join(', '))
          installDependencies(dest, deps)
        }
      }
    }

    if (!checkOnly && didUpgrade) {
      manifest.installed = installed
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')
      console.log('Updated manifest:', path.relative(dest, manifestPath))
    } else if (checkOnly) {
      console.log('Check complete. No files were modified.')
    }
    process.exit(0)
  }

  usage()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

function detectPackageManager(dest) {
  const { spawnSync } = require('child_process')
  const path = require('path')
  if (fs.existsSync(path.join(dest, 'pnpm-lock.yaml'))) return 'pnpm'
  if (fs.existsSync(path.join(dest, 'yarn.lock'))) return 'yarn'
  if (fs.existsSync(path.join(dest, 'package-lock.json'))) return 'npm'

  // Fallback: check for globally available CLIs
  try {
    const pn = spawnSync('pnpm', ['-v'], { stdio: 'ignore' })
    if (pn.status === 0) return 'pnpm'
  } catch (e) {}
  try {
    const yn = spawnSync('yarn', ['-v'], { stdio: 'ignore' })
    if (yn.status === 0) return 'yarn'
  } catch (e) {}
  return 'npm'
}

function installDependencies(dest, deps) {
  const { spawnSync } = require('child_process')
  const pkg = detectPackageManager(dest)
  let cmd, args
  if (pkg === 'pnpm') {
    cmd = 'pnpm'
    args = ['add', ...deps]
  } else if (pkg === 'yarn') {
    cmd = 'yarn'
    args = ['add', ...deps]
  } else {
    cmd = 'npm'
    args = ['install', '--save', ...deps]
  }
  console.log('Using package manager:', pkg)
  const res = spawnSync(cmd, args, { cwd: dest, stdio: 'inherit', shell: false })
  if (res.error) throw res.error
  if (res.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed with code ${res.status}`)
}

function readManifest(manifestPath) {
  try {
    const raw = fs.readFileSync(manifestPath, 'utf8')
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : { installed: {} }
  } catch (err) {
    return { installed: {} }
  }
}

function compareVersions(a, b) {
  const parse = (value) => String(value || '0.0.0').split('.').map((part) => Number.parseInt(part, 10) || 0)
  const [aMajor, aMinor, aPatch] = parse(a)
  const [bMajor, bMinor, bPatch] = parse(b)
  if (aMajor !== bMajor) return aMajor - bMajor
  if (aMinor !== bMinor) return aMinor - bMinor
  return aPatch - bPatch
}

function resolveRegistryPath(registryRoot, relativePath) {
  const resolvedRoot = path.resolve(registryRoot)
  const resolvedPath = path.resolve(resolvedRoot, String(relativePath || ''))
  const rootWithSep = resolvedRoot.endsWith(path.sep) ? resolvedRoot : resolvedRoot + path.sep
  if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(rootWithSep)) {
    throw new Error(`Refusing unsafe registry path: ${relativePath}`)
  }
  return resolvedPath
}
