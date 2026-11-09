import { Link, useNavigate } from 'react-router-dom'
import QuantityStepper from '../components/QuantityStepper.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import { FREE_SHIPPING_OVER, getShippingFee, getSubtotal, useCart } from '../utils/cart.js'
import { formatPrice } from '../utils/format.js'
import { getImage } from '../utils/getImage.js'
import './CartPage.css'
import { t } from '../utils/i18n.js'
import { lp } from '../utils/localize.js'

// 장바구니 (/cart): 담긴 상품 전체 주문 + 개별 삭제
function CartPage() {
  const { lines, updateQuantity, removeItem, clear } = useCart()
  const subtotal = getSubtotal(lines)
  const shippingFee = getShippingFee(subtotal)
  const total = subtotal + shippingFee
  const hasPreorder = lines.some(({ product }) => product.preorder)

  // 결제 페이지로 이동 (로그인 전이면 RequireAuth가 로그인 페이지를 거쳐 다시 보냄)
  const navigate = useNavigate()
  const order = () => navigate('/checkout')

  return (
    <main className="cart-page">
      <SectionTitle>CART</SectionTitle>

      {lines.length === 0 ? (
        <div className="cart-page__empty">
          <p>{t('장바구니가 비어 있어요.', 'Your cart is empty.')}</p>
          <Link to="/">{t('쇼핑하러 가기', 'Start Shopping')}</Link>
        </div>
      ) : (
        <>
          <div className="cart-page__head">
            <span>{t(`상품 ${lines.length}개`, `${lines.length} ${lines.length === 1 ? 'item' : 'items'}`)}</span>
            <button type="button" onClick={() => window.confirm(t('장바구니를 모두 비울까요?', 'Remove all items from your cart?')) && clear()}>
              {t('전체 삭제', 'Clear All')}
            </button>
          </div>

          <ul className="cart-page__list">
            {lines.map(({ id, quantity, product: raw }) => {
              const product = lp(raw) // 현재 언어의 상품 이름
              return (
              <li key={id} className="cart-item">
                <Link to={`/product/${id}`} className="cart-item__thumb">
                  <img src={getImage(product.thumbnail)} alt="" />
                </Link>
                <div className="cart-item__info">
                  <Link to={`/product/${id}`} className="cart-item__name">
                    {product.name}
                  </Link>
                  <p className="cart-item__price">
                    {product.discountRate > 0 && <del>{formatPrice(product.price)}</del>}
                    {formatPrice(product.salePrice)}
                  </p>
                  {(product.preorder || product.soleOrder) && (
                    <p className="cart-item__tag">
                      {[product.preorder && t('예약주문', 'Pre-order'), product.soleOrder && t('단독 구매', 'Purchase separately')]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                  <div className="cart-item__row">
                    <QuantityStepper value={quantity} onChange={(next) => updateQuantity(id, next)} />
                    <strong>{formatPrice(product.salePrice * quantity)}</strong>
                  </div>
                </div>
                <button type="button" className="cart-item__remove" onClick={() => removeItem(id)}>
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M1 1l10 10M11 1 1 11" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                  <span className="blind">{t(`${product.name} 삭제`, `Remove ${product.name}`)}</span>
                </button>
              </li>
              )
            })}
          </ul>

          {hasPreorder && (
            <p className="cart-page__notice">
              {t(
                '예약주문 상품이 포함되어 있어요. 함께 주문한 상품은 예약 상품 출고일(약 4주 뒤)에 맞춰 함께 발송됩니다.',
                'Your cart includes a pre-order item. Everything in this order will ship together on its ship date (in about 4 weeks).',
              )}
            </p>
          )}

          <dl className="cart-page__summary">
            <div>
              <dt>{t('상품 금액', 'Subtotal')}</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>{t('배송비', 'Shipping')}</dt>
              <dd>{shippingFee === 0 ? t('무료', 'Free') : `+${formatPrice(shippingFee)}`}</dd>
            </div>
            {shippingFee > 0 && (
              <p className="cart-page__free-hint">
                {t(
                  `${formatPrice(FREE_SHIPPING_OVER - subtotal)} 더 담으면 무료배송`,
                  `Add ${formatPrice(FREE_SHIPPING_OVER - subtotal)} more for free shipping`,
                )}
              </p>
            )}
            <div className="is-total">
              <dt>{t('총 결제 금액', 'Total')}</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          {/* 탭바 자리에 고정되는 주문 바 */}
          <div className="cart-page__order-bar">
            <button type="button" onClick={order}>
              {t(`${formatPrice(total)} 주문하기`, `Checkout · ${formatPrice(total)}`)}
            </button>
          </div>
        </>
      )}
    </main>
  )
}

export default CartPage
