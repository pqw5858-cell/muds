// 찜 하트 아이콘 (상품 카드, 상세페이지 구매 바에서 공용)
function HeartIcon({ filled, size = 16 }) {
  return (
    <svg width={size} height={(size * 15) / 16} viewBox="0 0 16 15" aria-hidden="true">
      <path
        d="M8 14.2 1.9 8.1A3.9 3.9 0 0 1 8 3.1a3.9 3.9 0 0 1 6.1 5L8 14.2Z"
        fill={filled ? '#F07263' : 'none'}
        stroke={filled ? '#F07263' : '#555'}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default HeartIcon
