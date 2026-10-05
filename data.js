const BRANDDECK_DATA = {
  // AI Base Multipliers for 2026 Creator Economy
  nicheMultipliers: {
    tech: 1.5, finance: 2.0, lifestyle: 1.0, gaming: 0.8, education: 1.3, fitness: 1.2
  },
  
  // Mock Pipeline Data (To make the CRM look active immediately)
  deals: [
    { id: "d1", brand: "TechFlow VPN", value: "$4,500", stage: "prospecting", logo: "fa-shield-halved", deliverables: ["1 Dedicated Video"] },
    { id: "d2", brand: "SkillMaster", value: "$2,200", stage: "pitched", logo: "fa-graduation-cap", deliverables: ["60s Integration", "1 IG Story"] },
    { id: "d3", brand: "Lumina Desk", value: "$8,000", stage: "negotiating", logo: "fa-desktop", deliverables: ["Dedicated Video", "Shorts Package"] },
    { id: "d4", brand: "CryptoX", value: "$12,000", stage: "closed", logo: "fa-bitcoin", deliverables: ["3x Integrations"] }
  ],

  // Ready-to-use Email Templates
  templates: [
    {
      title: "Cold Pitch to Brand",
      content: "Hi [Brand Name] Team,\n\nI’ve been using [Product] for months and my audience of [Sub Count] tech enthusiasts would love it. I'd love to discuss integrating you into my next video. Are you currently running YouTube campaigns?\n\nBest,\n[My Name]"
    },
    {
      title: "Inbound Rate Response",
      content: "Thanks for reaching out! I'd love to partner. Based on my current 30-day average of [Avg Views] views and [Eng Rate]% engagement, my rate for a 60-second integration is $[Rate]. \n\nLet me know if this aligns with your budget."
    }
  ]
};