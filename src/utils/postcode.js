// 카카오(다음) 우편번호 서비스: 무료, 키 불필요. 처음 쓸 때 스크립트를 불러옴
import { isEn, t } from './i18n.js'

const SCRIPT_URL = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
let scriptPromise = null

const loadScript = () => {
  if (window.daum?.Postcode) return Promise.resolve()
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.onload = resolve
    script.onerror = () => {
      scriptPromise = null
      reject(new Error(t('우편번호 서비스를 불러오지 못했어요.', "Couldn't load the address search.")))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

// 주소 검색 화면을 element 안에 그림(레이어 방식). 새 창 팝업은 일부 브라우저(VS Code 내장 브라우저 등)에서 흰 창으로 떠서 사용하지 않음
// 주소를 고르면 { zonecode, address } 전달
export const embedPostcode = async (element, onSelect) => {
  await loadScript()
  if (!element.isConnected) return // 불러오는 사이 레이어가 닫힘
  element.replaceChildren() // 다시 그릴 때 이전 화면이 겹치지 않게 비움
  new window.daum.Postcode({
    width: '100%',
    height: '100%',
    oncomplete: (data) => {
      // 영어 모드: 카카오가 함께 주는 영문 주소 사용 (건물명은 한글뿐이라 붙이지 않음)
      if (isEn()) {
        onSelect({ zonecode: data.zonecode, address: data.roadAddressEnglish || data.jibunAddressEnglish || data.addressEnglish })
        return
      }
      const base = data.roadAddress || data.jibunAddress
      onSelect({ zonecode: data.zonecode, address: data.buildingName ? `${base} (${data.buildingName})` : base })
    },
  }).embed(element)
}
