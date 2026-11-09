import event01 from '../images/event-01.png'
import event02 from '../images/event-02.png'
import event01En from '../images/event-01-en.png'
import event02En from '../images/event-02-en.png'
import { t } from './i18n.js'

// 이벤트 목록 (최신순). end가 null이면 상시 진행
// 글자 항목과 image는 { ko, en } → 화면에서 t()로 현재 언어 것을 꺼냄
export const EVENTS = [
  {
    id: 'blush-review',
    image: { ko: event02, en: event02En },
    alt: {
      ko: '붉어진 선비를 보여주세요 - 변색 인증 포토 리뷰 작성 시 적립금 2,000원, 12.31 까지',
      en: 'Show us your blushing scholar - Post a photo review of the color change and get ₩2,000 in points, until Dec 31',
    },
    title: { ko: '붉어진 선비를 보여주세요', en: 'Show Us Your Blushing Scholar' },
    summary: {
      ko: '변색 인증 포토 리뷰 작성 시 적립금 2,000원',
      en: 'Post a photo review showing the color change and get ₩2,000 in points',
    },
    start: '2026-11-01',
    end: '2026-12-31',
    sections: [
      {
        title: { ko: '참여 방법', en: 'How to Join' },
        items: [
          { ko: '취객선비 변색 잔을 구매해요.', en: 'Buy a Tipsy Seonbi color-changing glass.' },
          { ko: '차가운 음료를 따라 얼굴이 붉어진 선비를 사진으로 남겨요.', en: 'Pour in a cold drink and take a photo of the seonbi blushing.' },
          { ko: '구매한 상품의 리뷰에 사진과 함께 후기를 작성해요.', en: 'Write a review of the item with your photo.' },
        ],
      },
      {
        title: { ko: '혜택', en: 'Reward' },
        items: [
          {
            ko: '포토 리뷰 1건당 적립금 2,000원 (리뷰 작성 후 7일 이내 지급)',
            en: '2,000 points per photo review (credited within 7 days of posting)',
          },
        ],
      },
      {
        title: { ko: '유의 사항', en: 'Please Note' },
        items: [
          { ko: '변색이 확인되지 않는 사진은 지급 대상에서 제외돼요.', en: "Photos that don't show the color change are not eligible." },
          { ko: '이벤트 기간 동안 1인 1회 지급돼요.', en: 'One reward per person during the event.' },
          { ko: '적립금은 지급일로부터 30일 동안 사용할 수 있어요.', en: 'Points can be used for 30 days from the date they are credited.' },
        ],
      },
    ],
    productIds: ['cup-01', 'cup-04'],
    link: { label: { ko: '포토 리뷰 보러가기', en: 'See Photo Reviews' }, to: '/reviews?products=cup-01,cup-04&photo=1' }, // 이벤트 상품 포토 리뷰만
  },
  {
    id: 'gat-cup',
    image: { ko: event01, en: event01En },
    alt: {
      ko: 'NEW 갓 나온 갓잔 - 뒤집으면 갓, 바로 놓으면 잔',
      en: "NEW Gat Cup - Flip it over, it's a gat; set it upright, it's a cup",
    },
    title: { ko: 'NEW 갓 나온 갓잔', en: 'NEW: The Gat Cup' },
    summary: { ko: '뒤집으면 갓, 바로 놓으면 잔', en: "Flip it over, it's a gat; set it upright, it's a cup" },
    start: '2026-10-20',
    end: null,
    sections: [
      {
        title: { ko: '상품 소개', en: 'About the Item' },
        items: [
          {
            ko: '조선 선비의 갓을 닮은 잔이에요. 뒤집어 두면 갓, 바로 놓으면 잔이 돼요.',
            en: "A cup shaped like the gat, the hat of Joseon scholars. Upside down it's a hat; right side up it's a cup.",
          },
          { ko: '한 손에 쏙 들어오는 미니 사이즈가 새로 나왔어요.', en: 'Now also in a mini size that fits right in your hand.' },
        ],
      },
    ],
    productIds: ['cup-14', 'cup-17'],
    link: { label: { ko: '컵 전체 보기', en: 'Shop All Cups' }, to: '/shop/cup' },
  },
]

export const findEvent = (id) => EVENTS.find((e) => e.id === id)

// 2026-11-01 → 2026.11.01
const dot = (date) => date.replaceAll('-', '.')
export const formatPeriod = ({ start, end }) => (end ? `${dot(start)} ~ ${dot(end)}` : `${dot(start)} ~ ${t('상시', 'Ongoing')}`)

// 오늘 기준 진행 여부 (날짜 문자열 비교)
export const isEventOpen = ({ start, end }) => {
  const today = new Date().toLocaleDateString('sv-SE') // YYYY-MM-DD (로컬 날짜)
  return start <= today && (!end || today <= end)
}
