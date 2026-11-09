import { useEffect, useMemo, useRef, useState } from 'react'
import products from '../products.json'
import { byPopularity } from '../utils/productLists.js'
import SectionTitle from './SectionTitle.jsx'
import ProductCard from './ProductCard.jsx'
import './WeeklyBest.css'

const TABS = ['cup', 'tumbler', 'plate', 'tray', 'coaster']
const MAX_ITEMS = 10

// 캐러셀 설정
const VISIBLE = 3 // 한 화면에 보이는 카드 수
const AUTO_DELAY = 1000 // 멈춰 있는 시간 (ms)
const AUTO_DURATION = 1300 // 자동으로 한 칸 넘어가는 시간 (ms)
const AUTO_EASE = 'cubic-bezier(0.45, 0, 0.15, 1)' // 천천히 출발 → 길게 감속
const DRAG_DURATION = 600 // 드래그 후 제자리 맞춤 시간 (ms)
const DRAG_EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)'
const MOMENTUM = 200 // 드래그 속도에 곱하는 관성 거리

// BEST 상품을 먼저, 부족하면 나머지를 리뷰 많은 순으로 채워 최대 10개
const getWeeklyBest = (category) => {
  const list = products.filter((p) => p.category === category)
  const best = list.filter((p) => p.badges.includes('BEST')).sort(byPopularity)
  const rest = list.filter((p) => !p.badges.includes('BEST')).sort(byPopularity)
  return [...best, ...rest].slice(0, MAX_ITEMS)
}

function WeeklyBest() {
  const [activeTab, setActiveTab] = useState(TABS[0])
  const trackRef = useRef(null)
  const barRef = useRef(null)
  const items = useMemo(() => getWeeklyBest(activeTab), [activeTab])

  // 무한 반복을 위해 상품 목록을 3번 이어 붙이고, 가운데 묶음을 기준으로 움직임
  const slides = useMemo(() => [...items, ...items, ...items], [items])

  useEffect(() => {
    const track = trackRef.current
    const bar = barRef.current
    const n = items.length
    let index = n // 현재 맨 왼쪽 카드 번호 (가운데 묶음의 첫 카드에서 시작)
    let currentX = 0
    let timer = null
    let dragging = false
    let moved = false
    let startX = 0
    let startOffset = 0
    let lastX = 0
    let lastTime = 0
    let velocity = 0

    // 카드 한 칸 이동 거리: 첫 카드와 두 번째 카드의 실제 위치 차이 (소수점까지 정확하게)
    // offsetWidth는 정수로 반올림되어 칸마다 오차가 쌓이므로 사용하지 않음
    const stepWidth = () => {
      const [first, second] = track.children
      return second.getBoundingClientRect().left - first.getBoundingClientRect().left
    }

    // 트랙 위치 이동 (duration 0이면 즉시 이동)
    const setX = (x, duration = 0, ease = '') => {
      currentX = x
      track.style.transition = duration ? `transform ${duration}ms ${ease}` : 'none'
      track.style.transform = `translateX(${x}px)`
    }

    // 하단 진행 바: 현재 상품 위치에 맞춰 이동
    const updateBar = (duration = 0, ease = '') => {
      const real = ((index % n) + n) % n
      const width = Math.min(100, (VISIBLE / n) * 100)
      const left = n > 1 ? (real / (n - 1)) * (100 - width) : 0
      bar.style.transition = duration ? `left ${duration}ms ${ease}` : 'none'
      bar.style.width = `${width}%`
      bar.style.left = `${left}%`
    }

    const scheduleAuto = () => {
      clearTimeout(timer)
      timer = setTimeout(() => goTo(index + 1, AUTO_DURATION, AUTO_EASE), AUTO_DELAY)
    }

    // 이동이 끝나면 가운데 묶음 범위로 몰래 되돌린 뒤 다음 자동 이동 예약
    const settle = () => {
      if (index >= 2 * n) index -= n
      if (index < n) index += n
      setX(-index * stepWidth())
      scheduleAuto()
    }

    const goTo = (target, duration, ease) => {
      index = Math.max(1, Math.min(3 * n - VISIBLE - 1, target))
      const x = -index * stepWidth()
      updateBar(duration, ease)
      if (x === currentX) {
        settle()
        return
      }
      setX(x, duration, ease)
    }

    const onTransitionEnd = (e) => {
      if (e.target === track && e.propertyName === 'transform') settle()
    }

    // 드래그 시작: 움직이는 중이었다면 그 자리에서 멈춤
    const onPointerDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      clearTimeout(timer)
      const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform)
      setX(matrix.m41)
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

    // 손을 떼면 관성만큼 더 간 위치에서 가장 가까운 카드에 맞춤
    const onPointerUp = () => {
      if (!dragging) return
      dragging = false
      track.classList.remove('is-dragging')
      const projected = currentX + velocity * MOMENTUM
      goTo(Math.round(-projected / stepWidth()), DRAG_DURATION, DRAG_EASE)
    }

    // 드래그 후에는 클릭(하트 등)이 눌리지 않도록 막음
    const onClick = (e) => {
      if (moved) {
        e.stopPropagation()
        e.preventDefault()
        moved = false
      }
    }

    const onResize = () => setX(-index * stepWidth())

    // 시작 위치로 이동 후 자동 슬라이드 시작
    setX(-index * stepWidth())
    updateBar()
    scheduleAuto()

    track.addEventListener('transitionend', onTransitionEnd)
    track.addEventListener('pointerdown', onPointerDown)
    track.addEventListener('pointermove', onPointerMove)
    track.addEventListener('pointerup', onPointerUp)
    track.addEventListener('pointercancel', onPointerUp)
    track.addEventListener('click', onClick, true)
    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(timer)
      track.removeEventListener('transitionend', onTransitionEnd)
      track.removeEventListener('pointerdown', onPointerDown)
      track.removeEventListener('pointermove', onPointerMove)
      track.removeEventListener('pointerup', onPointerUp)
      track.removeEventListener('pointercancel', onPointerUp)
      track.removeEventListener('click', onClick, true)
      window.removeEventListener('resize', onResize)
    }
  }, [items])

  return (
    <section className="weekly-best">
      <SectionTitle>WEEKLY BEST ITEM</SectionTitle>

      <ul className="weekly-best__tabs" role="tablist">
        {TABS.map((tab) => (
          <li key={tab}>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={`weekly-best__tab ${activeTab === tab ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>

      <div className="weekly-best__viewport">
        <ul className="weekly-best__track" ref={trackRef}>
          {slides.map((product, i) => (
            <li
              key={`${product.id}-${i}`}
              className="weekly-best__item"
              aria-hidden={i < items.length || i >= items.length * 2}
            >
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>

      <div className="weekly-best__progress" aria-hidden="true">
        <span ref={barRef} />
      </div>
    </section>
  )
}

export default WeeklyBest
