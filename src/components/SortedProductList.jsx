import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SORT_OPTIONS, sortProducts } from '../utils/productLists.js'
import ProductCard from './ProductCard.jsx'
import './ProductGridSection.css'
import './SortedProductList.css'
import { t } from '../utils/i18n.js'

const PAGE_SIZE = 20 // 처음 보이는 개수, 더보기마다 이만큼 추가

// 총 개수 + 정렬 선택 + 2열 카드 목록 + 더보기 (상품 목록·검색 결과 공용)
// 정렬은 주소 ?sort=에 남겨 새로고침·뒤로가기에도 유지 (다른 주소 값은 그대로 둠)
function SortedProductList({ products, defaultSort = 'new', emptyMessage }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const sortParam = searchParams.get('sort')
  const sort = SORT_OPTIONS.some((o) => o.id === sortParam) ? sortParam : defaultSort
  const sorted = sortProducts(products, sort)

  const handleSort = (event) => {
    const next = new URLSearchParams(searchParams)
    if (event.target.value === defaultSort) next.delete('sort')
    else next.set('sort', event.target.value)
    setSearchParams(next, { replace: true })
  }

  if (products.length === 0) return <div className="sorted-list__empty">{emptyMessage}</div>

  return (
    <>
      <div className="sorted-list__toolbar">
        <span>
          {t('총 ', '')}
          <strong>{products.length}</strong>
          {t('개', products.length === 1 ? ' item' : ' items')}
        </span>
        <label>
          <span className="blind">{t('정렬', 'Sort by')}</span>
          <select value={sort} onChange={handleSort}>
            {SORT_OPTIONS.map(({ id, label }) => (
              <option key={id} value={id}>
                {t(label)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {/* 목록이나 정렬이 바뀌면 더보기 상태를 처음부터 */}
      <PagedGrid key={`${sort}-${sorted.map((p) => p.id).join()}`} products={sorted} />
    </>
  )
}

function PagedGrid({ products }) {
  const [count, setCount] = useState(PAGE_SIZE)

  return (
    <>
      <ul className="product-grid__list">
        {products.slice(0, count).map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      {count < products.length && (
        <button type="button" className="product-grid__more" onClick={() => setCount((n) => n + PAGE_SIZE)}>
          {t('더보기', 'View More')} ({count}/{products.length})
        </button>
      )}
    </>
  )
}

export default SortedProductList
