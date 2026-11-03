// Writes a real HTML file for every public page after `vite build`, so
// search engines, AI crawlers and link previews get full content, titles
// and structured data without running JavaScript. Also writes sitemap.xml,
// robots.txt, the 404 fallback and the admin shell.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')
const SITE = 'https://ourkeypartnership.co.uk'

function env(name) {
  if (process.env[name]) return process.env[name]
  for (const file of ['.env.local', '.env']) {
    const p = path.join(root, file)
    if (!fs.existsSync(p)) continue
    const line = fs.readFileSync(p, 'utf8').split('\n').find(l => l.startsWith(`${name}=`))
    if (line) return line.slice(name.length + 1).trim()
  }
  return ''
}

async function fetchJobs() {
  const url = env('VITE_SUPABASE_URL')
  const key = env('VITE_SUPABASE_ANON_KEY')
  if (!url || !key) {
    console.warn('prerender: no Supabase settings, building with no jobs')
    return []
  }
  const res = await fetch(`${url}/rest/v1/jobs?select=*&is_active=eq.true&order=created_at.desc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
  // Fail the build rather than publish an empty jobs board if Supabase is down.
  if (!res.ok) throw new Error(`prerender: Supabase returned ${res.status}`)
  return res.json()
}

const ssr = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const jobs = ssr.sortJobs((await fetchJobs()).map(ssr.normaliseJob))

const baseTemplate = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
let template = baseTemplate
const font = null
if (font) {
  template = template.replace('<!--head-->', `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin>\n    <!--head-->`)
}

const dataScript = `<script>window.__KP_JOBS__=${JSON.stringify(jobs).replace(/</g, '\\u003c')}</script>`

function page(url, { app = '', head }) {
  return template
    .replace('<!--head-->', head)
    .replace('<!--app-->', app)
    .replace('<!--data-->', dataScript)
}

function write(file, html) {
  const out = path.join(dist, file)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, html)
}

// Pages are written as /name.html so GitHub Pages and Vercel (cleanUrls)
// both serve them at /name with no trailing-slash redirect.
const routes = [
  ['/', 'index.html'],
  ['/jobs', 'jobs.html'],
  ['/hire', 'hire.html'],
  ['/contact', 'contact.html'],
  ['/privacy', 'privacy.html'],
  ...jobs.map(j => [ssr.jobPath(j), `${ssr.jobPath(j).slice(1)}.html`, j]),
]

for (const [url, file, job] of routes) {
  const head = ssr.headHtml(ssr.headFor(url, { jobs, job }))
  write(file, page(url, { app: ssr.render(url, jobs), head }))
}

// Unknown URLs: the app renders client-side, which also covers roles added
// after this build until the next one.
write('404.html', page('/404', { head: ssr.headHtml(ssr.headFor('/404', { jobs })) }))
write('admin.html', baseTemplate
  .replace('<!--head-->', '<title>Admin | Key Partnership</title>\n    <meta name="robots" content="noindex, nofollow">')
  .replace('<!--app-->', '').replace('<!--data-->', ''))

const latest = ssr.latestDate(jobs).slice(0, 10)
const urls = [
  ['/', latest],
  ['/jobs', latest],
  ['/hire'],
  ['/contact'],
  ['/privacy'],
  ...jobs.map(j => [ssr.jobPath(j), String(j.created_at).slice(0, 10)]),
]
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d]) => `  <url><loc>${SITE}${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`)

write('robots.txt', `# Search engines and AI search assistants are welcome.
User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${SITE}/sitemap.xml
`)

fs.rmSync(ssrDir, { recursive: true, force: true })
console.log(`prerender: ${routes.length} pages, ${jobs.length} jobs`)
