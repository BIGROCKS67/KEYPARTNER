// Helpers for job records from Supabase. All pure functions so they run
// the same in the browser and in the build-time prerender.

const TZ = 'Europe/London'

export const tidy = (s) => (s || '').replace(/\s+/g, ' ').trim()

export function jobRef(job) {
  return `KPR-${String(job.id).replace(/-/g, '').slice(0, 6).toUpperCase()}`
}

export function jobPath(job) {
  return `/jobs/${job.id}`
}

export function formatDate(iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d)) return ''
  return new Intl.DateTimeFormat('en-GB', { timeZone: TZ, ...opts }).format(d)
}

export function isoDay(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d)) return ''
  // en-CA gives YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d)
}

/* ---------- description cleaning ---------- */

const ALLOWED = {
  p: 'p', br: 'br', ul: 'ul', ol: 'ol', li: 'li',
  strong: 'strong', b: 'strong', em: 'em', i: 'em',
  h1: 'h3', h2: 'h3', h3: 'h3', h4: 'h4', h5: 'h4', h6: 'h4',
  a: 'a',
}

function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function escapeText(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function legacyToHtml(text) {
  const inline = (t) => escapeText(t)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
  const out = []
  let list = []
  const flush = () => { if (list.length) { out.push(`<ul>${list.join('')}</ul>`); list = [] } }
  for (const raw of text.split('\n')) {
    const t = raw.trim()
    if (!t) { flush(); continue }
    if (/^[•\-*]\s+/.test(t)) list.push(`<li>${inline(t.replace(/^[•\-*]\s+/, ''))}</li>`)
    else { flush(); out.push(`<p>${inline(t)}</p>`) }
  }
  flush()
  return out.join('\n')
}

// Turns pasted Word/WYSIWYG HTML into plain semantic HTML: no inline styles,
// fonts, classes or Office tags. Short bold-only paragraphs become headings.
export function cleanDescription(input) {
  if (!input) return ''
  if (!/<[a-z][\s\S]*>/i.test(input)) return legacyToHtml(input)

  let s = input
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|noscript|xml|template)\b[\s\S]*?<\/\1\s*>/gi, '')

  s = s.replace(/<(\/?)([a-zA-Z][\w:-]*)([^>]*)>/g, (_, close, tag, attrs) => {
    const t = ALLOWED[tag.toLowerCase()]
    if (!t) return ''
    if (close) return t === 'br' ? '' : `</${t}>`
    if (t === 'a') {
      const m = attrs.match(/href\s*=\s*("([^"]*)"|'([^']*)')/i)
      const href = m ? (m[2] ?? m[3] ?? '').trim() : ''
      if (!/^(https?:|mailto:)/i.test(href)) return '<a>'
      return `<a href="${escapeAttr(href)}" rel="nofollow noopener" target="_blank">`
    }
    return t === 'br' ? '<br>' : `<${t}>`
  })

  s = s
    .replace(/<a>([\s\S]*?)<\/a>/g, '$1')
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t\r\n]+/g, ' ')
    // empty blocks
    .replace(/<(p|li|h3|h4|strong|em)>\s*(<br>\s*)*<\/\1>/g, '')
    .replace(/<p>\s*(<br>\s*)*<\/p>/g, '')
    // paragraphs inside list items from Word
    .replace(/<li>\s*<p>([\s\S]*?)<\/p>\s*<\/li>/g, '<li>$1</li>')
    // a paragraph that is only bold, short text reads as a subheading
    .replace(/<p>\s*<strong>([^<]{1,70}?)\s*:?\s*<\/strong>\s*<\/p>/g, '<h3>$1</h3>')
    .replace(/<h3>\s*<strong>([\s\S]*?)<\/strong>\s*<\/h3>/g, '<h3>$1</h3>')
    // shouted headings to sentence case
    .replace(/<(h3|h4)>([^<]+)<\/\1>/g, (m, h, text) => (
      /[a-z]/.test(text) ? m : `<${h}>${text.charAt(0)}${text.slice(1).toLowerCase()}</${h}>`
    ))
    // line breaks used as paragraph breaks
    .replace(/(<br>\s*){2,}/g, '</p><p>')
    // typed bullets ("· item") become a real list
    .replace(/<p>\s*[·•▪◦‣\-–]\s*([\s\S]*?)<\/p>/g, '<li data-typed>$1</li>')
    .replace(/(?:<li data-typed>[\s\S]*?<\/li>\s*)+/g, run => `<ul>${run.replace(/ data-typed/g, '')}</ul>`)
    .replace(/\s*(<\/?(p|ul|ol|li|h3|h4)>)\s*/g, '$1')
    .replace(/<\/(p|ul|ol|h3|h4)>/g, '</$1>\n')
    .trim()

  return s
}

export function plainText(html, max) {
  const t = tidy(cleanDescription(html).replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"))
  if (!max || t.length <= max) return t
  const cut = t.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

/* ---------- salary and location ---------- */

export function parseSalary(salary) {
  const s = tidy(salary)
  if (!s) return null
  const nums = [...s.matchAll(/£\s?(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s*(k)?/gi)]
    .map(m => Number(m[1].replace(/,/g, '')) * (m[2] ? 1000 : 1))
    .filter(n => n > 0)
  if (!nums.length) return null
  let unit = 'YEAR'
  if (/per\s+day|a\s+day|\/\s*day|daily/i.test(s)) unit = 'DAY'
  else if (/per\s+hour|an\s+hour|\/\s*h(ou)?r|hourly/i.test(s)) unit = 'HOUR'
  const [min, max] = nums.length > 1 ? [Math.min(nums[0], nums[1]), Math.max(nums[0], nums[1])] : [nums[0], null]
  return { min, max, unit }
}

export function parseLocation(location) {
  const parts = tidy(location).replace(/\b(UK|United Kingdom)\b\.?/gi, '').split(',').map(tidy).filter(Boolean)
  return { locality: parts[0] || '', region: parts.slice(1).join(', ') }
}

export const shortLocation = (loc) => parseLocation(loc).locality || tidy(loc)

export function workPattern(type) {
  const t = tidy(type).toLowerCase()
  if (t === 'onsite' || t === 'on-site') return 'On-site'
  return tidy(type)
}

export function normaliseJob(j) {
  return {
    ...j,
    title: tidy(j.title),
    location: tidy(j.location),
    salary: tidy(j.salary),
    discipline: tidy(j.discipline),
    type: workPattern(j.type),
    benefits: (j.benefits || []).map(tidy).filter(Boolean),
  }
}

export function sortJobs(list) {
  return [...list].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
}

export function latestDate(list) {
  return list.reduce((m, j) => (String(j.created_at) > m ? String(j.created_at) : m), '')
}
