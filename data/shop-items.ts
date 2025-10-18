// Shared shop items data
export interface ShopItem {
  id: string
  name: string
  category: 'Holy Items' | 'Scriptures & Texts' | 'Devotional Materials' | 'Blessing Keepsakes'
  description: string
  image?: string
  note?: string
  status: 'Available' | 'Out of Stock'
  price: number
}

export const shopItems: ShopItem[] = [
  { id: 'holy-salt', name: 'Holy Salt', category: 'Holy Items', description: 'Used in sanctification and protection rituals.', image: '/data/shop/holy-items.svg', note: 'Cheong Pyeong standard packaging.', status: 'Available', price: 150 },
  { id: 'holy-wine-set', name: 'Holy Wine Set', category: 'Holy Items', description: 'For Blessing ceremonies and family dedication.', image: '/data/shop/holy-items.svg', note: 'Offered during official Blessing rites.', status: 'Out of Stock', price: 1200 },
  { id: 'prayer-candle', name: 'Prayer Candle', category: 'Devotional Materials', description: 'A serene candle used for focused prayer at home.', image: '/data/shop/devotional.svg', status: 'Available', price: 250 },
  { id: 'divine-principle-en', name: 'Divine Principle (English)', category: 'Scriptures & Texts', description: 'Foundational text outlining core teachings.', image: '/data/shop/scriptures.svg', status: 'Available', price: 950 },
  { id: 'divine-principle-tl', name: 'Divine Principle (Tagalog)', category: 'Scriptures & Texts', description: 'Tagalog edition of the foundational teachings.', image: '/data/shop/scriptures.svg', status: 'Out of Stock', price: 900 },
  { id: 'chambumo-gyeong', name: 'Chambumo Gyeong', category: 'Scriptures & Texts', description: 'Anthology on the life, thought, and achievements of True Parents.', image: '/data/shop/scriptures.svg', status: 'Available', price: 1800 },
  { id: 'pyeong-hwa-gyeong', name: 'Pyeong Hwa Gyeong', category: 'Scriptures & Texts', description: 'Compilation of peace messages delivered globally.', image: '/data/shop/scriptures.svg', status: 'Available', price: 1400 },
  { id: 'family-pledge-plaque', name: 'Family Pledge Plaque', category: 'Devotional Materials', description: 'Wall display of the Family Pledge for daily recitation.', image: '/data/shop/devotional.svg', status: 'Available', price: 600 },
  { id: 'blessing-ring-case', name: 'Blessing Ring Case', category: 'Blessing Keepsakes', description: 'Protective case for preserving Blessing rings.', image: '/data/shop/keepsakes.svg', note: 'Velvet interior.', status: 'Out of Stock', price: 850 },
  { id: 'holy-robe-set', name: 'Holy Robe Set', category: 'Blessing Keepsakes', description: 'Ceremonial attire for special occasions and Blessing rites.', image: '/data/shop/keepsakes.svg', status: 'Available', price: 3500 },
  { id: 'holy-water-vial', name: 'Holy Water Vial', category: 'Holy Items', description: 'Small sealed vial containing sanctified holy water for family use.', image: '/data/shop/holy-items.svg', status: 'Available', price: 180 },
  { id: 'anointing-oil', name: 'Anointing Oil', category: 'Holy Items', description: 'Fragrant consecrated oil used during special prayers and dedication.', image: '/data/shop/holy-items.svg', status: 'Out of Stock', price: 420 },
  { id: 'candle-set', name: 'Prayer Candle Set (3)', category: 'Devotional Materials', description: 'Triple candle set signifying faith, hope, and love in daily devotion.', image: '/data/shop/devotional.svg', status: 'Available', price: 500 },
  { id: 'rosary-alt-style', name: 'Meditation Beads', category: 'Devotional Materials', description: 'Beaded strand aiding focused meditation and reflective prayer sessions.', image: '/data/shop/devotional.svg', status: 'Out of Stock', price: 300 },
  { id: 'scripture-set-basic', name: 'Basic Scripture Starter Set', category: 'Scriptures & Texts', description: 'Bundle of introductory texts ideal for new families beginning study.', image: '/data/shop/scriptures.svg', status: 'Available', price: 2500 },
  { id: 'family-photo-frame', name: 'Blessing Family Photo Frame', category: 'Blessing Keepsakes', description: 'Elegant frame for displaying official Blessing photograph.', image: '/data/shop/keepsakes.svg', status: 'Available', price: 700 },
  { id: 'ring-box-deluxe', name: 'Deluxe Ring Box', category: 'Blessing Keepsakes', description: 'Premium preservation box lined with silk for Blessing rings.', image: '/data/shop/keepsakes.svg', status: 'Out of Stock', price: 1100 },
  { id: 'holy-robe-accessory', name: 'Holy Robe Accessory Set', category: 'Blessing Keepsakes', description: 'Matching sash and cover complementing the ceremonial robe.', image: '/data/shop/keepsakes.svg', status: 'Available', price: 950 }
]
