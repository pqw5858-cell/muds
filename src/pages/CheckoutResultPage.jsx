import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SectionTitle from '../components/SectionTitle.jsx'
import { useAuth } from '../utils/auth.js'
import { useCart } from '../utils/cart.js'
import { formatPrice } from '../utils/format.js'
import { clearPendingOrder, loadOrders, loadPendingOrder, saveOrder } from '../utils/orders.js'
import './CheckoutResultPage.css'
import { t } from '../utils/i18n.js'

// 결제 성공 (/checkout/success?paymentKey&orderId&amount, 로그인 필요)
// 실제 서비스는 여기서 서버가 비밀키로 결제 승인 API를 호출해야 하지만, 이 프로젝트는 서버가 없어 승인 단계를 생략(테스트 결제)
export function CheckoutSuccessPage() {
  const [params] = useSearchParams()
  const { user } = useAuth()
  const { clear: clearCart } = useCart()
  const orderId = params.get('orderId')
  const amount = Number(params.get('amount'))

  // 결제 전에 보관한 주문 정보와 토스가 돌려준 주문번호·금액이 같은지 확인 (금액 변조 방지)
  // 새로고침 등으로 이미 저장된 주문이면 저장된 내역을 보여줌
  const [result] = useState(() => {
    const pending = loadPendingOrder()
    if (pending && pending.orderId === orderId && pending.amount === amount) {
      return { status: 'new', order: { ...pending, paymentKey: params.get('paymentKey'), paidAt: new Date().toISOString() } }
    }
    const saved = loadOrders(user.uid).find((o) => o.orderId === orderId)
    return saved ? { status: 'saved', order: saved } : { status: 'mismatch', order: null }
  })

  // 새 주문이면 주문 내역에 저장하고, 장바구니에서 주문한 경우 장바구니 비우기
  // (장바구니를 비우면 clearCart가 새로 만들어져 효과가 다시 실행되므로 ref로 한 번만 처리)
  const savedRef = useRef(false)
  useEffect(() => {
    if (result.status !== 'new' || savedRef.current) return
    savedRef.current = true
    saveOrder(user.uid, result.order)
    if (result.order.source === 'cart') clearCart()
    clearPendingOrder()
  }, [result, user.uid, clearCart])

  if (result.status === 'mismatch') {
    return (
      <main className="checkout-result">
        <SectionTitle>ORDER</SectionTitle>
        <p className="checkout-result__title">{t('주문 정보를 확인할 수 없어요', "We couldn't verify your order")}</p>
        <p className="checkout-result__desc">
          {t(
            '결제 금액 또는 주문번호가 일치하지 않아요. 고객센터로 문의해 주세요.',
            "The payment amount or order number doesn't match. Please contact our Customer Center.",
          )}
        </p>
        <Link to="/" className="checkout-result__button">
          {t('메인으로', 'Go to Home')}
        </Link>
      </main>
    )
  }

  const { order } = result
  return (
    <main className="checkout-result">
      <SectionTitle>ORDER COMPLETE</SectionTitle>
      <div className="checkout-result__icon is-success" aria-hidden="true">
        ✓
      </div>
      <p className="checkout-result__title">{t('주문이 완료되었어요', 'Your order is complete')}</p>
      <p className="checkout-result__desc">
        {t('테스트 결제로, 실제 결제·배송은 진행되지 않아요.', 'This was a test payment. No actual charge or delivery will take place.')}
      </p>

      <dl className="checkout-result__info">
        <div>
          <dt>{t('주문번호', 'Order No.')}</dt>
          <dd>{order.orderId}</dd>
        </div>
        <div>
          <dt>{t('주문 상품', 'Items')}</dt>
          <dd>{order.orderName}</dd>
        </div>
        <div>
          <dt>{t('배송지', 'Ship to')}</dt>
          <dd>
            {order.shipping.recipient} · {order.shipping.address}
          </dd>
        </div>
        <div className="is-total">
          <dt>{t('결제 금액', 'Amount Paid')}</dt>
          <dd>{formatPrice(order.amount)}</dd>
        </div>
      </dl>

      <div className="checkout-result__actions">
        <Link to="/mypage" className="checkout-result__button is-line">
          {t('주문 내역 보기', 'View Orders')}
        </Link>
        <Link to="/" className="checkout-result__button">
          {t('쇼핑 계속하기', 'Continue Shopping')}
        </Link>
      </div>
    </main>
  )
}

// 결제 실패·취소 (/checkout/fail?code&message)
export function CheckoutFailPage() {
  const [params] = useSearchParams()
  const code = params.get('code')
  const message = params.get('message')
  const pending = loadPendingOrder()
  // 다시 시도: 바로 구매였으면 그 상품으로, 장바구니였으면 장바구니 결제로
  const retryState = pending?.source === 'direct' ? { items: pending.items.map(({ id, quantity }) => ({ id, quantity })) } : undefined

  return (
    <main className="checkout-result">
      <SectionTitle>ORDER</SectionTitle>
      <div className="checkout-result__icon" aria-hidden="true">
        !
      </div>
      <p className="checkout-result__title">
        {code === 'PAY_PROCESS_CANCELED'
          ? t('결제를 취소했어요', 'Payment canceled')
          : t('결제에 실패했어요', 'Payment failed')}
      </p>
      {message && <p className="checkout-result__desc">{message}</p>}
      {code && (
        <p className="checkout-result__code">
          {t('오류 코드', 'Error code')}: {code}
        </p>
      )}

      <div className="checkout-result__actions">
        <Link to="/cart" className="checkout-result__button is-line">
          {t('장바구니', 'Cart')}
        </Link>
        <Link to="/checkout" state={retryState} replace className="checkout-result__button">
          {t('다시 시도', 'Try Again')}
        </Link>
      </div>
    </main>
  )
}
