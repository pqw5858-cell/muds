import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getShippingFee, MAX_QUANTITY, useCart } from '../../utils/cart.js'
import { formatPrice } from '../../utils/format.js'
import QuantityStepper from '../QuantityStepper.jsx'
import './PurchaseSheet.css'
import { t } from '../../utils/i18n.js'

// 구매 옵션 창: 아래에서 올라옴. 수량 선택 + 총 금액 + 장바구니 담기 / 바로 구매
// 닫힘 모션을 위해 항상 렌더링하고 open으로 제어
function PurchaseSheet({ product, open, onClose, onAdded }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { name, salePrice, preorder, soleOrder } = product
  const total = salePrice * quantity
  const shippingFee = getShippingFee(total)

  const changeQuantity = (next) => setQuantity(Math.min(MAX_QUANTITY, Math.max(1, next)))

  // 장바구니 담기: 단독 구매 규칙에 걸리면 비우고 담을지 확인
  const addToCart = () => {
    if (addItem(product, quantity) === 'conflict') {
      const ok = window.confirm(
        t(
          '단독 구매 상품은 다른 상품과 함께 담을 수 없어요.\n장바구니를 비우고 이 상품만 담을까요?',
          'This item must be purchased separately.\nEmpty your cart and add only this item?',
        ),
      )
      if (!ok) return
      addItem(product, quantity, { replace: true })
    }
    setQuantity(1)
    onAdded()
  }

  // 바로 구매: 이 상품만 결제 페이지로 (장바구니에는 담지 않음). 로그인 전이면 로그인을 거쳐 이어짐
  const navigate = useNavigate()
  const buyNow = () => navigate('/checkout', { state: { items: [{ id: product.id, quantity }] } })

  return (
    <div className={`purchase-sheet${open ? ' is-open' : ''}`} inert={!open}>
      <div className="purchase-sheet__backdrop" onClick={onClose} />
      <div className="purchase-sheet__panel" role="dialog" aria-modal="true" aria-label={t('구매 옵션', 'Purchase options')}>
        <button type="button" className="purchase-sheet__handle" onClick={onClose}>
          <span className="blind">{t('옵션 창 닫기', 'Close options')}</span>
        </button>

        <div className="purchase-sheet__item">
          <p className="purchase-sheet__name">{name}</p>
          <div className="purchase-sheet__row">
            <QuantityStepper value={quantity} onChange={changeQuantity} />
            <strong>{formatPrice(total)}</strong>
          </div>
        </div>

        {preorder && (
          <p className="purchase-sheet__notice">
            {t('예약주문 상품으로 약 4주 뒤 출고됩니다.', 'Pre-order item: ships in about 4 weeks.')}
          </p>
        )}
        {soleOrder && (
          <p className="purchase-sheet__notice">
            {t(
              '단독 구매 상품으로 다른 상품과 함께 결제할 수 없습니다.',
              'This item must be purchased separately from other items.',
            )}
          </p>
        )}

        <dl className="purchase-sheet__total">
          <div>
            <dt>{t('배송비', 'Shipping')}</dt>
            <dd>{shippingFee === 0 ? t('무료', 'Free') : formatPrice(shippingFee)}</dd>
          </div>
          <div className="is-sum">
            <dt>{t('총 결제 금액', 'Total')}</dt>
            <dd>{formatPrice(total + shippingFee)}</dd>
          </div>
        </dl>

        <div className="purchase-sheet__actions">
          <button type="button" className="is-line" onClick={addToCart}>
            {t('장바구니 담기', 'Add to Cart')}
          </button>
          <button type="button" onClick={buyNow}>
            {t('바로 구매하기', 'Buy Now')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PurchaseSheet
