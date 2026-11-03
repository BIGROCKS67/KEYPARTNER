import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App.jsx'
import { JobsProvider } from './data/jobs-context'

export { headFor, headHtml } from './lib/seo'
export { normaliseJob, sortJobs, jobPath, latestDate } from './lib/jobs'

export function render(url, jobs) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <JobsProvider initialJobs={jobs}>
          <App />
        </JobsProvider>
      </StaticRouter>
    </StrictMode>,
  )
}
