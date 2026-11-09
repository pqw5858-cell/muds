import { useState } from 'react'
import SectionTitle from './SectionTitle.jsx'
import ProductCard from './ProductCard.jsx'
import './ProductGridSection.css'
import { t } from '../utils/i18n.js'

const INITIAL_COUNT = 6 // 처음 보이는 개수 (2열 × 3줄)
const MAX_COUNT = 10 // 더보기로 펼칠 수 있는 최대 개수

// 2열 상품 목록 + 더보기 (NEW ARRIVALS, BEST ITEM 공통)
function ProductGridSection({ title, products }) {
  const [expanded, setExpanded] = useState(false)
  const list = products.slice(0, MAX_COUNT)
  const visible = expanded ? list : list.slice(0, INITIAL_COUNT)

  return (
    <section className="product-grid">
      <SectionTitle>{title}</SectionTitle>

      <ul className="product-grid__list">
        {visible.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>

      {!expanded && list.length > INITIAL_COUNT && (
        <button type="button" className="product-grid__more" onClick={() => setExpanded(true)}>
          {t('더보기', 'View More')}
        </button>
      )}
    </section>
  )
}

export default ProductGridSection
