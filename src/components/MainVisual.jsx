import { useEffect, useRef } from 'react'
import hero01 from '../images/hero-01.png'
import hero02 from '../images/hero-02.png'
import hero03 from '../images/hero-03.png'
import hero04 from '../images/hero-04.png'
import hero05 from '../images/hero-05.png'
import './MainVisual.css'
import { t } from '../utils/i18n.js'

const HEROES = [hero01, hero02, hero03, hero04, hero05]

// 이미지 크기·간격은 CSS에서 프레임 폭 비율로 정함 (500px 기준 400 x 500, 간격 30) → 실제 크기를 재서 사용

const BASE_SPEED = 40 // 기본 흐름 속도 (px/초)
const SLOW_SPEED = 12 // 짧게 드래그한 뒤의 느린 속도 (px/초)
const LONG_DRAG = 150 // 이 거리 이상 드래그하면 기본 속도로 복귀 (px)
const EASING = 3 // 속도가 목표 속도로 바뀌는 부드러움 (클수록 빠르게 바뀜)

function MainVisual() {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    // 한 묶음 길이·시작 위치: 화면 폭이 바뀌면 다시 잼
    const size = { set: 0, start: 0 }
    const measure = () => {
      const slide = track.children[0].getBoundingClientRect().width
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      size.set = HEROES.length * (slide + gap) // 이미지 5장 한 묶음의 길이
      size.start = (track.parentElement.clientWidth - slide) / 2 // 첫 이미지가 프레임 가운데 오도록
    }
    measure()
    let offset = 0 // 현재 흐른 거리
    let speed = BASE_SPEED // 현재 속도
    let targetSpeed = BASE_SPEED // 바뀌어야 할 속도
    let dragging = false
    let dragStartX = 0
    let lastX = 0
    let lastTime = performance.now()
    let rafId

    // 매 프레임마다 위치 갱신
    const tick = (now) => {
      const dt = (now - lastTime) / 1000
      lastTime = now

      if (!dragging) {
        speed += (targetSpeed - speed) * Math.min(1, dt * EASING)
        offset -= speed * dt
      }

      // 한 묶음만큼 흐르면 처음 위치로 되돌려서 끊김 없이 반복
      offset = ((offset % size.set) + size.set) % size.set - size.set
      track.style.transform = `translateX(${size.start + offset}px)`

      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const onPointerDown = (e) => {
      dragging = true
      dragStartX = lastX = e.clientX
      track.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e) => {
      if (!dragging) return
      offset += e.clientX - lastX // 드래그하는 동안 손가락을 따라 이동
      lastX = e.clientX
    }

    const onPointerUp = (e) => {
      if (!dragging) return
      dragging = false
      const distance = Math.abs(e.clientX - dragStartX)
      targetSpeed = distance >= LONG_DRAG ? BASE_SPEED : SLOW_SPEED
    }

    track.addEventListener('pointerdown', onPointerDown)
    track.addEventListener('pointermove', onPointerMove)
    track.addEventListener('pointerup', onPointerUp)
    track.addEventListener('pointercancel', onPointerUp)
    window.addEventListener('resize', measure)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', measure)
      track.removeEventListener('pointerdown', onPointerDown)
      track.removeEventListener('pointermove', onPointerMove)
      track.removeEventListener('pointerup', onPointerUp)
      track.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  // 끊김 없이 반복되도록 이미지 묶음을 3번 이어 붙임
  const slides = [...HEROES, ...HEROES, ...HEROES]

  return (
    <section className="main-visual" aria-label={t('메인 비주얼', 'Main visual')}>
      <div className="main-visual__track" ref={trackRef}>
        {slides.map((src, i) => (
          <div key={i} className="main-visual__slide" aria-hidden={i >= HEROES.length}>
            <img src={src} alt="" draggable={false} />
          </div>
        ))}
      </div>

      <p className="main-visual__copy">
        {t('박물관의 유물,', 'Museum treasures,')}
        <br />
        {t('오늘의 식탁에 오르다', "on today's table")}
      </p>
    </section>
  )
}

export default MainVisual
