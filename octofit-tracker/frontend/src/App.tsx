import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  return (
    <Router>
      <div className="container mt-5">
        <h1>OctoFit Tracker</h1>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">OctoFit</a>
            <button className="navbar-toggler" type="button">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link" href="/">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/tracker">Tracker</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/leaderboard">Leaderboard</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  )
}

function HomePage() {
  return (
    <div className="row mt-5">
      <div className="col-md-8">
        <h2>Welcome to OctoFit Tracker</h2>
        <p>Track your fitness activities, build teams, and compete on the leaderboard!</p>
      </div>
    </div>
  )
}

export default App
