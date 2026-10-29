export function activityColor(level) {
  return `rgba(255, 255, 255, ${[0.18, 0.35, 0.55, 0.78, 1][level]})`
}

export function activityLabel(day) {
  return `${day.date}: ${day.count} ${day.count === 1 ? 'contribución' : 'contribuciones'}`
}
