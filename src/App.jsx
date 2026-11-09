import { useLayoutEffect } from 'react'
import { Route, Routes, useLocation, useMatch, useNavigationType } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import SearchPanel from './components/SearchPanel.jsx'
import TabBar from './components/TabBar.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import ScrollTopButton from './components/ScrollTopButton.jsx'
import BrandPage from './pages/BrandPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import CollectionPage from './pages/CollectionPage.jsx'
import { EventDetailPage, EventsPage } from './pages/EventsPage.jsx'
import { CheckoutFailPage, CheckoutSuccessPage } from './pages/CheckoutResultPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MyPage from './pages/MyPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import WishlistPage from './pages/WishlistPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import RecentPage from './pages/RecentPage.jsx'
import ReviewsPage from './pages/ReviewsPage.jsx'
import ReviewDetailPage from './pages/ReviewDetailPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import { useCart } from './utils/cart.js'
import { findProduct } from './utils/productLists.js'
import { useMediaQuery } from './utils/useMediaQuery.js'
import backgroundVideo from './images/background.mp4'
import backgroundPoster from './images/background-poster.jpg'
import './App.css'

// 브라우저 기본 스크롤 복원 대신 직접 처리
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

// 페이지별 마지막 스크롤 위치 (방문 기록 항목 key 기준)
const scrollPositions = new Map()

// 새 페이지로 이동하면 맨 위로, 뒤로/앞으로 가기면 보던 위치로 복원
function ScrollManager() {
  const { key } = useLocation()
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    window.scrollTo(0, navigationType === 'POP' ? (scrollPositions.get(key) ?? 0) : 0)
    // 이 페이지에 있는 동안 스크롤 위치를 계속 기록 (떠나는 순간에는 이미 새 페이지라 읽으면 틀림)
    const save = () => scrollPositions.set(key, window.scrollY)
    window.addEventListener('scroll', save, { passive: true })
    return () => window.removeEventListener('scroll', save)
  }, [key, navigationType])

  return null
}

// 모든 페이지 공통 틀: 배경 영상 + 외부 검색창 + 500px 프레임(헤더·페이지·푸터) + 탭바
function App() {
  // 상세페이지(구매 바)와 상품이 담긴 장바구니(주문 바)에서는 탭바 대신 각 페이지의 하단 바를 표시
  const productMatch = useMatch('/product/:id')
  const isProductPage = Boolean(productMatch && findProduct(productMatch.params.id))
  const { count: cartCount } = useCart()
  const isCartWithItems = Boolean(useMatch('/cart')) && cartCount > 0
  const isCheckout = Boolean(useMatch('/checkout')) // 결제 바
  const hideTabBar = isProductPage || isCartWithItems || isCheckout
  const hasBackground = useMediaQuery('(min-width: 501px)') // 배경 영상은 프레임 밖이 보이는 화면에서만

  return (
    <div className="app">
      <ScrollManager />
      {/* 화면 전체에 고정된 배경 영상 (자동재생은 음소거 상태에서만 허용됨)
          휴대폰(500px 이하)은 프레임이 화면을 꽉 채워 배경이 안 보이므로 영상을 아예 불러오지 않음 */}
      {hasBackground && (
        <>
          <video
            className="app__background"
            src={backgroundVideo}
            poster={backgroundPoster}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          {/* 배경 영상 위에만 까는 노이즈 (프레임·검색 카드에는 적용 안 함) */}
          <div className="app__noise" aria-hidden="true" />
        </>
      )}
      <SearchPanel />
      <div className="frame">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop/:category" element={<ShopPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/reviews/:id" element={<ReviewDetailPage />} />
          <Route path="/brand" element={<BrandPage />} />
          <Route path="/collection/:id" element={<CollectionPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/recent" element={<RecentPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/mypage"
            element={
              <RequireAuth>
                <MyPage />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <CheckoutPage />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout/success"
            element={
              <RequireAuth>
                <CheckoutSuccessPage />
              </RequireAuth>
            }
          />
          <Route path="/checkout/fail" element={<CheckoutFailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </div>
      {!hideTabBar && <TabBar />}
      <ScrollTopButton />
    </div>
  )
}

export default App
