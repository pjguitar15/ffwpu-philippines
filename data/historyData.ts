type TimelineItem = {
  id: string
  year: string
  title: string
  icon: 'calendar' | 'map' | 'users' | 'award' | 'heart'
  content: string
  imageUrl?: string // NEW
}

export const TIMELINE: TimelineItem[] = [
  {
    id: 'ph-1975',
    year: '1975',
    title: 'First Missionaries Arrive',
    icon: 'calendar',
    content:
      'Gary Brown (USA), Jiro Hirano (Japan), and Ulrich Voelkel (Germany) arrived, beginning the Unification mission in the Philippines.',
    imageUrl: '/history-images/first-missionaries.png',
  },
  {
    id: 'ph-1976',
    year: '1976',
    title: 'Official Establishment',
    icon: 'calendar',
    content:
      'The Unification Church was officially established on September 30, 1976; in 1980 it was registered as HSA-UWC.',
    imageUrl: '/history-images/church-established.png',
  },
  {
    id: 'ph-1979',
    year: '1979',
    title: 'Bacolod Rally',
    icon: 'map',
    content:
      'A rally in Bacolod City central park proclaimed God’s Kingdom through True Parents, marking bold public outreach.',
    imageUrl: '/history-images/bacolod-rally.png',
  },

  {
    id: 'ph-1980',
    year: '1980',
    title: 'Cebu Church Center',
    icon: 'map',
    content:
      'A permanent Unification Church center was purchased in Cebu City, built on members’ sacrifices.',
    imageUrl: '/history-images/cebu-church-center.png',
  },
  {
    id: 'ph-1981-7day',
    year: '1981',
    title: 'First 7-Day Workshop in the Philippines',
    icon: 'users',
    content:
      'The first 7-day workshop in the Philippines was held, laying the foundation for national training programs.',
    imageUrl: '/history-images/1981-7day-workshop.png',
  },
  {
    id: 'ph-1981',
    year: '1981',
    title: 'First 21-Day National Workshop',
    icon: 'users',
    content:
      'The first national 21-day training workshop was held in Cebu from April 19–30, raising Filipino leaders.',
    imageUrl: '/history-images/1981-21day-workshop.png',
  },
  {
    id: 'ph-1982',
    year: '1982',
    title: 'First Davao Workshop',
    icon: 'users',
    content:
      'On May 8–9, the first 2-day workshop in Mindanao took place in Davao City, expanding outreach to the south.',
    imageUrl: '/history-images/1982-davao-workshop.png',
  },
  {
    id: 'ph-1979-1989-tongil-moodo',
    year: '1979–1989',
    title: 'Tong-Il Moo-Do in the Philippines',
    icon: 'users',
    content:
      'Early Filipino practitioners such as Gerry Servito, Elcid Liñan, and Raffy Rabaño pioneered the training, supported by Master Kensaku Takahashi sent by Dr. Joon Ho Seuk.',
    imageUrl: '/history-images/1979-1989-tongil-moodo.png',
  },
  {
    id: 'ph-1983',
    year: '1983',
    title: 'Quezon City Headquarters Acquired',
    icon: 'calendar',
    content:
      'The Philippine National HQ in Diliman, Quezon City was purchased with prize money from True Parents.',
    imageUrl: '/history-images/1983-qc-hq.png',
  },
  {
    id: 'ph-1984',
    year: '1984',
    title: 'Antipolo Properties',
    icon: 'map',
    content:
      'Properties in Antipolo were acquired, later developed into the Asian Leadership Peace Academy',
    imageUrl: '/history-images/1984-antipolo-properties.png',
  },
  {
    id: 'ph-1988-6500blessing',
    year: '1988.10.30',
    title: '6,500 Couples Blessing – Filipino Participants',
    icon: 'heart',
    content:
      'At the 6,500 Couples Blessing in Korea, 15 Filipino brothers were matched: 14 to Japanese spouses and 1 to a Korean spouse. This marked one of the earliest large-scale international Blessings with Filipino representation.',
    imageUrl: '/history-images/1988-6500blessing.png',
  },
  {
    id: 'ph-1989-1275blessing',
    year: '1989.01.12',
    title: '1,275 Couples Blessing – 64 Filipinos Blessed',
    icon: 'heart',
    content:
      'On January 12, 1989, True Parents officiated the 1,275 Couples Blessing in Seoul. Among them were 64 Filipino members. Pictured were couples such as Jim & Delia Capa Javanasundara (Fil-Thailand), Mr. & Mrs. Josette Rafil Mendonca (Fil-USA), Eddie & Esther Borinaga Batino (Fil-Fil), Abraham & Haide Leonora Millare (Fil-Fil), and Manuel & Diosdada Ladica Dos Santos (Fil-Brazil).',
    imageUrl: '/history-images/1989-1275blessing.png',
  },
  {
    id: 'ph-1989-21day-leadership',
    year: '1989.11.16',
    title: '2nd 21-Day Leadership Training (Quezon City)',
    icon: 'users',
    content:
      'The second batch of the 21-day leadership training was held at the Philippine HQ from Nov 16 – Dec 6, 1989. Rev. Yoshinobu Murotani served as the main lecturer, raising a new wave of Filipino leaders.',
    imageUrl: '/history-images/1989-21day-leadership.png',
  },

  // ——— Added milestones ———
  {
    id: 'ph-1992-wfwp',
    year: '1992',
    title: "True Mother's First Visit & WFWP Launch",
    icon: 'award',
    content:
      'True Mother first visited the Philippines in December 1992 to launch the Women’s Federation for World Peace.',
    imageUrl: '/history-images/1992-wfwp-launch.png',
  },
  {
    id: 'ph-1992-30000blessing',
    year: '1992.08.25',
    title: '30,000 Couples Blessing – Filipino International Couples',
    icon: 'heart',
    content:
      'The 30,000 Couples Blessing took place at the Seoul Olympic Stadium on August 25, 1992. Filipino participants included Filipino-African and Filipino-Japanese couples, demonstrating the international and intercultural character of the Blessing movement.',
    imageUrl: '/history-images/1992-30000blessing.png',
  },
  {
    id: 'ph-1994',
    year: '1994',
    title: 'Philippine Assembly for World Peace',
    icon: 'award',
    content:
      'Held at the Westin Philippine Plaza Hotel; True Father signed Manila Bulletin coverage of the event.',
    imageUrl: '/history-images/1994-assembly-world-peace.png',
  },
  {
    id: 'ph-1995-worldtour',
    year: '1995.12',
    title: "True Parents' World Tour in Manila",
    icon: 'award',
    content:
      'True Father gave a dynamic and passionate speech during the World Tour at the Philippine International Convention Center in Manila, December 1995. Thousands of Filipino members gathered with great joy and inspiration.',
    imageUrl: '/history-images/1995-worldtour-manila.png',
  },
  {
    id: 'ph-1996-1998-blessing-persecution-victory',
    year: '1996–1998',
    title: 'PICC Blessing, Persecution & Religious Freedom Victory',
    icon: 'award',
    content:
      'In January 1996, nearly 1,000 Korean-Filipino couples joined the 360,000 Couples Blessing at the Philippine International Convention Center (PICC). The government, alarmed by the large number of foreign participants, accused the movement of mail-order bride practices. After years of investigation, the House of Representatives ruled in 1998 that the International Blessing was a legitimate religious rite. Thanksgiving celebrations were held at Camp Aguinaldo (April 12, 1998) and the Manila Polo Club (April 25, 1998), marking victory for religious freedom.',
    imageUrl: '/history-images/1996-1998-picc-blessing-victory.png',
  },
  {
    id: 'ph-1999-tm-visit',
    year: '1999',
    title: "True Mother's 1999 Visit (World Tour)",
    icon: 'users',
    content:
      'On April 25, 1999, during her world peace tour, True Mother spoke in Manila—her 63rd speaking event of an 80-city tour.',
    imageUrl: '/history-images/1999-true-mother-visit.png',
  },
  {
    id: 'ph-1999-rys',
    year: '1999.10.22',
    title: 'Religious Youth Service Project (Manila & Batangas)',
    icon: 'users',
    content:
      'IIFWP’s Religious Youth Service held “World Peace Through Inter-Religious Community Service” in Manila, Batangas City and Bauan, Oct 22–29, 1999, with volunteers from across Southeast Asia.',
    imageUrl: '/history-images/1999-rys-philippines.png',
  },
  {
    id: 'ph-2001-timd-calligraphy',
    year: '2001.05.04',
    title: '“Tong-Il Moo-Do” Calligraphy from True Father',
    icon: 'award',
    content:
      'True Father bestowed the “Tong-Il Moo-Do” calligraphy and symbol, emphasizing discipline as essential to accomplish great tasks.',
    imageUrl: '/history-images/2001-timd-calligraphy.png',
  },
  {
    id: 'ph-2002-shia-founded',
    year: '2002.03.25',
    title:
      'Sun Hwa International Academy Foundation, Inc. Established (Antipolo)',
    icon: 'map',
    content:
      'Sun Hwa International Academy Foundation, Inc. was founded in Antipolo City on March 25, 2002, advancing character and leadership education for Filipino youth.',
    imageUrl: '/history-images/2002-shia-founded.png',
  },
  {
    id: 'ph-2005a',
    year: '2005.12.01',
    title: 'UPF Inaugural Convocation in Manila',
    icon: 'award',
    content:
      'True Parents launched the Universal Peace Federation at the Manila Hotel’s Fiesta Pavilion before ~5,000 participants; True Father also offered special calligraphy for the Philippines.',
    imageUrl: '/history-images/2005-upf-inaugural.png',
  },
  {
    id: 'ph-2005b',
    year: '2005.12.02',
    title: 'Hoon Dok Hae & Victory Celebration (Manila Hotel)',
    icon: 'users',
    content:
      'A Hoon Dok Hae and victory celebration with True Parents was held at the Manila Hotel on December 2.',
    imageUrl: '/history-images/2005-12-01-upf.png',
  },
  {
    id: 'ph-2005-11-07-ancestors',
    year: '2005.11.07',
    title: 'Ancestral Liberation (Tanay, Rizal)',
    icon: 'award',
    content:
      '“Building God’s Peace Nation towards Cheon Il Guk” ancestral liberation workshop held Nov 7–8, 2005 in Sitio Mayagay, Tanay, Rizal.',
    imageUrl: '/history-images/2005-11-07-ancestral-liberation.png',
  },

  {
    id: 'ph-2006',
    year: '2006',
    title: 'True Mother’s Peace Tour',
    icon: 'award',
    content:
      'True Mother visited Manila during her world peace tour, affirming the Philippines’ providential role among island nations.',
    imageUrl: '/history-images/2006-true-mother-peace-tour.png',
  },
  {
    id: 'ph-2006-araneta-students',
    year: '2006',
    title: 'Collegiate/University Assembly at Araneta Coliseum',
    icon: 'users',
    content:
      'A large collegiate and university student assembly gathered at Araneta Coliseum in 2006, showcasing youth participation.',
    imageUrl: '/history-images/2006-araneta-assembly.png',
  },
  {
    id: 'ph-2006-05-29-hdh',
    year: '2006.05.29',
    title: 'Hoon Dok Hae with True Mother (~4,000 attendees)',
    icon: 'users',
    content:
      'As many as 4,000 members and guests gathered for Hoon Dok Hae with True Mother in Manila.',
    imageUrl: '/history-images/2006-05-29-hdh.png',
  },
  {
    id: 'ph-2006-09-25-wpt3',
    year: '2006.09.25',
    title: 'UPF World Peace Tour III (Three Generations)',
    icon: 'award',
    content:
      'World Peace Tour III in Manila (Sept 25–26, 2006) drew ~2,100 leaders; Hoon Dok Hae was held with three generations.',
    imageUrl: '/history-images/2006-09-25-wpt3.png',
  },

  {
    id: 'ph-2007-02-10-bfwp',
    year: '2007.02.10',
    title: 'Barangay Federation for World Peace Launched',
    icon: 'map',
    content:
      'UPF launched the Barangay Federation for World Peace (BFWP) on Feb 10–11, 2007, mobilizing grassroots leadership nationwide.',
    imageUrl: '/history-images/2007-02-10-bfwp.png',
  },

  {
    id: 'ph-2009',
    year: '2009',
    title: 'First UPF Chapter in Quezon City',
    icon: 'map',
    content:
      'The first Universal Peace Federation chapter was launched, officiated by then Mayor Feliciano Belmonte.',
    imageUrl: '/history-images/2009-upf-qc.png',
  },

  {
    id: 'ph-2010-memorial-festival',
    year: '2010.06.26',
    title: 'Memorial Festival “Honoring a Legacy of Peace” (AFCOC)',
    icon: 'award',
    content:
      'A Memorial Festival of Ascension and Unity, “Honoring a Legacy of Peace,” was held at AFCOC, Camp Aguinaldo, Quezon City.',
    imageUrl: '/history-images/2010-memorial-festival.png',
  },
  {
    id: 'ph-2010a',
    year: '2010.08.03',
    title: 'Visit of Hyung Jin Nim & Yeon Ah Nim',
    icon: 'users',
    content:
      'Nearly 4,000 members gathered at the Philippine HQ for a 3-day visit of international leaders (Aug 3–5).',
    imageUrl: '/history-images/2010-hj-visit.png',
  },
  {
    id: 'ph-2010-01-17-bbw',
    year: '2010.01.17',
    title: 'Visit of Boon Bong Wang & Rev. Peter Kim',
    icon: 'users',
    content:
      'Rev. Peter Kim visited the Philippines; photos document the welcome and gatherings at HQ.',
    imageUrl: '/history-images/2010-01-17-visit.png',
  },
  {
    id: 'ph-2010b',
    year: '2010.12.12',
    title: 'Little Angels Performances (Cultural Center of the Philippines)',
    icon: 'award',
    content:
      'The Little Angels of Korea performed breath-taking cultural shows to full audiences in Manila (Dec 12–15).',
    imageUrl: '/history-images/2010-little-angels.png',
  },
  {
    id: 'ph-2010-12-13-little-angels',
    year: '2010.12.13',
    title: 'Little Angels Courtesy Call at Malacañang',
    icon: 'award',
    content:
      'The Little Angels paid a courtesy call at Malacañang and were welcomed by President Benigno Aquino III together with dignitaries.',
    imageUrl: '/history-images/2010-little-angels-visit.png',
  },

  {
    id: 'ph-2011-03-13-iplc-groundbreaking',
    year: '2011.03.13',
    title: 'IPLC Groundbreaking (Tanay, Rizal)',
    icon: 'map',
    content:
      'Groundbreaking ceremony for the International Peace Leadership College was held in Tanay, Rizal.',
    imageUrl: '/history-images/2011-03-13-iplc-groundbreaking.png',
  },
  {
    id: 'ph-2011-01-seminar',
    year: '2011.01.18',
    title: 'True Parents’ Life Course Seminar (Philippines HQ)',
    icon: 'users',
    content:
      'A 3-day seminar on the Life Course of True Parents at the National HQ, Jan 18–20, 2011, with Rev. Jin Hun Yong.',
    imageUrl: '/history-images/2011-01-life-course-seminar.png',
  },
  {
    id: 'ph-2011-07-seminar',
    year: '2011.07.09',
    title: 'TP Life Course Seminar (HQ, July 9–10, 2011)',
    icon: 'users',
    content:
      'Two-day seminar at the National HQ with Rev. Jin Hun Yong and translator Tim Elder (July 9–10, 2011).',
    imageUrl: '/history-images/2011-07-life-course-seminar.png',
  },
  {
    id: 'ph-2011-120day-education',
    year: '2011–2012',
    title: '120-Day Special Education for Asian Leaders (Five Classes)',
    icon: 'award',
    content:
      'A series of 120-day special education workshops for Asian leaders ran from Jan 2011 through Oct 2012 (five classes).',
    imageUrl: '/history-images/2011-120day-education.png',
  },
  {
    id: 'ph-2011-04-10-hdh-100',
    year: '2011.04.10',
    title: 'Hoon Dok Hae “Read DP 100 Times” Emphasis',
    icon: 'calendar',
    content:
      'Asia Continental Director Dr. Chung Sik Yong emphasized the “Hoon Dok Hae revolution” and encouraged members to read the Exposition of Divine Principle 100 times.',
    imageUrl: '/history-images/2011-04-10-hdh-100.png',
  },
  {
    id: 'ph-2011-07-01-basuil-seonghwa',
    year: '2011.07.01',
    title: 'Seonghwa of Rev. Rolando C. Basuil, Jr.',
    icon: 'calendar',
    content:
      'Rev. Basuil (National Leader, 2009–2011) ascended on July 1, 2011; Seonghwa ceremony followed on July 5.',
    imageUrl: '/history-images/2011-07-01-basuil-seonghwa.png',
  },

  {
    id: 'ph-2012',
    year: '2012',
    title: 'True Father’s Seonghwa Memorial',
    icon: 'calendar',
    content:
      'Memorial services were held at Antipolo’s ALPA Training Center with members, Ambassadors for Peace, and leaders.',
    imageUrl: '/history-images/2012-seonghwa-memorial.png',
  },
  {
    id: 'ph-2012-03-30-strong-korea',
    year: '2012.03.30',
    title: 'International Leadership Conference (Davao) — “Strong Korea”',
    icon: 'users',
    content:
      'Kook Jin Nim gave a special lecture to ~300 foreign and local delegates at Waterfront Hotel, Davao City.',
    imageUrl: '/history-images/2012-03-30-ilc-davao.png',
  },
  {
    id: 'ph-2012-07-21-ipbf-dumaguete',
    year: '2012.07.21',
    title: 'Interfaith Peace Blessing Festival — Dumaguete (3,000 couples)',
    icon: 'heart',
    content:
      'An unprecedented 3,000 couples turned out for IPBF at the Lamberto Macias Sports Complex in Dumaguete City, Negros Oriental.',
    imageUrl: '/history-images/2012-07-21-ipbf-dumaguete.png',
  },
  {
    id: 'ph-2012-08-04-ipbf-higaonon',
    year: '2012.08.04',
    title:
      'Interfaith Peace Blessing Festival — Higaonon Tribe (1,400 couples)',
    icon: 'heart',
    content:
      '1,400 Higaonon tribal couples from Northern Mindanao attended the IPBF in Balingasag, Misamis Oriental; officiated by Dr. & Mrs. Chung Sik Yong.',
    imageUrl: '/history-images/2012-08-04-ipbf-higaonon.png',
  },
  {
    id: 'ph-2012-10-13-ipbf-cebu',
    year: '2012.10.13',
    title: 'Interfaith Peace Blessing Festival — Cebu (1,250 couples)',
    icon: 'heart',
    content:
      '1,250 couples participated in the IPBF at the Cebu Coliseum; interreligious prayers were offered by faith leaders.',
    imageUrl: '/history-images/2012-10-13-ipbf-cebu.png',
  },
  {
    id: 'ph-2013a',
    year: '2013',
    title: 'Philippine Cheon Jeong Gung Inauguration',
    icon: 'map',
    content:
      'The new Philippine National Headquarters building was inaugurated in Quezon City.',
    imageUrl: '/history-images/2013-cjg-inauguration.png',
  },
  {
    id: 'ph-2013b',
    year: '2013',
    title: 'International Peace Leadership College',
    icon: 'users',
    content:
      'The International Peace Leadership College was inaugurated in Tanay, Rizal, advancing leadership education.',
    imageUrl: '/history-images/2013-iplc-inauguration.png',
  },

  {
    id: 'ph-2018',
    year: '2018',
    title: 'Peace Road Philippines',
    icon: 'map',
    content:
      'Nationwide Peace Road rallies united youth, cyclists, and leaders for peace and interfaith solidarity.',
    imageUrl: '/history-images/2018-peace-road.png',
  },
  {
    id: 'ph-2021-rallyofhope',
    year: '2021.02.06',
    title: 'One Million Rally of Hope Philippines',
    icon: 'users',
    content: `Featuring: Messages of Hope and Peace from Distinguished Leaders. Messages of Hope from Famous Celebrities. Exciting Performances from Famous Artists.`,
    imageUrl: '/history-images/2021-rally-of-hope.jpg',
  },
  {
    id: 'ph-2021-ryf',
    year: '2021.02.06',
    title: 'Regional Youth Forum',
    icon: 'users',
    content: `A total of 25,084 participants registered and a total of 6,677 completed the 2-day education throughout the 17 Regions Nationwide.`,
    imageUrl: '/history-images/2021-regional-youth-forum.jpg',
  },
]
