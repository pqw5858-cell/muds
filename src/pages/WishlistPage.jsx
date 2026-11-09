import ProductListLayout from '../components/ProductListLayout.jsx'
import { useWishlist } from '../utils/wishlist.js'
import { t } from '../utils/i18n.js'

// 찜한 상품 (/wishlist): 최근에 찜한 순. 카드의 하트를 누르면 바로 목록에서 빠짐
function WishlistPage() {
  const { products, clear } = useWishlist()

  return (
    <ProductListLayout
      title="WISHLIST"
      countLabel={t('찜한 상품', 'Wishlist')}
      products={products}
      emptyMessage={t(
        '찜한 상품이 없어요. 마음에 드는 상품의 하트를 눌러 보세요.',
        'Your wishlist is empty. Tap the heart on any item you love.',
      )}
      onClear={clear}
      clearConfirm={t('찜한 상품을 모두 삭제할까요?', 'Remove all items from your wishlist?')}
    />
  )
}

export default WishlistPage
