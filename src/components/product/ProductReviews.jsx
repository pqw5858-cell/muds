import reviews from '../../reviews.json'
import SectionTitle from '../SectionTitle.jsx'
import ReviewItem from '../ReviewItem.jsx'
import StarRating from '../StarRating.jsx'
import './ProductSection.css'
import './ProductReviews.css'
import { t } from '../../utils/i18n.js'

// 리뷰: 이 상품의 리뷰만 최신순 + 별점 요약
function ProductReviews({ product }) {
  const list = reviews
    .filter((r) => r.productId === product.id)
    .sort((a, b) => b.date.localeCompare(a.date))
  const average = list.length ? list.reduce((sum, r) => sum + r.rating, 0) / list.length : 0

  return (
    <section className="product-section" id="product-reviews">
      <SectionTitle>REVIEW</SectionTitle>

      <div className="product-reviews__summary">
        <strong>{average.toFixed(1)}</strong>
        <StarRating rating={average} size={16} />
        <span>{t(`리뷰 ${list.length}개`, `${list.length} ${list.length === 1 ? 'review' : 'reviews'}`)}</span>
      </div>

      {list.length === 0 ? (
        <p className="product-reviews__empty">{t('아직 작성된 리뷰가 없어요.', 'No reviews yet.')}</p>
      ) : (
        <ul className="product-reviews__list">
          {list.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default ProductReviews
