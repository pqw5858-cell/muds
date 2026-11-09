import { createContext, useContext } from 'react'

// 찜(관심상품) 공용 상태 (값은 WishlistProvider에서 제공)
export const WishlistContext = createContext(null)

export const useWishlist = () => {
  const wishlist = useContext(WishlistContext)
  if (!wishlist) throw new Error('useWishlist는 WishlistProvider 안에서만 사용할 수 있습니다.')
  return wishlist
}
