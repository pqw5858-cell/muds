import { useEffect, useState } from 'react'
import './ScrollTopButton.css'
import { t } from '../utils/i18n.js'

const SHOW_AFTER = 400 // 이만큼 내려가면 표시

// 맨 위로 버튼: 탭바에서 옮겨와 하단 바 위 오른쪽에 떠 있음. 스크롤을 내렸을 때만 보임
function ScrollTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <button
      type="button"
      className={`scroll-top${visible ? ' is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('맨 위로', 'Back to top')}
      tabIndex={visible ? 0 : -1}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2 11 8 5l6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  )
}

export default ScrollTopButton
