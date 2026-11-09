import { useEffect, useMemo, useState } from 'react'
import { findProduct } from '../utils/productLists.js'
import { WishlistContext } from '../utils/wishlist.js'

const STORAGE_KEY = 'muds-wishlist'

const loadIds = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

// 찜 상태 제공: 상품 ID 목록(최근 찜한 순)을 브라우저에 저장 → 상품 카드·상세·찜 목록·헤더·탭바가 같은 상태를 봄
function WishlistProvider({ children }) {
  const [ids, setIds] = useState(loadIds)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [ids])

  const value = useMemo(() => {
    const products = ids.map(findProduct).filter(Boolean) // 없어진 상품은 제외
    return {
      products,
      count: products.length,
      has: (id) => ids.includes(id),
      toggle: (id) => setIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [id, ...prev])),
      remove: (id) => setIds((prev) => prev.filter((v) => v !== id)),
      clear: () => setIds([]),
    }
  }, [ids])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export default WishlistProvider
