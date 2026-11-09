import SectionTitle from '../components/SectionTitle.jsx'
import { isEn, t } from '../utils/i18n.js'
import './PrivacyPage.css'

// 개인정보처리방침 (/privacy): 이 포트폴리오 사이트가 실제로 저장·전달하는 정보를 코드 기준으로 안내
const SECTIONS = [
  {
    title: '1. 안내',
    body: [
      '본 사이트는 개인 포트폴리오 목적으로 제작된 비상업적 작업물입니다. 실제 판매·결제·배송은 이루어지지 않습니다.',
      '로그인과 주문 과정을 시연하기 위해 아래의 정보만 처리합니다.',
    ],
  },
  {
    title: '2. 처리하는 정보와 보관 위치',
    table: [
      ['회원가입·로그인', '이름, 이메일, 비밀번호(암호화) / 구글 로그인 시 구글 계정의 이름·이메일', 'Google Firebase Authentication'],
      ['주문서 입력', '주문자 이름·휴대폰 번호, 받는 분 이름·휴대폰 번호, 배송지 주소', '이용자 브라우저(결제 진행 중 임시 보관)'],
      ['주문 내역', '주문번호, 주문 상품, 결제 금액, 배송지', '이용자 브라우저'],
      ['장바구니·찜·최근 본 상품', '상품 번호, 수량', '이용자 브라우저'],
    ],
  },
  {
    title: '3. 이용 목적',
    body: ['회원 식별과 로그인 유지, 주문서 작성·주문 내역 표시 등 사이트 기능 시연에만 사용하며 그 밖의 목적으로 사용하지 않습니다.'],
  },
  {
    title: '4. 외부 서비스 이용',
    body: [
      'Google Firebase: 회원가입·로그인 처리',
      '토스페이먼츠(테스트 환경): 결제창 표시. 결제 시 주문자 이름·이메일·휴대폰 번호와 결제 금액이 전달되며, 테스트 환경이므로 실제로 결제되지 않습니다.',
      '카카오 우편번호 서비스: 주소 검색 시 입력한 검색어가 전달됩니다.',
    ],
  },
  {
    title: '5. 보관 기간과 삭제',
    body: [
      '브라우저에 저장된 정보(장바구니, 찜, 최근 본 상품, 주문 내역)는 브라우저의 사이트 데이터를 삭제하면 즉시 지워집니다.',
      'Firebase에 저장된 회원 정보는 포트폴리오 공개 기간 동안 보관하며, 삭제를 원하면 제작자에게 요청할 수 있습니다.',
    ],
  },
]

// 영문판 (같은 구성)
const SECTIONS_EN = [
  {
    title: '1. About This Site',
    body: [
      'This site is a non-commercial project created for a personal portfolio. No actual sales, payments or deliveries take place.',
      'To demonstrate the login and ordering process, we handle only the information listed below.',
    ],
  },
  {
    title: '2. Information We Handle and Where It Is Stored',
    table: [
      ['Sign-up / Login', 'Name, email, password (encrypted) / For Google login: the name and email of your Google account', 'Google Firebase Authentication'],
      ['Order form', "Orderer's name and phone number, recipient's name and phone number, shipping address", 'Your browser (kept temporarily during payment)'],
      ['Order history', 'Order number, items ordered, amount paid, shipping address', 'Your browser'],
      ['Cart, wishlist and recently viewed', 'Product numbers and quantities', 'Your browser'],
    ],
  },
  {
    title: '3. How We Use It',
    body: [
      'This information is used only to demonstrate site features, such as identifying members, keeping you logged in, filling in order forms and showing order history. It is never used for any other purpose.',
    ],
  },
  {
    title: '4. Third-Party Services',
    body: [
      'Google Firebase: handles sign-up and login.',
      "Toss Payments (test environment): displays the payment window. The orderer's name, email, phone number and payment amount are sent when you pay. Because this is a test environment, no actual charge is made.",
      'Kakao Postcode Service: the search terms you enter when looking up an address are sent to the service.',
    ],
  },
  {
    title: '5. Retention and Deletion',
    body: [
      "Information stored in your browser (cart, wishlist, recently viewed and order history) is deleted immediately when you clear your browser's site data.",
      'Member information stored in Firebase is kept while this portfolio is public. You may ask the creator to delete it at any time.',
    ],
  },
]

function PrivacyPage() {
  const sections = isEn() ? SECTIONS_EN : SECTIONS
  return (
    <main className="privacy-page">
      <SectionTitle>PRIVACY POLICY</SectionTitle>
      <p className="privacy-page__lead">{t('개인정보처리방침', 'How we handle your information')}</p>

      {sections.map(({ title, body, table }) => (
        <section key={title} className="privacy-page__section">
          <h3>{title}</h3>
          {body?.map((text) => (
            <p key={text}>{text}</p>
          ))}
          {table && (
            <table>
              <thead>
                <tr>
                  <th scope="col">{t('구분', 'Purpose')}</th>
                  <th scope="col">{t('항목', 'Information')}</th>
                  <th scope="col">{t('보관 위치', 'Stored in')}</th>
                </tr>
              </thead>
              <tbody>
                {table.map(([type, items, place]) => (
                  <tr key={type}>
                    <th scope="row">{type}</th>
                    <td>{items}</td>
                    <td>{place}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ))}

      <p className="privacy-page__date">{t('시행일: 2026년 11월 6일', 'Effective date: November 6, 2026')}</p>
    </main>
  )
}

export default PrivacyPage
