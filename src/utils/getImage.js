// src/products 폴더의 이미지를 한 번에 불러와 { '../products/cup/cup-01.jpg': '실제주소' } 형태로 저장
const images = import.meta.glob('../products/**/*.jpg', { eager: true, import: 'default' })

// JSON의 문자열 경로(products/cup/cup-01.jpg)를 실제 이미지 주소로 변환
export const getImage = (path) => images[`../${path}`]
