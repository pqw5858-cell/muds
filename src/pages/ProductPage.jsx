import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductDetail from '../components/product/ProductDetail.jsx'
import ProductGuide from '../components/product/ProductGuide.jsx'
import ProductReviews from '../components/product/ProductReviews.jsx'
import ProductSummary from '../components/product/ProductSummary.jsx'
import ProductTabs from '../components/product/ProductTabs.jsx'
import PurchaseBar from '../components/product/PurchaseBar.jsx'
import { findProduct } from '../utils/productLists.js'
import { addRecent } from '../utils/recent.js'
import NotFoundPage from './NotFoundPage.jsx'
import { lp } from '../utils/localize.js'

const TABS = [
  { id: 'product-detail', label: { ko: '상세정보', en: 'Details' } },
  { id: 'product-reviews', label: { ko: '리뷰', en: 'Reviews' } },
  { id: 'product-guide', label: { ko: '구매안내', en: 'Guide' } },
]

const scrollToReviews = () => document.getElementById('product-reviews')?.scrollIntoView({ behavior: 'smooth' })

// 상품 상세 페이지 (/product/:id)
function ProductPage() {
  const { id } = useParams()
  const found = findProduct(id)
  const product = lp(found) // 영어 모드면 상품 글자를 영어로 (아래 모든 영역에 그대로 전달)

  // 최근 본 상품에 기록
  useEffect(() => {
    if (found) addRecent(found.id)
  }, [found])

  if (!product) return <NotFoundPage />

  // key: 다른 상품으로 이동하면 수량·아코디언 등 상태를 새로 시작
  return (
    <main key={product.id} className="product-page">
      <ProductSummary product={product} onReviewClick={scrollToReviews} />
      <ProductTabs tabs={TABS} />
      <ProductDetail product={product} />
      <ProductReviews product={product} />
      <ProductGuide product={product} />
      <PurchaseBar product={product} />
    </main>
  )
}

export default ProductPage
