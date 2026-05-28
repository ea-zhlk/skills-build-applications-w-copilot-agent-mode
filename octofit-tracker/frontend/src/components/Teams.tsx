import { useEffect, useState } from 'react'
import { fetchCollection } from '../lib/api'

type TeamMember = {
  _id: string
  name: string
  fitnessLevel: string
  streakDays: number
  totalPoints: number
}

type Team = {
  _id: string
  name: string
  city: string
  motto: string
  weeklyScore: number
  members: TeamMember[]
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadTeams() {
      try {
        const items = await fetchCollection<Team>('teams')

        if (active) {
          setTeams(items)
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load teams.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadTeams()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="view-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Teams</p>
          <h2>Community squads</h2>
        </div>
        <span className="summary-chip">{teams.length} competitive groups</span>
      </div>

      {loading && <p className="status-card">Loading teams...</p>}
      {error && <p className="status-card error-card">{error}</p>}

      {!loading && !error && (
        <div className="data-grid two-column-grid">
          {teams.map((team) => (
            <article className="data-card" key={team._id}>
              <div className="card-header-row">
                <div>
                  <h3>{team.name}</h3>
                  <p>{team.city}</p>
                </div>
                <span className="pill">{team.weeklyScore} pts</span>
              </div>
              <p className="note-copy">{team.motto}</p>
              <p className="list-label">Members</p>
              <ul className="mini-list">
                {team.members.map((member) => (
                  <li key={member._id}>
                    {member.name} · {member.fitnessLevel} · {member.totalPoints} pts
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}