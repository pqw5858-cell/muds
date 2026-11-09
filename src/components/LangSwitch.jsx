import { useLanguage } from '../utils/i18n.js'
import './LangSwitch.css'

// KO | EN 전환 버튼 (내비 메뉴 로고 오른쪽)
function LangSwitch({ className = '' }) {
  const { lang, setLang } = useLanguage()

  return (
    <div className={`lang-switch ${className}`} role="group" aria-label="Language / 언어">
      {[
        ['ko', 'KO', '한국어'],
        ['en', 'EN', 'English'],
      ].map(([code, label, name]) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={lang === code}
          aria-label={name}
          onClick={() => setLang(code)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default LangSwitch
