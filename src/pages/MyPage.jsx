import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductStrip from '../components/ProductStrip.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import { getDisplayName, useAuth } from '../utils/auth.js'
import { useCart } from '../utils/cart.js'
import { formatPrice } from '../utils/format.js'
import { getImage } from '../utils/getImage.js'
import { loadOrders } from '../utils/orders.js'
import { loadRecentProducts } from '../utils/recent.js'
import { useWishlist } from '../utils/wishlist.js'
import './MyPage.css'
import { isEn, t } from '../utils/i18n.js'

// "2026-11-06T03:12:00Z" → "2026.11.06" (영어: "Nov 6, 2026")
const formatDate = (iso) =>
  isEn()
    ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date(iso).toLocaleDateString('ko-KR').replace(/\.\s?/g, '.').replace(/\.$/, '')

// 로그인 방식 표시용
const PROVIDER_LABELS = {
  'google.com': { ko: 'Google 계정', en: 'Google account' },
  password: { ko: '이메일', en: 'Email' },
}

// 마이페이지 (/mypage, 로그인 필요): 회원 정보 + 장바구니 + 찜한 상품 + 최근 본 상품 + 주문 내역 + 로그아웃
function MyPage() {
  const { user, logout } = useAuth()
  const { count: cartCount } = useCart()
  const navigate = useNavigate()
  const provider = t(PROVIDER_LABELS[user.providerData[0]?.providerId] ?? PROVIDER_LABELS.password)
  const [orders] = useState(() => loadOrders(user.uid))
  const { products: wishProducts } = useWishlist()
  const [recentProducts] = useState(loadRecentProducts)

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <main className="my-page">
      <SectionTitle>MY PAGE</SectionTitle>

      <section className="my-page__profile">
        <p className="my-page__name">
          {t('', 'Welcome, ')}
          <strong>{getDisplayName(user)}</strong>
          {t('님, 반가워요!', '!')}
        </p>
        <dl className="my-page__info">
          <div>
            <dt>{t('이메일', 'Email')}</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>{t('로그인 방식', 'Signed in with')}</dt>
            <dd>{provider}</dd>
          </div>
        </dl>
      </section>

      <ul className="my-page__menu">
        <li>
          <Link to="/cart">
            {t('장바구니', 'Cart')} <span>{cartCount}</span>
          </Link>
        </li>
      </ul>

      {/* 찜한 상품 · 최근 본 상품: 썸네일 가로 목록 + 전체보기 */}
      <ProductStrip
        title={t('찜한 상품', 'Wishlist')}
        to="/wishlist"
        products={wishProducts}
        emptyMessage={t('찜한 상품이 없어요.', 'Your wishlist is empty.')}
      />
      <ProductStrip
        title={t('최근 본 상품', 'Recently Viewed')}
        to="/recent"
        products={recentProducts}
        emptyMessage={t('최근 본 상품이 없어요.', "You haven't viewed any items yet.")}
      />

      {/* 주문 내역 (결제 성공 시 브라우저에 저장된 주문) */}
      <section className="my-page__orders">
        <h3>{t('주문 내역', 'Order History')}</h3>
        {orders.length === 0 ? (
          <p className="my-page__empty">{t('아직 주문 내역이 없어요.', 'No orders yet.')}</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.orderId} className="my-order">
                <p className="my-order__head">
                  <time dateTime={order.paidAt}>{formatDate(order.paidAt)}</time>
                  <span>{t('결제 완료', 'Paid')}</span>
                </p>
                <div className="my-order__body">
                  <img src={getImage(order.items[0].thumbnail)} alt="" />
                  <div>
                    <p className="my-order__name">{order.orderName}</p>
                    <p className="my-order__meta">
                      {t('주문번호', 'Order No.')} {order.orderId}
                    </p>
                  </div>
                  <strong>{formatPrice(order.amount)}</strong>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button type="button" className="my-page__logout" onClick={handleLogout}>
        {t('로그아웃', 'Log Out')}
      </button>
    </main>
  )
}

export default MyPage
