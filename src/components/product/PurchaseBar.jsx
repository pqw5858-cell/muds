import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../../utils/wishlist.js'
import HeartIcon from '../HeartIcon.jsx'
import PurchaseSheet from './PurchaseSheet.jsx'
import './PurchaseBar.css'
import { t } from '../../utils/i18n.js'

const TOAST_DURATION = 2500

// 상세페이지 하단 고정 구매 바 (탭바 대신 표시)
function PurchaseBar({ product }) {
  const { has, toggle } = useWishlist()
  const liked = has(product.id)
  const [isSheetOpen, setSheetOpen] = useState(false)
  const [toastKey, setToastKey] = useState(0) // 0: 숨김, 담을 때마다 1씩 증가(다시 담으면 시간 초기화)

  // 담았다는 알림은 잠시 뒤 자동으로 사라짐
  useEffect(() => {
    if (!toastKey) return
    const timer = setTimeout(() => setToastKey(0), TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [toastKey])

  const handleAdded = () => {
    setSheetOpen(false)
    setToastKey((k) => k + 1)
  }

  return (
    <>
      {toastKey > 0 && (
        <div key={toastKey} className="purchase-bar__toast" role="status">
          {t('장바구니에 담았어요', 'Added to your cart')}
          <Link to="/cart">{t('보러가기', 'View Cart')}</Link>
        </div>
      )}

      <div className="purchase-bar">
        <button
          type="button"
          className="purchase-bar__like"
          aria-pressed={liked}
          aria-label={liked ? t('찜 해제', 'Remove from wishlist') : t('찜하기', 'Add to wishlist')}
          onClick={() => toggle(product.id)}
        >
          <HeartIcon filled={liked} size={22} />
        </button>

        {product.soldOut ? (
          <button type="button" className="purchase-bar__button is-disabled" disabled>
            {t('품절된 상품입니다', 'Sold Out')}
          </button>
        ) : (
          <>
            <button type="button" className="purchase-bar__button is-line" onClick={() => setSheetOpen(true)}>
              {t('장바구니', 'Add to Cart')}
            </button>
            <button type="button" className="purchase-bar__button" onClick={() => setSheetOpen(true)}>
              {t('구매하기', 'Buy Now')}
            </button>
          </>
        )}
      </div>

      {!product.soldOut && (
        <PurchaseSheet
          product={product}
          open={isSheetOpen}
          onClose={() => setSheetOpen(false)}
          onAdded={handleAdded}
        />
      )}
    </>
  )
}

export default PurchaseBar
