import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../utils/auth.js'

// 로그인이 필요한 페이지: 로그인 전이면 로그인 페이지로 보내고, 로그인 후 원래 페이지로 돌아오게 함
function RequireAuth({ children }) {
  const { user, isReady } = useAuth()
  const location = useLocation()

  if (!isReady) return null // 로그인 상태 확인 중
  // fromState: 원래 페이지로 넘기던 정보(예: 바로 구매 상품)도 로그인 후 그대로 전달
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname, fromState: location.state }} />
  return children
}

export default RequireAuth
