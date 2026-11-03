import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { JobsProvider } from './data/jobs-context'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter>
      <JobsProvider initialJobs={window.__KP_JOBS__ || []}>
        <App />
      </JobsProvider>
    </BrowserRouter>
  </StrictMode>
)

// Prerendered pages hydrate; the 404 fallback (new roles, /admin) renders fresh.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
