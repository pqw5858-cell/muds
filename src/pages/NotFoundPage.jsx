import { Link } from 'react-router-dom'
import { t } from '../utils/i18n.js'

// 없는 주소로 들어왔을 때
function NotFoundPage() {
  return (
    <main className="page-placeholder">
      <h2>{t('페이지를 찾을 수 없습니다', 'Page not found')}</h2>
      <Link to="/" className="page-placeholder__link">
        {t('메인으로 가기', 'Go to Home')}
      </Link>
    </main>
  )
}

export default NotFoundPage
