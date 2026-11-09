// 단색 원형 SNS 아이콘 (외부 검색창용): 갈색 원 + 흰 로고. 푸터의 컬러 아이콘과 같은 원형 모양
const GLYPHS = {
  // 로고(f) 가로 범위 8.3~15.8 → 중심 12 이므로 오른쪽으로 2 이동해 원 중심(14)에 맞춤
  facebook: (
    <path
      d="M13.2 21v-6.4h2.2l.3-2.6h-2.5v-1.6c0-.7.2-1.2 1.3-1.2h1.3V6.9a17 17 0 0 0-2-.1c-2 0-3.3 1.2-3.3 3.4V12H8.3v2.6h2.2V21Z"
      fill="#fff"
      transform="translate(2 0)"
    />
  ),
  instagram: (
    <g fill="none" stroke="#fff" strokeWidth="1.5">
      <rect x="7.5" y="7.5" width="13" height="13" rx="3.6" />
      <circle cx="14" cy="14" r="3.1" />
      <circle cx="17.7" cy="10.3" r="0.4" fill="#fff" />
    </g>
  ),
  youtube: (
    <g>
      <rect x="6.5" y="9" width="15" height="10.4" rx="3" fill="none" stroke="#fff" strokeWidth="1.5" />
      <path d="m12.5 11.6 4 2.6-4 2.6Z" fill="#fff" />
    </g>
  ),
}

function SnsIcon({ id, size = 28, color = 'var(--brown-800)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true">
      <circle cx="14" cy="14" r="14" fill={color} />
      {GLYPHS[id]}
    </svg>
  )
}

export default SnsIcon
