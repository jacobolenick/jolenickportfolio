// All site content lives here. Edit this file, then run `node build.mjs`.

// Images are currently loaded from the live site. After running
// `sh scripts/fetch-images.sh`, change this to '/images/' to serve them locally.
export const IMG = 'https://www.jacobolenick.com/images/';

export const site = {
  name: 'Jacob Olenick',
  title: 'Senior Design Systems Designer',
  company: 'General Motors',
  url: 'https://www.jacobolenick.com',
  description:
    'Jacob Olenick is a Senior Design Systems Designer at General Motors, building the systems behind the car experience — from tokens to components to production code.',
  links: [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/jacobmolenick' },
    { label: 'Figma', href: 'https://www.figma.com/@jacobolenick' },
    { label: 'Ko-fi', href: 'https://ko-fi.com/O5O31U1KMI' },
  ],
  // Baseball content channels
  social: [
    { label: 'YouTube', handle: '@jacobtalks-baseball', href: 'https://www.youtube.com/@jacobtalks-baseball' },
    { label: 'X', handle: '@jtalksbaseball', href: 'https://x.com/jtalksbaseball' },
    { label: 'Threads', handle: '@jacobtalksbaseball', href: 'https://www.threads.com/@jacobtalksbaseball' },
    { label: 'Instagram', handle: '@jacobtalksbaseball', href: 'https://www.instagram.com/jacobtalksbaseball' },
    { label: 'TikTok', handle: '@jacobtalksbaseball', href: 'https://www.tiktok.com/@jacobtalksbaseball' },
    { label: 'Facebook', handle: 'Jacob Talks Baseball', href: 'https://www.facebook.com/profile.php?id=61595596657892' },
  ],
};

export const intro = {
  lead: 'I design the systems behind the screens in your car.',
  body: [
    'I’m a Senior Design Systems Designer at General Motors. I turn colors, type and spacing into tokens, tokens into components, and components into the products people actually touch.',
    'I’ve designed for some of the most recognized companies in the world, on projects that have reached over a billion users and billions in revenue. I care about systems that stay clear as they grow.',
  ],
};

// "What I do" — explained as a pipeline.
export const process = [
  {
    n: '01',
    anim: 'tokens',
    title: 'Foundations',
    text: 'Color, type, spacing and elevation become variables and tokens — one source of truth with light and dark modes built in.',
  },
  {
    n: '02',
    anim: 'components',
    title: 'Components',
    text: 'I build Figma libraries for scale: well-structured properties and variants so a small set of components covers a huge range of screens.',
  },
  {
    n: '03',
    anim: 'code',
    title: 'Code',
    text: 'I connect Figma to Claude Code and Cursor through the Figma MCP server to code accurate components — an agentic design system that matches the library.',
  },
  {
    n: '04',
    anim: 'ship',
    title: 'Adoption',
    text: 'Docs, office hours and advocacy. Product teams ship consistent UI faster across phone, web, TV — and now the dashboard.',
  },
];

export const numbers = [
  { value: '1B+', label: 'users reached by products I’ve designed for' },
  { value: '281', label: 'components in one library, across 5 workspaces' },
  { value: '$10M', label: 'funding round supported by a redesign' },
  { value: '8', label: 'free Figma plugins & widgets shipped' },
];

export const stack = [
  'Figma', 'Figma Make', 'Figma MCP Server', 'Claude Code', 'Cursor', 'V0', 'ChatGPT', 'Gemini',
  'Nano Banana', 'Miro', 'Notion', 'Jira', 'Material Design', 'Human Interface Guidelines',
  'Tailwind UI', 'shadcn',
];

