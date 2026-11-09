import { Link } from 'react-router-dom'
import iconHome from '../images/tap-bar-icon-01.png'
import iconCategory from '../images/icon-hamburger.png' // 헤더 햄버거 메뉴와 같은 아이콘
import iconMyPage from '../images/tap-bar-icon-03.png'
import iconCart from '../images/tap-bar-icon-04.png'
import { useCart } from '../utils/cart.js'
import { useWishlist } from '../utils/wishlist.js'
import WishIcon from './WishIcon.jsx'
import './TabBar.css'
import { t } from '../utils/i18n.js'

// 다섯 칸 모두 같은 구조: 아이콘 20px + 간격 8px + 코드 글자 (글자 굵기·크기 통일)
function TabBar() {
  const { count: cartCount } = useCart()
  const { count: wishCount } = useWishlist()

  return (
    <nav className="tab-bar" aria-label={t('하단 메뉴', 'Bottom menu')}>
      <ul className="tab-bar__list">
        <li>
          <Link to="/" className="tab-bar__item tab-bar__drawn">
            <span className="tab-bar__drawn-icon">
              <img src={iconHome} alt="" />
            </span>
            <span className="tab-bar__label">{t('홈', 'Home')}</span>
          </Link>
        </li>
        <li>
          <Link to="/shop/all" className="tab-bar__item tab-bar__drawn">
            <span className="tab-bar__drawn-icon">
              <img src={iconCategory} alt="" />
            </span>
            <span className="tab-bar__label">{t('카테고리', 'Shop')}</span>
          </Link>
        </li>
        <li>
          {/* 로그인 전이면 /mypage의 RequireAuth가 로그인 페이지로 보냄 */}
          <Link to="/mypage" className="tab-bar__item tab-bar__drawn">
            <span className="tab-bar__drawn-icon">
              <img src={iconMyPage} alt="" />
            </span>
            <span className="tab-bar__label">{t('마이페이지', 'My Page')}</span>
          </Link>
        </li>
        <li>
          {/* 장바구니: 아이콘 + 수량 뱃지 + 글자를 코드로 조합 */}
          <Link to="/cart" className="tab-bar__item tab-bar__drawn">
            <span className="tab-bar__drawn-icon">
              <img src={iconCart} alt="" />
              <span className="tab-bar__badge">
                <span className="blind">{t('담긴 상품 수 ', 'Items in cart: ')}</span>
                {cartCount}
              </span>
            </span>
            <span className="tab-bar__label">{t('장바구니', 'Cart')}</span>
          </Link>
        </li>
        <li>
          {/* 찜: 장바구니와 같은 방식(아이콘 + 개수 뱃지 + 글자). "위로" 버튼은 화면에 떠 있는 버튼으로 이동 */}
          <Link to="/wishlist" className="tab-bar__item tab-bar__drawn">
            <span className="tab-bar__drawn-icon">
              <WishIcon color="#222" strokeWidth={1.2} />
              <span className="tab-bar__badge">
                <span className="blind">{t('찜한 상품 수 ', 'Wishlist items: ')}</span>
                {wishCount}
              </span>
            </span>
            <span className="tab-bar__label">{t('찜', 'Wishlist')}</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default TabBar
