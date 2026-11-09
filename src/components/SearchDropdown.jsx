import { useEffect, useRef } from 'react'
import SearchBox from './SearchBox.jsx'
import './SearchDropdown.css'
import { t } from '../utils/i18n.js'

// 인기 검색어 (영어 모드는 영어 단어로 — 검색은 두 언어 모두 찾음)
const POPULAR_KEYWORDS = {
  ko: ['취객선비', '청자', '곤룡포', '의궤', '코스터', '텀블러', '소반', '선물', '머그컵', '접시'],
  en: ['Tipsy Seonbi', 'Celadon', 'Dragon Robe', 'Uigwe', 'Coaster', 'Tumbler', 'Soban', 'Gift', 'Mug', 'Plate'],
}

// 헤더 검색 아이콘을 누르면 화면 맨 위부터 덮으며 펼쳐지는 내부 검색창
// 닫힘 모션을 보여주기 위해 항상 렌더링하고, 열림 여부는 클래스로 제어
function SearchDropdown({ open, onClose }) {
  const inputRef = useRef(null)

  // 열리면 입력창에 포커스
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  return (
    <>
      {/* 어두운 배경: 즉시 나타나고 즉시 사라짐. 프레임 밖 배경을 눌러도 닫힘 */}
      {open && <div className="search-dropdown__backdrop" onClick={onClose} />}
      <div
        className={`search-dropdown${open ? ' is-open' : ''}`}
        id="search-dropdown"
        inert={!open}
      >
        <SearchBox keywords={t(POPULAR_KEYWORDS)} inputRef={inputRef} onSearch={onClose} />
      </div>
    </>
  )
}

export default SearchDropdown
