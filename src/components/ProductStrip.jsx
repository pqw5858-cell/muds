import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/format.js'
import { getImage } from '../utils/getImage.js'
import { useDragScroll } from '../utils/useDragScroll.js'
import './ProductStrip.css'
import { t } from '../utils/i18n.js'
import { lp } from '../utils/localize.js'

const STRIP_COUNT = 8 // 가로 목록에 보여줄 최대 개수 (더 있으면 맨 끝에 + 더보기 칸)

// 상품 썸네일 가로 목록 (좌우로 넘겨보기) + 개수 + 전체보기(to) + 8개 넘으면 끝에 + 더보기 칸. description은 제목 아래 설명
function ProductStrip({ title, description, to, products, emptyMessage }) {
  const listRef = useRef(null)
  useDragScroll(listRef, { snap: true }) // 멈추면 가까운 상품 칸에 맞춤
  const hasMore = Boolean(to) && products.length > STRIP_COUNT

  return (
    <section className="product-strip">
      <div className="product-strip__head">
        <h3>
          {title} <span>{products.length}</span>
        </h3>
        {to && products.length > 0 && <Link to={to}>{t('전체보기', 'View All')}</Link>}
      </div>
      {description && <p className="product-strip__desc">{description}</p>}
      {products.length === 0 ? (
        <p className="product-strip__empty">{emptyMessage}</p>
      ) : (
        <ul className="product-strip__list" ref={listRef}>
          {products.slice(0, STRIP_COUNT).map(lp).map(({ id, name, thumbnail, salePrice }) => (
            <li key={id}>
              <Link to={`/product/${id}`} draggable={false}>
                <img src={getImage(thumbnail)} alt="" loading="lazy" draggable={false} />
                <span className="product-strip__name">{name}</span>
                <span className="product-strip__price">{formatPrice(salePrice)}</span>
              </Link>
            </li>
          ))}
          {hasMore && (
            <li>
              <Link to={to} className="product-strip__more" draggable={false}>
                <span className="product-strip__more-icon" aria-hidden="true">
                  +
                </span>
                {t('더보기', 'More')}
                <span className="blind">{t(` (${title} ${products.length}개 전체)`, ` (all ${products.length} in ${title})`)}</span>
              </Link>
            </li>
          )}
        </ul>
      )}
    </section>
  )
}

export default ProductStrip
