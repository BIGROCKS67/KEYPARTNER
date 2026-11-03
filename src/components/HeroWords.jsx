import { useMemo } from 'react'
import { useJobs } from '../data/jobs-context'

// The skills and roles Matt recruits for, set as faint type across the hero.
// The spotlight finds them, which is the job: finding the people other
// recruiters can't reach. Live role titles are mixed in and set bolder.
const WORDS = [
  'React', '.NET', 'Java', 'Python', 'TypeScript', 'Node.js', 'AWS', 'Azure', 'DevOps', 'Kubernetes',
  'Platform Engineering', 'QA Automation', 'Power BI', 'Tableau', 'SQL Server', 'Data Engineering',
  'Machine Learning', 'BI Analyst', 'Infrastructure', 'Service Desk', 'Account Management',
  'Business Development', 'Customer Success', 'Bid Management', 'Solutions Architect', 'CTO',
  'Head of Product', 'Full Stack', 'C#', 'Angular', 'Data Warehouse', 'Cloud', 'Security',
  'Front End', 'Back End', 'Scrum Master', 'Product Owner', 'Head of Data', 'IT Support', 'ETL',
]

// `words` and `rows` let a quieter version run in other dark bands.
export function HeroWords({ words = WORDS, rows: rowCount = 9, live = true, className = '' }) {
  const { jobs } = useJobs()
  const rows = useMemo(() => {
    const titles = live ? jobs.map(j => j.title) : []
    const pool = [...words]
    return Array.from({ length: rowCount }, (_, r) => {
      const items = []
      for (let i = 0; i < 14; i++) {
        // A live role title every few words, the rest from the skills list
        if (titles.length && (i + r) % 5 === 2) items.push({ t: titles[(i + r) % titles.length], live: true })
        else items.push({ t: pool[(r * 7 + i * 3) % pool.length], live: false })
      }
      return items
    })
  }, [jobs, words, rowCount, live])

  const layer = (lit) => (
    <div className={`hero-words${lit ? ' hero-words--lit' : ''} ${className}`.trim()} aria-hidden>
      {rows.map((items, r) => (
        <div key={r} className={`hero-words__row${r % 2 ? ' hero-words__row--rev' : ''}`}>
          {items.map((w, i) => (
            <span key={i} className={w.live ? 'is-live' : undefined}>{w.t}</span>
          ))}
        </div>
      ))}
    </div>
  )

  return <>{layer(false)}{layer(true)}</>
}
