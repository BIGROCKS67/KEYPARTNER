// Head tags and structured data for each route. Used by the build-time
// prerender (as HTML) and by the browser after client-side navigation.
import {
  SITE_URL, BRAND, LEGAL_NAME, PHONE_TEL, EMAIL, OFFICE, FOUNDER, COMPANY_LINKEDIN,
} from './site'
import {
  cleanDescription, plainText, parseSalary, parseLocation, isoDay, jobPath, jobRef, shortLocation,
} from './jobs'

const OG_IMAGE = `${SITE_URL}/og.jpg`

export const agencyLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'EmploymentAgency',
  '@id': `${SITE_URL}/#agency`,
  name: BRAND,
  legalName: LEGAL_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icon-512.png`,
  image: `${SITE_URL}/matt.jpg`,
  telephone: PHONE_TEL,
  email: EMAIL,
  foundingDate: '2020-07-10',
  address: {
    '@type': 'PostalAddress',
    streetAddress: OFFICE.line1,
    addressLocality: OFFICE.town,
    addressRegion: OFFICE.city,
    postalCode: OFFICE.postcode,
    addressCountry: 'GB',
  },
  areaServed: ['United Kingdom', 'United Arab Emirates', 'Singapore', 'Australia', 'New Zealand'],
  knowsAbout: ['Software development recruitment', 'Data and AI recruitment', 'Commercial recruitment', 'Enterprise IT recruitment'],
  founder: { '@type': 'Person', name: FOUNDER.name, jobTitle: FOUNDER.role, sameAs: [FOUNDER.linkedin] },
  sameAs: [COMPANY_LINKEDIN],
})

function jobPostingLd(job) {
  const salary = parseSalary(job.salary)
  const loc = parseLocation(job.location)
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: cleanDescription(job.description) || `<p>${job.title}</p>`,
    identifier: { '@type': 'PropertyValue', name: BRAND, value: jobRef(job) },
    datePosted: isoDay(job.created_at),
    hiringOrganization: { '@type': 'Organization', name: BRAND, sameAs: `${SITE_URL}/`, logo: `${SITE_URL}/icon-512.png` },
    directApply: true,
    url: `${SITE_URL}${jobPath(job)}`,
  }
  if (job.discipline) ld.occupationalCategory = job.discipline
  if (job.type === 'Remote') {
    ld.jobLocationType = 'TELECOMMUTE'
    ld.applicantLocationRequirements = { '@type': 'Country', name: 'United Kingdom' }
  }
  if (loc.locality) {
    ld.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: loc.locality,
        ...(loc.region ? { addressRegion: loc.region } : {}),
        addressCountry: 'GB',
      },
    }
  }
  if (salary) {
    ld.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'GBP',
      value: salary.max
        ? { '@type': 'QuantitativeValue', minValue: salary.min, maxValue: salary.max, unitText: salary.unit }
        : { '@type': 'QuantitativeValue', value: salary.min, unitText: salary.unit },
    }
  }
  return ld
}

const crumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({
    '@type': 'ListItem', position: i + 1, name, item: `${SITE_URL}${path}`,
  })),
})

export function headFor(pathname, { jobs = [], job = null } = {}) {
  const path = pathname.replace(/\/+$/, '') || '/'
  const canonical = `${SITE_URL}${path === '/' ? '/' : path}`
  const base = { canonical, image: OG_IMAGE, robots: 'index, follow', ld: [] }

  if (path === '/') {
    return {
      ...base,
      title: 'Key Partnership Recruitment | Tech recruiter, Milton Keynes',
      description: `Matt Stimpson headhunts software, data and commercial people for UK tech businesses from Stony Stratford, Milton Keynes. Three candidates per role, CVs within 7 days. ${jobs.length} live roles.`,
      ld: [
        agencyLd(),
        { '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND, alternateName: 'Key Partnership', url: `${SITE_URL}/` },
      ],
    }
  }
  if (path === '/jobs') {
    return {
      ...base,
      title: 'Tech, data and commercial jobs in the UK | Key Partnership',
      description: `${jobs.length} live roles from Key Partnership Recruitment: software, testing, data and commercial jobs with salaries listed. Apply online with your CV.`,
      ld: [crumbs([['Home', '/'], ['Jobs', '/jobs']])],
    }
  }
  if (path.startsWith('/jobs/')) {
    if (!job) {
      return { ...base, title: 'Role closed | Key Partnership Recruitment', description: 'This role has been filled or closed.', robots: 'noindex, follow' }
    }
    const where = shortLocation(job.location)
    return {
      ...base,
      title: `${job.title}${where ? `, ${where}` : ''} | Key Partnership`,
      description: plainText(`${job.salary ? `${job.salary}. ` : ''}${job.type ? `${job.type}. ` : ''}${plainText(cleanDescription(job.description).replace(/<h[34]>[\s\S]*?<\/h[34]>/g, ' '))}`, 155),
      ld: [jobPostingLd(job), crumbs([['Home', '/'], ['Jobs', '/jobs'], [job.title, jobPath(job)]])],
    }
  }
  if (path === '/hire') {
    return {
      ...base,
      title: 'Hire tech, data and commercial staff | Key Partnership',
      description: 'Send Matt Stimpson your vacancy. He headhunts three candidates per role and sends the first CVs within 7 days. Contingent, retained and fixed-fee retainer options.',
      ld: [crumbs([['Home', '/'], ['Hire', '/hire']])],
    }
  }
  if (path === '/contact') {
    return {
      ...base,
      title: 'Contact Key Partnership Recruitment, Stony Stratford',
      description: `Call ${'01327 493143'} or email ${EMAIL}. Office 15, 76 High Street, Stony Stratford, Milton Keynes MK11 1AH.`,
      ld: [agencyLd()],
    }
  }
  if (path === '/privacy') {
    return { ...base, title: 'Privacy notice | Key Partnership Recruitment', description: 'How Key Partnership Recruitment Ltd uses the details and CVs you send us.' }
  }
  return { ...base, title: 'Page not found | Key Partnership Recruitment', description: 'This page does not exist.', robots: 'noindex, follow', canonical: null }
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c')

export function headHtml(h) {
  return [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}">`,
    `<meta name="robots" content="${h.robots}">`,
    h.canonical ? `<link rel="canonical" href="${h.canonical}">` : '',
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${BRAND}">`,
    `<meta property="og:title" content="${esc(h.title)}">`,
    `<meta property="og:description" content="${esc(h.description)}">`,
    h.canonical ? `<meta property="og:url" content="${h.canonical}">` : '',
    `<meta property="og:image" content="${h.image}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="Matt Stimpson of Key Partnership Recruitment">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    ...h.ld.map(o => `<script type="application/ld+json">${json(o)}</script>`),
  ].filter(Boolean).map(t => t.replace(/^<(\w+)/, '<$1 data-kp')).join('\n    ')
}
