import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import GoogleLoginButton from '../components/GoogleLoginButton.jsx'
import PasswordInput from '../components/PasswordInput.jsx'
import logo from '../images/logo.png'
import { EMAIL_PATTERN, getAuthErrorMessage, MIN_PASSWORD_LENGTH, useAuth } from '../utils/auth.js'
import './AuthPage.css'
import { t } from '../utils/i18n.js'

const TERMS = [
  { id: 'service', label: { ko: '이용약관 동의 (필수)', en: 'I agree to the Terms of Use (required)' } },
  {
    id: 'privacy',
    label: { ko: '개인정보 수집·이용 동의 (필수)', en: 'I agree to the collection and use of personal information (required)' },
  },
]

// 입력값 검사 → 칸별 안내 문구 (입력한 칸만 검사해서, 처음부터 빨간 글씨가 나오지 않게 함)
const validate = ({ name, email, password, passwordConfirm }) => ({
  name: name && !name.trim() ? t('이름을 입력해 주세요.', 'Please enter your name.') : '',
  email: email && !EMAIL_PATTERN.test(email.trim()) ? t('이메일 형식을 확인해 주세요.', 'Please enter a valid email address.') : '',
  password:
    password && password.length < MIN_PASSWORD_LENGTH
      ? t(`비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상으로 입력해 주세요.`, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      : '',
  passwordConfirm:
    passwordConfirm && passwordConfirm !== password ? t('비밀번호가 일치하지 않아요.', "Passwords don't match.") : '',
})

// 회원가입 (/signup): 이름·이메일·비밀번호 + 약관 동의. 가입하면 바로 로그인되어 원래 페이지로 이동
function SignupPage() {
  const { user, isReady, signupWithEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const fromState = location.state?.fromState // 원래 페이지로 넘기던 정보 (예: 바로 구매 상품)

  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' })
  const [agreed, setAgreed] = useState({ service: false, privacy: false })
  const [isPending, setPending] = useState(false)
  const [error, setError] = useState('')

  // 가입 직후에도 로그인 상태가 되므로 이 조건으로 원래 페이지로 이동함
  if (isReady && user) return <Navigate to={from} replace state={fromState} />

  const fieldErrors = validate(form)
  const allAgreed = TERMS.every(({ id }) => agreed[id])
  const isComplete =
    form.name.trim() &&
    EMAIL_PATTERN.test(form.email.trim()) &&
    form.password.length >= MIN_PASSWORD_LENGTH &&
    form.password === form.passwordConfirm &&
    allAgreed

  const change = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))
  const toggleAll = () => setAgreed(Object.fromEntries(TERMS.map(({ id }) => [id, !allAgreed])))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isComplete) return
    setPending(true)
    setError('')
    try {
      await signupWithEmail(form.name.trim(), form.email.trim(), form.password)
    } catch (err) {
      setError(getAuthErrorMessage(err))
      setPending(false)
    }
  }

  const field = (key, label, input) => (
    <div className="auth-page__field">
      <label htmlFor={`signup-${key}`}>{label}</label>
      {input}
      {fieldErrors[key] && <p className="auth-page__field-error">{fieldErrors[key]}</p>}
    </div>
  )

  return (
    <main className="auth-page">
      <img className="auth-page__logo" src={logo} alt={t('MU:DS 국립박물관 굿즈', 'MU:DS National Museum Goods')} />
      <h2 className="auth-page__title">JOIN</h2>

      <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
        {field(
          'name',
          t('이름', 'Name'),
          <input
            id="signup-name"
            className={`auth-page__input${fieldErrors.name ? ' is-invalid' : ''}`}
            value={form.name}
            onChange={change('name')}
            placeholder={t('이름', 'Name')}
            autoComplete="name"
          />,
        )}
        {field(
          'email',
          t('이메일 (아이디)', 'Email (used to log in)'),
          <input
            id="signup-email"
            className={`auth-page__input${fieldErrors.email ? ' is-invalid' : ''}`}
            type="email"
            value={form.email}
            onChange={change('email')}
            placeholder="example@email.com"
            autoComplete="email"
          />,
        )}
        {field(
          'password',
          t('비밀번호', 'Password'),
          <PasswordInput
            id="signup-password"
            value={form.password}
            onChange={change('password')}
            placeholder={t(`${MIN_PASSWORD_LENGTH}자 이상`, `At least ${MIN_PASSWORD_LENGTH} characters`)}
            autoComplete="new-password"
            invalid={Boolean(fieldErrors.password)}
          />,
        )}
        {field(
          'passwordConfirm',
          t('비밀번호 확인', 'Confirm Password'),
          <PasswordInput
            id="signup-passwordConfirm"
            value={form.passwordConfirm}
            onChange={change('passwordConfirm')}
            placeholder={t('비밀번호 다시 입력', 'Re-enter your password')}
            autoComplete="new-password"
            invalid={Boolean(fieldErrors.passwordConfirm)}
          />,
        )}

        <fieldset className="auth-page__terms">
          <legend className="blind">{t('약관 동의', 'Agreements')}</legend>
          <label className="auth-page__check is-all">
            <input type="checkbox" checked={allAgreed} onChange={toggleAll} />
            {t('전체 동의', 'Agree to all')}
          </label>
          {TERMS.map(({ id, label }) => (
            <label key={id} className="auth-page__check">
              <input
                type="checkbox"
                checked={agreed[id]}
                onChange={() => setAgreed((prev) => ({ ...prev, [id]: !prev[id] }))}
              />
              {t(label)}
            </label>
          ))}
        </fieldset>

        {error && (
          <p className="auth-page__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="auth-page__submit" disabled={!isComplete || isPending || !isReady}>
          {isPending ? t('가입 중…', 'Signing up…') : t('가입하기', 'Sign Up')}
        </button>
      </form>

      <p className="auth-page__links">
        {t('이미 회원이신가요?', 'Already a member?')}
        <Link to="/login" state={{ from, fromState }} replace>
          {t('로그인', 'Log In')}
        </Link>
      </p>

      <p className="auth-page__divider">
        <span>{t('또는', 'or')}</span>
      </p>

      <GoogleLoginButton
        label={t('Google 계정으로 가입하기', 'Sign up with Google')}
        onSuccess={() => navigate(from, { replace: true, state: fromState })}
        onError={setError}
      />
    </main>
  )
}

export default SignupPage
