import { createContext, useContext } from 'react'

// 화면 언어 (ko / en). 고른 언어는 localStorage에 기억
// 언어를 바꾸면 App 전체를 다시 그리므로(App key), 어디서든 t()로 현재 언어 문구를 바로 꺼내 쓸 수 있음
const STORAGE_KEY = 'muds-lang'

const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
let current = saved === 'en' ? 'en' : 'ko'
if (typeof document !== 'undefined') document.documentElement.lang = current

export const getLang = () => current
export const isEn = () => current === 'en'

export function applyLang(lang) {
  current = lang === 'en' ? 'en' : 'ko'
  localStorage.setItem(STORAGE_KEY, current)
  document.documentElement.lang = current
}

// 현재 언어 문구: t('장바구니', 'Cart') 또는 t({ ko: '장바구니', en: 'Cart' })
export function t(ko, en) {
  if (ko && typeof ko === 'object') return ko[current] ?? ko.ko
  return current === 'en' && en !== undefined ? en : ko
}

export const LanguageContext = createContext({ lang: current, setLang: () => {} })
export const useLanguage = () => useContext(LanguageContext)
