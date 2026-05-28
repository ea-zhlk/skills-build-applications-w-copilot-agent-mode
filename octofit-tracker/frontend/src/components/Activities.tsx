import { useEffect, useState } from 'react'
import { fetchCollection } from '../lib/api'

type ActivityUser = {
  _id: string
  name: string
  fitnessLevel: string
}

type Activity = {
  _id: string
  type: string
  durationMinutes: number
  caloriesBurned: number
  distanceKm?: number
  completedAt: string
  notes?: string
  user: ActivityUser
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadActivities() {
      try {
        const items = await fetchCollection<Activity>('activities')

        if (active) {
          setActivities(items)
        }
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load activities.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadActivities()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="view-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Activities</p>
          <h2>Latest logged sessions</h2>
        </div>
        <span className="summary-chip">{activities.length} logged efforts</span>
      </div>

      {loading && <p className="status-card">Loading activities...</p>}
      {error && <p className="status-card error-card">{error}</p>}

      {!loading && !error && (
        <div className="data-grid two-column-grid">
          {activities.map((activity) => (
            <article className="data-card" key={activity._id}>
              <div className="card-header-row">
                <div>
                  <h3>{activity.type}</h3>
                  <p>{activity.user.name}</p>
                </div>
                <span className="pill">{activity.user.fitnessLevel}</span>
              </div>
              <dl className="metric-list">
                <div>
                  <dt>Duration</dt>
                  <dd>{activity.durationMinutes} min</dd>
                </div>
                <div>
                  <dt>Calories</dt>
                  <dd>{activity.caloriesBurned}</dd>
                </div>
                <div>
                  <dt>Distance</dt>
                  <dd>{activity.distanceKm ? `${activity.distanceKm} km` : 'N/A'}</dd>
                </div>
              </dl>
              <p className="timestamp">{new Date(activity.completedAt).toLocaleString()}</p>
              {activity.notes && <p className="note-copy">{activity.notes}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}