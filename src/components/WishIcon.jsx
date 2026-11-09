// 찜 하트 선 아이콘 (헤더·탭바): 20px. 선 굵기는 헤더 1.5(기본), 탭바는 다른 탭 아이콘에 맞춰 1.2
function WishIcon({ color = '#202020', strokeWidth = 1.5 }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M10 17.2 3.1 10.4a4.1 4.1 0 0 1 0-5.9 4.2 4.2 0 0 1 5.9 0l1 1 1-1a4.2 4.2 0 0 1 5.9 0 4.1 4.1 0 0 1 0 5.9Z"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default WishIcon
