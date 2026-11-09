import { useState } from 'react'
import { LanguageContext, applyLang, getLang } from '../utils/i18n.js'

// 언어 상태 제공. 바뀌면 children(App)에 key를 줘서 화면 전체를 새 언어로 다시 그림
// (로그인·장바구니·찜 등 바깥 Provider의 상태는 그대로 유지)
function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getLang)

  const setLang = (next) => {
    if (next === lang) return
    applyLang(next)
    setLangState(next)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <div key={lang} style={{ display: 'contents' }}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export default LanguageProvider
