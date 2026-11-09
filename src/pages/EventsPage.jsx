import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import { EVENTS, findEvent, formatPeriod, isEventOpen } from '../utils/events.js'
import { findProduct } from '../utils/productLists.js'
import NotFoundPage from './NotFoundPage.jsx'
import '../components/ProductGridSection.css'
import './EventsPage.css'
import { t } from '../utils/i18n.js'

function EventStatus({ event }) {
  const open = isEventOpen(event)
  return <span className={`event-status${open ? '' : ' is-ended'}`}>{open ? t('진행중', 'Ongoing') : t('종료', 'Ended')}</span>
}

// 이벤트 목록 (/events): 배너 + 제목 + 기간, 누르면 상세
export function EventsPage() {
  return (
    <main className="events-page">
      <SectionTitle>EVENT</SectionTitle>
      <ul className="events-page__list">
        {EVENTS.map((event) => (
          <li key={event.id}>
            <Link to={`/events/${event.id}`} className="event-item">
              <img src={t(event.image)} alt={t(event.alt)} width="500" height="590" loading="lazy" />
              <div className="event-item__info">
                <EventStatus event={event} />
                <h3>{t(event.title)}</h3>
                <p>{t(event.summary)}</p>
                <time>{formatPeriod(event)}</time>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

// 이벤트 상세 (/events/:id): 배너 + 기간 + 안내 + 관련 상품 + 바로가기
export function EventDetailPage() {
  const { id } = useParams()
  const event = findEvent(id)
  if (!event) return <NotFoundPage />

  const products = event.productIds.map(findProduct).filter(Boolean)

  return (
    <main className="event-detail">
      <img src={t(event.image)} alt={t(event.alt)} width="500" height="590" />

      <div className="event-detail__head">
        <EventStatus event={event} />
        <h2>{t(event.title)}</h2>
        <p>{t(event.summary)}</p>
        <time>{formatPeriod(event)}</time>
      </div>

      {event.sections.map(({ title, items }) => (
        <section key={title.ko} className="event-detail__section">
          <h3>{t(title)}</h3>
          <ul>
            {items.map((item) => (
              <li key={item.ko}>{t(item)}</li>
            ))}
          </ul>
        </section>
      ))}

      {products.length > 0 && (
        <section className="event-detail__products">
          <SectionTitle>EVENT ITEM</SectionTitle>
          <ul className="product-grid__list">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="event-detail__actions">
        <Link to={event.link.to} className="event-detail__primary">
          {t(event.link.label)}
        </Link>
        <Link to="/events" className="event-detail__secondary">
          {t('이벤트 목록', 'All Events')}
        </Link>
      </div>
    </main>
  )
}
