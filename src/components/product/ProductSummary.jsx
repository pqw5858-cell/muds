import { formatPrice } from '../../utils/format.js'
import { getImage } from '../../utils/getImage.js'
import StarRating from '../StarRating.jsx'
import TimeDeal from '../TimeDeal.jsx'
import './ProductSummary.css'
import { t } from '../../utils/i18n.js'

// 상세페이지 상단: 대표 이미지 + 상품 정보 + 배송/주의 안내
function ProductSummary({ product, onReviewClick }) {
  const {
    categoryName,
    category,
    name,
    summary,
    notes,
    price,
    discountRate,
    salePrice,
    hashtags,
    badges,
    thumbnail,
    timeDealEnd,
    soldOut,
    preorder,
    soleOrder,
    rating,
    reviewCount,
    shipping,
  } = product

  return (
    <section className="product-summary">
      <div className="product-summary__image">
        <img src={getImage(thumbnail)} alt={name} />
        {timeDealEnd && <TimeDeal endAt={timeDealEnd} />}
        {soldOut && <span className="product-summary__sold-out">SOLD OUT</span>}
      </div>

      <div className="product-summary__info">
        <p className="product-summary__category">
          <span>{category.toUpperCase()}</span>
          <span className="blind">{categoryName}</span>
          {badges.map((badge) => (
            <span key={badge} className="product-summary__badge">
              {badge}
            </span>
          ))}
        </p>

        <h2 className="product-summary__name">{name}</h2>
        <p className="product-summary__desc">{summary}</p>

        {reviewCount > 0 ? (
          <button type="button" className="product-summary__rating" onClick={onReviewClick}>
            <StarRating rating={rating} />
            <strong>{rating.toFixed(1)}</strong>
            <span>{t(`리뷰 ${reviewCount}`, `${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}`)}</span>
          </button>
        ) : (
          <p className="product-summary__rating is-empty">{t('아직 리뷰가 없어요', 'No reviews yet')}</p>
        )}

        <div className="product-summary__price">
          {discountRate > 0 && <del>{formatPrice(price)}</del>}
          <p>
            {discountRate > 0 && <span className="product-summary__rate">{discountRate}%</span>}
            <strong>{formatPrice(salePrice)}</strong>
          </p>
        </div>

        <p className="product-summary__tags">{hashtags.join(' ')}</p>

        {notes.length > 0 && (
          <ul className="product-summary__notes">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </div>

      <dl className="product-summary__shipping">
        <div>
          <dt>{t('배송', 'Shipping')}</dt>
          <dd>
            {shipping.method} · {formatPrice(shipping.fee)}{' '}
            {t(`(${formatPrice(shipping.freeOver)} 이상 무료)`, `(free over ${formatPrice(shipping.freeOver)})`)}
            <span>{shipping.note}</span>
          </dd>
        </div>
        {!shipping.overseas && (
          <div>
            <dt>{t('해외배송', 'International')}</dt>
            <dd>{t('불가', 'Not available')}</dd>
          </div>
        )}
      </dl>

      {(preorder || soleOrder) && (
        <ul className="product-summary__alerts">
          {preorder && (
            <li>
              {t(
                '예약주문 상품입니다. 결제 후 제작이 시작되어 약 4주 뒤 출고됩니다.',
                'This is a pre-order item. Production begins after payment, and it ships in about 4 weeks.',
              )}
            </li>
          )}
          {soleOrder && (
            <li>
              {t(
                '단독 구매 상품입니다. 다른 상품과 함께 결제할 수 없습니다.',
                'This item must be purchased separately and cannot be checked out with other items.',
              )}
            </li>
          )}
        </ul>
      )}
    </section>
  )
}

export default ProductSummary
