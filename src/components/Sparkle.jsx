export const SPARKLE_D =
  'M6 0.8 Q7.1 4.9 11.2 6 Q7.1 7.1 6 11.2 Q4.9 7.1 0.8 6 Q4.9 4.9 6 0.8 Z'

export default function Sparkle({ className = '', style, sway = '6deg' }) {
  return (
    <svg
      className={`block overflow-visible ${className}`}
      style={{ '--sway': sway, ...style }}
      viewBox="0 0 12 12"
      aria-hidden="true"
    >
      <path
        d={SPARKLE_D}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
