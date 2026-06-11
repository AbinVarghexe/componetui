const fs = require('fs')
const path = require('path')
const Ajv = require('ajv')

const registryDir = path.join(__dirname, '..', 'registry')
const schemaPath = path.join(registryDir, 'metadata.schema.json')

if (!fs.existsSync(schemaPath)) {
  console.error('Schema not found at', schemaPath)
  process.exit(2)
}

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))
const ajv = new Ajv({ allErrors: true, strict: false })
const validate = ajv.compile(schema)

function findMetadataFiles(dir) {
  const results = []
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) {
      const meta = path.join(p, 'metadata.json')
      if (fs.existsSync(meta)) results.push(meta)
    }
  }
  return results
}

const files = findMetadataFiles(registryDir)
if (files.length === 0) {
  console.warn('No metadata.json files found in registry')
}

let ok = true
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'))
  const valid = validate(data)
  if (!valid) {
    ok = false
    console.error('\nInvalid metadata:', f)
    for (const e of validate.errors) {
      console.error(' -', e.instancePath || '/', e.message)
    }
  } else {
    console.log('OK:', path.relative(process.cwd(), f))
  }
}

if (!ok) process.exit(1)
console.log('\nAll metadata files are valid')
