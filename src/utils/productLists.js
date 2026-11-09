import products from '../products.json'
import { englishSearchText } from './localize.js'

// 상품 ID로 찾기 (없으면 undefined)
export const findProduct = (id) => products.find((p) => p.id === id)

// 리뷰 많은 순 → 같으면 평점 높은 순
export const byPopularity = (a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating

// NEW ARRIVALS: NEW 뱃지 상품을 최신 등록일 순으로
export const newArrivals = products
  .filter((p) => p.badges.includes('NEW'))
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

// BEST ITEM: BEST 뱃지 상품을 리뷰 많은 순으로
export const bestItems = products.filter((p) => p.badges.includes('BEST')).sort(byPopularity)

// 상품 목록 페이지(/shop/:category) 카테고리. 주소에 쓰는 id와 화면 제목
export const SHOP_CATEGORIES = [
  { id: 'all', title: 'ALL' },
  { id: 'new', title: 'NEW ARRIVALS' },
  { id: 'best', title: 'BEST' },
  { id: 'cup', title: 'CUP' },
  { id: 'tumbler', title: 'TUMBLER' },
  { id: 'plate', title: 'PLATE' },
  { id: 'tray', title: 'TRAY' },
  { id: 'coaster', title: 'COASTER' },
]

export const findShopCategory = (id) => SHOP_CATEGORIES.find((c) => c.id === id)

// 카테고리에 속한 상품 (NEW·BEST는 뱃지 기준)
export const getCategoryProducts = (id) => {
  if (id === 'all') return products
  if (id === 'new') return products.filter((p) => p.badges.includes('NEW'))
  if (id === 'best') return products.filter((p) => p.badges.includes('BEST'))
  return products.filter((p) => p.category === id)
}

// 정렬 방식 (label은 { ko, en } → 화면에서 t(label)). 품절 상품은 어떤 정렬이든 맨 뒤로
export const SORT_OPTIONS = [
  { id: 'new', label: { ko: '신상품순', en: 'Newest' }, compare: (a, b) => b.createdAt.localeCompare(a.createdAt) },
  { id: 'popular', label: { ko: '인기순', en: 'Most Popular' }, compare: byPopularity },
  { id: 'low', label: { ko: '낮은 가격순', en: 'Price: Low to High' }, compare: (a, b) => a.salePrice - b.salePrice },
  { id: 'high', label: { ko: '높은 가격순', en: 'Price: High to Low' }, compare: (a, b) => b.salePrice - a.salePrice },
]

export const sortProducts = (list, sortId) => {
  const { compare } = SORT_OPTIONS.find((o) => o.id === sortId) ?? SORT_OPTIONS[0]
  return [...list].sort((a, b) => Number(a.soldOut) - Number(b.soldOut) || compare(a, b))
}

// 검색: 한국어·영어 모두, 띄어쓰기·#·대소문자 무시. 검색어를 띄어 쓰면 모든 단어가 들어간 상품만 (상품명, 한 줄 소개, 카테고리, 해시태그)
const normalize = (text) => text.toLowerCase().replace(/[\s#]/g, '')
const searchText = products.map((p) =>
  normalize([p.name, p.summary, p.categoryName, p.category, ...p.hashtags, englishSearchText(p)].join(' ')),
)

export const searchProducts = (query) => {
  const terms = query.split(/\s+/).map(normalize).filter(Boolean)
  if (terms.length === 0) return []
  return products.filter((_, i) => terms.every((term) => searchText[i].includes(term)))
}

// 컬렉션 (브랜드 페이지, /collection/:id): 상품 비고(notes)로 묶음, 기본 인기순. label·description은 { ko, en }
export const COLLECTIONS = [
  {
    id: 'museum',
    title: 'MUSEUM EXCLUSIVE',
    label: { ko: '박물관 특화상품', en: 'Museum Exclusives' },
    description: {
      ko: '전국 국립박물관이 각자의 소장품에서 영감을 받아 만든 상품',
      en: "Goods inspired by each national museum's own collection",
    },
    test: (note) => note.includes('특화상품'),
  },
  {
    id: 'contest',
    title: 'MU:DS CONTEST',
    label: { ko: '뮷즈 공모 선정작', en: 'MU:DS Contest Winners' },
    description: { ko: '해마다 열리는 뮷즈 공모전에서 선정된 디자인', en: 'Designs chosen in the annual MU:DS design contest' },
    test: (note) => note.includes('공모 선정작'),
  },
  {
    id: 'exhibition',
    title: 'EXHIBITION',
    label: { ko: '전시 연계 상품', en: 'Exhibition Goods' },
    description: { ko: '박물관 특별전의 감동을 집으로 가져가는 상품', en: 'Take the wonder of special exhibitions home with you' },
    test: (note) => note.startsWith('[') && note.includes('전시'),
  },
  {
    id: 'collab',
    title: 'COLLABORATION',
    label: { ko: '협업 상품', en: 'Collaborations' },
    description: { ko: '공예·한식 전문 기관과 함께 만든 상품', en: 'Made together with craft and Korean food institutions' },
    test: (note) => note.includes('협업'),
  },
]

export const findCollection = (id) => COLLECTIONS.find((c) => c.id === id)

export const getCollectionProducts = ({ test }) =>
  products.filter((p) => p.notes.some(test)).sort(byPopularity)
