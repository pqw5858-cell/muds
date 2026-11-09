import { useLayoutEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useDragScroll } from '../utils/useDragScroll.js'
import './ScrollTabs.css'

// 헤더 아래 고정되는 가로 탭 (상품 목록 카테고리·컬렉션). items: [{ to, title }]
// 마우스로 끌어 넘길 수 있고, 현재 탭이 화면 밖이면 가운데로 오도록 가로 스크롤
function ScrollTabs({ items, label }) {
  const listRef = useRef(null)
  const firstRef = useRef(true) // 처음 그릴 때는 바로, 탭을 바꿀 때는 부드럽게
  useDragScroll(listRef)
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const list = listRef.current
    const active = list?.querySelector('.is-active')
    if (!active) return
    const left = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2
    list.scrollTo({ left: Math.max(0, left), behavior: firstRef.current ? 'instant' : 'smooth' })
    firstRef.current = false
  }, [pathname])

  return (
    <nav className="scroll-tabs" aria-label={label}>
      <ul className="scroll-tabs__list" ref={listRef}>
        {items.map(({ to, title }) => (
          <li key={to}>
            <NavLink
              to={to}
              draggable={false}
              className={({ isActive }) => `scroll-tabs__item${isActive ? ' is-active' : ''}`}
            >
              {title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default ScrollTabs
