import { findProduct } from './productLists.js'

// 최근 본 상품: 상세페이지를 볼 때마다 기록 (최신순, 최대 20개, 브라우저 저장)
const STORAGE_KEY = 'muds-recent'
const MAX_RECENT = 20

const loadIds = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export const addRecent = (id) => {
  const ids = [id, ...loadIds().filter((v) => v !== id)].slice(0, MAX_RECENT)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export const loadRecentProducts = () => loadIds().map(findProduct).filter(Boolean)

export const clearRecent = () => localStorage.removeItem(STORAGE_KEY)
