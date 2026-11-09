import { createContext, useContext } from 'react'
import { t } from './i18n.js'

// 로그인 공용 상태 (값은 AuthProvider에서 제공)
export const AuthContext = createContext(null)

export const useAuth = () => {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.')
  return auth
}

// 화면에 보여줄 이름 (이름이 없으면 이메일 앞부분)
export const getDisplayName = (user) => user?.displayName || user?.email?.split('@')[0] || t('회원', 'Member')

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MIN_PASSWORD_LENGTH = 8

// 사용자가 직접 구글 팝업을 닫은 경우 → 오류로 보여주지 않음
export const SILENT_AUTH_ERRORS = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request']

// Firebase 오류 코드 → 한국어 안내
const AUTH_ERROR_MESSAGES = {
  'auth/invalid-credential': { ko: '이메일 또는 비밀번호가 맞지 않아요.', en: 'Incorrect email or password.' },
  'auth/wrong-password': { ko: '이메일 또는 비밀번호가 맞지 않아요.', en: 'Incorrect email or password.' },
  'auth/user-not-found': { ko: '이메일 또는 비밀번호가 맞지 않아요.', en: 'Incorrect email or password.' },
  'auth/invalid-email': { ko: '이메일 형식을 확인해 주세요.', en: 'Please enter a valid email address.' },
  'auth/missing-email': { ko: '이메일을 입력해 주세요.', en: 'Please enter your email.' },
  'auth/email-already-in-use': {
    ko: '이미 가입된 이메일이에요. 로그인해 주세요.',
    en: 'This email is already registered. Please log in.',
  },
  'auth/weak-password': {
    ko: `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상으로 입력해 주세요.`,
    en: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
  },
  'auth/too-many-requests': {
    ko: '시도가 너무 많아요. 잠시 후 다시 시도해 주세요.',
    en: 'Too many attempts. Please try again in a moment.',
  },
  'auth/network-request-failed': { ko: '네트워크 연결을 확인해 주세요.', en: 'Please check your network connection.' },
  'auth/popup-blocked': {
    ko: '팝업이 차단되었어요. 브라우저에서 팝업을 허용해 주세요.',
    en: 'The pop-up was blocked. Please allow pop-ups in your browser.',
  },
  'auth/account-exists-with-different-credential': {
    ko: '같은 이메일이 다른 방법으로 가입되어 있어요.',
    en: 'This email is already registered with a different sign-in method.',
  },
  'auth/operation-not-allowed': {
    ko: '지금은 이 방법으로 로그인할 수 없어요.',
    en: "This sign-in method isn't available right now.",
  },
}

export const getAuthErrorMessage = (error) =>
  t(AUTH_ERROR_MESSAGES[error?.code] ?? { ko: '문제가 생겼어요. 잠시 후 다시 시도해 주세요.', en: 'Something went wrong. Please try again later.' })
