import { createContext, useContext, useEffect, useState } from 'react'
import { hasSupabase, loadSupabase } from '../lib/supabase-lazy'
import { normaliseJob, sortJobs } from '../lib/jobs'

const JobsContext = createContext({ jobs: [], fresh: false })

// First render uses the jobs baked into the page at build time (so the
// prerendered HTML and the hydrated app match), then refreshes from Supabase
// so roles added in the admin show up before the next site build.
export function JobsProvider({ initialJobs = [], children }) {
  const [state, setState] = useState({ jobs: initialJobs, fresh: false })

  useEffect(() => {
    if (!hasSupabase) { setState(s => ({ ...s, fresh: true })); return }
    let live = true
    loadSupabase()
      .then(sb => sb.from('jobs').select('*').eq('is_active', true))
      .then(({ data, error }) => {
        if (!live) return
        if (error || !data) { setState(s => ({ ...s, fresh: true })); return }
        setState({ jobs: sortJobs(data.map(normaliseJob)), fresh: true })
      })
      .catch(() => { if (live) setState(s => ({ ...s, fresh: true })) })
    return () => { live = false }
  }, [])

  return <JobsContext.Provider value={state}>{children}</JobsContext.Provider>
}

export const useJobs = () => useContext(JobsContext)
