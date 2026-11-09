import { Link, useParams } from 'react-router-dom'
import reviews from '../reviews.json'
import ReviewItem from '../components/ReviewItem.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import StarRating from '../components/StarRating.jsx'
import { formatPrice } from '../utils/format.js'
import { getImage } from '../utils/getImage.js'
import { findProduct } from '../utils/productLists.js'
import NotFoundPage from './NotFoundPage.jsx'
import '../components/product/ProductReviews.css'
import './ReviewDetailPage.css'
import { t } from '../utils/i18n.js'
import { lp, lr } from '../utils/localize.js'

const OTHER_COUNT = 5 // 이 상품의 다른 리뷰 미리보기 개수

// 리뷰 상세 (/reviews/:id): 사진 + 별점·제목·내용·작성자 + 리뷰한 상품 + 이 상품의 다른 리뷰
function ReviewDetailPage() {
  const { id } = useParams()
  const review = reviews.find((r) => r.id === id)
  const product = lp(review && findProduct(review.productId)) // 현재 언어의 상품 이름
  if (!review || !product) return <NotFoundPage />

  const { author, rating, title, content, option, date, photo } = lr(review) // 현재 언어의 리뷰 글자
  const others = reviews
    .filter((r) => r.productId === product.id && r.id !== review.id)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <main className="review-detail">
      <SectionTitle>REVIEW</SectionTitle>

      <article className="review-detail__article">
        {photo && <img className="review-detail__photo" src={getImage(photo)} alt={t(`${author}님의 리뷰 사진`, `Review photo by ${author}`)} />}
        <div className="review-detail__body">
          <div className="review-detail__meta">
            <StarRating rating={rating} size={15} />
            <span>{author}</span>
            <time dateTime={date}>{date}</time>
          </div>
          <h3 className="review-detail__title">{title}</h3>
          {option && <p className="review-detail__option">
              {t('옵션', 'Option')}: {option}
            </p>}
          <p className="review-detail__content">{content}</p>
        </div>
      </article>

      {/* 리뷰한 상품 → 상품 상세 */}
      <Link to={`/product/${product.id}`} className="review-detail__product">
        <img src={getImage(product.thumbnail)} alt="" />
        <span className="review-detail__product-info">
          <span className="review-detail__product-name">{product.name}</span>
          <span className="review-detail__product-price">
            {product.discountRate > 0 && <em>{product.discountRate}%</em>}
            {formatPrice(product.salePrice)}
          </span>
        </span>
        <span className="review-detail__product-go" aria-hidden="true">
          {t('상품 보기 →', 'View Item →')}
        </span>
      </Link>

      {/* 이 상품의 다른 리뷰 (최신순 5개) + 전체 보기 */}
      {others.length > 0 && (
        <section className="review-detail__others">
          <div className="review-detail__others-head">
            <h3>
              {t('이 상품의 다른 리뷰', 'More Reviews of This Item')} <span>{others.length}</span>
            </h3>
            <Link to={`/reviews?products=${product.id}`}>{t('전체보기', 'View All')}</Link>
          </div>
          <ul className="product-reviews__list review-detail__list">
            {others.slice(0, OTHER_COUNT).map((r) => (
              <ReviewItem key={r.id} review={r} />
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

export default ReviewDetailPage
