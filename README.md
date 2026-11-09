# MU:DS Kitchen — 국립박물관 굿즈 쇼핑몰

국립박물관 문화상품 브랜드 **뮷즈(MU:DS)**의 주방·식기 굿즈를 모티브로 만든 모바일 중심 쇼핑몰 포트폴리오입니다.
화면은 가운데 500px 프레임으로 구성했습니다. 화면이 넓으면 프레임 뒤로 배경 영상이 보이고(폭 501px 이상), 더 넓은 화면에서는 오른쪽에 검색 카드가 함께 보입니다(폭 1530px 이상).

- 배포 주소: https://muds.vercel.app
- 비상업 포트폴리오 프로젝트이며, 실제 결제는 이루어지지 않습니다(토스페이먼츠 테스트 모드).

## 사용 기술

- React 19, Vite, React Router 7
- Firebase Authentication (이메일·구글 로그인)
- 토스페이먼츠 결제위젯 v2 (테스트 키)
- 다음 우편번호 서비스
- 배포: Vercel (GitHub main 브랜치에 push하면 자동 배포)

## 주요 기능

- **메인**: 메인 비주얼 슬라이드, WEEKLY BEST, NEW 배너, NEW ARRIVALS, BEST ITEM, 이벤트 슬라이더, 포토 리뷰, 이벤트 팝업(오늘 하루 보지 않기), 띠배너 닫기
- **상품 목록**: 카테고리(NEW ARRIVALS, BEST, CUP, TUMBLER, PLATE, TRAY, COASTER)와 컬렉션(MUSEUM EXCLUSIVE, MU:DS CONTEST, EXHIBITION, COLLABORATION), 정렬(신상품·인기·가격순, 품절은 맨 뒤), 더보기
- **검색**: 상품 이름·해시태그 검색(한국어·영어 모두), 인기 검색어
- **상품 상세**: 할인가, 타임딜 남은 시간, 수량 선택, 장바구니·바로 구매, 상세 이미지, 구매 안내, 리뷰
- **쇼핑**: 장바구니, 찜, 최근 본 상품, 주문서(우편번호 검색), 토스 결제와 결과 페이지
- **회원**: 회원가입, 로그인(이메일·구글), 비밀번호 재설정, 마이페이지(찜, 최근 본 상품, 주문 내역)
- **콘텐츠**: 브랜드 이야기, 이벤트 목록·상세, 리뷰 목록(포토 리뷰·정렬)·상세
- **다국어**: 한국어 / 영어 전환 — 화면 문구, 상품 118개·리뷰 150개·이벤트 내용, 배너 이미지까지 영어로 바뀜
- **반응형**: PC · 태블릿 · 휴대폰
- **인터랙션**: 마우스로 끌어서 넘기는 슬라이드, 단청 꽃 마우스 커서(누를 수 있는 곳에서는 기울어진 꽃)

> 회원 정보는 Firebase에 저장되고, 장바구니·찜·최근 본 상품·주문 내역은 서버 없이 브라우저(localStorage)에 저장됩니다.

## 페이지 구성

| 주소 | 페이지 |
| --- | --- |
| `/` | 메인 |
| `/shop/:category`, `/collection/:id` | 상품 목록 · 컬렉션 |
| `/product/:id` | 상품 상세 |
| `/search?q=` | 검색 결과 |
| `/cart`, `/wishlist`, `/recent` | 장바구니 · 찜 · 최근 본 상품 |
| `/checkout`, `/checkout/success`, `/checkout/fail` | 주문서 · 결제 결과 (로그인 필요) |
| `/login`, `/signup`, `/mypage` | 로그인 · 회원가입 · 마이페이지 (마이페이지는 로그인 필요) |
| `/brand` | 브랜드 이야기 |
| `/events`, `/events/:id` | 이벤트 목록 · 상세 |
| `/reviews`, `/reviews/:id` | 리뷰 목록 · 상세 |
| `/privacy` | 개인정보처리방침 |
| 그 밖의 주소 | 404 페이지 |

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
public/            파비콘
src/
├─ pages/          페이지
├─ components/     공용 컴포넌트 (헤더, 내비, 슬라이더, 상품 카드 등)
├─ utils/          인증·장바구니·찜·다국어·정렬 등 로직
├─ i18n/           영어 데이터 (상품, 리뷰, 구매 안내)
├─ products/       상품 이미지
├─ images/         배너·아이콘·커서 이미지
├─ fonts/          부산단디명조
├─ products.json   상품 데이터
├─ reviews.json    리뷰 데이터
└─ guide.json      구매 안내
vercel.json        하위 주소로 바로 들어와도 페이지가 열리도록 설정
```

## 출처

- 상품 정보와 이미지: 국립박물관문화재단 뮷즈 (학습용으로만 사용)
- 글꼴
  - 사이트: Pretendard(본문), Roboto(영문 제목), 부산단디명조(메인 비주얼·브랜드 페이지 히어로 문구)
  - 이벤트 배너 이미지: 제주한라산체(붉어진 선비 이벤트 배너), Segoe UI(갓잔 배너의 NEW) — 이미지 안에 들어간 글자라 사이트에서 글꼴 파일을 불러오지 않음
