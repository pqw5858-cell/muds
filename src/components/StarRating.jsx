import './StarRating.css'
import { t } from '../utils/i18n.js'

// 별 1개: 13 x 12px 기준 좌표 (메인 리뷰 카드와 같은 모양)
export const STAR_POINTS = '6.5,-0.2 8.6,4.2 13.2,4.6 9.8,7.8 10.8,12.2 6.5,10 2.2,12.2 3.2,7.8 -0.2,4.6 4.4,4.2'

// 별점 표시 (반올림한 개수만큼 채움). size: 별 폭(px)
function StarRating({ rating, size = 13 }) {
  const filled = Math.round(rating)
  return (
    <span className="star-rating" role="img" aria-label={t(`별점 5점 중 ${rating}점`, `Rated ${rating} out of 5`)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={n <= filled ? 'is-filled' : ''}
          width={size}
          height={(size * 12) / 13}
          viewBox="0 0 13 12"
          aria-hidden="true"
        >
          <polygon points={STAR_POINTS} />
        </svg>
      ))}
    </span>
  )
}

export default StarRating
