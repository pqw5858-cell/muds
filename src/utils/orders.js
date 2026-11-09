// 주문 관련: 결제 진행 중 주문(세션) + 완료된 주문 내역(회원별, 브라우저 저장)
import { t } from './i18n.js'
import { lp } from './localize.js'

const name = (line) => lp(line.product).name // 현재 언어의 상품 이름

const PENDING_KEY = 'muds-pending-order'
const ordersKey = (uid) => `muds-orders-${uid}`

// 토스 주문번호 규칙: 영문 대소문자·숫자·-·_ 6~64자 → "MUDS-날짜-랜덤"
export const createOrderId = () => {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const random = Math.random().toString(36).slice(2, 10).toUpperCase()
  return `MUDS-${date}-${random}`
}

// "취객선비 3인방 변색 잔세트 외 2건" (영어: "... and 2 more")
export const createOrderName = (lines) =>
  lines.length > 1
    ? t(`${name(lines[0])} 외 ${lines.length - 1}건`, `${name(lines[0])} and ${lines.length - 1} more`)
    : name(lines[0])

// 결제창으로 이동하면 페이지가 새로 열리므로, 결제 전 주문 정보를 세션에 보관했다가 결과 페이지에서 꺼냄
export const savePendingOrder = (order) => sessionStorage.setItem(PENDING_KEY, JSON.stringify(order))

export const loadPendingOrder = () => {
  try {
    return JSON.parse(sessionStorage.getItem(PENDING_KEY))
  } catch {
    return null
  }
}

export const clearPendingOrder = () => sessionStorage.removeItem(PENDING_KEY)

// 완료된 주문 내역 (최신순)
export const loadOrders = (uid) => {
  try {
    const saved = JSON.parse(localStorage.getItem(ordersKey(uid)))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export const saveOrder = (uid, order) => {
  const orders = loadOrders(uid).filter((o) => o.orderId !== order.orderId)
  localStorage.setItem(ordersKey(uid), JSON.stringify([order, ...orders]))
}
