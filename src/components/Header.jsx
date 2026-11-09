import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../images/logo.png'
import iconHamburger from '../images/icon-hamburger.png'
import iconSearch from '../images/icon-search.png'
import { useWishlist } from '../utils/wishlist.js'
import NavMenu from './NavMenu.jsx'
import WishIcon from './WishIcon.jsx'
import SearchDropdown from './SearchDropdown.jsx'
import { todayKey } from '../utils/format.js'
import './Header.css'
import { t } from '../utils/i18n.js'

const BANNER_HIDE_KEY = 'muds-top-banner-hide-date' // 띠배너를 닫은 날짜 (localStorage)

// 상단 띠배너: 오른쪽 X를 누르면 0.3초 동안 위로 접히며 사라지고, 오늘 하루 동안 안 보임
function TopBanner() {
  const [hidden] = useState(() => localStorage.getItem(BANNER_HIDE_KEY) === todayKey())
  const [closing, setClosing] = useState(false)
  if (hidden) return null

  const close = () => {
    localStorage.setItem(BANNER_HIDE_KEY, todayKey())
    setClosing(true)
  }

  return (
    <div className={`top-banner${closing ? ' is-closed' : ''}`} inert={closing}>
      <p>{t('2026년 신규 가입시 10,000원 적립 이벤트', 'Sign up in 2026 and get ₩10,000 in points')}</p>
      <button type="button" className="top-banner__close" onClick={close}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M1 1l10 10M11 1 1 11" stroke="#fff" strokeWidth="1.3" />
        </svg>
        <span className="blind">{t('띠배너 오늘 하루 닫기', 'Hide this banner for today')}</span>
      </button>
    </div>
  )
}

function Header() {
  const [isNavOpen, setNavOpen] = useState(false)
  const { count: wishCount } = useWishlist()
  const [isSearchOpen, setSearchOpen] = useState(false)

  // 페이지를 이동하면 열려 있던 메뉴/검색창 닫기 (렌더 중에 이전 주소와 비교)
  const { pathname, key } = useLocation()
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setNavOpen(false)
    setSearchOpen(false)
  }

  // Esc 키로 열린 메뉴/검색창 닫기
  useEffect(() => {
    if (!isNavOpen && !isSearchOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setNavOpen(false)
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isNavOpen, isSearchOpen])

  // 메인을 제외한 모든 페이지: 햄버거 왼쪽에 뒤로가기
  const hasBackButton = pathname !== '/'
  const navigate = useNavigate()
  // 사이트 안에서 이동해 왔으면 이전 페이지로, 주소로 바로 들어왔으면(이전 기록 없음) 메인으로
  const goBack = () => (key === 'default' ? navigate('/') : navigate(-1))

  const openNav = () => {
    setSearchOpen(false)
    setNavOpen(true)
  }

  return (
    <>
      <TopBanner />

      {/* 메인에서는 고정하지 않음 (탭바 카테고리·외부 검색창이 항상 보이므로) */}
      <header className={`header${pathname === '/' ? ' header--static' : ''}`}>
        {/* 왼쪽 묶음: (뒤로가기) + 햄버거. 오른쪽 찜·검색과 같은 간격 */}
        <div className="header__side">
          {hasBackButton && (
            <button type="button" className="header__icon" onClick={goBack}>
              {/* 뒤로가기 화살표: 햄버거·검색 아이콘과 같은 20px */}
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M13 3 6 10l7 7" fill="none" stroke="#202020" strokeWidth="1.6" />
              </svg>
              <span className="blind">{t('뒤로 가기', 'Go back')}</span>
            </button>
          )}
          <button
            type="button"
            className="header__icon"
            aria-expanded={isNavOpen}
            aria-controls="nav-menu"
            onClick={openNav}
          >
            <img src={iconHamburger} alt={t('메뉴 열기', 'Open menu')} />
          </button>
        </div>
        <h1 className="header__logo">
          <Link to="/">
            <img src={logo} alt={t('MU:DS 국립박물관 굿즈', 'MU:DS National Museum Goods')} />
          </Link>
        </h1>
        <div className="header__side header__actions">
          {/* 찜한 상품 */}
          <Link to="/wishlist" className="header__icon header__wish">
            <WishIcon />
            <span className="blind">{t('찜한 상품', 'Wishlist')}</span>
            {wishCount > 0 && (
              <span className="header__badge">
                <span className="blind">{t('개수 ', 'Items: ')}</span>
                {wishCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="header__icon"
            aria-expanded={isSearchOpen}
            aria-controls="search-dropdown"
            onClick={() => setSearchOpen((open) => !open)}
          >
            <img src={iconSearch} alt={t('검색', 'Search')} />
          </button>
        </div>
      </header>

      {/* 닫힘 모션이 있어 항상 렌더링하고 open으로 제어 */}
      <SearchDropdown open={isSearchOpen} onClose={() => setSearchOpen(false)} />
      <NavMenu open={isNavOpen} onClose={() => setNavOpen(false)} />
    </>
  )
}

export default Header
