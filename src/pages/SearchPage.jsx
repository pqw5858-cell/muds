import { Link, useSearchParams } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle.jsx'
import SortedProductList from '../components/SortedProductList.jsx'
import { searchProducts } from '../utils/productLists.js'
import './SearchPage.css'
import { t } from '../utils/i18n.js'

// 검색 결과 (/search?q=&sort=): 상품명·한 줄 소개·카테고리·해시태그에서 찾음. 기본 정렬은 인기순
function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() ?? ''

  return (
    <main className="search-page">
      <SectionTitle>SEARCH</SectionTitle>
      {query ? (
        <>
          <p className="search-page__query">
            {t('', 'Results for ')}
            <strong>‘{query}’</strong>
            {t(' 검색 결과', '')}
          </p>
          <SortedProductList
            products={searchProducts(query)}
            defaultSort="popular"
            emptyMessage={
              <>
                <p>
                  {t(`‘${query}’에 맞는 상품이 없어요.`, `No items match ‘${query}’.`)}
                  <br />
                  {t(
                    '검색어를 다시 확인하거나 전체 상품에서 찾아보세요.',
                    'Check your spelling or browse all items.',
                  )}
                </p>
                <Link to="/shop/all" className="search-page__all">
                  {t('전체 상품 보기', 'Browse All Items')}
                </Link>
              </>
            }
          />
        </>
      ) : (
        <p className="search-page__query">{t('검색어를 입력해 주세요.', 'Please enter a search term.')}</p>
      )}
    </main>
  )
}

export default SearchPage
