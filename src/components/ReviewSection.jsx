import { Link } from 'react-router-dom'
import products from '../products.json'
import reviews from '../reviews.json'
import { getImage } from '../utils/getImage.js'
import SectionTitle from './SectionTitle.jsx'
import { STAR_POINTS } from './StarRating.jsx'
import './ProductGridSection.css'
import './ReviewSection.css'
import { t } from '../utils/i18n.js'
import { lp, lr } from '../utils/localize.js'

const REVIEW_COUNT = 4 // 2열 × 2줄

// 사진이 있는 최신 리뷰 4개 + 리뷰한 상품 정보
const latestPhotoReviews = reviews
  .filter((r) => r.photo)
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, REVIEW_COUNT)
  .map((review) => ({ ...review, product: products.find((p) => p.id === review.productId) }))

function Stars({ rating }) {
  return (
    <p className="review-card__stars" role="img" aria-label={t(`별점 5점 중 ${rating}점`, `Rated ${rating} out of 5`)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={n <= rating ? 'is-filled' : ''} width="13" height="12" viewBox="0 0 13 12" aria-hidden="true">
          <polygon points={STAR_POINTS} />
        </svg>
      ))}
    </p>
  )
}

function ReviewCard({ review }) {
  const { id, title, content, rating, author, date, photo } = lr(review) // 현재 언어의 리뷰 글자
  const product = lp(review.product) // 현재 언어의 상품 이름
  // 작은 사진 2장: 리뷰한 상품의 상세 이미지 앞 2장
  const subPhotos = product.detailImages.slice(0, 2)

  return (
    <article className="review-card">
      <div className="review-card__photo">
        <img src={getImage(photo)} alt={t(`${product.name} 리뷰 사진`, `Review photo of ${product.name}`)} />
        {subPhotos.length > 0 && (
          <ul className="review-card__sub-photos">
            {subPhotos.map((src) => (
              <li key={src}>
                <img src={getImage(src)} alt="" />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="review-card__body">
        <h3 className="review-card__title">
          {/* 링크 영역을 카드 전체로 넓힘 (CSS ::after) → 카드를 누르면 리뷰 상세 */}
          <Link to={`/reviews/${id}`} className="review-card__link">
            {title}
          </Link>
        </h3>
        <p className="review-card__content">{content}</p>
        <Stars rating={rating} />
        <p className="review-card__meta">
          <span>{author}</span>
          <time dateTime={date}>{date}</time>
        </p>
      </div>

      <div className="review-card__product">
        <img src={getImage(product.thumbnail)} alt="" />
        <span className="review-card__product-name">{product.name}</span>
      </div>
    </article>
  )
}

function ReviewSection() {
  return (
    <section className="review-section">
      <SectionTitle>REVIEW</SectionTitle>
      <ul className="review-section__list">
        {latestPhotoReviews.map((review) => (
          <li key={review.id}>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
      <Link to="/reviews?photo=1" className="product-grid__more review-section__more">
        {t('리뷰 더보기', 'More Reviews')}
      </Link>
    </section>
  )
}

export default ReviewSection
