import { useLayoutEffect, useRef, useState } from 'react'
import activity from '../data/github-activity.json'
import { activityColor, activityLabel } from '../lib/activity.js'

export default function GitHubActivity() {
  const gridRef = useRef(null)
  const [columns, setColumns] = useState(1)

  useLayoutEffect(() => {
    const grid = gridRef.current
    const measure = () => {
      const gap = 0
      const pixel = (grid.getBoundingClientRect().height - gap) / 2
      const count = Math.min(Math.floor(activity.days.length / 2), Math.max(1, Math.floor((grid.clientWidth + gap) / (pixel + gap))))
      setColumns(count)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(grid)
    measure()
    return () => observer.disconnect()
  }, [])

  const days = activity.days.slice(-columns * 2)
  const from = days[0].date

  return (
    <div
      ref={gridRef}
      role="img"
      className="activity-grid"
      style={{ '--activity-columns': columns }}
      aria-label={`Actividad de GitHub del ${from} al ${activity.to}. ${days.map(activityLabel).join('. ')}`}
      title={`GitHub · ${days.length} días · ${from} — ${activity.to}`}
    >
      {days.map(day => (
        <span key={day.date} className="activity-pixel" style={{ backgroundColor: activityColor(day.level) }} title={activityLabel(day)} aria-hidden="true" />
      ))}
    </div>
  )
}
