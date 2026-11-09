import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/format.js'
import { getImage } from '../utils/getImage.js'
import { useWishlist } from '../utils/wishlist.js'
import HeartIcon from './HeartIcon.jsx'
import TimeDeal from './TimeDeal.jsx'
import soldOutBadge from '../images/badge-sold-out.svg'
import './ProductCard.css'
import { t } from '../utils/i18n.js'
import { lp } from '../utils/localize.js'

function ProductCard({ product }) {
  const { id, category, name, price, salePrice, discountRate, notes, thumbnail, timeDealEnd, soldOut } = lp(product)
  const { has, toggle } = useWishlist()
  const liked = has(id)

  return (
    <article className="product-card">
      <div className="product-card__thumb">
        <img src={getImage(thumbnail)} alt={name} draggable={false} />
        {timeDealEnd && <TimeDeal endAt={timeDealEnd} />}
        <button
          type="button"
          className="product-card__like"
          aria-pressed={liked}
          aria-label={liked ? t('찜 해제', 'Remove from wishlist') : t('찜하기', 'Add to wishlist')}
          onClick={() => toggle(id)}
        >
          <HeartIcon filled={liked} />
        </button>
      </div>

      <div className="product-card__info">
        <p className="product-card__category">{category.toUpperCase()}</p>
        <h3 className="product-card__name">
          {/* 링크 영역을 카드 전체로 넓힘 (CSS ::after). 슬라이더 드래그를 막지 않도록 기본 드래그는 끔 */}
          <Link to={`/product/${id}`} className="product-card__link" draggable={false}>
            {name}
          </Link>
        </h3>
        <p className="product-card__price">
          {discountRate > 0 && <del className="product-card__original">{formatPrice(price)}</del>}
          <strong className="product-card__sale">{formatPrice(salePrice)}</strong>
          {discountRate > 0 && <span className="product-card__rate">{discountRate}%</span>}
        </p>
        <p className="product-card__note">{notes[0] ?? ''}</p>
        {soldOut && <img className="product-card__sold-out" src={soldOutBadge} alt={t('품절', 'Sold out')} width="59" height="13" />}
      </div>
    </article>
  )
}

export default ProductCard
