import {
  BADGE_TEXT,
  CATEGORY_TEXT,
  HASHTAG_TEXT,
  MATERIAL_TEXT,
  NOTE_TEXT,
  PRODUCT_TEXT,
  SHIPPING_NOTE_TEXT,
  translateSize,
} from '../i18n/products.en.js'
import { REVIEW_SENTENCE_TEXT, REVIEW_TITLE_TEXT, SURNAME_TEXT } from '../i18n/reviews.en.js'
import { isEn } from './i18n.js'

// 영어 모드면 상품의 글자 항목(이름·소개·비고·해시태그·재질·크기·분류·배송 안내)을 영어로 바꾼 복사본, 한국어면 그대로
// 화면에 상품 글자를 그리는 곳에서 lp(product)로 감싸서 사용 (ID·가격 등 나머지는 그대로)
export function lp(product) {
  if (!product || !isEn()) return product
  const [name, summary] = PRODUCT_TEXT[product.id] ?? [product.name, product.summary]
  return {
    ...product,
    name,
    summary,
    categoryName: CATEGORY_TEXT[product.categoryName] ?? product.categoryName,
    notes: product.notes.map((note) => NOTE_TEXT[note] ?? note),
    hashtags: product.hashtags.map((tag) => `#${HASHTAG_TEXT[tag.slice(1)] ?? tag.slice(1)}`),
    material: MATERIAL_TEXT[product.material] ?? product.material,
    size: translateSize(product.size),
    badges: product.badges.map((badge) => BADGE_TEXT[badge] ?? badge),
    shipping: {
      ...product.shipping,
      method: product.shipping.method === '택배' ? 'Courier' : product.shipping.method,
      note: SHIPPING_NOTE_TEXT[product.shipping.note] ?? product.shipping.note,
    },
  }
}

// 상품 영어 이름 (검색·주문명 등 화면 밖에서도 필요할 때)
export const englishName = (product) => PRODUCT_TEXT[product.id]?.[0] ?? product.name
export const englishSearchText = (product) => {
  const [name, summary] = PRODUCT_TEXT[product.id] ?? ['', '']
  const tags = product.hashtags.map((tag) => HASHTAG_TEXT[tag.slice(1)] ?? '')
  return [name, summary, CATEGORY_TEXT[product.categoryName], ...tags].join(' ')
}

// 영어 모드면 리뷰의 제목·본문·작성자를 영어로 바꾼 복사본, 한국어면 그대로
// 본문은 문장마다 번역해서 이어 붙임 (사전에 없는 문장은 원문 유지)
export function lr(review) {
  if (!review || !isEn()) return review
  const content = (review.content ?? '')
    .split(/(?<=[.!?~])\s+/)
    .map((sentence) => REVIEW_SENTENCE_TEXT[sentence] ?? sentence)
    .join(' ')
  const [surname, ...rest] = review.author ?? ''
  return {
    ...review,
    title: REVIEW_TITLE_TEXT[review.title] ?? review.title,
    content,
    author: SURNAME_TEXT[surname] ? SURNAME_TEXT[surname] + rest.join('') : review.author,
  }
}
