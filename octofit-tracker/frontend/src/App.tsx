import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'
import { apiBaseUrl, getApiMode } from './lib/api'
import logoUrl from '../../../docs/octofitapp-small.png'

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/users', label: 'Users' },
  { to: '/teams', label: 'Teams' },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' },
]

function App() {
  return (
    <div className="app-shell">
      <header className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Octofit Tracker</p>
          <h1>One dashboard for community fitness, ranked effort, and guided training.</h1>
          <p className="hero-text">
            The React 19 presentation tier reads from the Express API using a safe
            Codespaces-aware base URL and falls back to localhost when the Codespace name is not set.
          </p>
          <div className="hero-meta">
            <span className="summary-chip">API mode: {getApiMode()}</span>
            <span className="api-chip">{apiBaseUrl}</span>
          </div>
        </div>
        <div className="hero-brand-card">
          <img alt="Octofit Tracker logo" className="hero-logo" src={logoUrl} />
          <p>
            Define <code>VITE_CODESPACE_NAME</code> in <code>.env.local</code> for Codespaces.
            If it is absent, the app automatically targets <code>http://localhost:8000/api</code>.
          </p>
        </div>
      </header>

      <nav className="route-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) => `route-link${isActive ? ' active' : ''}`}
            key={item.to}
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  )
}

function HomePage() {
  return (
    <section className="view-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Presentation tier configuration</h2>
        </div>
      </div>

      <div className="overview-grid">
        <article className="data-card spotlight-card">
          <h3>Codespaces-ready API base URL</h3>
          <p>
            When <code>import.meta.env.VITE_CODESPACE_NAME</code> is defined, the frontend calls:
          </p>
          <pre className="code-block">
            <code>https://${'{'}import.meta.env.VITE_CODESPACE_NAME{'}'}-8000.app.github.dev/api/[component]/</code>
          </pre>
        </article>

        <article className="data-card">
          <h3>Safe localhost fallback</h3>
          <p>
            If <code>VITE_CODESPACE_NAME</code> is unset, the app avoids broken
            <code>https://undefined-8000...</code> URLs and falls back to <code>http://localhost:8000/api</code>.
          </p>
        </article>

        <article className="data-card">
          <h3>Response compatibility</h3>
          <p>
            The data helper accepts either bare arrays or paginated objects with <code>items</code>,
            <code>results</code>, or <code>data</code> collections.
          </p>
        </article>
      </div>
    </section>
  )
}

export default App
