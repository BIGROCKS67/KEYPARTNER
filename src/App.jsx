import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LenisProvider } from './components/LenisProvider'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Head } from './components/Head'
import { Home } from './pages/Home'
import { Jobs } from './pages/Jobs'
import { Hire } from './pages/Hire'
import { Contact } from './pages/Contact'
import { Job } from './pages/Job'
import { Privacy } from './pages/Privacy'
import { Applied } from './pages/Applied'
import { NotFound } from './pages/NotFound'
import { BandSwitcher } from './components/BandSwitcher'

const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })))

export default function App() {
  return (
    <LenisProvider>
      <Routes>
        <Route path="/admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
        <Route path="*" element={
          <>
            <a className="skip-link" href="#main">Skip to content</a>
            <Head />
            <Nav />
            <main id="main" tabIndex={-1}>
              <Routes>
                <Route path="/"         element={<Home />} />
                <Route path="/jobs"     element={<Jobs />} />
                <Route path="/jobs/:id" element={<Job />} />
                <Route path="/hire"     element={<Hire />} />
                <Route path="/contact"  element={<Contact />} />
                <Route path="/privacy"  element={<Privacy />} />
                <Route path="/applied"  element={<Applied />} />
                <Route path="*"         element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <BandSwitcher />
          </>
        } />
      </Routes>
    </LenisProvider>
  )
}
