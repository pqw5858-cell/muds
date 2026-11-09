import { useEffect, useMemo, useState } from 'react'
import { CartContext, MAX_QUANTITY, withProducts } from '../utils/cart.js'

const STORAGE_KEY = 'muds-cart'

// 브라우저에 저장된 장바구니 불러오기 (형식이 틀리면 빈 장바구니)
const loadItems = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

const clamp = (n) => Math.min(MAX_QUANTITY, Math.max(1, n))

// 장바구니 상태 제공: 항목은 { id, quantity }만 저장하고, 화면에는 상품 정보를 붙여 전달
function CartProvider({ children }) {
  const [items, setItems] = useState(loadItems)

  // 바뀔 때마다 브라우저에 저장 (새로고침해도 유지)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo(() => {
    const lines = withProducts(items)

    // 담기: 이미 있으면 수량 더하기. 단독 구매 규칙에 걸리면 담지 않고 'conflict' 반환
    const addItem = (product, quantity, { replace = false } = {}) => {
      const others = lines.filter((line) => line.id !== product.id)
      const conflict = others.length > 0 && (product.soleOrder || others.some((line) => line.product.soleOrder))
      if (conflict && !replace) return 'conflict'

      setItems((prev) => {
        const base = replace ? prev.filter((item) => item.id === product.id) : prev
        const exists = base.find((item) => item.id === product.id)
        return exists
          ? base.map((item) => (item.id === product.id ? { ...item, quantity: clamp(item.quantity + quantity) } : item))
          : [...base, { id: product.id, quantity: clamp(quantity) }]
      })
      return 'added'
    }

    const updateQuantity = (id, quantity) =>
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: clamp(quantity) } : item)))

    const removeItem = (id) => setItems((prev) => prev.filter((item) => item.id !== id))

    const clear = () => setItems([])

    return { lines, count: lines.length, addItem, updateQuantity, removeItem, clear }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
