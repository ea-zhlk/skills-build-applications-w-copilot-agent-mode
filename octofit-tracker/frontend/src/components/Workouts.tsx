import { useEffect, useState } from 'react'
import { fetchCollection } from '../lib/api'

type Workout = {
  _id: string
  title: string
  category: string
  difficulty: string
  durationMinutes: number
  targetMuscles: string[]
  equipment: string[]
  description: string
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadWorkouts() {
      try {
        const items = await fetchCollection<Workout>('workouts')

        if (active) {
          setWorkouts(items)
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load workouts.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadWorkouts()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="view-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Workouts</p>
          <h2>Suggested training plans</h2>
        </div>
        <span className="summary-chip">{workouts.length} routines</span>
      </div>

      {loading && <p className="status-card">Loading workouts...</p>}
      {error && <p className="status-card error-card">{error}</p>}

      {!loading && !error && (
        <div className="data-grid two-column-grid">
          {workouts.map((workout) => (
            <article className="data-card" key={workout._id}>
              <div className="card-header-row">
                <div>
                  <h3>{workout.title}</h3>
                  <p>{workout.category}</p>
                </div>
                <span className="pill">{workout.difficulty}</span>
              </div>
              <p className="note-copy">{workout.description}</p>
              <dl className="metric-list">
                <div>
                  <dt>Duration</dt>
                  <dd>{workout.durationMinutes} min</dd>
                </div>
                <div>
                  <dt>Targets</dt>
                  <dd>{workout.targetMuscles.join(', ')}</dd>
                </div>
                <div>
                  <dt>Equipment</dt>
                  <dd>{workout.equipment.join(', ')}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}