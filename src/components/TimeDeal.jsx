import { useEffect, useState } from 'react'
import './TimeDeal.css'
import { t } from '../utils/i18n.js'

const pad = (n) => String(n).padStart(2, '0')

// 남은 시간(ms) → "209 일 13 : 30 : 27"
const formatRemaining = (ms) => {
  const total = Math.floor(ms / 1000)
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return `${days}${t(' 일', 'd')} ${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`
}

// 상품 이미지 위에 올라가는 타임딜 뱃지 + 카운트다운 (마감되면 표시하지 않음)
function TimeDeal({ endAt }) {
  const end = new Date(endAt).getTime()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const remaining = end - now
  if (remaining <= 0) return null

  return (
    <>
      <span className="time-deal__badge">{t('타임딜', 'Time Deal')}</span>
      <span className="time-deal__countdown" role="timer" aria-label={t('타임딜 남은 시간', 'Time Deal time left')}>
        {formatRemaining(remaining)}
      </span>
    </>
  )
}

export default TimeDeal
