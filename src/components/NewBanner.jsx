import { Link } from 'react-router-dom'
import bannerImage from '../images/event-01.png'
import bannerImageEn from '../images/event-01-en.png'
import './NewBanner.css'
import { t } from '../utils/i18n.js'

// NEW 배너: 새로 나온 갓잔 미니 상세로 이동
function NewBanner() {
  return (
    <section className="new-banner">
      <Link to="/product/cup-14">
        <img
          src={t({ ko: bannerImage, en: bannerImageEn })}
          alt={t('NEW 갓 나온 갓잔 - 뒤집으면 갓, 바로 놓으면 잔', "NEW Gat Cup - Flip it over, it's a gat; set it upright, it's a cup")}
          width="500"
          height="590"
        />
      </Link>
    </section>
  )
}

export default NewBanner
