import { Link } from 'react-router-dom'
import logo from '../images/logo.png'
import iconCall from '../images/icon-call.png'
import { EMAIL_REFUSAL_URL, OFFLINE_STORE_URL, SNS_LINKS, TERMS_URL } from '../utils/sns.js'
import './Footer.css'
import { t } from '../utils/i18n.js'

const POLICY_LINKS = [
  { label: { ko: '이용약관', en: 'Terms of Use' }, href: TERMS_URL, external: true }, // 뮷즈 공식 이용약관
  { label: { ko: '개인정보처리방침', en: 'Privacy Policy' }, strong: true, to: '/privacy' }, // 사이트 안 페이지
  { label: { ko: '이메일 수집거부', en: 'No Email Harvesting' }, href: EMAIL_REFUSAL_URL, external: true },
  { label: { ko: '오프라인 매장', en: 'Store Locations' }, href: OFFLINE_STORE_URL, external: true },
]

function Footer() {
  return (
    <footer className="footer">
      <ul className="footer__links">
        {POLICY_LINKS.map(({ label, strong, to, href, external }) => (
          <li key={to ?? href}>
            {to ? (
              <Link to={to} className={strong ? 'is-strong' : ''}>
                {t(label)}
              </Link>
            ) : (
              <a
                href={href}
                className={strong ? 'is-strong' : ''}
                {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {t(label)}
              </a>
            )}
          </li>
        ))}
      </ul>

      <a href="tel:0000-0000" className="footer__call">
        <img src={iconCall} alt="" width="15" height="15" />
        {t('고객센터', 'Customer Center')} 0000-0000
      </a>

      <p className="footer__hours">
        <span>{t('월~금, 주말 및 공휴일 휴무', 'Mon–Fri, closed weekends & holidays')}</span>
        <span>{t('상담시간', 'Hours')}&nbsp;&nbsp;{t('10시~12시', '10:00–12:00')}</span>
      </p>

      <ul className="footer__sns">
        {SNS_LINKS.map(({ id, icon, label, href }) => (
          <li key={id}>
            <a href={href} aria-label={`${t(label)} ${t('(새 창)', '(opens in a new tab)')}`} target="_blank" rel="noopener noreferrer">
              <img src={icon} alt="" />
            </a>
          </li>
        ))}
      </ul>

      <img className="footer__logo" src={logo} alt={t('MU:DS 국립박물관 굿즈', 'MU:DS National Museum Goods')} width="61" height="20" />

      <address className="footer__info">
        <p>
          <span>{t('온라인숍 문의', 'Online Shop')}</span> 02-OOO-OOOO | ooo@ooo.or.kr
          <span>{t('기업특판 주문상담', 'Corporate Orders')}</span> ooo@ooo.or.kr
        </p>
        <p>
          <span>{t('국립박물관문화재단 대표자', 'National Museum Foundation of Korea, CEO')}</span> OOO
          <span>{t('주소', 'Address')}</span> {t('서울특별시 용산구 OOO로 OOO', 'OOO, OOO-ro, Yongsan-gu, Seoul')}
        </p>
        <p>
          <span>{t('사업자 등록번호', 'Business Reg. No.')}</span> OOO-OO-OOOOO
        </p>
        <p>
          <span>{t('통신판매업 신고번호', 'Mail-Order Sales Reg. No.')}</span> {t('OOOO-서울용산-OOOOO', 'OOOO-Seoul Yongsan-OOOOO')}
        </p>
      </address>

      <div className="footer__copyright">
        <p>© 2026 MU:DS Kitchen Portfolio. All rights reserved.</p>
        <p>{t('본 페이지는 개인 포트폴리오 목적으로 제작된 비상업적 작업물입니다.', 'This site is a non-commercial personal portfolio project.')}</p>
        <p>
          {t(
            '실제 판매 및 결제가 이루어지지 않으며, 상품 이미지와 브랜드의 권리는 국립박물관문화재단에 있습니다.',
            'No actual sales or payments take place. All rights to the product images and brand belong to the National Museum Foundation of Korea.',
          )}
        </p>
      </div>
    </footer>
  )
}

export default Footer
