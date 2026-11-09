import { useParams } from 'react-router-dom'
import ScrollTabs from '../components/ScrollTabs.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import SortedProductList from '../components/SortedProductList.jsx'
import { SHOP_CATEGORIES, findShopCategory, getCategoryProducts } from '../utils/productLists.js'
import NotFoundPage from './NotFoundPage.jsx'
import './ShopPage.css'
import { t } from '../utils/i18n.js'

const CATEGORY_TABS = SHOP_CATEGORIES.map(({ id, title }) => ({ to: `/shop/${id}`, title }))

// 상품 목록 (/shop/:category?sort=): 카테고리 탭 + 정렬 + 2열 카드 목록
function ShopPage() {
  const { category } = useParams()
  const shopCategory = findShopCategory(category)
  if (!shopCategory) return <NotFoundPage />

  return (
    <main className="shop-page">
      <SectionTitle>{shopCategory.title}</SectionTitle>
      <ScrollTabs items={CATEGORY_TABS} label={t('상품 카테고리', 'Product categories')} />
      {/* 기본 정렬: BEST만 인기순, 나머지는 신상품순 */}
      <SortedProductList
        products={getCategoryProducts(category)}
        defaultSort={category === 'best' ? 'popular' : 'new'}
        emptyMessage={t('등록된 상품이 없어요.', 'No items yet.')}
      />
    </main>
  )
}

export default ShopPage
