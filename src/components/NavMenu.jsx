import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../images/logo.png'
import { getDisplayName, useAuth } from '../utils/auth.js'
import { useCart } from '../utils/cart.js'
import { COLLECTIONS, SHOP_CATEGORIES } from '../utils/productLists.js'
import './NavMenu.css'
import { t } from '../utils/i18n.js'
import LangSwitch from './LangSwitch.jsx'

// 펼치는 메뉴: SHOP = 상품 목록 카테고리(전체 제외), COLLECTION = 컬렉션
const SUB_MENUS = [
  {
    id: 'shop',
    label: 'SHOP',
    items: SHOP_CATEGORIES.filter(({ id }) => id !== 'all').map(({ id, title }) => ({ to: `/shop/${id}`, title })),
  },
  {
    id: 'collection',
    label: 'COLLECTION',
    items: COLLECTIONS.map(({ id, title }) => ({ to: `/collection/${id}`, title })),
  },
]
const MAIN_MENU = [
  { label: 'BRAND', to: '/brand' },
  { label: 'EVENT', to: '/events' },
  { label: 'REVIEW', to: '/reviews' },
]

// 헤더 햄버거 버튼을 누르면 왼쪽에서 가로로 슬라이드되어 들어오는 내비게이션
// 닫힐 때도 슬라이드되어 나가야 하므로 항상 렌더링하고, 열림 여부는 클래스로 제어
function NavMenu({ open, onClose }) {
  const [openSub, setOpenSub] = useState(null) // 펼친 하위 메뉴 id (한 번에 하나)
  const { count: cartCount } = useCart()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    onClose()
  }

  // 연결된 페이지가 있는 링크만 to 지정 (나머지는 준비 중). 첫 칸은 로그인 상태에 따라 로그인/로그아웃
  const userLinks = [
    user
      ? { label: t('로그아웃', 'Log Out'), onClick: handleLogout }
      : { label: t('로그인/회원가입', 'Log In / Sign Up'), to: '/login' },
    // 3열 배치: 로그아웃 · 마이페이지 · 주문조회 / 최근본상품 · 관심상품 · 장바구니
    { label: t('마이페이지', 'My Page'), to: '/mypage' },
    { label: t('주문조회', 'Orders'), to: '/mypage' },
    { label: t('최근본상품', 'Recently Viewed'), to: '/recent' },
    { label: t('관심상품', 'Wishlist'), to: '/wishlist' },
    { label: `${t('장바구니', 'Cart')} (${cartCount})`, to: '/cart' },
  ]

  return (
    <div className={`nav-menu__layer${open ? ' is-open' : ''}`} inert={!open}>
      <div className="nav-menu__backdrop" onClick={onClose} />
      <nav className="nav-menu" id="nav-menu" aria-label={t('전체 메뉴', 'Main menu')}>
        <div className="nav-menu__top">
          <Link to="/" className="nav-menu__logo" onClick={onClose}>
            <img src={logo} alt={t('MU:DS 국립박물관 굿즈', 'MU:DS National Museum Goods')} />
          </Link>
          <div className="nav-menu__top-right">
            <LangSwitch />
            <button type="button" className="nav-menu__close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="blind">{t('메뉴 닫기', 'Close menu')}</span>
            </button>
          </div>
        </div>

        <ul className={`nav-menu__list${openSub ? ' is-shop-open' : ''}`}>
          {SUB_MENUS.map(({ id, label, items }) => {
            const isOpen = openSub === id
            return (
              <li key={id}>
                <button
                  type="button"
                  className="nav-menu__main"
                  aria-expanded={isOpen}
                  aria-controls={`nav-${id}-sub`}
                  onClick={() => setOpenSub(isOpen ? null : id)}
                >
                  {label}
                  {/* 닫힘: +, 열림: − */}
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M0 7h14" stroke="currentColor" />
                    {!isOpen && <path d="M7 0v14" stroke="currentColor" />}
                  </svg>
                </button>
                {/* 하위 메뉴: 높이가 0.2초 동안 늘어나고 줄어드는 아코디언 */}
                <div className={`nav-menu__sub-wrap${isOpen ? ' is-open' : ''}`} id={`nav-${id}-sub`} inert={!isOpen}>
                  <ul className="nav-menu__sub">
                    {items.map(({ to, title }, i) => (
                      <li key={to} style={{ '--i': i }}>
                        <Link to={to} onClick={onClose}>
                          {title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          })}
          {MAIN_MENU.map(({ label, to }) => (
            <li key={label}>
              {to ? (
                <Link to={to} className="nav-menu__main" onClick={onClose}>
                  {label}
                </Link>
              ) : (
                <a href="#" className="nav-menu__main">
                  {label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="nav-menu__user">
          <p className="nav-menu__notice">
            {user ? (
              <>
                {t(`${getDisplayName(user)}님, 반가워요!`, `Welcome, ${getDisplayName(user)}!`)}
                <br />
                <span className="nav-menu__email">{user.email}</span>
              </>
            ) : (
              <>
                {t('로그인 후 이용하세요', 'Log in to get started')}
                <br />
                {t('회원만의 혜택을 누려보세요!', 'Enjoy members-only benefits!')}
              </>
            )}
          </p>
          <ul className="nav-menu__links">
            {userLinks.map(({ label, to, onClick }) => (
              <li key={label}>
                {to && (
                  <Link to={to} onClick={onClose}>
                    {label}
                  </Link>
                )}
                {onClick && (
                  <button type="button" onClick={onClick}>
                    {label}
                  </button>
                )}
                {!to && !onClick && <a href="#">{label}</a>}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default NavMenu
