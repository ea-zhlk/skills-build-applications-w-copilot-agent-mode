import { useEffect, useState } from 'react'
import { fetchCollection } from '../lib/api'

type TeamSummary = {
  _id: string
  name: string
  city: string
  weeklyScore: number
}

type User = {
  _id: string
  name: string
  email: string
  fitnessLevel: string
  goals: string[]
  streakDays: number
  totalPoints: number
  team?: TeamSummary | null
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadUsers() {
      try {
        const items = await fetchCollection<User>('users')

        if (active) {
          setUsers(items)
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load users.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadUsers()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="view-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Users</p>
          <h2>Athlete snapshot</h2>
        </div>
        <span className="summary-chip">{users.length} active profiles</span>
      </div>

      {loading && <p className="status-card">Loading users...</p>}
      {error && <p className="status-card error-card">{error}</p>}

      {!loading && !error && (
        <div className="data-grid">
          {users.map((user) => (
            <article className="data-card" key={user._id}>
              <div className="card-header-row">
                <div>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
                <span className="pill">{user.fitnessLevel}</span>
              </div>
              <dl className="metric-list">
                <div>
                  <dt>Streak</dt>
                  <dd>{user.streakDays} days</dd>
                </div>
                <div>
                  <dt>Points</dt>
                  <dd>{user.totalPoints}</dd>
                </div>
                <div>
                  <dt>Team</dt>
                  <dd>{user.team?.name ?? 'Independent'}</dd>
                </div>
              </dl>
              <div>
                <p className="list-label">Goals</p>
                <ul className="mini-list">
                  {user.goals.map((goal) => (
                    <li key={goal}>{goal}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}