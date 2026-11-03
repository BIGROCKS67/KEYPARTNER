import { useEffect } from 'react'
import { useLocation, matchPath } from 'react-router-dom'
import { useJobs } from '../data/jobs-context'
import { headFor, headHtml } from '../lib/seo'

// Keeps <title>, meta and JSON-LD in step after client-side navigation.
// The prerendered HTML already carries the same tags for first load.
export function Head() {
  const { pathname } = useLocation()
  const { jobs, fresh } = useJobs()

  useEffect(() => {
    const m = matchPath('/jobs/:id', pathname)
    const job = m ? jobs.find(j => String(j.id) === m.params.id) : null
    if (m && !job && !fresh) return
    const h = headFor(pathname, { jobs, job })
    document.querySelectorAll('[data-kp]').forEach(el => el.remove())
    const tpl = document.createElement('template')
    tpl.innerHTML = headHtml(h)
    document.head.append(tpl.content)
    document.title = h.title
  }, [pathname, jobs, fresh])

  return null
}
