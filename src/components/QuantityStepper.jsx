import { MAX_QUANTITY } from '../utils/cart.js'
import './QuantityStepper.css'
import { t } from '../utils/i18n.js'

// 수량 −/+ (1 ~ 99). 구매 옵션 창, 장바구니에서 공용
function QuantityStepper({ value, onChange, label = t('수량', 'Quantity') }) {
  return (
    <div className="quantity-stepper">
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={t(`${label} 빼기`, `Decrease ${label.toLowerCase()}`)}>
        −
      </button>
      <output aria-live="polite" aria-label={label}>
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label={t(`${label} 더하기`, `Increase ${label.toLowerCase()}`)}
      >
        +
      </button>
    </div>
  )
}

export default QuantityStepper
