import { useEffect } from 'react'

const FRICTION = 0.94 // 손을 뗀 뒤 미끄러짐 감속 (프레임당 남는 속도 비율, 클수록 오래 미끄러짐)
const MIN_SPEED = 0.02 // 이 속도(px/ms) 아래면 미끄러짐 끝
const SNAP_DURATION = 320 // 가까운 칸으로 맞추는 시간 (ms)
const easeOutCubic = (t) => 1 - (1 - t) ** 3

// 마우스로 잡아 끌면 가로 스크롤 (터치·트랙패드는 브라우저 기본 스크롤)
// - 손을 떼면 끌던 속도로 미끄러지다 서서히 멈춤 (관성)
// - snap: true면 멈춘 뒤 가장 가까운 칸(li)으로 부드럽게 맞춤
// - 끈 뒤에는 링크 이동을 막음
// 끄는 동안 is-dragging, 미끄러지거나 맞추는 동안 is-gliding 클래스 (CSS에서 칸 맞춤 해제·커서 등)
export function useDragScroll(ref, { snap = false } = {}) {
  useEffect(() => {
    const list = ref.current
    if (!list) return
    const drag = { active: false, moved: false, startX: 0, startScroll: 0, lastX: 0, lastTime: 0, velocity: 0, frame: 0 }

    const stopAnimation = () => {
      cancelAnimationFrame(drag.frame)
      list.classList.remove('is-gliding')
    }

    // 현재 위치에서 가장 가까운 칸의 시작 위치 (scroll-padding만큼 왼쪽 여백 반영)
    const nearestSnap = () => {
      const padding = parseFloat(getComputedStyle(list).scrollPaddingLeft) || 0
      const max = list.scrollWidth - list.clientWidth
      const listLeft = list.getBoundingClientRect().left
      // 칸의 목록 안 위치 = 화면상 위치 차이 + 현재 스크롤 (offsetLeft는 기준 요소가 달라 쓰지 않음)
      const points = [...list.children].map((item) => {
        const x = item.getBoundingClientRect().left - listLeft + list.scrollLeft - padding
        return Math.min(max, Math.max(0, x))
      })
      return points.reduce((best, p) => (Math.abs(p - list.scrollLeft) < Math.abs(best - list.scrollLeft) ? p : best), 0)
    }

    const settle = () => {
      if (!snap) return stopAnimation()
      const from = list.scrollLeft
      const to = nearestSnap()
      if (Math.abs(to - from) < 1) return stopAnimation()
      const start = performance.now()
      const step = (now) => {
        const t = Math.min(1, (now - start) / SNAP_DURATION)
        list.scrollLeft = from + (to - from) * easeOutCubic(t)
        if (t < 1) drag.frame = requestAnimationFrame(step)
        else stopAnimation()
      }
      drag.frame = requestAnimationFrame(step)
    }

    const glide = () => {
      list.classList.add('is-gliding')
      const clock = { last: performance.now() }
      const step = (now) => {
        const dt = Math.min(32, now - clock.last)
        clock.last = now
        const before = list.scrollLeft
        list.scrollLeft -= drag.velocity * dt
        drag.velocity *= FRICTION ** (dt / 16)
        // 충분히 느려졌거나 양 끝에 닿으면 미끄러짐 끝 → 칸 맞춤
        if (Math.abs(drag.velocity) < MIN_SPEED || list.scrollLeft === before) settle()
        else drag.frame = requestAnimationFrame(step)
      }
      drag.frame = requestAnimationFrame(step)
    }

    const onPointerDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      stopAnimation() // 미끄러지는 중에 다시 잡으면 그 자리에서 멈춤
      Object.assign(drag, {
        active: true,
        moved: false,
        startX: e.clientX,
        startScroll: list.scrollLeft,
        lastX: e.clientX,
        lastTime: performance.now(),
        velocity: 0,
      })
    }
    const onPointerMove = (e) => {
      if (!drag.active) return
      const dx = e.clientX - drag.startX
      if (!drag.moved && Math.abs(dx) > 5) {
        drag.moved = true
        list.setPointerCapture(e.pointerId)
        list.classList.add('is-dragging', 'is-gliding')
      }
      if (!drag.moved) return
      list.scrollLeft = drag.startScroll - dx
      // 최근 움직임 위주로 속도 계산 (px/ms)
      const now = performance.now()
      const dt = now - drag.lastTime
      if (dt > 0) drag.velocity = drag.velocity * 0.6 + ((e.clientX - drag.lastX) / dt) * 0.4
      drag.lastX = e.clientX
      drag.lastTime = now
    }
    const onPointerUp = () => {
      if (!drag.active) return
      drag.active = false
      list.classList.remove('is-dragging')
      if (!drag.moved) return
      // 손을 떼기 직전에 멈춰 있었으면 미끄러지지 않음
      if (performance.now() - drag.lastTime > 80) drag.velocity = 0
      glide()
    }
    const onClickCapture = (e) => {
      if (drag.moved) {
        e.preventDefault()
        e.stopPropagation()
        drag.moved = false
      }
    }

    list.addEventListener('pointerdown', onPointerDown)
    list.addEventListener('pointermove', onPointerMove)
    list.addEventListener('pointerup', onPointerUp)
    list.addEventListener('pointercancel', onPointerUp)
    list.addEventListener('click', onClickCapture, true)
    return () => {
      cancelAnimationFrame(drag.frame)
      list.removeEventListener('pointerdown', onPointerDown)
      list.removeEventListener('pointermove', onPointerMove)
      list.removeEventListener('pointerup', onPointerUp)
      list.removeEventListener('pointercancel', onPointerUp)
      list.removeEventListener('click', onClickCapture, true)
    }
  }, [ref, snap])
}
