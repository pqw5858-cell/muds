import EventSlider from '../components/EventSlider.jsx'
import MainVisual from '../components/MainVisual.jsx'
import NewBanner from '../components/NewBanner.jsx'
import ProductGridSection from '../components/ProductGridSection.jsx'
import PromoModal from '../components/PromoModal.jsx'
import ReviewSection from '../components/ReviewSection.jsx'
import WeeklyBest from '../components/WeeklyBest.jsx'
import { bestItems, newArrivals } from '../utils/productLists.js'

// 메인 페이지 (/)
function HomePage() {
  return (
    <main>
      <MainVisual />
      <WeeklyBest />
      <NewBanner />
      <ProductGridSection title="NEW ARRIVALS" products={newArrivals} />
      <ProductGridSection title="BEST ITEM" products={bestItems} />
      <EventSlider />
      <ReviewSection />
      {/* 이벤트 팝업: 방문할 때 한 번 (오늘 하루 보지 않기 가능) */}
      <PromoModal />
    </main>
  )
}

export default HomePage
