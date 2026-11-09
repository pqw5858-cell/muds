import { getImage } from '../../utils/getImage.js'
import SectionTitle from '../SectionTitle.jsx'
import './ProductSection.css'
import './ProductDetail.css'
import { t } from '../../utils/i18n.js'

const yesNo = (value) => (value ? t('사용 가능', 'Yes') : t('사용 불가', 'No'))

// 상세정보: 상세 이미지 + 상품 정보 표
function ProductDetail({ product }) {
  const { name, detailImages, material, size, care, shipping } = product

  const specs = [
    [t('재질', 'Material'), material],
    [t('용량 · 크기', 'Capacity / Size'), size],
    [t('식기세척기', 'Dishwasher safe'), yesNo(care.dishwasher)],
    [t('전자레인지', 'Microwave safe'), yesNo(care.microwave)],
    [
      t('배송 방법', 'Shipping'),
      `${shipping.method} · ${shipping.overseas ? t('국내 · 해외 배송', 'Korea & international') : t('국내 배송만 가능', 'Within Korea only')}`,
    ],
  ]

  return (
    <section className="product-section" id="product-detail">
      <SectionTitle>DETAIL</SectionTitle>

      <div className="product-detail__images">
        {detailImages.map((src, i) => (
          <img key={src} src={getImage(src)} alt={t(`${name} 상세 이미지 ${i + 1}`, `${name} detail image ${i + 1}`)} loading="lazy" />
        ))}
      </div>

      <table className="product-detail__specs">
        <caption className="blind">{t('상품 정보', 'Product information')}</caption>
        <tbody>
          {specs.map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default ProductDetail
