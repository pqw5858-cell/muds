import { useState } from 'react'
import { t } from '../utils/i18n.js'

// 비밀번호 입력 + 보기/숨기기 버튼
function PasswordInput({ id, value, onChange, placeholder, autoComplete, invalid }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="auth-page__password">
      <input
        id={id}
        className={`auth-page__input${invalid ? ' is-invalid' : ''}`}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
      />
      <button
        type="button"
        className="auth-page__eye"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t('비밀번호 숨기기', 'Hide password') : t('비밀번호 보기', 'Show password')}
        aria-pressed={visible}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="10" cy="10" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
          {!visible && <path d="M3 17 17 3" stroke="currentColor" strokeWidth="1.3" />}
        </svg>
      </button>
    </div>
  )
}

export default PasswordInput
