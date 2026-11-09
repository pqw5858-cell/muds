import { useEffect, useState } from 'react'
import './ProductTabs.css'
import { t } from '../../utils/i18n.js'

// 헤더 아래에 붙는 탭 메뉴. 누르면 해당 영역으로 부드럽게 스크롤, 스크롤 위치에 따라 현재 탭 표시
function ProductTabs({ tabs }) {
  const [activeId, setActiveId] = useState(tabs[0].id)

  useEffect(() => {
    // 화면 위쪽(헤더+탭 아래 ~ 화면 40%) 구간에 들어온 영역을 현재 탭으로
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-120px 0px -60% 0px' },
    )
    tabs.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [tabs])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="product-tabs" aria-label={t('상품 정보 메뉴', 'Product sections')}>
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`product-tabs__item${activeId === id ? ' is-active' : ''}`}
          aria-current={activeId === id ? 'true' : undefined}
          onClick={() => scrollTo(id)}
        >
          {t(label)}
        </button>
      ))}
    </nav>
  )
}

export default ProductTabs