export const projects = [
  {
    slug: 'paramount',
    anim: 'tv',
    name: 'Paramount+',
    title: 'Paramount+ Streaming Platform',
    short: 'Streaming platform experience and design system.',
    summary: 'Design system contribution and product design for Top 10, Carousels, Marquees, and Sports.',
    tags: ['Design System', 'Product Design'],
    year: '2022',
    cover: 'work/paramount-streaming-cover.png',
    stats: [
      { value: '7', unit: 'months', label: 'Contributing to the Paramount+ design system and product' },
      { value: '3', unit: 'features owned', label: 'Top 10, Carousels, Marquees — plus Sports on TV and mobile' },
    ],
    role: 'Product Designer & Design Systems Contributor',
    roleItems: [
      'Owned Top 10, Carousels, and Marquees features',
      'Contributed to the Paramount+ design system',
      'Built components and variants for the design system',
      'Helped facilitate design systems office hours',
      'Worked on the main streaming experience',
      'Contributed to Sports experiences on connected TV and mobile',
    ],
    overview:
      'Contributed to both the design system and the main streaming experience at Paramount+ for 7 months. I owned key features including Top 10, Carousels, and Marquees, helped work on the Sports part of the app across TV and mobile, and supported the design systems team through office hours and building out components and variants.',
    sections: [
      {
        h: 'Sports',
        p: 'I also helped work on the Sports part of the Paramount+ app — live and upcoming match browsing, sports hubs on TV, multi-view for concurrent games, and the mobile Sports home with CBS Sports programming and live tiles.',
        images: [
          ['work/paramount/paramount-sports-live-hero-tv.jpg', 'TV Sports home — live hero, hubs, and upcoming matches'],
          ['work/paramount/paramount-sports-champions-league-tv.jpg', 'Champions League hub — featured live matches and lean-back navigation'],
          ['work/paramount/paramount-sports-multiview.webp', 'Multi-view — watch several live matches and pick from On Now'],
          ['work/paramount/paramount-sports-mobile.jpg', 'Mobile Sports — CBS Sports on Paramount+ and live upcoming tiles'],
        ],
      },
      {
        h: 'Top 10',
        p: 'The Top 10 feature highlights the most popular shows on Paramount+ each month, helping users discover trending content with an engaging visual presentation.',
        images: [['work/Frame 427321337.jpg', 'Top 10']],
      },
      {
        h: 'Marquee',
        p: 'The marquee hero section showcases featured content with immersive imagery, show details, and clear calls-to-action for immediate engagement.',
        images: [['work/Frame 427321335.jpg', 'Marquee']],
      },
      {
        h: 'Mobile experience',
        p: 'Designed responsive components that work seamlessly across mobile devices, including sign-up flows, episode details, content recommendations, and brand browsing.',
        images: [['work/axs123.jpg', 'Mobile experience']],
      },
      {
        h: 'Carousels',
        p: 'Content carousels like “Now Featuring” and “Originals” help users browse and discover shows with large, visually appealing cards that showcase key information.',
        images: [['work/Frame 427321336.jpg', 'Carousels']],
      },
      {
        h: 'Experience gallery',
        p: 'Additional TV, detail-page, and mobile explorations — hero marquees, Top 10 rows, hubs, and lean-back layouts.',
        images: [
          ['work/paramount/paramount-01-gladiator-hero.png', 'Home hero — featured title with countdown and primary navigation'],
          ['work/paramount/paramount-02-gladiator-detail.png', 'Title detail — synopsis, cast, and related posters'],
          ['work/paramount/paramount-03-quiet-place-day-one.png', 'Featured marquee with Top 10 Movies in the U.S.'],
        ],
      },
      {
        h: 'Design systems contribution',
        list: [
          'Building reusable components and variants',
          'Helping run design systems office hours for the broader team',
          'Ensuring consistency across the streaming platform',
        ],
      },
    ],
    tools: ['Figma', 'Design Systems', 'Components', 'Variants'],
  },
  {
    slug: 'jacob-talks-baseball',
    anim: 'scoreboard',
    name: 'An MLB website for fans',
    title: 'An MLB website for fans',
    short: 'Trades, scores, teams and highlights in one calm place.',
    summary: 'Jacob Talks Baseball — a fan-first site for trades, scores, teams, news, and highlights in one calm, readable experience.',
    tags: ['Personal Project', 'Product Design'],
    year: '2026',
    cover: 'work/jacob-talks-baseball/cover-moves.png',
    live: 'https://www.jacobtalksbaseball.com/',
    stats: [
      { value: 'Lead', unit: 'role', label: 'Product design and design engineering from concept through build' },
      { value: '5', unit: 'core areas', label: 'Moves, Feed, Scores, Teams, and creator link-in-bio' },
    ],
    role: 'Lead Product Designer & Design Engineer',
    roleItems: [
      'End-to-end product design — IA, flows, components, and responsive layouts',
      'Design and build of Moves, Feed, Scores, Teams, and link-in-bio experiences',
      'Player and news modals with stats, breakdowns, and embedded video',
      'Navigation model with persistent bottom bar and transaction ticker',
    ],
    overview:
      'I designed and built a website for fans to see when trades happen, check scores and highlights, and dig into teams, payroll, and front offices — without the noise of a typical sports portal. It has a live transaction ticker, filterable moves feed, news and video feed, historical scores, and team directories with detail pages. I owned UX, visual design, and implementation.',
    sections: [
      {
        h: 'Moves',
        p: 'Trades, signings, options, and free-agency updates in one scannable feed — with filters by move type, team, and minor-league deals, plus expandable cards for full context and links to reports.',
        images: [['work/jacob-talks-baseball/moves-list.png', 'Moves']],
      },
      {
        h: 'Feed',
        p: 'News, video, and Shorts from MLB and clubs — tabbed filters and a Shorts row for quick highlights alongside full article cards.',
        images: [['work/jacob-talks-baseball/feed.png', 'Feed']],
      },
      {
        h: 'Scores',
        p: 'Final scores grouped by date, team filters, and celebratory moments like championship callouts when a season ends.',
        images: [['work/jacob-talks-baseball/scores.png', 'Scores']],
      },
      {
        h: 'Teams',
        p: 'Every club organized by division, with team pages for payroll, front office, and coaching staff.',
        images: [
          ['work/jacob-talks-baseball/teams-directory.png', 'Teams directory'],
          ['work/jacob-talks-baseball/teams-red-sox.png', 'Team detail'],
        ],
      },
      {
        h: 'Detail modals',
        p: 'Deep dives without leaving the page — trade rumor write-ups, player profiles with career stats, game recaps with line scores and starters, and in-feed video playback.',
        images: [
          ['work/jacob-talks-baseball/trade-rumors-modal.png', 'Trade rumors & transaction detail'],
          ['work/jacob-talks-baseball/player-profile-modal.png', 'Player profile'],
          ['work/jacob-talks-baseball/world-series-recap.jpg', 'Game recap & box score'],
          ['work/jacob-talks-baseball/feed-video-modal.jpg', 'In-feed video'],
        ],
      },
      {
        h: 'Link-in-bio',
        images: [['work/jacob-talks-baseball/link-in-bio.png', 'Creator link-in-bio']],
      },
    ],
    tools: ['Product Design', 'Design Engineering', 'Figma', 'Front-end development'],
  },
  {
    slug: 'c1b',
    anim: 'card',
    name: 'Large credit card company',
    title: 'Design System and Product for a Large Credit Card Company',
    short: 'A Figma/Angular design system for the software that runs the bank.',
    summary: 'I designed the design system and the product for a large credit card company.',
    tags: ['Design System', 'Product Design'],
    year: '2023',
    cover: 'work/c1b-design-system-cover.png',
    stats: [
      { value: '281', unit: 'components', label: 'Kept the count down with variables and properties — saving the team budget on their Figma bill' },
      { value: '5', unit: 'workspaces', label: 'One library serving 5 workspaces across the internal tooling suite' },
    ],
    role: 'Lead Product Designer',
    overview:
      'Led the design and implementation of a comprehensive design system for a major credit card company, establishing design standards and component libraries that improved consistency across all digital products.',
    sections: [
      {
        h: 'Challenge',
        p: 'The bank needed a Figma/Angular design system for the internal suite software that helps run the bank — with clear documentation and great collaboration, so the dev team could implement components, variables, and tokens quickly and other dev teams could build the screens.',
      },
      {
        h: 'User stories',
        list: [
          'We need to follow WCAG AA compliance rules and guidelines to ensure the product is accessible to all.',
          'We need a dynamic customer panel — customer info, customer card + accounts, search + advanced search through filtering, recent history, and pricing strategy. One of the more complex components we’d build.',
        ],
        images: [['work/CUSTOMER PANEL.jpg', 'Customer panel']],
      },
      {
        h: 'Better library performance',
        p: 'Strategically building components with well-structured properties keeps the design system file’s storage down, which keeps the file fast to work in — and saves the team’s budget by avoiding fees for storage limits.',
        images: [['work/figmaprops.png', 'Component properties']],
      },
    ],
    tools: ['Figma', 'Storybook'],
  },
  {
    slug: 'orgspace',
    anim: 'org',
    name: 'Orgspace',
    title: 'Orgspace — Modernizing an Enterprise Platform to Support Growth',
    short: 'Redesigning enterprise workflows for organizational planning.',
    summary: 'Redesigning key workflows, establishing a scalable design system, and delivering a more intuitive enterprise experience for organizational planning.',
    tags: ['Product Design', 'Design System'],
    year: '2025',
    cover: 'work/orgspace-cover.png',
    stats: [
      { value: '3', unit: 'months', label: 'Product design engagement from concept to delivery' },
      { value: '$10M', unit: 'funding round', label: 'The modernized product foundation helped support Orgspace’s funding round' },
    ],
    role: 'Lead Product Designer',
    overview:
      'Orgspace, an enterprise platform for organizational planning and resource allocation, partnered with me to modernize its product experience ahead of its next stage of growth. Over three months, I redesigned key workflows, established the foundation of a scalable design system, and collaborated closely with stakeholders to deliver a more intuitive and cohesive experience.',
    sections: [
      {
        h: 'The challenge',
        p: 'The existing product had become difficult to scale. The interface lacked consistency, workflows were inefficient, and there was no centralized design system to support future development. Orgspace needed a modern experience that improved usability while creating a foundation for faster iteration.',
      },
      {
        h: 'My approach',
        list: [
          'Designed a foundational design system with reusable components, styles, and design standards.',
          'Redesigned several core product screens to simplify complex enterprise workflows.',
          'Worked closely with stakeholders through regular design reviews and iterative feedback sessions.',
          'Maintained clear communication to keep business goals and product decisions aligned.',
        ],
        images: [
          ['work/orgspace/activate.png', 'Activate'],
          ['work/orgspace/create-account.png', 'Create account'],
          ['work/orgspace/allocation.png', 'Allocation'],
          ['work/orgspace/org-chart.png', 'Org chart'],
          ['work/orgspace/upload-csv.png', 'Upload CSV'],
          ['work/orgspace/review-import.png', 'Review import'],
          ['work/orgspace/invite-team.png', 'Invite team'],
          ['work/orgspace/integrations-drawer.png', 'Integrations drawer'],
        ],
      },
      {
        h: 'Results',
        p: 'Orgspace left the engagement with a modernized product foundation that improved consistency, usability, and scalability. The new design system made the design process more efficient, and the redesigned core experiences positioned the product for growth — helping support Orgspace’s $10 million funding round by giving investors and customers confidence in the product vision.',
      },
    ],
    tools: ['Figma', 'Design Systems', 'Product Design', 'UX Design', 'Stakeholder Collaboration'],
  },
  {
    slug: 'crtside',
    anim: 'athlete',
    name: 'Crtside',
    title: 'Crtside',
    short: 'Founding designer for a LinkedIn for athletes. Acquired.',
    summary: 'A LinkedIn for athletes, scouts, and coaches — helping athletes showcase their skills and get into better college programs.',
    tags: ['Product Design', 'Founding Designer'],
    year: '2020',
    cover: 'work/crtside-cover.jpg',
    stats: [
      { value: '1', unit: 'year', label: 'Founding designer, concept to prototype' },
      { value: 'Pre-seed', unit: 'raised', label: 'Design and prototype helped founders land funding' },
      { value: 'Acquired', unit: 'outcome', label: 'Company was later acquired' },
    ],
    role: 'Founding Product Designer',
    roleItems: [
      'Led all product design from concept through prototype',
      'Built the complete UI in Figma — onboarding, profiles, video feed, search, and messaging',
      'Created a component library and design system with brand colors, typography, and reusable patterns',
      'Used Miro for user flows, journey mapping, and workshops with founders',
      'Delivered a working prototype for investor demos and fundraising',
    ],
    overview:
      'Crtside is a professional networking platform for the sports world — a LinkedIn for athletes, scouts, and coaches. Athletes get discovered through video highlights, profiles, and direct connections with coaches and recruiters. I joined as founding designer for about a year, taking the product from early concept to a high-fidelity design and working prototype that helped the founders land pre-seed funding. The company was later acquired.',
    sections: [
      {
        h: 'Design system & components',
        p: 'A dark, athletic visual language with bold accent colors for CTAs, verification badges, and status indicators. The library covered navigation, buttons, inputs, athlete cards, video players, and role-based onboarding.',
        images: [['work/crtside/design-system.png', 'Design system']],
      },
      {
        h: 'Onboarding & authentication',
        p: 'A full sign-up and onboarding flow through account creation, profile setup, and role selection — athlete, fan, coach, scout, or media — balancing data collection with a welcoming, sports-forward experience.',
        images: [['work/crtside/onboarding.png', 'Onboarding']],
      },
      {
        h: 'Core experience',
        p: 'Athletes build rich profiles with stats, highlights, and social proof. Coaches and scouts browse a TikTok-style video feed, search by position and skill, and connect directly with prospects.',
        images: [['work/crtside/app-screens.png', 'App screens']],
      },
      {
        h: 'Impact',
        list: [
          'Design and prototype helped founders secure pre-seed funding',
          'Company was acquired after building traction in athlete recruiting',
          'Established a scalable design foundation the team built on through acquisition',
        ],
      },
    ],
    tools: ['Figma', 'Miro', 'Product Design', 'Prototyping', 'Mobile Design'],
  },
  {
    slug: 'wasai',
    anim: 'generate',
    name: 'Visual App Design System',
    title: 'Visual App Design System',
    short: 'A small-but-mighty system for an AI image generation platform.',
    summary: 'Design system for an AI image and video generation platform.',
    tags: ['Design System'],
    year: '2025',
    cover: 'work/wasai-visual-app-cover.png',
    figma: 'https://www.figma.com/design/dYN1p9AAmqKW8sCEtCljaX/Demo-Design-system?node-id=5201-485&t=1JFO3rbLtwWyR8y0-1',
    stats: [
      { value: '2', unit: 'weeks', label: 'Solo designer' },
      { value: '60+', unit: 'components', label: 'Light and dark themes' },
      { value: '35%', unit: 'faster dev', label: 'Reduction in development time' },
    ],
    role: 'Product Designer',
    roleItems: [
      'Design system creation and component library',
      'Set up variables and tokens',
      'Set up light mode and dark mode',
      'Completed a proper handoff to the development team',
    ],
    overview:
      'Created a design system for an AI-powered image generation platform, focusing on visual consistency and scalability across the application — and keeping it simple for a product that generates images and video.',
    sections: [
      {
        h: 'Solution',
        list: [
          'Visual component library with 60+ components',
          'Dark and light theme support',
          'Responsive grid system for various screen sizes',
          'Animation and interaction patterns',
          'Kept the component library small but mighty',
        ],
      },
      {
        h: 'Color system & variables',
        p: 'Variables and tokens for light and dark mode across web and app, including semantic palettes and color families.',
        images: [
          ['work/wasai-hinted-web.png', 'Hinted (Web) palette'],
          ['work/wasai-monochrome-app.png', 'Monochrome (App) palette'],
          ['work/wasai-green-palette.png', 'Green color family'],
        ],
      },
      {
        h: 'Impact',
        list: [
          'Streamlined design workflow for the team',
          'Saved the company money on extra features and components',
          'Reduced development time by 35%',
          '5-star client review',
        ],
      },
    ],
    tools: ['Figma', 'Tokenizely plugin'],
  },
  {
    slug: 'axs',
    anim: 'seats',
    name: 'AXS Ticketing',
    title: 'AXS Ticketing Platform',
    short: 'Design system buildout and B2B seat-map platform.',
    summary: 'Design system buildout and B2B platform for event ticketing.',
    tags: ['Design System', 'Product Design'],
    year: '2021',
    cover: 'work/axs-4x3.png',
    stats: [
      { value: '6', unit: 'months', label: 'Hired to help get the team over the finish line' },
      { value: '2', unit: 'tools', label: 'Sketch to Figma migration' },
    ],
    role: 'Design Systems Designer',
    roleItems: [
      'Complete the design system buildout',
      'Build color styles and components',
      'Transfer the design system from Sketch to Figma',
      'Close collaboration with developer teams',
      'B2B platform design support',
    ],
    overview:
      'I was hired to help AXS complete the buildout of their design system and B2B platform. Over 6 months, I built out color styles and components in Sketch, then migrated them to Figma — working closely with developers so there were no surprises along the way.',
    sections: [
      {
        h: 'Inventory list view',
        p: 'Inventory management with customizable columns, filtering, and real-time data updates for ticket management.',
        images: [['work/1.0.1 (static) Inventory-List-EditColumns-B2B-Dark-dt@3x.png', 'Inventory list view']],
      },
      {
        h: 'Hybrid view with seat map',
        p: 'An interactive seat map alongside the inventory list, so users can visually select seats and manage pricing, status changes, and bulk actions.',
        images: [['work/3.0.0 (static) Inventory-Hybrid-SeatMap-B2B-Dark-dt@3x.png', 'Hybrid view with seat map']],
      },
      {
        h: 'Developer collaboration',
        p: 'Open communication and clear documentation throughout meant no surprises during implementation, and a design system built to be developer-friendly.',
      },
    ],
    tools: ['Sketch', 'Figma', 'Miro', 'Zeplin'],
  },
  {
    slug: 'publix',
    anim: 'cart',
    name: 'Publix',
    title: 'Publix Design System',
    short: 'Responsive components for web, iPad, Android and iOS.',
    summary: 'Design system and responsive components for web, iPad, Android, and iOS.',
    tags: ['Design System', 'Product Design'],
    year: '2021',
    cover: 'work/publix-design-system-cover.png',
    stats: [
      { value: '4', unit: 'platforms', label: 'Web, iPad, Android, and iOS' },
      { value: '100+', unit: 'components', label: 'Customer-facing components for the design system' },
      { value: '+55%', unit: 'online orders', label: 'After the Catering redesign' },
    ],
    role: 'Design Systems Designer & Product Designer',
    roleItems: [
      'Design system development in Figma',
      'Integration with Publix’s private Figma plugin for data',
      'Responsive components for web, iPad, Android, and iOS',
      'Components for all customer-facing projects',
      'Token and variable system setup',
    ],
    overview:
      'Worked on the Publix design system in Figma, using Publix’s private Figma plugin for real data. I built responsive components across web, iPad, Android, and iOS for every customer-facing project, and set up a robust token and variable system.',
    sections: [
      {
        h: 'Challenge',
        p: 'Publix needed a unified design system that could scale across web, iPad, Android, and iOS while staying consistent across every customer-facing experience — integrated with their proprietary data plugin.',
      },
      {
        h: 'Catering',
        p: 'I redesigned the Catering experience to improve how people choose stores and create orders — reducing wrong-store mistakes and streamlining order creation.',
        images: [
          ['work/catering 3.png', 'Catering'],
          ['work/catering 2.png', 'Catering'],
          ['work/catering 1.png', 'Catering'],
          ['work/catering 4.png', 'Catering'],
          ['work/catering 5.png', 'Catering'],
        ],
      },
      {
        h: 'Impact',
        list: [
          'Increased online orders by 55%',
          'Improved checkout completion rate by 38%',
          'Reduced order time by 30%',
          'Improved customer satisfaction scores',
        ],
      },
    ],
    tools: ['Figma', 'Publix Figma Plugin', 'Design Tokens', 'Variables'],
  },
  {
    slug: 'espressoui',
    anim: 'coffee',
    name: 'Espresso UI',
    title: 'Espresso UI',
    short: 'A free shadcn-based Figma library for founders and freelancers.',
    summary: 'A free Figma design library for SaaS founders, freelancers, and solopreneurs — built on the shadcn framework.',
    tags: ['Design System', 'Personal Project'],
    year: '2026',
    cover: 'work/espresso-ui-light.png',
    live: 'https://espressoui.com/',
    stats: [
      { value: '~2', unit: 'months', label: 'Solo designer' },
      { value: 'shadcn', unit: 'framework', label: 'Handoff-ready SaaS patterns' },
      { value: 'Free', unit: 'for everyone', label: 'Released to the design community' },
    ],
    role: 'Founder & Product Designer',
    roleItems: [
      'Designed and built the full Figma component library',
      'Structured tokens and variables for light and dark mode',
      'Aligned patterns with the shadcn framework for handoff-ready SaaS UI',
      'Shipped the marketing site at espressoui.com',
    ],
    overview:
      'Founders and designers kept asking for a library they could actually use for client and product work — and I needed one for my own projects — so I built Espresso UI, free for the design community. It’s now becoming an agentic design system, translated to code with Claude Code and the Figma MCP alongside students from Design XP.',
    sections: [
      {
        h: 'Challenge',
        p: 'Founders, freelancers, and solopreneurs need polished SaaS UI without rebuilding the same buttons, forms, tables, and dashboards every time. Existing kits were often too heavy, too opinionated, or not aligned with how modern teams ship with shadcn-style systems.',
      },
      {
        h: 'Solution',
        list: [
          'Component collage covering buttons, inputs, modals, tables, charts, and navigation',
          'Light and dark mode coverage for real product surfaces',
          'Patterns tailored to freelancers, solopreneurs, and small teams',
          'Released free so the community can use it on real work',
        ],
        images: [
          ['work/espresso-ui-light.png', 'Light mode'],
          ['work/espresso-ui-dark.png', 'Dark mode'],
        ],
      },
    ],
    tools: ['Figma', 'shadcn', 'Design Systems', 'Variables & Tokens'],
  },
  {
    slug: 'wells-fargo-vantage',
    anim: 'chart',
    name: 'Wells Fargo Vantage',
    title: 'Wells Fargo Vantage',
    short: 'Senior Lead Product Designer on a platform for businesses.',
    summary: 'Senior Lead Product Designer on Vantage — Wells Fargo’s platform for businesses.',
    tags: ['Product Design'],
    year: '2022',
    video: 'work/vantage.mp4',
    role: 'Senior Lead Product Designer',
    overview: 'Designed the Vantage product for Wells Fargo — a digital banking platform for businesses.',
    sections: [],
    tools: ['Figma'],
  },
];

