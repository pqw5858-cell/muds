import { useState } from 'react'
import ProductListLayout from '../components/ProductListLayout.jsx'
import { clearRecent, loadRecentProducts } from '../utils/recent.js'
import { t } from '../utils/i18n.js'

// 최근 본 상품 (/recent): 상세페이지를 본 순서(최신순), 최대 20개
function RecentPage() {
  const [products, setProducts] = useState(loadRecentProducts)

  const handleClear = () => {
    clearRecent()
    setProducts([])
  }

  return (
    <ProductListLayout
      title="RECENTLY VIEWED"
      countLabel={t('최근 본 상품', 'Recently viewed')}
      products={products}
      emptyMessage={t('최근 본 상품이 없어요.', "You haven't viewed any items yet.")}
      onClear={handleClear}
      clearConfirm={t('최근 본 상품 기록을 모두 삭제할까요?', 'Clear your recently viewed history?')}
    />
  )
}

export default RecentPage
