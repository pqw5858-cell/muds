import { createContext, useContext } from 'react'
import { findProduct } from './productLists.js'

// 장바구니 공용 상태 (값은 CartProvider에서 제공)
export const CartContext = createContext(null)

export const useCart = () => {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('useCart는 CartProvider 안에서만 사용할 수 있습니다.')
  return cart
}

export const MAX_QUANTITY = 99

// 배송비 규칙 (모든 상품 동일: 3,000원, 50,000원 이상 무료)
export const SHIPPING_FEE = 3000
export const FREE_SHIPPING_OVER = 50000

export const getShippingFee = (subtotal) => (subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE)

// 저장된 { id, quantity } 목록 → 상품 정보를 붙인 목록 (삭제된 상품은 제외)
export const withProducts = (items) =>
  items.map((item) => ({ ...item, product: findProduct(item.id) })).filter((item) => item.product)

// 상품 금액 합계
export const getSubtotal = (lines) => lines.reduce((sum, { product, quantity }) => sum + product.salePrice * quantity, 0)
