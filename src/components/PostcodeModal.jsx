import { useEffect, useRef, useState } from 'react'
import { embedPostcode } from '../utils/postcode.js'
import './PostcodeModal.css'
import { t } from '../utils/i18n.js'

// 우편번호 검색 레이어: 프레임 위에 띄우고 그 안에 카카오 주소 검색 화면을 그림
function PostcodeModal({ onSelect, onClose }) {
  const bodyRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    embedPostcode(bodyRef.current, (result) => {
      onSelect(result)
      onClose()
    }).catch(() => setError(t('우편번호 서비스를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.', "Couldn't load the address search. Please try again later.")))
  }, [onSelect, onClose])

  // Esc로 닫기
  useEffect(() => {
    const handleKeyDown = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="postcode-modal">
      <div className="postcode-modal__backdrop" onClick={onClose} />
      <div className="postcode-modal__panel" role="dialog" aria-modal="true" aria-label={t('주소 검색', 'Address search')}>
        <div className="postcode-modal__head">
          <h3>{t('주소 검색', 'Address Search')}</h3>
          <button type="button" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M1 1l14 14M15 1 1 15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="blind">{t('닫기', 'Close')}</span>
          </button>
        </div>
        {error && <p className="postcode-modal__error">{error}</p>}
        <div className="postcode-modal__body" ref={bodyRef} />
      </div>
    </div>
  )
}

export default PostcodeModal
