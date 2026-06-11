import fs from 'fs'
import path from 'path'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_req: Request, { params }: RouteContext) {
  const resolvedParams = await params
  const id = resolvedParams?.id
  try {
    console.log('[api/components/[id]] params:', resolvedParams)
    console.log('[api/components/[id]] id:', id)
    const compDir = resolveRegistryPath(path.join(process.cwd(), 'registry'), String(id))
    console.log('[api/components/[id]] compDir:', compDir)
    if (!fs.existsSync(compDir)) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
    }

    const metaPath = path.join(compDir, 'metadata.json')
    const metadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'))

    const files: { [k: string]: string } = {}
    const listed = Array.isArray(metadata.files) && metadata.files.length > 0
    let toRead: string[] = []
    if (listed) {
      toRead = metadata.files.filter((f: any) => typeof f === 'string' && f)
    } else {
      toRead = fs
        .readdirSync(compDir)
        .filter((f) => f.endsWith('.tsx') || f.endsWith('.jsx') || f.endsWith('.ts') || f.endsWith('.js'))
    }

    for (const fname of toRead) {
      if (typeof fname !== 'string' || !fname) continue
      const p = resolveRegistryPath(compDir, fname)
      if (fs.existsSync(p)) {
        files[fname] = fs.readFileSync(p, 'utf8')
      }
    }

    return new Response(JSON.stringify({ metadata, files }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
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