export const experience = [
  { years: '2026 – Present', role: 'Senior Design Systems Designer', org: 'General Motors', text: 'Helping shape the car experience through design systems.', now: true },
  { years: '2026', role: 'Senior Product Designer, Design Systems', org: 'Creative People (placed at Eli Lilly)', text: 'Super IC helping design and build the Lilly Design System across numerous sites and pages.' },
  { years: '2025 – Present', role: 'Founder', org: 'DesignOps Studio', text: 'Plugins, tools, UI kits, and resources for the design community — plus 0 → 1 agentic design systems for startups, from Figma to production with Claude.' },
  { years: '2024 – 2026', role: 'Lead Product Designer, Design Systems Advocate', org: 'CVS Health', text: 'Built the design system for the pharmacist application and designed the pharmacy experience. The bridge between DesignOps and Product Design, advocating for the Rhythm Design System.' },
  { years: '2024 – 2025', role: 'Product Design Consultant', org: 'Adobe', text: '11 months on Adobe Portfolio, plus an integrated experience between Behance and Adobe Portfolio.' },
  { years: '2023 – 2024', role: 'Lead Product Designer & Design Systems', org: 'Credit One Bank', text: 'Led a design system for internal banking software: 281 components using advanced properties and variants, deployed across 5 workspaces.' },
  { years: '2023', role: 'Senior Product Designer (AI)', org: 'Cisco', text: 'Designed an AI dashboard for cyber security.' },
  { years: '2022 – 2023', role: 'Senior Lead Product Designer', org: 'Wells Fargo', text: 'Designed the Vantage product for Wells Fargo.' },
  { years: '2022', role: 'Senior Product Designer', org: 'Paramount+', text: 'Designed the Paramount+ main experience and design system.' },
  { years: '2021 – 2022', role: 'Founding Designer', org: 'Arena Club', text: 'Shaped the product experience from early concept through launch.' },
  { years: '2021', role: 'Product Designer', org: 'AXS', text: 'Designed the design system and B2B (white label) experience.' },
  { years: '2020 – 2021', role: 'Founding Designer', org: 'Crtside', text: 'A LinkedIn for athletes — product design and prototype from concept through pre-seed.' },
  { years: '2019 – 2020', role: 'Founding Product Designer', org: 'Adapt', text: 'Shaped the product from early concept through launch.' },
  { years: '2018 – 2019', role: 'Product Designer', org: 'Apartments 24/7', text: 'Apartment listings and rental platform.' },
];

