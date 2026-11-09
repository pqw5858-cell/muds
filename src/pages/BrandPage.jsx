import { Link } from 'react-router-dom'
import ProductStrip from '../components/ProductStrip.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import heroImage from '../images/background-poster.jpg'
import cardSmile from '../images/brand-card-01.png'
import cardGat from '../images/brand-card-02.png'
import cardIrworobongdo from '../images/brand-card-03.png'
import cardUigwe from '../images/brand-card-04.png'
import { getImage } from '../utils/getImage.js'
import { COLLECTIONS, findProduct, getCollectionProducts } from '../utils/productLists.js'
import { OFFLINE_STORE_URL } from '../utils/sns.js'
import './BrandPage.css'
import { t } from '../utils/i18n.js'
import { lp } from '../utils/localize.js'

// FROM MUSEUM TO TABLE: 유물 → 상품 이야기 (이미지 출처: 국립중앙박물관, 공공누리)
const STORIES = [
  {
    id: 'smile',
    image: cardSmile,
    imagePosition: 'center 42%', // 정사각형 사진이라 얼굴이 잘리지 않게
    meta: { ko: '신라 · 보물 · 국립경주박물관', en: 'Silla · Treasure · Gyeongju National Museum' },
    title: { ko: '얼굴무늬 수막새', en: 'Roof-End Tile with a Human Face' },
    text: {
      ko: "기와 끝을 막는 수막새에 사람 얼굴을 새겼습니다. 한쪽이 깨져 나갔지만 은은한 미소가 그대로 남아 '신라의 미소'로 불립니다.",
      en: 'A human face carved into a roof-end tile, the piece that once capped the end of a tiled roof. Though one side has broken away, its gentle smile survives—earning it the name "the Smile of Silla."',
    },
    copy: { ko: '그 미소가 작은 소스볼에 담겼습니다', en: 'That smile now rests in a little sauce bowl' },
    productId: 'plate-08',
  },
  {
    id: 'gat',
    image: cardGat,
    meta: { ko: '조선 · 소수박물관', en: 'Joseon · Sosu Museum' },
    title: { ko: '갓(흑립)', en: 'Gat, the Black Horsehair Hat' },
    text: {
      ko: '조선의 선비가 의관을 갖출 때 쓰던 모자입니다. 가늘게 엮어 은은하게 비치는 챙과 높이 솟은 모자 부분이 단정한 멋을 보여줍니다.',
      en: 'The hat a Joseon scholar wore to complete his formal dress. Its finely woven, softly see-through brim and tall crown show an elegance that is quiet and composed.',
    },
    copy: { ko: '뒤집으면 갓, 바로 놓으면 잔이 됩니다', en: "Flip it over, it's a gat; set it upright, it's a cup" },
    productId: 'cup-17',
  },
  {
    id: 'irworobongdo',
    image: cardIrworobongdo,
    meta: { ko: '조선 · 국립고궁박물관', en: 'Joseon · National Palace Museum of Korea' },
    title: { ko: '일월오봉도', en: 'Sun, Moon and Five Peaks' },
    text: {
      ko: '궁궐에서 왕의 자리 뒤에 놓인 병풍입니다. 해와 달, 다섯 봉우리, 소나무와 물결이 어우러져 왕이 다스리는 세상을 그렸습니다.',
      en: "The folding screen that stood behind the king's throne. The sun and moon, five peaks, pine trees and rolling waves come together to portray the world under the king's rule.",
    },
    copy: { ko: '왕의 병풍 속 해와 달이 아침의 잔에 뜹니다', en: "The sun and moon of the king's screen rise in your morning cup" },
    productId: 'cup-20',
  },
  {
    id: 'uigwe',
    image: cardUigwe,
    meta: { ko: '조선 1638년 · 국립중앙박물관', en: 'Joseon, 1638 · National Museum of Korea' },
    title: { ko: ['인조장렬왕후', '가례도감의궤'], en: ['Royal Wedding Uigwe of', 'King Injo and Queen Jangnyeol'] },
    text: {
      ko: '인조와 장렬왕후의 혼례를 기록한 왕실 의궤입니다. 프랑스로 건너갔다가 2011년에 돌아온 외규장각 의궤 가운데 한 권입니다.',
      en: 'A uigwe, or royal protocol record, documenting the wedding of King Injo and Queen Jangnyeol. It is one of the Oegyujanggak uigwe that were taken to France and returned to Korea in 2011.',
    },
    copy: { ko: '왕비의 혼례 행렬이 머그 둘레를 걷습니다', en: "The queen's wedding procession winds around your mug" },
    productId: 'cup-23',
  },
].map((story) => ({ ...story, product: findProduct(story.productId) }))


