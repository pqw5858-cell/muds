import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import GoogleLoginButton from '../components/GoogleLoginButton.jsx'
import PasswordInput from '../components/PasswordInput.jsx'
import logo from '../images/logo.png'
import { EMAIL_PATTERN, getAuthErrorMessage, useAuth } from '../utils/auth.js'
import './AuthPage.css'
import { t } from '../utils/i18n.js'

// 로그인 (/login): 이메일·비밀번호 로그인 + 비밀번호 찾기 + 회원가입 링크 + 구글 로그인
// 로그인 후 원래 가려던 페이지(state.from, 없으면 메인)로 이동
function LoginPage() {
  const { user, isReady, loginWithEmail, resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const fromState = location.state?.fromState // 원래 페이지로 넘기던 정보 (예: 바로 구매 상품)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  // 이미 로그인되어 있으면 바로 이동
  if (isReady && user) return <Navigate to={from} replace state={fromState} />

  const goBack = () => navigate(from, { replace: true, state: fromState })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setInfo('')
    if (!email.trim() || !password) return setError(t('이메일과 비밀번호를 입력해 주세요.', 'Please enter your email and password.'))
    if (!EMAIL_PATTERN.test(email.trim())) return setError(t('이메일 형식을 확인해 주세요.', 'Please enter a valid email address.'))

    setPending(true)
    setError('')
    try {
      await loginWithEmail(email.trim(), password)
      goBack()
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setPending(false)
    }
  }

  // 비밀번호 찾기: 이메일 칸의 주소로 재설정 메일 발송
  const handleReset = async () => {
    setInfo('')
    if (!EMAIL_PATTERN.test(email.trim())) return setError(
        t('비밀번호를 찾을 이메일을 위 칸에 입력해 주세요.', 'Enter your email above to reset your password.'),
      )
    setError('')
    try {
      await resetPassword(email.trim())
      setInfo(
        t(
          `${email.trim()} 주소로 비밀번호 재설정 메일을 보냈어요. 메일함을 확인해 주세요.`,
          `We've sent a password reset link to ${email.trim()}. Please check your inbox.`,
        ),
      )
    } catch (err) {
      setError(getAuthErrorMessage(err))
    }
  }

  return (
    <main className="auth-page">
      <img className="auth-page__logo" src={logo} alt={t('MU:DS 국립박물관 굿즈', 'MU:DS National Museum Goods')} />
      <h2 className="auth-page__title">LOGIN</h2>

      <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
        <label className="blind" htmlFor="login-email">
          {t('이메일', 'Email')}
        </label>
        <input
          id="login-email"
          className="auth-page__input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('이메일', 'Email')}
          autoComplete="email"
        />
        <label className="blind" htmlFor="login-password">
          {t('비밀번호', 'Password')}
        </label>
        <PasswordInput
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('비밀번호', 'Password')}
          autoComplete="current-password"
        />

        {error && (
          <p className="auth-page__error" role="alert">
            {error}
          </p>
        )}
        {info && (
          <p className="auth-page__info" role="status">
            {info}
          </p>
        )}

        <button type="submit" className="auth-page__submit" disabled={isPending || !isReady}>
          {isPending ? t('로그인 중…', 'Logging in…') : t('로그인', 'Log In')}
        </button>
      </form>

      <p className="auth-page__links">
        <button type="button" onClick={handleReset}>
          {t('비밀번호 찾기', 'Forgot Password?')}
        </button>
        <Link to="/signup" state={{ from, fromState }} replace>
          {t('회원가입', 'Sign Up')}
        </Link>
      </p>

      <p className="auth-page__divider">
        <span>{t('또는', 'or')}</span>
      </p>

      <GoogleLoginButton onSuccess={goBack} onError={setError} />
    </main>
  )
}

export default LoginPage
