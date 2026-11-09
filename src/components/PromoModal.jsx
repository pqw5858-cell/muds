import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import modalImage from '../images/modal.png'
import modalImageEn from '../images/modal-en.png'
import { todayKey as today } from '../utils/format.js'
import './PromoModal.css'
import { t } from '../utils/i18n.js'

const SEEN_KEY = 'muds-promo-seen' // 이번 방문에 이미 봤는지 (sessionStorage: 브라우저를 닫으면 사라짐)
const HIDE_KEY = 'muds-promo-hide-date' // "오늘 하루 보지 않기"를 누른 날짜 (localStorage)
const AUTO_DELAY = 4000 // 자동으로 다음 장 (ms)
const SLIDE_DURATION = 500 // 한 장 넘어가는 시간 (ms)
const SWIPE_RATIO = 0.2 // 이 비율 이상 끌면 다음 장

// 팝업 배너 (여러 장이면 슬라이드·자동 넘김, 한 장이면 끌어도 제자리)
const BANNERS = [
  {
    to: '/events/blush-review',
    image: { ko: modalImage, en: modalImageEn },
    alt: {
      ko: '붉어진 선비를 보여주세요 - 변색 인증 포토 리뷰 작성 시 적립금 2,000원, 12.31 까지',
      en: 'Show us your blushing scholar - Post a photo review of the color change and get ₩2,000 in points, until Dec 31',
    },
  },
]

const shouldShow = () => !sessionStorage.getItem(SEEN_KEY) && localStorage.getItem(HIDE_KEY) !== today()

// 메인 페이지 이벤트 팝업 (참고 영상: 녹음 2026-11-06 160648)
// 아래에서 올라오는 창 + 배너 슬라이드(누르면 이벤트 상세) + 오늘 하루 보지 않기 / 닫기
// 방문할 때 한 번만, "오늘 하루 보지 않기"를 누르면 그날은 안 뜸. 닫을 때는 바로 사라짐
function PromoModal() {
  const [open, setOpen] = useState(shouldShow)

  // 한 번 뜨면 이번 방문 동안은 메인에 다시 와도 안 뜸
  useEffect(() => {
    if (open) sessionStorage.setItem(SEEN_KEY, '1')
  }, [open])

  // 열려 있는 동안 뒤 페이지 스크롤 막기 + Esc로 닫기
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (!open) return null

  const hideToday = () => {
    localStorage.setItem(HIDE_KEY, today())
    setOpen(false)
  }

  return (
    <div className="promo-modal" role="dialog" aria-modal="true" aria-label={t('이벤트 안내', 'Event notice')}>
      <div className="promo-modal__backdrop" onClick={() => setOpen(false)} />
      <div className="promo-modal__sheet">
        <PromoSlider />
        <div className="promo-modal__bar">
          <button type="button" onClick={hideToday}>
            {t('오늘 하루 보지 않기', "Don't show again today")}
          </button>
          <button type="button" onClick={() => setOpen(false)}>
            {t('닫기', 'Close')}
          </button>
        </div>
      </div>
    </div>
  )
}

// 배너 슬라이드: 끊김 없는 반복을 위해 [마지막 복제, ...배너, 첫 번째 복제] 순서로 배치
function PromoSlider() {
  const trackRef = useRef(null)
  const [current, setCurrent] = useState(0) // 쪽 번호 표시용 (0부터)
  const count = BANNERS.length
  const slides = [BANNERS[count - 1], ...BANNERS, BANNERS[0]]

  useEffect(() => {
    const track = trackRef.current
    const state = { index: 1, animating: false, dragging: false, moved: false, startX: 0, timer: 0 }
    const width = () => track.parentElement.clientWidth

    const setX = (x, animate) => {
      track.style.transition = animate ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none'
      track.style.transform = `translateX(${x}px)`
    }
    const goTo = (index) => {
      state.index = index
      state.animating = true
      setX(-index * width(), true)
      setCurrent((index - 1 + count) % count)
    }
    const schedule = () => {
      clearTimeout(state.timer)
      if (count > 1) state.timer = setTimeout(() => goTo(state.index + 1), AUTO_DELAY)
    }
    // 복제 장에 도착하면 같은 그림의 실제 장으로 몰래 이동
    const onTransitionEnd = (e) => {
      if (e.target !== track) return
      state.animating = false
      if (state.index === 0) state.index = count
      if (state.index === count + 1) state.index = 1
      setX(-state.index * width(), false)
      schedule()
    }
    const onPointerDown = (e) => {
      if (state.animating || (e.pointerType === 'mouse' && e.button !== 0)) return
      Object.assign(state, { dragging: true, moved: false, startX: e.clientX })
      clearTimeout(state.timer)
    }
    const onPointerMove = (e) => {
      if (!state.dragging) return
      const dx = e.clientX - state.startX
      if (!state.moved && Math.abs(dx) > 5) {
        state.moved = true
        track.setPointerCapture(e.pointerId)
      }
      if (state.moved) setX(-state.index * width() + dx, false)
    }
    const onPointerUp = (e) => {
      if (!state.dragging) return
      state.dragging = false
      if (!state.moved) return schedule()
      const dx = e.clientX - state.startX
      const step = Math.abs(dx) > width() * SWIPE_RATIO && count > 1 ? (dx < 0 ? 1 : -1) : 0
      goTo(state.index + step) // 덜 끌었으면 제자리로 (끝나면 transitionend에서 자동 넘김 다시 시작)
    }
    // 끌어서 넘긴 경우에는 배너 링크로 이동하지 않음
    const onClickCapture = (e) => {
      if (state.moved) {
        e.preventDefault()
        state.moved = false
      }
    }
    const onResize = () => setX(-state.index * width(), false)

    setX(-state.index * width(), false)
    schedule()
    track.addEventListener('transitionend', onTransitionEnd)
    track.addEventListener('pointerdown', onPointerDown)
    track.addEventListener('pointermove', onPointerMove)
    track.addEventListener('pointerup', onPointerUp)
    track.addEventListener('pointercancel', onPointerUp)
    track.addEventListener('click', onClickCapture, true)
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(state.timer)
      track.removeEventListener('transitionend', onTransitionEnd)
      track.removeEventListener('pointerdown', onPointerDown)
      track.removeEventListener('pointermove', onPointerMove)
      track.removeEventListener('pointerup', onPointerUp)
      track.removeEventListener('pointercancel', onPointerUp)
      track.removeEventListener('click', onClickCapture, true)
      window.removeEventListener('resize', onResize)
    }
  }, [count])

  return (
    <div className="promo-slider">
      <ul className="promo-slider__track" ref={trackRef}>
        {slides.map((banner, i) => {
          const isClone = i === 0 || i === slides.length - 1
          return (
            <li key={i} aria-hidden={isClone} inert={isClone}>
              <Link to={banner.to} draggable={false}>
                <img src={t(banner.image)}alt={t(banner.alt)} width="500" height="362" draggable={false} />
              </Link>
            </li>
          )
        })}
      </ul>
      <span className="promo-slider__count" aria-live="polite">
        {current + 1} / {count}
      </span>
    </div>
  )
}

export default PromoModal