export const plugins = [
  { name: 'Colorize It', anim: 'p-color', text: 'Color variables from popular UI libraries in one click.', href: 'https://www.figma.com/community/plugin/1602001831211544731/colorize-it' },
  { name: 'Textorize It', anim: 'p-type', text: 'Quickly create type variables and styles.', href: 'https://www.figma.com/community/plugin/1602160860505052540/textorize-it' },
  { name: 'Shadow It', anim: 'p-shadow', text: 'Elevations as styles, based on popular UI libraries.', href: 'https://www.figma.com/community/plugin/1602118052371791185/shadow-it' },
  { name: 'Tokenizely', anim: 'p-token', text: 'Name smart tokens for variables and components.', href: 'https://www.figma.com/community/plugin/1571390740428803255/tokenizely' },
  { name: 'Page-Generator', anim: 'p-pages', text: 'Generate every page a design systems project needs.', href: 'https://www.figma.com/community/plugin/1571424922828284135/page-generator' },
  { name: 'DS Checklist', anim: 'p-check', text: 'A to-do list for design systems projects.', href: 'https://www.figma.com/community/plugin/1571428612071462125/ds-checklist' },
  { name: 'Design Tasks', anim: 'p-timer', text: 'Create tasks, set a date, or run a pomodoro timer.', href: 'https://www.figma.com/community/plugin/1601803893584695089/design-tasks' },
  { name: 'UpVote', anim: 'p-vote', text: 'Widget: your team votes on iterations next to each screen.', href: 'https://www.figma.com/community/widget/1603115958169044986/upvote' },
];

