import logo from '../images/logo.png'
import { SNS_LINKS } from '../utils/sns.js'
import SearchBox from './SearchBox.jsx'
import SnsIcon from './SnsIcon.jsx'
import './SearchPanel.css'
import { t } from '../utils/i18n.js'

// 인기 검색어 (영어 모드는 영어 단어로 — 검색은 두 언어 모두 찾음)
const POPULAR_KEYWORDS = {
  ko: ['취객선비', '청자', '곤룡포', '의궤', '텀블러', '머그컵', '접시'],
  en: ['Tipsy Seonbi', 'Celadon', 'Dragon Robe', 'Uigwe', 'Tumbler', 'Mug', 'Plate'],
}

// 시안 순서: 유튜브 · 인스타그램 · 페이스북
const PANEL_SNS = ['youtube', 'instagram', 'facebook'].map((id) => SNS_LINKS.find((sns) => sns.id === id))

// PC 화면에서 프레임 오른쪽에 떠 있는 검색 카드: 로고 + SNS(갈색 단색) / 검색창 / 인기 검색어
function SearchPanel() {
  return (
    <aside className="search-panel">
      <div className="search-panel__top">
        <h2 className="search-panel__logo">
          <img src={logo} alt={t('MU:DS 국립박물관 굿즈', 'MU:DS National Museum Goods')} />
        </h2>
        <ul className="search-panel__sns">
          {PANEL_SNS.map(({ id, label, href }) => (
            <li key={id}>
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${t(label)} ${t('(새 창)', '(opens in a new tab)')}`}>
                <SnsIcon id={id} />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <SearchBox keywords={t(POPULAR_KEYWORDS)} />
    </aside>
  )
}

export default SearchPanel
