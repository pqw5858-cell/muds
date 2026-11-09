import { isEn } from './i18n.js'

// 26000 → "26,000원" (영어: "₩26,000")
export const formatPrice = (price) => (isEn() ? `₩${price.toLocaleString('en-US')}` : `${price.toLocaleString()}원`)

// 오늘 날짜 "YYYY-MM-DD" (로컬 시간 기준, 오늘 하루 보지 않기 등에 사용)
export const todayKey = () => new Date().toLocaleDateString('sv-SE')
