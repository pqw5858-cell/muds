import { Link } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'
import SectionTitle from './SectionTitle.jsx'
import './ProductGridSection.css'
import './ProductListLayout.css'
import { t } from '../utils/i18n.js'

// 상품 목록 페이지 공용 틀 (찜한 상품, 최근 본 상품 등): 제목 + 개수 + 전체 삭제 + 2열 카드 목록 + 비었을 때 안내
function ProductListLayout({ title, countLabel, products, emptyMessage, onClear, clearConfirm }) {
  const handleClear = () => {
    if (!clearConfirm || window.confirm(clearConfirm)) onClear()
  }

  return (
    <main className="product-list-page">
      <SectionTitle>{title}</SectionTitle>

      {products.length === 0 ? (
        <div className="product-list-page__empty">
          <p>{emptyMessage}</p>
          <Link to="/">{t('쇼핑하러 가기', 'Start Shopping')}</Link>
        </div>
      ) : (
        <>
          <div className="product-list-page__head">
            <span>
              {t(`${countLabel} ${products.length}개`, `${countLabel}: ${products.length}`)}
            </span>
            {onClear && (
              <button type="button" onClick={handleClear}>
                {t('전체 삭제', 'Clear All')}
              </button>
            )}
          </div>
          <ul className="product-grid__list">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}

export default ProductListLayout
