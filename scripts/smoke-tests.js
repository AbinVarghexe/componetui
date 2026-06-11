const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')

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

function main() {
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

  console.log('Smoke tests passed')
}

main()
