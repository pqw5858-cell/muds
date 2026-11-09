import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { EVENTS } from '../utils/events.js'
import SectionTitle from './SectionTitle.jsx'
import './EventSlider.css'
import { t } from '../utils/i18n.js'

const DURATION = 700 // 한 장 넘어가는 시간 (ms)
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)' // 빠르게 출발 → 길게 감속
const SWIPE_RATIO = 0.2 // 이 비율 이상 끌면 다음 장으로 넘어감
const SWIPE_VELOCITY = 0.4 // 이 속도(px/ms) 이상 빠르게 밀면 거리와 상관없이 넘어감

function ArrowIcon({ direction }) {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true">
      <path
        d={direction === 'prev' ? 'M9.5 0.5 1.4 8 9.5 15.5' : 'M0.5 0.5 8.6 8 0.5 15.5'}
        fill="none"
        stroke="#000"
        strokeWidth="2.4" /* 시안과 같은 굵기 (10 x 16 영역, 진한 픽셀 59개) */
      />
    </svg>
  )
}

function EventSlider() {
  const trackRef = useRef(null)
  const controlsRef = useRef({ prev: () => {}, next: () => {} })

  // 무한 반복: [마지막 복제, ...이벤트, 첫 번째 복제] 순서로 배치
  const slides = [EVENTS[EVENTS.length - 1], ...EVENTS, EVENTS[0]]

  useEffect(() => {
    const track = trackRef.current
    const n = EVENTS.length
    let index = 1 // 복제 슬라이드 다음, 실제 첫 번째 이벤트
    let currentX = 0
    let animating = false
    let dragging = false
    let moved = false
    let startX = 0
    let startOffset = 0
    let lastX = 0
    let lastTime = 0
    let velocity = 0

    // 슬라이드 한 장 폭 (소수점까지 실제 위치로 측정)
    const slideWidth = () => track.children[1].getBoundingClientRect().left - track.children[0].getBoundingClientRect().left

    const setX = (x, animate = false) => {
      currentX = x
      track.style.transition = animate ? `transform ${DURATION}ms ${EASE}` : 'none'
      track.style.transform = `translateX(${x}px)`
    }

    const goTo = (target) => {
      index = target
      const x = -index * slideWidth()
      if (x === currentX) return
      animating = true
      setX(x, true)
    }

    // 복제 슬라이드에 도착하면 같은 그림의 실제 슬라이드로 몰래 이동
    const onTransitionEnd = (e) => {
      if (e.target !== track || e.propertyName !== 'transform') return
      animating = false
      if (index === 0) index = n
      if (index === n + 1) index = 1
      setX(-index * slideWidth())
    }

    controlsRef.current.prev = () => !animating && !dragging && goTo(index - 1)
    controlsRef.current.next = () => !animating && !dragging && goTo(index + 1)

    const onPointerDown = (e) => {
      if (animating || (e.pointerType === 'mouse' && e.button !== 0)) return
      dragging = true
      moved = false
      velocity = 0
      startX = lastX = e.clientX
      startOffset = currentX
      lastTime = performance.now()
    }

    const onPointerMove = (e) => {
      if (!dragging) return
      const dx = e.clientX - startX
      if (!moved && Math.abs(dx) > 5) {
        moved = true
        track.setPointerCapture(e.pointerId)
        track.classList.add('is-dragging')
      }
      if (!moved) return
      setX(startOffset + dx)
      const now = performance.now()
      const dt = now - lastTime
      if (dt > 0) velocity = velocity * 0.6 + ((e.clientX - lastX) / dt) * 0.4
      lastX = e.clientX
      lastTime = now
    }

    // 손을 떼면: 충분히 끌었거나 빠르게 밀었으면 다음/이전 장, 아니면 제자리
    const onPointerUp = (e) => {
      if (!dragging) return
      dragging = false
      track.classList.remove('is-dragging')
      if (!moved) return
      const dx = e.clientX - startX
      const passed = Math.abs(dx) > slideWidth() * SWIPE_RATIO || Math.abs(velocity) > SWIPE_VELOCITY
      if (passed) goTo(index + (dx < 0 ? 1 : -1))
      else goTo(index)
      // 제자리로 돌아갈 위치가 이미 같으면 transitionend가 없으므로 바로 정리
      if (!animating) setX(-index * slideWidth())
    }

    const onResize = () => setX(-index * slideWidth())

    // 끌어서 넘긴 경우에는 슬라이드 링크로 이동하지 않음 (그냥 누른 경우만 이벤트 상세로)
    const onClickCapture = (e) => {
      if (moved) e.preventDefault()
    }

    setX(-index * slideWidth())
    track.addEventListener('transitionend', onTransitionEnd)
    track.addEventListener('pointerdown', onPointerDown)
    track.addEventListener('pointermove', onPointerMove)
    track.addEventListener('pointerup', onPointerUp)
    track.addEventListener('pointercancel', onPointerUp)
    track.addEventListener('click', onClickCapture, true)
    window.addEventListener('resize', onResize)

    return () => {
      track.removeEventListener('transitionend', onTransitionEnd)
      track.removeEventListener('pointerdown', onPointerDown)
      track.removeEventListener('pointermove', onPointerMove)
      track.removeEventListener('pointerup', onPointerUp)
      track.removeEventListener('pointercancel', onPointerUp)
      track.removeEventListener('click', onClickCapture, true)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section className="event-slider" aria-roledescription="carousel" aria-label={t('이벤트', 'Events')}>
      <div className="event-slider__header">
        <button type="button" className="event-slider__arrow" aria-label={t('이전 이벤트', 'Previous event')} onClick={() => controlsRef.current.prev()}>
          <ArrowIcon direction="prev" />
        </button>
        <SectionTitle>EVENT</SectionTitle>
        <button type="button" className="event-slider__arrow" aria-label={t('다음 이벤트', 'Next event')} onClick={() => controlsRef.current.next()}>
          <ArrowIcon direction="next" />
        </button>
      </div>

      <div className="event-slider__viewport">
        <ul className="event-slider__track" ref={trackRef}>
          {slides.map((event, i) => (
            <li
              key={i}
              className="event-slider__slide"
              aria-hidden={i === 0 || i === slides.length - 1}
              inert={i === 0 || i === slides.length - 1} // 복제 슬라이드는 링크 포커스 제외
            >
              <Link to={`/events/${event.id}`} draggable={false}>
                <img src={t(event.image)}alt={t(event.alt)} width="500" height="590" draggable={false} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default EventSlider
