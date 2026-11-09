import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../utils/auth.js'
import { auth, googleProvider } from '../utils/firebase.js'

// 로그인 상태 제공 (구글 / 이메일·비밀번호). Firebase가 로그인 정보를 브라우저에 보관하므로 새로고침해도 유지됨
function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isReady, setReady] = useState(false) // 처음 로그인 상태 확인이 끝났는지
  const [profileVersion, setProfileVersion] = useState(0) // 가입 직후 이름 반영용

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setReady(true)
    })
    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({
      user,
      isReady,
      profileVersion,
      loginWithGoogle: () => signInWithPopup(auth, googleProvider),
      loginWithEmail: (email, password) => signInWithEmailAndPassword(auth, email, password),
      // 가입 후 이름 저장. 가입하면 자동으로 로그인 상태가 됨
      signupWithEmail: async (name, email, password) => {
        const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(newUser, { displayName: name })
        setProfileVersion((v) => v + 1) // 같은 user 객체의 이름만 바뀌므로 화면을 다시 그리게 함
      },
      resetPassword: (email) => sendPasswordResetEmail(auth, email),
      logout: () => signOut(auth),
    }),
    [user, isReady, profileVersion],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
