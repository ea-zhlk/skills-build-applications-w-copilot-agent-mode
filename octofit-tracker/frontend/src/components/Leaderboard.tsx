import { useEffect, useState } from 'react'
import { fetchCollection } from '../lib/api'

type RankingEntry = {
  _id: string
  rank: number
  points: number
  label: string
}

type Leaderboard = {
  _id: string
  title: string
  category: string
  period: string
  rankings: RankingEntry[]
}

export default function Leaderboard() {
  const [boards, setBoards] = useState<Leaderboard[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadBoards() {
      try {
        const items = await fetchCollection<Leaderboard>('leaderboard')

        if (active) {
          setBoards(items)
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load leaderboard.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadBoards()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="view-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Leaderboard</p>
          <h2>Weekly standings</h2>
        </div>
        <span className="summary-chip">{boards.length} active boards</span>
      </div>

      {loading && <p className="status-card">Loading leaderboard...</p>}
      {error && <p className="status-card error-card">{error}</p>}

      {!loading && !error && (
        <div className="data-grid two-column-grid">
          {boards.map((board) => (
            <article className="data-card" key={board._id}>
              <div className="card-header-row">
                <div>
                  <h3>{board.title}</h3>
                  <p>{board.period}</p>
                </div>
                <span className="pill">{board.category}</span>
              </div>
              <ol className="ranking-list">
                {board.rankings.map((entry) => (
                  <li key={entry._id}>
                    <span>#{entry.rank} {entry.label}</span>
                    <strong>{entry.points} pts</strong>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}