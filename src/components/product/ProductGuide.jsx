import { useState } from 'react'
import guide from '../../guide.json'
import SectionTitle from '../SectionTitle.jsx'
import './ProductSection.css'
import './ProductGuide.css'
import { isEn } from '../../utils/i18n.js'
import guideEn from '../../i18n/guide.en.js'

// 구매안내: guide.json 아코디언. 예약주문·단독구매 안내는 해당 상품에서만 표시
function ProductGuide({ product }) {
  const [openIds, setOpenIds] = useState([])

  const sections = (isEn() ? guideEn : guide).sections.filter(
    ({ id }) => (id !== 'preorder' || product.preorder) && (id !== 'sole' || product.soleOrder),
  )

  const toggle = (id) =>
    setOpenIds((ids) => (ids.includes(id) ? ids.filter((v) => v !== id) : [...ids, id]))

  return (
    <section className="product-section" id="product-guide">
      <SectionTitle>GUIDE</SectionTitle>

      <ul className="product-guide__list">
        {sections.map(({ id, title, items }) => {
          const isOpen = openIds.includes(id)
          return (
            <li key={id}>
              <button
                type="button"
                className="product-guide__head"
                aria-expanded={isOpen}
                aria-controls={`guide-${id}`}
                onClick={() => toggle(id)}
              >
                {title}
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M0 6h12" stroke="currentColor" />
                  {!isOpen && <path d="M6 0v12" stroke="currentColor" />}
                </svg>
              </button>
              {/* 내비게이션 SHOP과 같은 방식의 아코디언 (0.2초) */}
              <div className={`product-guide__body${isOpen ? ' is-open' : ''}`} id={`guide-${id}`} inert={!isOpen}>
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default ProductGuide
