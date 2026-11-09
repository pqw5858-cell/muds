import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import iconSearch from '../images/icon-search.png'
import './SearchBox.css'
import { t } from '../utils/i18n.js'

// 검색 입력창 + 인기 검색어 (외부 검색 카드와 헤더 내부 검색창에서 공용)
// 검색하면 /search?q=로 이동하고 onSearch 호출 (내부 검색창은 이때 닫힘)
function SearchBox({ keywords, inputRef, onSearch }) {
  const [text, setText] = useState('')
  const navigate = useNavigate()

  const search = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
    onSearch?.()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const query = text.trim()
    const input = event.currentTarget.elements.q
    if (!query) {
      input.focus() // 빈 검색어는 이동하지 않고 입력창으로
      return
    }
    input.blur()
    search(query)
  }

  const handleKeyword = (keyword) => {
    setText(keyword)
    search(keyword)
  }

  return (
    <>
      <form className="search-box__form" role="search" onSubmit={handleSubmit}>
        <input
          type="search"
          name="q"
          className="search-box__input"
          placeholder={t('어서오세요! 어떤 상품을 찾으세요?', 'Welcome! What are you looking for?')}
          aria-label={t('상품 검색', 'Search products')}
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="search-box__button">
          <img src={iconSearch} alt={t('검색', 'Search')} />
        </button>
      </form>

      <h3 className="search-box__title">{t('인기 검색어', 'Popular Searches')}</h3>
      <ul className="search-box__keywords">
        {keywords.map((keyword) => (
          <li key={keyword}>
            <button type="button" className="search-box__keyword" onClick={() => handleKeyword(keyword)}>
              {keyword}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default SearchBox
