import { useEffect } from 'react'

// Extra scroll distance with the section held still before the next transition.
const HOLD_VIEWPORTS = 0.75
const TITLE_HOLD_VIEWPORTS = 0.3
const clamp = value => Math.min(1, Math.max(0, value))
const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]

export default function ScrollBackground() {
  useEffect(() => {
    const scroller = document.querySelector('.content-scroll')
    const artwork = document.querySelector('.artwork-pair')
    const noise = document.querySelector('.background-noise')
    const content = document.querySelector('.fade-content')
    const stage = document.querySelector('.fade-stage')
    const runway = document.querySelector('.fade-runway')
    const tail = document.querySelector('.ai-runway')
    const sections = Array.from(document.querySelectorAll('[data-portfolio-section]'))
    if (!scroller || !artwork || !noise || !content || !stage) return
    let navigation = false, navigationFrame = 0
    let frame = 0, needsMeasurement = true, finish = 0, artworkEnd = 1, viewportHeight = 1
    let timeline = [], transitions = []
    const show = (element, visible, offset = 0) => {
      element.style.visibility = visible ? 'visible' : 'hidden'
      element.inert = !visible
      element.setAttribute('aria-hidden', visible ? 'false' : 'true')
      if (element !== content) {
        element.style.transform = element.dataset.axis === 'horizontal'
          ? `translateX(${-offset}px)` : `translateY(${-offset}px)`
        element.style.setProperty('--section-offset', `${offset}px`)
      }
    }
    const update = () => {
      frame = 0
      if (navigation) return
      if (needsMeasurement) {
        viewportHeight = scroller.clientHeight
        finish = Math.max(0, stage.offsetTop + content.offsetHeight - viewportHeight)
        content.style.setProperty('--fade-pin-top', `${Math.min(0, viewportHeight - content.offsetHeight)}px`)
        let top = 0
        for (let node = artwork; node && node !== content; node = node.offsetParent) top += node.offsetTop
        artworkEnd = Math.max(1, stage.offsetTop + top + artwork.offsetHeight - viewportHeight)
        const duration = viewportHeight * 2
        const hold = viewportHeight * HOLD_VIEWPORTS
        runway.style.height = `${duration + hold}px`
        let cursor = finish + hold
        transitions = []
        timeline = sections.map((section, index) => {
          transitions.push({ start: cursor, end: cursor + duration, from: index - 1, to: index })
          cursor += duration
          const start = cursor
          const readStart = start + viewportHeight * TITLE_HOLD_VIEWPORTS
          const description = section.querySelector('.ai-description')
          const travel = section.dataset.axis === 'horizontal'
            ? Math.max(0, (section.querySelector('.visual-copy')?.offsetLeft ?? description.offsetLeft) + description.scrollWidth - section.clientWidth)
            : Math.max(0, description.offsetTop + description.offsetHeight - section.clientHeight) + 10
          cursor = readStart + travel
          if (index < sections.length - 1) cursor += hold
          return { start, readStart, end: cursor, travel }
        })
        tail.style.height = `${Math.max(0, cursor - finish - duration - hold)}px`
        needsMeasurement = false
      }
      const scroll = scroller.scrollTop
      let progress = 0, transition = 0, coverage = 0, direction = directions[0]
      let visible = -1, offset = 0
      const active = transitions.find(item => scroll >= item.start && scroll < item.end)
      if (active) {
        transition = clamp((scroll - active.start) / (active.end - active.start))
        const entry = clamp((transition - .47) / .53)
        coverage = transition < .47 ? clamp(transition / .45) : 1 - entry
        progress = active.to + transition
        direction = directions[active.to % directions.length]
        visible = transition < .46 ? active.from : transition > .47 ? active.to : -2
        offset = visible >= 0 && visible === active.from ? timeline[visible].travel : 0
      } else {
        for (let index = 0; index < timeline.length; index++) {
          if (scroll >= timeline[index].start) {
            visible = index
            progress = index + 1
            offset = Math.min(timeline[index].travel, Math.max(0, scroll - timeline[index].readStart))
          }
        }
      }
      const entry = clamp((transition - .47) / .53)
      const dim = progress >= 1 ? 0 : clamp(scroll / artworkEnd) * .35 * (1 - entry)
      noise.dispatchEvent(new CustomEvent('background-progress', { detail: { progress, dim, coverage, transition, direction } }))
      show(content, visible === -1)
      sections.forEach((section, index) => show(section, visible === index, visible === index ? offset : 0))
    }
    const navigate = event => {
      const index = event.detail.index
      if (navigation || index < 0 || index > sections.length) return
      const destination = index === 0 ? 0 : timeline[index - 1]?.start
      if (destination == null) return
      navigation = true
      const started = performance.now()
      let switched = false
      const animate = now => {
        const t = clamp((now - started) / 1000)
        if (t >= .5 && !switched) {
          switched = true
          scroller.scrollTo({ top: destination, behavior: 'instant' })
          navigation = false
          update()
          navigation = true
        }
        const coverage = t < .5 ? t * 2 : (1 - t) * 2
        noise.dispatchEvent(new CustomEvent('background-progress', { detail: {
          progress: index, dim: 0, coverage, transition: t, direction: [-1, 0], ripple: 1,
        } }))
        if (t < 1) navigationFrame = requestAnimationFrame(animate)
        else { navigation = false; update() }
      }
      navigationFrame = requestAnimationFrame(animate)
    }
    window.addEventListener('portfolio-navigate', navigate)
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const measure = () => { needsMeasurement = true; schedule() }
    const observer = new ResizeObserver(measure)
    for (const element of [scroller, content, artwork, ...sections, ...sections.map(section => section.querySelector('.ai-description'))]) observer.observe(element)
    scroller.addEventListener('load', measure, true)
    scroller.addEventListener('scroll', schedule, { passive: true })
    update()
    return () => {
      window.removeEventListener('portfolio-navigate', navigate)
      cancelAnimationFrame(navigationFrame)
      cancelAnimationFrame(frame)
      observer.disconnect()
      scroller.removeEventListener('scroll', schedule)
      scroller.removeEventListener('load', measure, true)
      noise.dispatchEvent(new CustomEvent('background-progress', { detail: { progress: 0, dim: 0, coverage: 0 } }))
      content.style.visibility = ''
      content.inert = false
      content.removeAttribute('aria-hidden')
      content.style.removeProperty('--fade-pin-top')
      tail.style.height = ''
      runway.style.height = ''
      sections.forEach(section => { show(section, false); section.style.transform = ''; section.style.removeProperty('--section-offset') })
    }
  }, [])
  return null
}