export const notes = [
  {
    slug: 'ultimate-baseball-website-for-fans', date: 'Nov 11, 2026',
    title: 'I built the ultimate baseball website for fans.',
    body: [
      'I played from tee-ball through high school, and baseball has stayed at the center of my life. When the offseason started and a lockout started to loom, I wanted one calm place where fans could catch up, relive last season, and follow where players are signing or getting traded.',
      'That’s Jacob Talks Baseball — Moves tracks trades, signings, options, and free-agent deals in a clear timeline; Feed brings in news and highlights; Scores and Teams round it out.',
    ],
    link: { label: 'Read the case study', href: '/projects/jacob-talks-baseball/' },
  },
  {
    slug: 'great-first-week-lilly-creative-people', date: 'Apr 23, 2026',
    title: 'Great first week at my new gig with Lilly through Creative People.',
    body: [
      'I started my new gig this Wednesday with Eli Lilly through Creative People. I’m so impressed with the team already and feel thankful I took this offer over others.',
      'I’m excited to be designing the Lilly Design System and to contribute to the look and feel of Lilly sites and products. Week 1 down and many more to go.',
    ],
  },
  {
    slug: 'espresso-ui-agentic-design-system', date: 'Apr 6, 2026',
    title: 'I’m building a free product: an agentic design system called Espresso UI.',
    body: [
      'Why build this for free? I want to give back and build my brand. It’s been a dream of mine since 2020 — my pal Joey Banks inspired me. Now I’m working on it with a few students from Design XP, which gives students real-world experience.',
      'We’re building it from scratch in Figma and using Claude Code and the Figma MCP to translate it into an agentic design system.',
    ],
    link: { label: 'espressoui.com', href: 'https://espressoui.com/' },
  },
  {
    slug: 'design-systems-studio', date: 'Apr 4, 2026',
    title: 'I’m starting something new.',
    body: [
      'A first-of-its-kind Design Systems Studio: 0 → 1 design systems for startups.',
      'We start in Figma, then implement a production-ready agentic design system using Claude — so anyone on your team can ship production-ready UI with your company’s own design system.',
    ],
  },
  {
    slug: 'lilly-design-system-role', date: 'Apr 2, 2026',
    title: 'I’m stepping into a new design system role at Lilly.',
    body: [
      'After a year and a half at CVS Health working on the Rhythm Design System and the pharmacy software, I’m stepping into a new season as a Super IC, Senior Product Designer building and maintaining the Lilly Design System through Creative People.',
      'Excited for this next chapter and to keep working in healthcare tech.',
    ],
  },
  {
    slug: 'design-systems-advocate', date: 'Feb 12, 2026',
    title: 'I’ve stepped into a new role as a Design Systems Advocate.',
    body: [
      'I’m the bridge between our product designers and our design system — on the Product Design team and back on the Design Systems team.',
      'I’ll be advocating for the Rhythm Design System and making sure it’s used properly, while still designing screens and UX flows.',
    ],
  },
  {
    slug: 'colorize-it', date: 'Feb 12, 2026',
    title: 'I built a Figma plugin that creates variables in a second from top UI libraries.',
    body: [
      'I couldn’t find a plugin that did exactly what I needed to save time on design system builds. So I built Colorize It.',
      'Pick from popular UI libraries like Tailwind, shadcn, and Bootstrap, and with one click the previewed colors land in your variables table — with dark mode variables created automatically.',
    ],
    link: { label: 'Try Colorize It', href: 'https://www.figma.com/community/plugin/1602001831211544731/colorize-it' },
  },
  {
    slug: 'figma-make-components', date: 'Feb 11, 2026',
    title: 'Building Figma Make components for others.',
    body: [
      'I’ve been turning components from Espresso UI into components others can use in Figma Make, and publishing them on my Figma Community page for remixing — including interactive ones like a location map designers can drop into their sites.',
      'I feel Make is the future of design systems. Many teams, including my own, have design systems designers using AI — Make, V0, and Cursor.',
    ],
    link: { label: 'Figma Community', href: 'https://www.figma.com/@jacobolenick' },
  },
  {
    slug: 'free-ui-kit', date: 'Feb 11, 2026',
    title: 'I got better as a design systems designer when I built a free UI kit.',
    body: [
      'I really became an expert in Figma once I started designing and building my own UI kits in my free time — pushing the limits of the tool without guardrails.',
      'It made me better at work, and better at teaching my product design team how to use our components and build screens with precision.',
    ],
  },
  {
    slug: 'scalable-design-systems', date: 'Nov 15, 2025',
    title: 'Building scalable design systems.',
    body: [
      'A design system that scales takes thoughtful planning and a deep understanding of your organization’s needs. It’s not just components — it’s a living ecosystem that evolves with your product.',
      'Start small and iterate. Focus on the most commonly used components and patterns first, then expand as you learn how teams actually use the system.',
    ],
  },
];

