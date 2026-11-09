# MU:DS 뮷즈 — 국립박물관 굿즈 쇼핑몰

국립박물관 문화상품 브랜드 **뮷즈(MU:DS)**를 모티브로 만든 모바일 중심 쇼핑몰 포트폴리오입니다.
화면은 가운데 500px 프레임으로 구성하고, PC에서는 배경 영상과 오른쪽 검색 카드가 함께 보입니다.

- 배포 주소: DEPLOY_URL
- 비상업 포트폴리오 프로젝트이며, 실제 결제는 이루어지지 않습니다(토스페이먼츠 테스트 모드).

## 사용 기술

- React 19, Vite, React Router 7
- Firebase Authentication (이메일·구글 로그인)
- 토스페이먼츠 결제위젯 v2 (테스트 키)
- 다음(카카오) 우편번호 서비스
- 배포: Vercel

## 주요 기능

- **메인**: 메인 비주얼 슬라이드, 타임딜, WEEKLY BEST, 이벤트 슬라이더, 포토 리뷰, 이벤트 팝업(오늘 하루 보지 않기), 띠배너 닫기
- **상품**: 카테고리·컬렉션 목록, 정렬, 더보기, 검색(한국어·영어), 상품 상세(옵션, 수량, 구매 안내, 리뷰)
- **쇼핑**: 장바구니, 찜, 최근 본 상품, 주문서(우편번호 검색), 토스 결제와 결과 페이지
- **회원**: 회원가입, 로그인(이메일·구글), 마이페이지
- **콘텐츠**: 브랜드 이야기, 이벤트 목록·상세, 리뷰 목록·상세
- **다국어**: 한국어 / 영어 전환 (화면 문구, 상품·리뷰·이벤트 데이터, 배너 이미지)
- **반응형**: PC · 태블릿 · 휴대폰, 마우스 끌기 슬라이드, 단청 꽃 마우스 커서

## 페이지 구성

| 주소 | 페이지 |
| --- | --- |
| `/` | 메인 |
| `/shop/:category`, `/collection/:id` | 상품 목록 · 컬렉션 |
| `/product/:id` | 상품 상세 |
| `/search?q=` | 검색 결과 |
| `/cart`, `/wishlist`, `/recent` | 장바구니 · 찜 · 최근 본 상품 |
| `/checkout`, `/checkout/success`, `/checkout/fail` | 주문서 · 결제 결과 (로그인 필요) |
| `/login`, `/signup`, `/mypage` | 로그인 · 회원가입 · 마이페이지 |
| `/brand`, `/events`, `/reviews` | 브랜드 · 이벤트 · 리뷰 |

## 실행 방법

```bash
npm install
npm run dev
```

프로젝트 루트에 `.env.local`을 만들고 아래 값을 넣어야 로그인과 결제가 동작합니다.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_TOSS_CLIENT_KEY=
```

## 폴더 구조

```
src/
├─ pages/        페이지
├─ components/   공용 컴포넌트 (헤더, 내비, 슬라이더, 상품 카드 등)
├─ utils/        인증·장바구니·찜·다국어·정렬 등 로직
├─ i18n/         영어 데이터 (상품, 리뷰, 구매 안내)
├─ products/     상품 이미지
├─ images/       배너·아이콘·커서 이미지
└─ fonts/        부산단디명조
```

## 출처

- 상품 정보와 이미지: 국립박물관문화재단 뮷즈 (학습용으로만 사용)
- 글꼴: Pretendard, Roboto, 부산단디명조
