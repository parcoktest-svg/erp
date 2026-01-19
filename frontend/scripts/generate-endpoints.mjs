import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.cwd())
const backendRoot = path.resolve(root, '..')
const javaRootCandidates = [
  path.join(backendRoot, 'src', 'main', 'java'),
  path.join(backendRoot, 'java')
]

function resolveJavaRoot() {
  for (const p of javaRootCandidates) {
    if (fs.existsSync(p)) return p
  }
  return null
}

const javaRoot = resolveJavaRoot()
const outFile = path.join(root, 'src', 'generated', 'endpoints.json')

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(p))
    else if (entry.isFile() && entry.name.endsWith('.java')) out.push(p)
  }
  return out
}

function readText(p) {
  return fs.readFileSync(p, 'utf8')
}

function pickRequestMappingPrefix(text) {
  const m = text.match(/@RequestMapping\(\s*"([^"]+)"\s*\)/)
  return m ? m[1] : ''
}

function extractEndpoints(text, classPrefix) {
  const endpoints = []

  const methodMappings = [
    { ann: 'GetMapping', method: 'GET' },
    { ann: 'PostMapping', method: 'POST' },
    { ann: 'PutMapping', method: 'PUT' },
    { ann: 'DeleteMapping', method: 'DELETE' },
    { ann: 'PatchMapping', method: 'PATCH' }
  ]

  for (const mm of methodMappings) {
    const re = new RegExp(`@${mm.ann}\\(([^)]*)\\)\\s*[\\r\\n]+\\s*public\\s+[^\\s]+\\s+([a-zA-Z0-9_]+)\\s*\\(`, 'g')
    let m
    while ((m = re.exec(text))) {
      const args = m[1] || ''
      const handler = m[2]

      let subPath = ''
      const p1 = args.match(/\"([^\"]*)\"/)
      if (p1) subPath = p1[1]

      const full = normalizePath(classPrefix, subPath)
      endpoints.push({ method: mm.method, path: full, handler })
    }

    const reNoArgs = new RegExp(`@${mm.ann}\\s*[\\r\\n]+\\s*public\\s+[^\\s]+\\s+([a-zA-Z0-9_]+)\\s*\\(`, 'g')
    while ((m = reNoArgs.exec(text))) {
      const handler = m[1]
      const full = normalizePath(classPrefix, '')
      const exists = endpoints.some((e) => e.method === mm.method && e.path === full && e.handler === handler)
      if (!exists) endpoints.push({ method: mm.method, path: full, handler })
    }
  }

  return endpoints
}

function normalizePath(a, b) {
  const join = `${a || ''}/${b || ''}`
  return ('/' + join)
    .replace(/\/+/g, '/')
    .replace(/\/{2,}/g, '/')
    .replace(/\/$/, '') || '/'
}

function main() {
  if (!javaRoot) {
    console.error('Java source folder not found. Tried:')
    for (const p of javaRootCandidates) console.error('-', p)
    process.exit(1)
  }

  const javaFiles = walk(javaRoot)
  const controllers = []

  for (const f of javaFiles) {
    const text = readText(f)
    if (!text.includes('@RestController')) continue

    const classNameMatch = text.match(/public\s+class\s+([A-Za-z0-9_]+)/)
    const className = classNameMatch ? classNameMatch[1] : path.basename(f)

    const prefix = pickRequestMappingPrefix(text)
    const endpoints = extractEndpoints(text, prefix)

    if (endpoints.length) {
      controllers.push({
        name: className,
        file: path.relative(backendRoot, f).replace(/\\/g, '/'),
        endpoints
      })
    }
  }

  const out = {
    generatedAt: new Date().toISOString(),
    controllers
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2), 'utf8')

  console.log(`Generated ${controllers.length} controllers -> ${path.relative(root, outFile)}`)
}

main()
