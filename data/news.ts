export interface NewsItem {
  id: string
  title: string
  author: string
  date: string
  image: string
  tags: string[]
  status: string
  views: number
  likes: number
  content: string // now HTML
  comments: any[]
  slug: string
}

export const sampleNews: NewsItem[] = [
  {
    id: '1',
    title: 'Philippines: Community Teaching',
    author: 'FFWPU Philippines',
    date: '2025-02-19',
    image:
      'https://familyfedihq.org/wp-content/uploads/2025/02/ph-cm-tc-1-1024x683.jpg',
    tags: ['community', 'youth'],
    status: 'active',
    views: 412,
    likes: 37,
    content: `
      <p>FFWPU Philippines, together with IAYSP leaders and barangay partners, conducted a full-day community teaching program in Sitio Upper Hinapao, Antipolo on February 15, 2025. The initiative gathered ninety-four participants—from elementary students to young professionals—and combined interactive learning with light service activities.</p>
      <p>The morning began with a lively welcome and icebreakers before small groups rotated through stations on cooperation, conflict resolution, and leadership by example. Facilitators used simple scenarios from school, neighborhood life, and online spaces to help participants connect values with practical choices. Parents who observed the sessions said they appreciated how the lessons encouraged empathy and accountability without shaming.</p>
      <p>After lunch, volunteers organized a short clean-up around the covered court and nearby paths. The activity became an exercise in stewardship and teamwork; children eagerly compared the recyclable items they collected while older youth coordinated sorting. Residents noted that the area “looked and felt different” after only an hour of collective effort.</p>
      <p>In the afternoon forum, participants reflected on what it means to live for the sake of others in ordinary ways—greeting neighbors, checking on classmates, or helping a younger sibling. Several youth leaders proposed creating a monthly service day and a study circle where they could continue the conversations started during the workshop.</p>
    `,
    comments: [],
    slug: 'philippines-community-teaching',
  },
  {
    id: '2',
    title: 'Philippine: Japanese Cultural Experience',
    author: 'FFWPU Philippines',
    date: '2025-02-19',
    image:
      'https://familyfedihq.org/wp-content/uploads/2025/02/JPcevent-1024x514.jpg',
    tags: ['culture', 'Cebu'],
    status: 'active',
    views: 358,
    likes: 29,
    content: `
      <p>On February 14, 2025, FFWPU Cebu, HTG Missionaries Japan, and BUCCI hosted a Japanese Cultural Experience that transformed a humble hall into a vibrant cultural classroom. Guests explored calligraphy and origami stations, learned a few Japanese greetings, and sampled simple norimaki while student performers offered songs and a short yosakoi dance.</p>
      <p>Between performances, speakers shared reflections on pure love, honoring parents, and the power of traditions to shape character. A highlight was a brief testimony from a Cebuano student who studied in Japan and found family-like support in a local church community during challenging months abroad.</p>
      <p>The event fostered genuine exchange: participants asked about school life in Tokyo and Osaka; Japanese guests asked about Cebuano festivals and the meaning of “bayanihan.” By the end of the evening, several attendees signed up for a follow-up character-education session and a planned language club that will pair students for weekly conversation practice.</p>
      <p>Organizers emphasized that culture nights are not just entertainment but a way to build bridges across generations and nations. The team hopes to tour the program to two campuses in the coming quarter, adapting activities to fit classroom schedules and student clubs.</p>
    `,
    comments: [],
    slug: 'philippine-japanese-cultural-experience',
  },
  {
    id: '3',
    title: 'Philippines: National Youth Leaders Convergence',
    author: 'Philippines Blessed Children Dept. & Youth Dept.',
    date: '2025-01-06',
    image:
      'https://familyfedihq.org/wp-content/uploads/2025/01/dream-1024x624.jpg',
    tags: ['leadership', 'workshop'],
    status: 'active',
    views: 501,
    likes: 45,
    content: `
      <p>From December 22 to 24, 2024, more than a hundred officers from IAYSP, BCD, CARP, and campus fellowships gathered at Sun Hwa International Academy for the DREAM Philippines Youth Leaders Convergence. The three-day program mixed strategic planning with hands-on skill labs to help chapters collaborate rather than compete for limited volunteers and time.</p>
      <p>Morning plenaries covered vision, accountability, and healthy team culture. Afternoon labs focused on event design, budgeting, social media ethics, and small-group facilitation. The design workshop challenged mixed teams to create a service project that could be replicated nationwide with minimal resources.</p>
      <p>On day two, leaders mapped a unified calendar for 2025, identifying potential joint weekends to avoid overlapping activities. A “marketplace” session allowed clusters to pitch ideas: scholarship mentoring, barangay tutoring hubs, and monthly clean-ups that double as leadership training for new officers.</p>
      <p>The final morning featured testimonies from regional coordinators who built partnerships with schools and LGUs by showing consistency over time. Participants sealed letters to their “future selves” for a mid-year check-in and pledged to share resources and co-host trainings across regions.</p>
    `,
    comments: [],
    slug: 'philippines-national-youth-leaders-convergence',
  },
  {
    id: '4',
    title: 'Unified Sunday Service — Metro Manila Family Church',
    author: 'FFWPU Philippines',
    date: '2024-12-15',
    image: 'https://picsum.photos/seed/unified-svc-mmfc-2024/1024/683',
    tags: ['worship', 'family'],
    status: 'active',
    views: 208,
    likes: 19,
    content: `
      <p>Families from across the NCR gathered for a unified Sunday service filled with worship, testimonies, and fellowship. The music ministry led classic hymns alongside new compositions from youth members, setting a reflective tone before the message on gratitude and year-end reflection.</p>
      <p>Two testimonies anchored the theme: one family shared how small acts of kindness in their neighborhood gradually opened friendships; another spoke about learning to pray together during a season of uncertainty. Both reminded the community that faith is practiced in ordinary decisions as much as in special events.</p>
      <p>After the benediction, volunteers distributed care packs prepared by home groups for first-time guests and seniors. Children decorated a “thank-you wall” with drawings of people they appreciate while young adults invited visitors to a holiday outreach posted near the exit.</p>
      <p>Leaders encouraged members to see Sunday service as the start of a week of service rather than its conclusion—checking on a neighbor, arranging a visit, and inviting a friend to experience community.</p>
    `,
    comments: [],
    slug: 'unified-sunday-service-mmfc-2024',
  },
  {
    id: '5',
    title: 'CARP Healing Café — Cebu Chapter',
    author: 'W-CARP Philippines',
    date: '2024-11-06',
    image: 'https://picsum.photos/seed/carp-healing-cafe-cebu-2024/1024/683',
    tags: ['CARP', 'youth'],
    status: 'active',
    views: 172,
    likes: 22,
    content: `
      <p>The CARP Healing Café in Cebu created a gentle space for students to slow down and reconnect. Against a backdrop of acoustic music, participants shared about exams, family expectations, and the pressure to perform online. Trained facilitators guided small circles using simple prompts and active-listening guidelines.</p>
      <p>A short talk introduced practical tools for mental wellness—journaling, breath prayers, and “digital Sabbaths.” Students tried a three-minute quiet time, then wrote encouragement notes for someone at their table. Several shared that even a few minutes of silence felt new and surprisingly restorative.</p>
      <p>The evening ended with an invitation to join monthly cafés or volunteer crews for campus clean-ups. Two departments have since asked CARP to bring a mini-version of the café to their student-org weeks, complete with a reflection corner and peer counselors on rotation.</p>
    `,
    comments: [],
    slug: 'carp-healing-cafe-cebu-2024',
  },
  {
    id: '6',
    title: 'IAYSP Outreach — Character Education Workshop',
    author: 'IAYSP Pilipinas',
    date: '2025-02-03',
    image:
      'https://picsum.photos/seed/iaysp-character-education-workshop-2025/1024/683',
    tags: ['IAYSP', 'education'],
    status: 'active',
    views: 246,
    likes: 33,
    content: `
      <p>Senior high students filled a multi-purpose room for an IAYSP character-education workshop on leadership by example. The opening session contrasted influence and popularity, showing how small, consistent choices inspire more than curated images online.</p>
      <p>Through role-plays, students practiced resolving conflicts, owning mistakes, and celebrating teammates. A service-design activity challenged groups to propose projects that would genuinely help their campus—not just look good in photos.</p>
      <p>Teachers said the interactive format kept energy high while grounding ideals in concrete action. Organizers will return for a project-planning clinic so each class can adopt one initiative for the next quarter.</p>
    `,
    comments: [],
    slug: 'iaysp-character-education-workshop-2025',
  },
  {
    id: '7',
    title: 'Blessing Preparation Seminar — Couples & Families',
    author: 'FFWPU Philippines',
    date: '2025-01-20',
    image: 'https://picsum.photos/seed/blessing-prep-seminar-2025/1024/683',
    tags: ['blessing', 'family'],
    status: 'active',
    views: 193,
    likes: 27,
    content: `
      <p>Couples joined a full-day Blessing Preparation Seminar that wove together practical guidance and spiritual reflection. Morning talks explored commitment, forgiveness, and the meaning of partnership as a shared mission.</p>
      <p>In breakout circles, couples discussed real-life topics—budgets, schedules, decision-making—using worksheets to map responsibilities with grace. A panel of seasoned couples answered questions about raising children, navigating extended family, and staying hopeful during difficult seasons.</p>
      <p>Participants said the seminar created “room to breathe and talk.” Many left with a simple weekly check-in plan and a shared intention to cultivate peace at home. Follow-up mentoring sessions will be offered for those preparing for the Blessing in 2025.</p>
    `,
    comments: [],
    slug: 'blessing-preparation-seminar-2025',
  },
  {
    id: '8',
    title: 'UPF Ambassadors for Peace Meetup — Manila',
    author: 'UPF Philippines',
    date: '2025-02-10',
    image: 'https://picsum.photos/seed/upf-ambassadors-meetup-2025/1024/683',
    tags: ['UPF', 'peace'],
    status: 'active',
    views: 221,
    likes: 25,
    content: `
      <p>Ambassadors for Peace convened in Manila for a compact evening of updates and collaboration. Short reports highlighted community tutoring hubs, interfaith volunteer brigades, and family-strengthening workshops hosted in barangay halls.</p>
      <p>Participants formed working groups to design small but replicable initiatives: a weekend parenting class, a youth peace camp, and a neighborhood “listening walk” where leaders ask residents about their hopes and needs. Each group identified partners, timelines, and simple learning metrics.</p>
      <p>UPF will host a quarterly online huddle to share progress and connect groups across cities. Organizers emphasized that peacebuilding grows where neighbors learn to trust one another and serve together—one street, one school, one project at a time.</p>
    `,
    comments: [],
    slug: 'upf-ambassadors-for-peace-meetup-2025',
  },
  {
    id: '9',
    title: 'Community Service Drive — Relief Goods Distribution',
    author: 'FFWPU Philippines',
    date: '2025-02-08',
    image:
      'https://picsum.photos/seed/community-service-relief-drive-2025/1024/683',
    tags: ['service', 'relief'],
    status: 'active',
    views: 289,
    likes: 31,
    content: `
      <p>Following days of heavy rain, volunteers organized a relief drive for families affected by flooding. Teams assembled packs of rice, canned goods, water, and hygiene items while others coordinated transport and distribution with barangay officials to reach the most affected blocks first.</p>
      <p>Residents shared that simple essentials bring immediate relief, but the greatest comfort is knowing their community has not forgotten them. After the initial delivery, volunteers conducted a quick needs assessment to plan follow-up support such as basic medical checks and counseling for those who lost belongings.</p>
      <p>Organizers aim to repeat the drive next month with an expanded list of partner groups. In the meantime, home groups are collecting gently used clothing and school supplies to help families rebuild routines as quickly as possible.</p>
    `,
    comments: [],
    slug: 'community-service-relief-drive-2025',
  },
]