// 히어로 썸네일 → 해당 이야기로 부드럽게 스크롤 (고정 헤더 높이는 CSS scroll-margin-top으로 비킴)
const scrollToStory = (id) => document.getElementById(`story-${id}`)?.scrollIntoView({ behavior: 'smooth' })

// 유물 이야기 한 장: 유물 사진 + 겹친 상품 사진 + 시대·소장처 + 이름 + 설명 + 상품 연결
function StoryCard({ story }) {
  const { id, image, imagePosition, meta, title, text, copy } = story
  const product = lp(story.product) // 현재 언어의 상품 이름
  const titleLines = [t(title)].flat()

  return (
    <section className="brand-story" id={`story-${id}`}>
      <div className="brand-story__visual">
        <img
          className="brand-story__artifact"
          src={image}
          alt={titleLines.join(' ')}
          loading="lazy"
          style={imagePosition && { objectPosition: imagePosition }}
        />
        <Link to={`/product/${product.id}`} className="brand-story__product-photo" tabIndex={-1} aria-hidden="true">
          <img src={getImage(product.thumbnail)} alt="" loading="lazy" />
        </Link>
      </div>
      <div className="brand-story__body">
        <p className="brand-story__meta">{t(meta)}</p>
        <h3 className="brand-story__title">
          {titleLines.map((line, n) => (
            <span key={line}>
              {n > 0 && <br />}
              {line}
            </span>
          ))}
        </h3>
        <p className="brand-story__text">{t(text)}</p>
        <Link to={`/product/${product.id}`} className="brand-story__link">
          <span className="brand-story__copy">{t(copy)}</span>
          <span className="brand-story__product-name">{product.name}</span>
        </Link>
        <p className="brand-story__credit">{t('이미지 출처: 국립중앙박물관', 'Image: National Museum of Korea')}</p>
      </div>
    </section>
  )
}

// 브랜드 소개 (/brand): 히어로 + 유물 이야기 4개 + 컬렉션 + 매장 안내 + 전체 상품
function BrandPage() {
  return (
    <main className="brand-page">
      {/* 히어로: 하늘·처마 배경 + 브랜드 소개 + 이야기 속 상품 4개(누르면 아래 이야기로) */}
      <section className="brand-hero">
        <img className="brand-hero__bg" src={heroImage} alt="" />
        <div className="brand-hero__content">
          <p className="brand-eyebrow">BRAND STORY</p>
          <h2 className="brand-hero__title">
            {t('보는 유물에서,', 'From artifacts you admire')}
            <br />
            {t('쓰는 유물로', 'to artifacts you use')}
          </h2>
          <p className="brand-hero__text">
            {t(
              '국립박물관 문화상품 뮷즈(MU:DS) 가운데 매일 손에 닿는 주방 식기만 모았습니다. 천 년 전 기와의 미소부터 왕실 혼례의 행렬까지, 유물에 담긴 이야기를 식탁 위에서 만나보세요.',
              "From MU:DS, the cultural goods of Korea's national museums, we've gathered only the tableware you'll reach for every day. From a thousand-year-old smile on a roof tile to a royal wedding procession, discover the stories within Korea's artifacts—right at your table.",
            )}
          </p>
          <ul className="brand-hero__thumbs">
            {STORIES.map(({ id, title, product }) => (
              <li key={id}>
                <button type="button" onClick={() => scrollToStory(id)}>
                  <img src={getImage(product.thumbnail)} alt={t(`${[t(title)].flat().join(' ')} 이야기 보기`, `Read the story of ${[t(title)].flat().join(' ')}`)} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {STORIES.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}

      <section className="brand-section">
        <SectionTitle>COLLECTION</SectionTitle>
        <div className="brand-collections">
          {COLLECTIONS.map((collection) => (
            <ProductStrip
              key={collection.id}
              title={t(collection.label)}
              description={t(collection.description)}
              to={`/collection/${collection.id}`}
              products={getCollectionProducts(collection)}
            />
          ))}
        </div>
      </section>

      <section className="brand-section brand-visit">
        <SectionTitle>VISIT</SectionTitle>
        <p>{t('전국 국립박물관 뮷즈 매장에서 직접 만나보세요.', 'Visit MU:DS shops at national museums across Korea.')}</p>
        <a href={OFFLINE_STORE_URL} target="_blank" rel="noopener noreferrer" className="brand-visit__store">
          {t('오프라인 매장 안내 (새 창)', 'Find a Store (opens in a new tab)')}
        </a>
      </section>

      <Link to="/shop/all" className="brand-page__cta">
        {t('전체 상품 보기', 'Shop All Items')}
      </Link>
    </main>
  )
}

export default BrandPage
