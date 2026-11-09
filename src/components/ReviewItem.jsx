import { Link } from 'react-router-dom'
import { getImage } from '../utils/getImage.js'
import StarRating from './StarRating.jsx'
import './product/ProductReviews.css'
import { t } from '../utils/i18n.js'
import { lp, lr } from '../utils/localize.js'

// 리뷰 한 줄 (상세페이지 리뷰 탭·리뷰 페이지·리뷰 상세의 다른 리뷰 공용). 누르면 리뷰 상세
// product를 넘기면 위에 리뷰한 상품 링크 표시
function ReviewItem({ review, product }) {
  const { author, rating, title, content, date, photo } = lr(review) // 현재 언어의 리뷰 글자

  return (
    <li className="product-review">
      {product && (
        <Link to={`/product/${product.id}`} className="product-review__product">
          <img src={getImage(product.thumbnail)} alt="" loading="lazy" />
          <span>{lp(product).name}</span>
        </Link>
      )}
      {/* 별점·제목·내용·사진을 누르면 리뷰 상세 (상품 이름 링크와는 따로) */}
      <Link to={`/reviews/${review.id}`} className="product-review__link">
        <div className="product-review__head">
          <StarRating rating={rating} />
          <span>{author}</span>
          <time dateTime={date}>{date}</time>
        </div>
        <div className="product-review__body">
          <div>
            <h3 className="product-review__title">{title}</h3>
            <p className="product-review__content">{content}</p>
          </div>
          {photo && <img src={getImage(photo)} alt={t(`${author}님의 리뷰 사진`, `Review photo by ${author}`)} loading="lazy" />}
        </div>
      </Link>
    </li>
  )
}

export default ReviewItem
