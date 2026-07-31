import {
  OfficialMessage,
} from '@/components/messages/official-message'

export default function RegionalDirectorMessagePage() {
  const message = {
    name: 'Rev. Leo Angelo Halog',
    title: 'Regional Director, FFWPU Philippines',
    organization: 'FFWPU Philippines',
    date: 'July 31, 2026',
    image: '/leaders/leo-angelo-halog.webp',
    message: [
      `Dear Blessed Families and Members,`,
      `With humility and a deep sense of responsibility, I greet you as we begin this new chapter of our providential journey together. I am sincerely grateful to Heavenly Parent and the True Parents for entrusting us with this precious time and opportunity to serve once again the Philippines.`,
      `As I assume this responsibility as Regional Director of FFWPU Philippines, I do so with the conviction that this position is not a title, but a calling to serve, unite, and walk together with our members toward the fulfillment of Heavenly Parent's will. I therefore humbly ask for your prayers, support, cooperation, and unity as we move forward together.`,
      `Our foremost responsibility at this time is to unite our hearts with True Mother, our Holy Mother Han, and sincerely understand and fulfill Her wishes for the providence. True Mother has carried the providential responsibility with unwavering devotion. As Blessed Families and members, we should not remain merely as observers of Her efforts. We must become people who can stand beside Her through our faith, our families, our witnessing, our service, and our sincere devotion.`,
      `I humbly invite all leaders, Blessed Families, and members to work together with the Regional Headquarters and with one another. Whatever our past experiences, differences, or individual perspectives may have been, let us place the providential mission above ourselves.`,
      `With one heart and one purpose, let us build a Philippines where Heavenly Parent's love can be experienced, where Blessed Families can flourish, where young people can find hope and purpose, and where the dream of Cheon Il Guk can become a living reality.`,
      `I sincerely ask for your prayers and continued support as we begin this journey together. May Heavenly Parent and the True Parents bless you and your family always.`,
      `Aju!`,
    ],
  }

  return <OfficialMessage {...message} position="Regional Director" />
}