export const about = {
  photo: 'hero-portrait.jpg',
  body: [
    'I’m a Senior Design Systems Designer at General Motors and a seasoned super IC with a track record of shipping products from 0 → 1 and modernizing legacy experiences.',
    'I’ve designed for some of the most recognized companies in the world, on projects that have reached over a billion users and generated billions in revenue.',
    'When I’m not designing, you’ll find me watching baseball — on TV or at a live game. Outside of the game I love building, whether that’s digital products, Figma plugins, or experimenting with interior design. I’m also a husband and a proud dog (and cat) dad to a golden doodle and a tuxedo cat.',
  ],
  // Pixel caps: c1 = crown, c2 = letters/stripes, brim = brim color
  teams: [
    { name: 'Athletics', letters: 'A', c1: '#003831', c2: '#efb21e', brim: '#efb21e' },
    { name: 'Las Vegas Aviators', letters: 'LV', c1: '#0b2341', c2: '#c4a24c', brim: '#0b2341' },
    { name: 'USA Baseball', letters: 'US', c1: '#0a2a66', c2: '#ffffff', brim: '#bf0d3e' },
    { name: 'Hanshin Tigers', letters: 'HT', c1: '#151515', c2: '#ffe201', brim: '#ffe201' },
  ],
  // Pixel jerseys: body, number color, trim; pin = pinstripes
  players: [
    { name: 'Derek Jeter', team: 'Yankees', num: 2, body: '#ffffff', numc: '#0c2340', trim: '#0c2340', pin: '#9aa6bf' },
    { name: 'Omar Vizquel', team: 'Cleveland', num: 13, body: '#ffffff', numc: '#0c2340', trim: '#e31937' },
    { name: 'Pete Crow-Armstrong', team: 'Cubs', num: 4, body: '#ffffff', numc: '#0e3386', trim: '#cc3433', pin: '#9fb0dc' },
    { name: 'Aaron Judge', team: 'Yankees', num: 99, body: '#ffffff', numc: '#0c2340', trim: '#0c2340', pin: '#9aa6bf' },
    { name: 'Nick Kurtz', team: 'Athletics', num: 16, body: '#003831', numc: '#efb21e', trim: '#efb21e' },
    { name: 'Shohei Ohtani', team: 'Dodgers', num: 17, body: '#ffffff', numc: '#ef3e42', trim: '#005a9c' },
    { name: 'Mookie Betts', team: 'Dodgers', num: 50, body: '#ffffff', numc: '#ef3e42', trim: '#005a9c' },
    { name: 'Manny Ramirez', team: 'Red Sox', num: 24, body: '#ffffff', numc: '#bd3039', trim: '#0c2340' },
  ],
};
