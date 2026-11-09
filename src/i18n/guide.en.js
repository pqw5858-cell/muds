// 구매 안내(guide.json) 영문판 — 같은 id 순서, 영어 모드에서 사용
const guideEn = {
  title: 'Shopping Guide',
  sections: [
    {
      id: 'shipping',
      title: 'Shipping',
      items: [
        'Shipping method: Courier delivery (within Korea only; international shipping is not available)',
        'Shipping fee: ₩3,000 / Free on orders of ₩50,000 or more',
        'Orders paid by 2 PM on weekdays ship the same day and arrive within 1–3 business days.',
        'Additional shipping fees may apply to Jeju Island and remote areas.',
        'Orders do not ship on weekends or public holidays.',
      ],
    },
    {
      id: 'preorder',
      title: 'Pre-Orders',
      items: [
        'Pre-order items are made after payment and ship in about 4 weeks.',
        'Orders cannot be canceled once production has started.',
        'If you order other items together with a pre-order item, everything ships together on the pre-order ship date.',
      ],
    },
    {
      id: 'sole',
      title: 'Separate-Purchase Items',
      items: [
        'Items marked "Purchase separately" cannot be checked out together with other items in your cart.',
        'These items are packed and shipped separately.',
      ],
    },
    {
      id: 'return',
      title: 'Exchanges & Returns',
      items: [
        'You can request an exchange or return within 7 days of delivery through the Customer Center or My Page.',
        'If a ceramic or glass item arrives damaged, please report it on the day of delivery with photos. We will exchange it at no shipping cost.',
        'Exchanges or returns for a change of mind are subject to a ₩6,000 round-trip shipping fee.',
        'Items that show signs of use or have damaged packaging, as well as made-to-order pre-order items, cannot be exchanged or returned.',
        'Due to the handmade process, glaze drips, small bubbles and slight color differences are not considered defects.',
      ],
    },
    {
      id: 'payment',
      title: 'Payment',
      items: [
        'We accept credit cards, real-time bank transfers, bank deposits and mobile payment services.',
        'Bank-deposit orders are automatically canceled if payment is not confirmed within 3 days.',
      ],
    },
    {
      id: 'cs',
      title: 'Customer Center',
      items: [
        'Phone: 0000-0000',
        'Hours: Weekdays 10:00–17:00 (lunch break 12:00–13:00)',
        'Closed on weekends and public holidays',
      ],
    },
  ],
}

export default guideEn
