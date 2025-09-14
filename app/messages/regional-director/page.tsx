import {
  OfficialMessage,
} from '@/components/messages/official-message'

export default function RegionalDirectorMessagePage() {
  const message = {
    name: 'Rev. Ronnie D. Sodusta',
    title: 'Regional Director, FFWPU Philippines',
    organization: 'FFWPU Philippines',
    date: 'September 14, 2025',
    image: '/leaders/ronnie-sodusta.png',
    message: [
      `Beloved leaders, families, youth, and friends of FFWPU Philippines,

  On this meaningful occasion, I humbly accept the responsibility entrusted to me by our Heavenly Parent and True Parents. With deep gratitude, I reaffirm our commitment to unity, faith, and the way of true love. Our strength as a community is found in our shared values and our resolve to live for the sake of others.

  Let us move forward together to build a nation where every family thrives, every young person discovers a clear purpose, and every individual is empowered to serve the greater good. We will strengthen family life through principled education and care, cultivate leaders of integrity, deepen ministries and partnerships that uplift communities, practice transparent stewardship, and offer a consistent witness of peace, reconciliation, and hope.

  I am honored to serve as your Regional Director and extend my heartfelt gratitude to all who tirelessly contribute to our mission. With one heart and one vision, let us advance God’s dream for the Philippines and bring joy to Heaven and True Parents through our unity and our results.

  Determination: With absolute faith, absolute love, and absolute obedience, I will dedicate myself to raising principled families, empowering the next generation, and expanding a culture of service that reflects Heavenly Parent’s heart. I will lead with transparency and humility, unite our leaders and members, and work ceaselessly until our offering brings joy to True Parents and tangible blessing to our nation. May Heavenly Parent bless our families and this beloved country. Aju!

  Ronnie D. Sodusta
  Regional Director, FFWPU Philippines
  September 14, 2025`,
    ],
    about:
      'Rev. Sodusta has served as Regional Director of FFWPU Philippines for several years, guiding the movement with wisdom and compassion. His leadership is marked by a deep commitment to family values, interfaith harmony, and the vision of a peaceful world. He is respected for his integrity, dedication, and ability to inspire others to live for the greater good.',
  }

  return <OfficialMessage {...message} position="Regional Director" />
}
