import fs from 'fs'
import path from 'path'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const q = (url.searchParams.get('q') || '').toLowerCase().trim()

    const idxPath = path.join(process.cwd(), 'registry', 'index.json')
    const idxRaw = fs.readFileSync(idxPath, 'utf8')
    const idx = JSON.parse(idxRaw)

    const results = []
    for (const c of idx.components) {
      const metaPath = resolveRegistryPath(path.join(process.cwd(), 'registry'), path.join(c.path, 'metadata.json'))
      let meta = null
      try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')) } catch (e) { meta = null }

      const hay = [c.id, meta?.name, meta?.description, (meta?.frameworks || []).join(' ')].filter(Boolean).join(' ').toLowerCase()
      if (!q || hay.includes(q)) {
        results.push({ id: c.id, path: c.path, version: c.version, metadata: meta })
      }
    }

    return new Response(JSON.stringify({ results }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}

function resolveRegistryPath(registryRoot: string, relativePath: string) {
  const resolvedRoot = path.resolve(registryRoot)
  const resolvedPath = path.resolve(resolvedRoot, String(relativePath || ''))
  const rootWithSep = resolvedRoot.endsWith(path.sep) ? resolvedRoot : resolvedRoot + path.sep
  if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(rootWithSep)) {
    throw new Error(`Refusing unsafe registry path: ${relativePath}`)
  }
  return resolvedPath
}
