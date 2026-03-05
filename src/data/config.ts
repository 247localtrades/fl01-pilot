// ============================================================
// 247 Local Trades — Centralized Brand Config (D-STACK-01)
// Single source of truth for all brand elements.
// Change here → npm run build → all pages update.
// ============================================================

export const brand = {
  name: "247 Local Trades",
  tagline: "We've got your neighborhood covered.",
  legalName: "247LocalTrades LLC",
  domain: "247localtrades.com",
  year: 2026,

  email: {
    info:    "info@247localtrades.com",
    service: "service@247localtrades.com",
    vendor:  "vendors@247localtrades.com",
  },

  phone: {
    hvac:        "(850) 403-9797",
    plumbing:   "(850) 403-9798",
    electrical: "(850) 403-9799",
    roofing:    "(850) 403-9800",
    hvac_raw:        "8504039797",
    plumbing_raw:    "8504039798",
    electrical_raw:  "8504039799",
    roofing_raw:     "8504039800",
  },

  logo: {
    full:    "/assets/247_Local_Trades_logo.svg",
    icon:    "/assets/247_Local_Trades_icon.svg",
    badge:   "/assets/247_Local_Trades_badge.svg",
    fullPng: "/assets/247_Local_Trades_logo.png",
    iconPng: "/assets/247_Local_Trades_icon.png",
  },

  certified: {
    headline: "The 247 Certified Difference",
    pillars: [
      {
        id:    "live-answering",
        icon:  "📞",
        title: "24/7 Live Answering",
        text:  "Live calls answered around the clock. On rare occasions, brief holds or fast call-backs may occur.",
      },
      {
        id:    "certified",
        icon:  "✅",
        title: "247 Local Trades Certified",
        text:  "Contractors approved to receive jobs through our platform and monitored for responsiveness, professionalism, and customer feedback.",
      },
      {
        id:    "graded",
        icon:  "📋",
        title: "Every Job Gets Graded",
        text:  "We score each job using performance KPIs. Customer feedback is included when available.",
      },
      {
        id:    "routed",
        icon:  "📍",
        title: "Routed Right",
        text:  "We match your request to the right local pro based on location, availability, and job type.",
      },
    ],
    disclaimer: "Routing and grading use available data and may vary based on job details and real-time availability.",
  },

  utilityBar: [
    "Licensed & Insured",
    "Background Checked",
    "24/7 Availability",
  ],

  cta: {
    form:  "📋 Request Service",
    phone: "📞 Call Live Agent",
    text:  "💬 Text Us",
  },

  social: {
    linkedin:  "https://linkedin.com/company/247localtrades",
    youtube:   "https://youtube.com/@247localtrades",
  },

  trades: [
    { id: "hvac",       label: "HVAC",        icon: "❄️",  phone: "(850) 403-9797" },
    { id: "plumbing",   label: "Plumbing",    icon: "🔧",  phone: "(850) 403-9798" },
    { id: "electrical", label: "Electrical",  icon: "⚡",  phone: "(850) 403-9799" },
    { id: "roofing",    label: "Roofing",     icon: "🏠",  phone: "(850) 403-9800" },
  ],

  markets: {
    fl01: {
      id:      "fl01",
      label:   "Northwest Florida",
      state:   "florida",
      cities:  ["gulf-breeze", "pensacola", "pace", "navarre", "milton"],
      anchor:  "gulf-breeze",
    },
  },

  schema: {
    type:        "Organization",
    name:        "247 Local Trades",
    url:         "https://247localtrades.com",
    logo:        "https://247localtrades.com/assets/247_Local_Trades_logo.png",
    description: "Exclusive home service leads for pre-verified HVAC, plumbing, electrical, and roofing contractors in Northwest Florida.",
    areaServed:  "Northwest Florida",
    telephone:   "+18504039797",
    founder: { type: "Person", name: "Justin Sonntag" },
  },
} as const;

export type Trade = typeof brand.trades[number];
export type Market = typeof brand.markets[keyof typeof brand.markets];
