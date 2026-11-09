import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import reviews from '../reviews.json'
import ReviewItem from '../components/ReviewItem.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import StarRating from '../components/StarRating.jsx'
import { findProduct } from '../utils/productLists.js'
import '../components/ProductGridSection.css'
import '../components/SortedProductList.css'
import './ReviewsPage.css'
import { t } from '../utils/i18n.js'
import { lp } from '../utils/localize.js'

const PAGE_SIZE = 10 // 처음 보이는 개수, 더보기마다 이만큼 추가

const byDate = (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)
const SORTS = [
  { id: 'new', label: { ko: '최신순', en: 'Newest' }, compare: byDate },
  { id: 'high', label: { ko: '별점 높은순', en: 'Highest Rated' }, compare: (a, b) => b.rating - a.rating || byDate(a, b) },
  { id: 'low', label: { ko: '별점 낮은순', en: 'Lowest Rated' }, compare: (a, b) => a.rating - b.rating || byDate(a, b) },
]

// 리뷰 (/reviews?products=&photo=1&sort=): 별점 요약 + 전체/포토 리뷰 + 정렬 + 10개씩 더보기
// products(상품 ID를 쉼표로)가 있으면 그 상품 리뷰만 (이벤트 상품 리뷰 등)
// 필터·정렬은 주소에 남겨 상품을 보고 뒤로 와도 유지
function ReviewsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const products = (searchParams.get('products') ?? '').split(',').map(findProduct).filter(Boolean)
  const productIds = products.map((p) => p.id)
  const base = productIds.length ? reviews.filter((r) => productIds.includes(r.productId)) : reviews
  const average = base.length ? base.reduce((sum, r) => sum + r.rating, 0) / base.length : 0
  const photoCount = base.filter((r) => r.photo).length

  const photoOnly = searchParams.get('photo') === '1'
  const sort = SORTS.find((s) => s.id === searchParams.get('sort')) ?? SORTS[0]
  const list = base.filter((r) => !photoOnly || r.photo).sort(sort.compare)

  const update = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  return (
    <main className="reviews-page">
      <SectionTitle>REVIEW</SectionTitle>

      {/* 특정 상품 리뷰만 보는 중: 상품명 + 모든 상품 리뷰로 돌아가기 */}
      {products.length > 0 && (
        <div className="reviews-page__target">
          <p>
            {t('', 'Reviews for ')}
            <strong>{lp(products[0]).name}</strong>
            {products.length > 1 && t(` 외 ${products.length - 1}개`, ` and ${products.length - 1} more`)}
            {t(' 상품 리뷰', '')}
          </p>
          <button type="button" onClick={() => update('products', null)}>
            {t('모든 상품 리뷰 보기', 'See reviews for all items')}
          </button>
        </div>
      )}

      <div className="product-reviews__summary">
        <strong>{average.toFixed(1)}</strong>
        <StarRating rating={average} size={16} />
        <span>{t(`리뷰 ${base.length}개`, `${base.length} ${base.length === 1 ? 'review' : 'reviews'}`)}</span>
      </div>


      <div className="reviews-page__filters" role="group" aria-label={t('리뷰 종류', 'Review type')}>
        <button type="button" aria-pressed={!photoOnly} onClick={() => update('photo', null)}>
          {t('전체 리뷰', 'All')} {base.length}
        </button>
        <button type="button" aria-pressed={photoOnly} onClick={() => update('photo', '1')}>
          {t('포토 리뷰', 'With Photos')} {photoCount}
        </button>
      </div>

      <div className="sorted-list__toolbar">
        <span>
          {t('총 ', '')}
          <strong>{list.length}</strong>
          {t('개', list.length === 1 ? ' review' : ' reviews')}
        </span>
        <label>
          <span className="blind">{t('정렬', 'Sort by')}</span>
          <select value={sort.id} onChange={(e) => update('sort', e.target.value === 'new' ? null : e.target.value)}>
            {SORTS.map(({ id, label }) => (
              <option key={id} value={id}>
                {t(label)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* 필터·정렬이 바뀌면 더보기 상태를 처음부터 */}
      {list.length === 0 ? (
        <p className="product-reviews__empty">{t('아직 작성된 리뷰가 없어요.', 'No reviews yet.')}</p>
      ) : (
        <PagedReviews key={`${productIds}-${photoOnly}-${sort.id}`} list={list} />
      )}
    </main>
  )
}

function PagedReviews({ list }) {
  const [count, setCount] = useState(PAGE_SIZE)

  return (
    <>
      <ul className="product-reviews__list reviews-page__list">
        {list.slice(0, count).map((review) => (
          <ReviewItem key={review.id} review={review} product={findProduct(review.productId)} />
        ))}
      </ul>
      {count < list.length && (
        <button type="button" className="product-grid__more" onClick={() => setCount((n) => n + PAGE_SIZE)}>
          {t('더보기', 'View More')} ({count}/{list.length})
        </button>
      )}
    </>
  )
}

export default ReviewsPage
