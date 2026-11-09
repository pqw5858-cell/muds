import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import PostcodeModal from '../components/PostcodeModal.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import { getDisplayName, useAuth } from '../utils/auth.js'
import { getShippingFee, getSubtotal, useCart, withProducts } from '../utils/cart.js'
import { formatPrice } from '../utils/format.js'
import { getImage } from '../utils/getImage.js'
import { createOrderId, createOrderName, savePendingOrder } from '../utils/orders.js'
import './CheckoutPage.css'
import { isEn, t } from '../utils/i18n.js'
import { lp } from '../utils/localize.js'

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY
const PHONE_PATTERN = /^01\d{8,9}$/ // 숫자만 10~11자리 (010…)
// 영어 모드는 해외 번호도 받음 (숫자 8~15자리). 토스에는 한국 휴대폰 번호일 때만 전달
const isPhone = (value) => (isEn() ? /^\d{8,15}$/ : PHONE_PATTERN).test(value)

const onlyDigits = (value) => value.replace(/\D/g, '').slice(0, 11)

// 결제 (/checkout, 로그인 필요)
// - 상세페이지 "바로 구매하기": location.state.items의 상품만 주문
// - 장바구니 "주문하기": 장바구니 전체 주문 (결제 성공 시 장바구니 비움)
function CheckoutPage() {
  const { user } = useAuth()
  const { lines: cartLines } = useCart()
  const location = useLocation()

  // 페이지에 들어온 순간의 주문 상품으로 고정 (결제 중 장바구니가 바뀌어도 영향 없음)
  const [order] = useState(() => {
    const directItems = location.state?.items
    const lines = directItems ? withProducts(directItems) : cartLines
    const subtotal = getSubtotal(lines)
    const shippingFee = getShippingFee(subtotal)
    return { source: directItems ? 'direct' : 'cart', lines, subtotal, shippingFee, total: subtotal + shippingFee }
  })

  const [form, setForm] = useState({
    ordererName: getDisplayName(user),
    ordererPhone: '',
    recipient: getDisplayName(user),
    recipientPhone: '',
    zonecode: '',
    address: '',
    addressDetail: '',
  })
  const [errors, setErrors] = useState({})
  const [widgetState, setWidgetState] = useState('loading') // loading | ready | error
  const [isPaying, setPaying] = useState(false)
  const widgetsRef = useRef(null)

  // 토스 결제위젯: 결제 수단 + 약관 영역 그리기
  useEffect(() => {
    if (order.lines.length === 0) return
    const status = { cancelled: false } // 화면을 떠나면 true (다시 할당하지 않고 속성만 바꿈)
    const rendered = [] // 화면을 떠날 때 지울 위젯(결제 수단·약관)

    const render = async () => {
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY)
      if (status.cancelled) return // 개발 모드(StrictMode)에서 두 번 실행될 때 먼저 실행된 쪽은 그리지 않음
      // customerKey: 회원 고유값(유추 불가능한 Firebase uid)
      const widgets = tossPayments.widgets({ customerKey: user.uid })
      await widgets.setAmount({ currency: 'KRW', value: order.total })
      rendered.push(
        ...(await Promise.all([
          widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' }),
          widgets.renderAgreement({ selector: '#payment-agreement', variantKey: 'AGREEMENT' }),
        ])),
      )
      if (status.cancelled) return
      widgetsRef.current = widgets
      setWidgetState('ready')
    }

    render().catch(() => !status.cancelled && setWidgetState('error'))

    return () => {
      status.cancelled = true
      widgetsRef.current = null
      rendered.forEach((widget) => widget.destroy())
    }
  }, [order, user.uid])

  // 우편번호 검색 레이어 (레이어가 다시 그려지지 않도록 콜백을 고정)
  const [isPostcodeOpen, setPostcodeOpen] = useState(false)
  const closePostcode = useCallback(() => setPostcodeOpen(false), [])
  const selectAddress = useCallback(({ zonecode, address }) => {
    setForm((prev) => ({ ...prev, zonecode, address }))
    setErrors((prev) => ({ ...prev, address: '' }))
  }, [])

  // 주문할 상품이 없으면(장바구니가 비었는데 들어온 경우) 장바구니로
  if (order.lines.length === 0) return <Navigate to="/cart" replace />

  const change = (key, transform = (v) => v) => (e) => {
    const value = transform(e.target.value)
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const searchAddress = () => setPostcodeOpen(true)

  const validate = () => {
    const next = {}
    const phoneMessage = t('휴대폰 번호를 숫자만 입력해 주세요. (예: 01012345678)', 'Please enter your phone number using digits only.')
    if (!form.ordererName.trim()) next.ordererName = t('주문자 이름을 입력해 주세요.', 'Please enter your name.')
    if (!isPhone(form.ordererPhone)) next.ordererPhone = phoneMessage
    if (!form.recipient.trim()) next.recipient = t('받는 분 이름을 입력해 주세요.', "Please enter the recipient's name.")
    if (!isPhone(form.recipientPhone)) next.recipientPhone = phoneMessage
    if (!form.address) next.address = t('우편번호 검색으로 주소를 입력해 주세요.', 'Please find your address with the postcode search.')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const pay = async () => {
    if (!validate()) {
      document.querySelector('.checkout-page .is-invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const widgets = widgetsRef.current
    if (!widgets) return

    const orderId = createOrderId()
    const orderName = createOrderName(order.lines)

    // 결제창에서 돌아오면 페이지가 새로 열리므로 주문 정보를 세션에 보관 (결과 페이지에서 금액 확인·주문 내역 저장)
    savePendingOrder({
      orderId,
      orderName,
      source: order.source,
      amount: order.total,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      items: order.lines.map(({ id, quantity, product }) => ({
        id,
        quantity,
        name: product.name,
        price: product.salePrice,
        thumbnail: product.thumbnail,
      })),
      shipping: {
        recipient: form.recipient.trim(),
        phone: form.recipientPhone,
        zonecode: form.zonecode,
        address: `${form.address} ${form.addressDetail.trim()}`.trim(),
      },
    })

    setPaying(true)
    try {
      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
        customerEmail: user.email,
        customerName: form.ordererName.trim(),
        customerMobilePhone: PHONE_PATTERN.test(form.ordererPhone) ? form.ordererPhone : undefined,
      })
    } catch (err) {
      // 결제 수단 미선택·약관 미동의 등 → 토스가 보낸 안내를 보여줌 (결제창을 닫은 경우는 조용히)
      if (err?.code !== 'USER_CANCEL') window.alert(err?.message || t('결제를 시작하지 못했어요. 다시 시도해 주세요.', "Couldn't start the payment. Please try again."))
    } finally {
      setPaying(false)
    }
  }

  const input = (key, label, props = {}) => (
    <div className="checkout-page__field">
      <label htmlFor={`checkout-${key}`}>{label}</label>
      <input
        id={`checkout-${key}`}
        className={`checkout-page__input${errors[key] ? ' is-invalid' : ''}`}
        value={form[key]}
        onChange={change(key, props.inputMode === 'numeric' ? onlyDigits : undefined)}
        {...props}
      />
      {errors[key] && <p className="checkout-page__error">{errors[key]}</p>}
    </div>
  )

  return (
    <main className="checkout-page">
      <SectionTitle>ORDER</SectionTitle>

      {/* 주문 상품 */}
      <section className="checkout-page__section">
        <h3 className="checkout-page__heading">
          {t(`주문 상품 ${order.lines.length}개`, `Order Items (${order.lines.length})`)}
        </h3>
        <ul className="checkout-page__items">
          {order.lines.map(({ id, quantity, product }) => (
            <li key={id}>
              <img src={getImage(product.thumbnail)} alt="" />
              <div>
                <p className="checkout-page__item-name">{lp(product).name}</p>
                <p className="checkout-page__item-meta">
                  {formatPrice(product.salePrice)} · {t(`${quantity}개`, `Qty ${quantity}`)}
                </p>
              </div>
              <strong>{formatPrice(product.salePrice * quantity)}</strong>
            </li>
          ))}
        </ul>
      </section>

      {/* 주문자 정보 */}
      <section className="checkout-page__section">
        <h3 className="checkout-page__heading">{t('주문자 정보', 'Your Information')}</h3>
        {input('ordererName', t('이름', 'Name'), { autoComplete: 'name' })}
        {input('ordererPhone', t('휴대폰 번호', 'Phone Number'), {
          inputMode: 'numeric',
          placeholder: t('01012345678', 'Digits only'),
          autoComplete: 'tel',
        })}
        <p className="checkout-page__email">{user.email}</p>
      </section>

      {/* 배송지 */}
      <section className="checkout-page__section">
        <h3 className="checkout-page__heading">{t('배송지', 'Shipping Address')}</h3>
        {input('recipient', t('받는 분', 'Recipient'))}
        {input('recipientPhone', t('받는 분 휴대폰 번호', "Recipient's Phone Number"), {
          inputMode: 'numeric',
          placeholder: t('01012345678', 'Digits only'),
        })}
        <div className="checkout-page__field">
          <label htmlFor="checkout-zonecode">{t('주소', 'Address')}</label>
          <div className="checkout-page__zip">
            <input
              id="checkout-zonecode"
              className={`checkout-page__input${errors.address ? ' is-invalid' : ''}`}
              value={form.zonecode}
              placeholder={t('우편번호', 'Postcode')}
              readOnly
              onClick={searchAddress}
            />
            <button type="button" onClick={searchAddress}>
              {t('우편번호 검색', 'Find Address')}
            </button>
          </div>
          <input
            className="checkout-page__input"
            value={form.address}
            placeholder={t('기본 주소', 'Street address')}
            readOnly
            onClick={searchAddress}
            aria-label={t('기본 주소', 'Street address')}
          />
          <input
            className="checkout-page__input"
            value={form.addressDetail}
            onChange={change('addressDetail')}
            placeholder={t('상세 주소 (동·호수 등)', 'Apt, suite, unit, etc.')}
            aria-label={t('상세 주소', 'Address line 2')}
          />
          {errors.address && <p className="checkout-page__error">{errors.address}</p>}
        </div>
      </section>

      {/* 결제 금액 */}
      <section className="checkout-page__section">
        <h3 className="checkout-page__heading">{t('결제 금액', 'Payment Summary')}</h3>
        <dl className="checkout-page__summary">
          <div>
            <dt>{t('상품 금액', 'Subtotal')}</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div>
            <dt>{t('배송비', 'Shipping')}</dt>
            <dd>{order.shippingFee === 0 ? t('무료', 'Free') : `+${formatPrice(order.shippingFee)}`}</dd>
          </div>
          <div className="is-total">
            <dt>{t('총 결제 금액', 'Total')}</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>

      {/* 토스 결제위젯 (결제 수단 + 약관) */}
      <section className="checkout-page__section is-widget">
        <h3 className="checkout-page__heading">{t('결제 수단', 'Payment Method')}</h3>
        {widgetState === 'loading' && <p className="checkout-page__widget-msg">{t('결제 수단을 불러오는 중…', 'Loading payment methods…')}</p>}
        {widgetState === 'error' && (
          <p className="checkout-page__widget-msg is-error">
            {t('결제 수단을 불러오지 못했어요. 새로고침해 주세요.', "Couldn't load payment methods. Please refresh the page.")}
          </p>
        )}
        <div id="payment-method" />
        <div id="payment-agreement" />
      </section>

      {isPostcodeOpen && <PostcodeModal onSelect={selectAddress} onClose={closePostcode} />}

      {/* 하단 고정 결제 바 */}
      <div className="checkout-page__pay-bar">
        <button type="button" onClick={pay} disabled={widgetState !== 'ready' || isPaying}>
          {t(`${formatPrice(order.total)} 결제하기`, `Pay ${formatPrice(order.total)}`)}
        </button>
      </div>
    </main>
  )
}

export default CheckoutPage
