import { useParams } from 'react-router-dom'
import ScrollTabs from '../components/ScrollTabs.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import SortedProductList from '../components/SortedProductList.jsx'
import { COLLECTIONS, findCollection, getCollectionProducts } from '../utils/productLists.js'
import NotFoundPage from './NotFoundPage.jsx'
import './CollectionPage.css'
import { t } from '../utils/i18n.js'

const COLLECTION_TABS = COLLECTIONS.map(({ id, title }) => ({ to: `/collection/${id}`, title }))

// 컬렉션 상품 목록 (/collection/:id?sort=): 컬렉션 탭 + 설명 + 정렬 목록(기본 인기순)
// 들어오는 곳: 내비 COLLECTION, 브랜드 페이지 컬렉션의 전체보기·더보기
function CollectionPage() {
  const { id } = useParams()
  const collection = findCollection(id)
  if (!collection) return <NotFoundPage />

  return (
    <main className="collection-page">
      <SectionTitle>{collection.title}</SectionTitle>
      <ScrollTabs items={COLLECTION_TABS} label={t('컬렉션', 'Collections')} />
      <p className="collection-page__label">{t(collection.label)}</p>
      <p className="collection-page__desc">{t(collection.description)}</p>
      <SortedProductList products={getCollectionProducts(collection)} defaultSort="popular" emptyMessage={t('등록된 상품이 없어요.', 'No items yet.')} />
    </main>
  )
}

export default CollectionPage
