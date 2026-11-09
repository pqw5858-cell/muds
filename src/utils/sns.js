import iconFacebook from '../images/icon-sns-01.png'
import iconInstagram from '../images/icon-sns-02.png'
import iconYoutube from '../images/icon-sns-03.png'

// 뮷즈 공식 SNS (푸터·외부 검색창 공용). 순서는 푸터 시안대로 페이스북 · 인스타그램 · 유튜브
// (주의: 이미지 파일 01=페이스북, 02=인스타그램, 03=유튜브)
export const SNS_LINKS = [
  { id: 'facebook', icon: iconFacebook, label: { ko: '페이스북', en: 'Facebook' }, href: 'https://www.facebook.com/muds.museumgoods/' },
  { id: 'instagram', icon: iconInstagram, label: { ko: '인스타그램', en: 'Instagram' }, href: 'https://www.instagram.com/muds_museumgoods/' },
  { id: 'youtube', icon: iconYoutube, label: { ko: '유튜브', en: 'YouTube' }, href: 'https://www.youtube.com/@muds_museumgoods' },
]

// 뮷즈 공식 사이트 안내 페이지 (푸터)
export const TERMS_URL = 'https://www.museumshop.or.kr/kor/etc/contract.do' // 이용약관
export const EMAIL_REFUSAL_URL = 'https://www.museumshop.or.kr/kor/etc/email.do' // 이메일 수집거부
export const OFFLINE_STORE_URL = 'https://www.nmf.or.kr/user/sub/20181019151938138100_contents.do' // 오프라인 매장
