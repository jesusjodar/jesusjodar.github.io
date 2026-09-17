import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { NOTIF_BLUE } from './bloub/bot/decor.ts'
import { BotEngine } from './bloub/bot/engine.ts'
import { clamp } from './bloub/bot/math.ts'
import { DEFAULT_EXPRESSION, EXPRESSION_BY_ID } from './bloub/bot/expressions.ts'
import { COLOR_BY_ID, DEFAULT_SHAPE, SHAPE_BY_ID, mixHex } from './bloub/bot/skins.ts'
import { DEMI_VIEWBOX, RAYON } from './bloub/bot/repere.ts'

const R = RAYON
const VB = DEMI_VIEWBOX
const IDLE_CYCLE = [{ state: 'idle', duration: Infinity }]

/**
 * Recreación en React del bot avatar de xAI (Bloub: https://github.com/jeremy-prt/bloub).
 *
 * Silueta morphing en SVG con respiración, parpadeos naturales y seguimiento de ratón.
 */
export default function BloubBot({
  size = 80,
  className = '',
  shape = DEFAULT_SHAPE,
  color = '#fff700',
  expression = DEFAULT_EXPRESSION,
  eyeShape = 'capsule',
  paper = '#0b1c55',
  cycle = IDLE_CYCLE,
  playing = false,
  follow = true,
  tight = true,
  active = true,
  onClick,
}) {
  const rawId = useId()
  const uid = useMemo(() => rawId.replace(/[^a-zA-Z0-9]/g, ''), [rawId])

  const shapeRadii = useMemo(() => SHAPE_BY_ID.get(shape)?.radii ?? null, [shape])
  const ink = useMemo(() => COLOR_BY_ID.get(color)?.hex ?? color ?? '#fff700', [color])
  const expr = useMemo(() => EXPRESSION_BY_ID.get(expression) ?? null, [expression])

  const [engine] = useState(
    () => new BotEngine(R, cycle[0]?.state ?? 'idle', shapeRadii, expr, eyeShape),
  )

  const [frame, setFrame] = useState(() => engine.sample(0))

  const blockIndexRef = useRef(0)
  const clockRef = useRef(0)
  const blockStartRef = useRef(0)
  const nextAtRef = useRef(Infinity)
  const lastTimeRef = useRef(0)
  const pointerRef = useRef(null)
  const aimingRef = useRef(false)
  const svgRef = useRef(null)

  useEffect(() => {
    engine.setShape(shapeRadii, clockRef.current)
  }, [shapeRadii, engine])

  useEffect(() => {
    engine.setExpression(expr, clockRef.current)
  }, [expr, engine])

  useEffect(() => {
    engine.setEyeShape(eyeShape)
  }, [eyeShape, engine])

  const applyBlock = useCallback(
    (i, from = 0) => {
      const b = cycle[i]
      if (!b) {
        nextAtRef.current = Infinity
        return
      }
      blockStartRef.current = clockRef.current - from
      engine.setState(b.state, clockRef.current)
      nextAtRef.current = playing ? blockStartRef.current + b.duration : Infinity
    },
    [cycle, engine, playing],
  )

  // Escucha del puntero para seguimiento de mirada
  useEffect(() => {
    if (!follow || !active) return
    const onPointerMove = (e) => {
      if (e.pointerType === 'touch') return
      pointerRef.current = { x: e.clientX, y: e.clientY }
    }
    const onPointerLeave = () => {
      pointerRef.current = null
    }
    window.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerleave', onPointerLeave)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [follow, active])

  const aim = useCallback(
    (clock) => {
      const box = svgRef.current?.getBoundingClientRect()
      if (!box || box.width === 0 || box.height === 0) return

      const pointer = pointerRef.current
      if (!pointer) {
        if (aimingRef.current) {
          engine.setLook(null, clock, 0.4)
          aimingRef.current = false
        }
        return
      }

      const centerX = box.left + box.width / 2
      const centerY = box.top + box.height / 2
      const demiW = Math.max(1, window.innerWidth / 2)
      const demiH = Math.max(1, window.innerHeight / 2)
      const nx = clamp((pointer.x - centerX) / demiW, -1, 1)
      const ny = clamp((pointer.y - centerY) / demiH, -1, 1)

      engine.setLook(
        {
          yaw: nx * 24,
          pitch: 8 - ny * 18,
          mix: 1,
          spin: 0,
          wander: 0,
        },
        clock,
      )
      aimingRef.current = true
    },
    [engine],
  )

  // Bucle de animación por requestAnimationFrame
  useEffect(() => {
    if (!active) return

    applyBlock(blockIndexRef.current)

    let rafId
    const tick = (ms) => {
      rafId = requestAnimationFrame(tick)
      const dt = lastTimeRef.current ? Math.min((ms - lastTimeRef.current) / 1000, 0.064) : 0
      lastTimeRef.current = ms
      clockRef.current += dt
      const clock = clockRef.current

      if (playing) {
        if (clock >= nextAtRef.current && cycle.length) {
          const nextIdx = (blockIndexRef.current + 1) % cycle.length
          blockIndexRef.current = nextIdx
          applyBlock(nextIdx)
        }
      }

      if (follow) {
        aim(clock)
      }

      setFrame(engine.sample(clock))
    }

    rafId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafId)
      lastTimeRef.current = 0
    }
  }, [active, playing, follow, cycle, applyBlock, aim, engine])

  const crop = tight ? 104 : VB
  const maskId = `bloub-mask-${uid}`

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`${-crop} ${-crop} ${crop * 2} ${crop * 2}`}
      role="img"
      aria-label="Bloub bot avatar"
      className={`select-none overflow-visible origin-left transition-transform duration-200 hover:scale-105 active:scale-95 ${className}`}
      onClick={onClick}
      style={{ overflow: 'visible', touchAction: 'none' }}
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="-300"
          y="-300"
          width="600"
          height="600"
        >
          <path d={frame.bodyPath} fill="#fff" />
          {frame.eyes.map((eye, i) => (
            <path
              key={i}
              d={eye.d}
              transform={eye.matrix}
              opacity={eye.alpha}
              fill="#000"
            />
          ))}
          {frame.notch && (
            <circle
              cx={frame.notch.x}
              cy={frame.notch.y}
              r={frame.notch.r}
              fill="#000"
            />
          )}
        </mask>

        {frame.arcs.map((arc) => (
          <linearGradient
            id={`${uid}-${arc.id}`}
            key={arc.id}
            gradientUnits="userSpaceOnUse"
            x1={arc.grad.x1}
            y1={arc.grad.y1}
            x2={arc.grad.x2}
            y2={arc.grad.y2}
          >
            {arc.grad.stops.map((c, i) => (
              <stop
                key={i}
                offset={i / (arc.grad.stops.length - 1)}
                stopColor={c}
              />
            ))}
          </linearGradient>
        ))}
      </defs>

      {/* Mitad trasera de las órbitas */}
      <g fill="none" strokeLinecap="round">
        {frame.arcs.map((arc) => (
          <path
            key={`b${arc.id}`}
            d={arc.back}
            stroke={`url(#${uid}-${arc.id})`}
            strokeWidth={arc.width}
            opacity={arc.opacity}
          />
        ))}
      </g>

      {/* Partículas detrás del cuerpo */}
      {frame.dotsBehind &&
        frame.dots.map((dot, i) => {
          const fill = dot.color ?? (dot.depth === undefined ? ink : mixHex(paper, ink, dot.depth))
          if (dot.d) {
            return (
              <path
                key={`pb${i}`}
                d={dot.d}
                transform={`translate(${dot.x} ${dot.y}) rotate(${dot.rot ?? 0}) scale(${R})`}
                fill={fill}
                opacity={dot.opacity}
              />
            )
          }
          return (
            <circle
              key={`pb${i}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill={fill}
              opacity={dot.opacity}
            />
          )
        })}

      <g opacity={frame.bodyAlpha}>
        <path d={frame.bodyPath} fill={paper} />
        <g mask={`url(#${maskId})`}>
          <rect x="-300" y="-300" width="600" height="600" fill={ink} />
        </g>
      </g>

      {/* Partículas delante del cuerpo */}
      {!frame.dotsBehind &&
        frame.dots.map((dot, i) => {
          const fill = dot.color ?? (dot.depth === undefined ? ink : mixHex(paper, ink, dot.depth))
          if (dot.d) {
            return (
              <path
                key={`pf${i}`}
                d={dot.d}
                transform={`translate(${dot.x} ${dot.y}) rotate(${dot.rot ?? 0}) scale(${R})`}
                fill={fill}
                opacity={dot.opacity}
              />
            )
          }
          return (
            <circle
              key={`pf${i}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill={fill}
              opacity={dot.opacity}
            />
          )
        })}

      {frame.notif && (
        <circle
          cx={frame.notif.x}
          cy={frame.notif.y}
          r={frame.notif.r}
          fill={NOTIF_BLUE}
        />
      )}

      {/* Mitad delantera de las órbitas */}
      <g fill="none" strokeLinecap="round">
        {frame.arcs.map((arc) => (
          <path
            key={`f${arc.id}`}
            d={arc.front}
            stroke={`url(#${uid}-${arc.id})`}
            strokeWidth={arc.width}
            opacity={arc.opacity}
          />
        ))}
      </g>
    </svg>
  )
}
