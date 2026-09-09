export type SiteContentFieldType = "text" | "textarea" | "list";

export type SiteContentField = {
  key: string;
  section: string;
  label: string;
  type: SiteContentFieldType;
  defaultValue: string;
};

export type SiteContentMap = Record<string, string>;

export const SITE_CONTENT_FIELDS: SiteContentField[] = [
  // Header / Footer
  {
    key: "seo.title",
    section: "Search / Google",
    label: "Google title",
    type: "text",
    defaultValue: "New Creation Living — Structured Housing on Fixed Income",
  },
  {
    key: "seo.description",
    section: "Search / Google",
    label: "Google description",
    type: "textarea",
    defaultValue:
      "New Creation Living provides all-inclusive homes for independent adults on fixed incomes. We also help individuals access and obtain government benefits and resources they may qualify for. Our goal is to provide safe, supportive housing and help individuals build greater stability and independence.",
  },
  {
    key: "brand.tagline",
    section: "Brand",
    label: "Tagline under the logo",
    type: "text",
    defaultValue: "From Benefits to Belonging",
  },
  {
    key: "footer.blurb",
    section: "Footer",
    label: "Footer description",
    type: "textarea",
    defaultValue:
      "Structured independent living for adults on fixed government income across Metro Atlanta & middle Georgia.",
  },
  {
    key: "footer.contact_phone",
    section: "Footer",
    label: "Contact phone",
    type: "text",
    defaultValue: "(404) 731-2371",
  },
  {
    key: "footer.contact_email",
    section: "Footer",
    label: "Contact email",
    type: "text",
    defaultValue: "SUPPORT@NEWCREATIONLIVING.ORG",
  },
  {
    key: "footer.contact_area",
    section: "Footer",
    label: "Contact area",
    type: "text",
    defaultValue: "Atlanta & Middle Georgia",
  },
  {
    key: "footer.disclaimer",
    section: "Footer",
    label: "Footer disclaimer",
    type: "text",
    defaultValue: "Structured Independent Living. Not a licensed personal care home.",
  },

  // Home hero
  {
    key: "home.hero.tag",
    section: "Home — Hero",
    label: "Hero badge",
    type: "text",
    defaultValue: "A Trusted Structured Independent Living Provider",
  },
  {
    key: "home.hero.headline",
    section: "Home — Hero",
    label: "Hero headline",
    type: "text",
    defaultValue: "New Creation Living",
  },
  {
    key: "home.hero.lead",
    section: "Home — Hero",
    label: "Hero lead line",
    type: "textarea",
    defaultValue: "An All-Inclusive Home for Independent Adults on Fixed Income",
  },
  {
    key: "home.hero.locations",
    section: "Home — Hero",
    label: "Hero locations line",
    type: "text",
    defaultValue: "Locations Available in Atlanta & Middle GA",
  },
  {
    key: "home.hero.cta_residency",
    section: "Home — Hero",
    label: "Primary button",
    type: "text",
    defaultValue: "Residency",
  },
  {
    key: "home.hero.cta_tour",
    section: "Home — Hero",
    label: "Secondary button",
    type: "text",
    defaultValue: "Schedule a Tour",
  },
  {
    key: "home.cost.title",
    section: "Home — Cost card",
    label: "Cost card title",
    type: "text",
    defaultValue: "All-Inclusive Living",
  },
  {
    key: "home.cost.items",
    section: "Home — Cost card",
    label: "Included items (one per line)",
    type: "list",
    defaultValue: [
      "Furnished Room",
      "Water, Gas & Electricity",
      "Wifi",
      "Laundry",
      "High End Finishes & High Standard of Living",
      "Sober & Drug Free Environment",
      "Access to Public Transportation",
      "Community Support",
      "On Site Management",
    ].join("\n"),
  },
  {
    key: "home.cost.price",
    section: "Home — Cost card",
    label: "Price amount",
    type: "text",
    defaultValue: "$25",
  },
  {
    key: "home.cost.period",
    section: "Home — Cost card",
    label: "Price period",
    type: "text",
    defaultValue: "/day",
  },
  {
    key: "home.cost.note",
    section: "Home — Cost card",
    label: "Price note",
    type: "text",
    defaultValue: "(Everything included at no cost. No hidden deposits/fees)",
  },

  // Philosophy
  {
    key: "home.philosophy.eyebrow",
    section: "Home — Philosophy",
    label: "Eyebrow",
    type: "text",
    defaultValue: "Our Philosophy",
  },
  {
    key: "home.philosophy.title",
    section: "Home — Philosophy",
    label: "Headline",
    type: "textarea",
    defaultValue: "Independence forged through structure and accountability",
  },
  {
    key: "home.philosophy.lead",
    section: "Home — Philosophy",
    label: "Lead paragraph",
    type: "textarea",
    defaultValue: "We build our homes around structure and support to secure your peace of mind.",
  },
  {
    key: "home.philosophy.pillar1_title",
    section: "Home — Philosophy",
    label: "Pillar 1 title",
    type: "text",
    defaultValue: "Move in within 48 hours",
  },
  {
    key: "home.philosophy.pillar1_body",
    section: "Home — Philosophy",
    label: "Pillar 1 body",
    type: "textarea",
    defaultValue:
      "No long waitlists. Once your application clears, you have keys. You are officially one of us!",
  },
  {
    key: "home.philosophy.pillar2_title",
    section: "Home — Philosophy",
    label: "Pillar 2 title",
    type: "text",
    defaultValue: "A Home, not just a House",
  },
  {
    key: "home.philosophy.pillar2_body",
    section: "Home — Philosophy",
    label: "Pillar 2 body",
    type: "textarea",
    defaultValue:
      "New Creation Living provides a community for all residents through community collaboration, events and support.",
  },
  {
    key: "home.philosophy.badge",
    section: "Home — Philosophy",
    label: "Image badge",
    type: "text",
    defaultValue: "Premium Living",
  },
  {
    key: "home.serve.title",
    section: "Home — Who we serve",
    label: "Headline",
    type: "text",
    defaultValue: "Who we are built for",
  },
  {
    key: "home.serve.body",
    section: "Home — Who we serve",
    label: "Paragraph",
    type: "textarea",
    defaultValue:
      "Independent adults who receive fixed government benefits and need stable, structured housing.",
  },
  {
    key: "home.serve.recipients",
    section: "Home — Who we serve",
    label: "Recipient cards (one per line)",
    type: "list",
    defaultValue: [
      "SSI RECIPIENTS",
      "SSDI RECIPIENTS",
      "VA PENSION & DISABILITY RECIPIENTS",
      "SOCIAL SECURITY RETIREMENT RECIPIENTS",
    ].join("\n"),
  },
  {
    key: "home.partners.title",
    section: "Home — Partners",
    label: "Headline",
    type: "text",
    defaultValue: "Who We Partner With",
  },
  {
    key: "home.partners.body",
    section: "Home — Partners",
    label: "Paragraph",
    type: "textarea",
    defaultValue:
      "We collaborate closely with healthcare professionals, advocates, and families to coordinate placements and support.",
  },
  {
    key: "home.partners.row1",
    section: "Home — Partners",
    label: "Partner row 1 (one per line)",
    type: "list",
    defaultValue: [
      "SOCIAL WORKERS & CASE MANAGERS",
      "REHABILITATION HOSPITALS & EMERGENCY DEPARTMENTS",
      "BEHAVIORAL HEALTH ORGANIZATIONS",
      "SUBSTANCE USE TREATMENT CENTERS",
      "SKILLED NURSING FACILITIES",
      "VETERAN HOUSING, SHELTERS & HOSPITALS",
      "FAMILY MEMBERS/FRIENDS",
    ].join("\n"),
  },
  {
    key: "home.partners.row2",
    section: "Home — Partners",
    label: "Partner row 2 (one per line)",
    type: "list",
    defaultValue: [
      "COUNSELORS",
      "SENIOR CENTERS & AREA AGENCIES ON AGING",
      "NON PROFIT ORGANIZATIONS AND MORE",
      "DETOX & OUTPATIENT PROGRAMS",
      "FAITH COMMUNITIES & CHURCHES",
      "PRIMARY CARE CLINICS",
    ].join("\n"),
  },

  // About
  {
    key: "about.eyebrow",
    section: "About",
    label: "Eyebrow",
    type: "text",
    defaultValue: "About Us",
  },
  {
    key: "about.title",
    section: "About",
    label: "Headline",
    type: "text",
    defaultValue: "What we do",
  },
  {
    key: "about.body",
    section: "About",
    label: "About paragraph",
    type: "textarea",
    defaultValue:
      'New Creation Living is a Structured Independent Living Housing Provider. Not a shelter, not a Personal Care Home. We give adults on fixed government income a safe, stable, affordable place to live while shattering traditional "low-quality" housing assumptions, proving that a fixed income doesn\'t have to mean compromising on quality or dignity.',
  },
  {
    key: "about.structure_title",
    section: "About",
    label: "Structure card title",
    type: "text",
    defaultValue: "Structure",
  },
  {
    key: "about.structure_body",
    section: "About",
    label: "Structure card body",
    type: "textarea",
    defaultValue:
      "A House Manager on-site, a daily rhythm, and a community of people who want the same thing: Safety, Stability, Structure with a high standard of living",
  },
  {
    key: "about.how.eyebrow",
    section: "About — How it works",
    label: "Eyebrow",
    type: "text",
    defaultValue: "How It Works",
  },
  {
    key: "about.how.title",
    section: "About — How it works",
    label: "Headline",
    type: "text",
    defaultValue: "From First Call to Move-In",
  },
  {
    key: "about.step1_title",
    section: "About — How it works",
    label: "Step 1 title",
    type: "text",
    defaultValue: "Apply",
  },
  {
    key: "about.step1_body",
    section: "About — How it works",
    label: "Step 1 body",
    type: "textarea",
    defaultValue:
      "A short application: Click the link below, give us a call, or get help from a case worker or a family member.",
  },
  {
    key: "about.step1_cta",
    section: "About — How it works",
    label: "Step 1 button",
    type: "text",
    defaultValue: "Apply now",
  },
  {
    key: "about.step2_title",
    section: "About — How it works",
    label: "Step 2 title",
    type: "text",
    defaultValue: "We Review",
  },
  {
    key: "about.step2_body",
    section: "About — How it works",
    label: "Step 2 body",
    type: "textarea",
    defaultValue:
      "We confirm benefit eligibility and run a standard background check within 24 to 48 hours.",
  },
  {
    key: "about.step3_title",
    section: "About — How it works",
    label: "Step 3 title",
    type: "text",
    defaultValue: "We Connect",
  },
  {
    key: "about.step3_body",
    section: "About — How it works",
    label: "Step 3 body",
    type: "textarea",
    defaultValue:
      "Approved applicants are matched to an available room based on location and needs.",
  },
  {
    key: "about.step4_title",
    section: "About — How it works",
    label: "Step 4 title",
    type: "text",
    defaultValue: "Move In",
  },
  {
    key: "about.step4_body",
    section: "About — How it works",
    label: "Step 4 body",
    type: "textarea",
    defaultValue:
      "Usually within 48 hours of approval. Onboarding covers house rules, your room, and your community.",
  },

  // Life
  {
    key: "life.eyebrow",
    section: "Life at NCL",
    label: "Eyebrow",
    type: "text",
    defaultValue: "Life at NCL",
  },
  {
    key: "life.title",
    section: "Life at NCL",
    label: "Headline",
    type: "text",
    defaultValue: "The NCL Mindset",
  },
  {
    key: "life.body",
    section: "Life at NCL",
    label: "Intro paragraph",
    type: "textarea",
    defaultValue:
      "New Creation Living isn't just a home. It's a system built around one simple idea: when you show up for yourself, you earn something back. Through our unique rewards program, your everyday consistency turns into real gift cards, rent credits, birthday celebrations, and a safe, supportive community that gets better the longer you stay.",
  },
  {
    key: "life.cta",
    section: "Life at NCL",
    label: "Button",
    type: "text",
    defaultValue: "Apply for residency",
  },
  {
    key: "life.rewards_title",
    section: "Life at NCL",
    label: "Rewards card title",
    type: "text",
    defaultValue: "Rewards Program",
  },
  {
    key: "life.rewards_body",
    section: "Life at NCL",
    label: "Rewards card body",
    type: "textarea",
    defaultValue: "Show up for yourself — and earn something real back.",
  },
  {
    key: "life.rewards_items",
    section: "Life at NCL",
    label: "Rewards items (one per line)",
    type: "list",
    defaultValue: ["Gift cards & rent credits", "Birthday celebrations", "Stronger community"].join(
      "\n"
    ),
  },
  {
    key: "life.culture.eyebrow",
    section: "Life at NCL — Culture",
    label: "Eyebrow",
    type: "text",
    defaultValue: "The Culture",
  },
  {
    key: "life.culture.title",
    section: "Life at NCL — Culture",
    label: "Headline",
    type: "text",
    defaultValue: "This is what living here feels like",
  },
  {
    key: "life.culture.lead",
    section: "Life at NCL — Culture",
    label: "Lead line",
    type: "text",
    defaultValue: "Community isn't a slogan. It's a schedule.",
  },
  {
    key: "life.card1.tag",
    section: "Life at NCL — Culture",
    label: "Card 1 tag",
    type: "text",
    defaultValue: "Every Saturday · 7 PM",
  },
  {
    key: "life.card1.title",
    section: "Life at NCL — Culture",
    label: "Card 1 title",
    type: "text",
    defaultValue: "Game Night",
  },
  {
    key: "life.card1.body",
    section: "Life at NCL — Culture",
    label: "Card 1 body",
    type: "textarea",
    defaultValue: "Cards, board games, laughter. The common area fills up. You show up as you are.",
  },
  {
    key: "life.card2.tag",
    section: "Life at NCL — Culture",
    label: "Card 2 tag",
    type: "text",
    defaultValue: "Last Saturday · Monthly",
  },
  {
    key: "life.card2.title",
    section: "Life at NCL — Culture",
    label: "Card 2 title",
    type: "text",
    defaultValue: "House Cookout",
  },
  {
    key: "life.card2.body",
    section: "Life at NCL — Culture",
    label: "Card 2 body",
    type: "textarea",
    defaultValue:
      "Every last Saturday of the month, the whole house eats together. Food and drinks provided. Residents only: this table is yours.",
  },
  {
    key: "life.card3.tag",
    section: "Life at NCL — Culture",
    label: "Card 3 tag",
    type: "text",
    defaultValue: "Twice a Year",
  },
  {
    key: "life.card3.title",
    section: "Life at NCL — Culture",
    label: "Card 3 title",
    type: "text",
    defaultValue: "The Big Event",
  },
  {
    key: "life.card3.body",
    section: "Life at NCL — Culture",
    label: "Card 3 body",
    type: "textarea",
    defaultValue:
      "An outdoor gathering with food, games, raffles, and partners from across the community. Free for every resident. Points unlock extras: bring a family member, earn VIP seating, get raffle tickets for real prizes.",
  },

  // Residency
  {
    key: "residency.eyebrow",
    section: "Residency",
    label: "Eyebrow",
    type: "text",
    defaultValue: "Apply or Refer",
  },
  {
    key: "residency.title",
    section: "Residency",
    label: "Headline",
    type: "text",
    defaultValue: "Residency",
  },
  {
    key: "residency.body",
    section: "Residency",
    label: "Intro paragraph",
    type: "textarea",
    defaultValue:
      "Choose how you'd like to get started. We'll walk you through a short guided application — typically a few minutes — and follow up within a few hours.",
  },
  {
    key: "residency.tour.eyebrow",
    section: "Residency — Tour",
    label: "Eyebrow",
    type: "text",
    defaultValue: "Schedule a Tour",
  },
  {
    key: "residency.tour.title",
    section: "Residency — Tour",
    label: "Headline",
    type: "text",
    defaultValue: "Schedule a Tour of Our Locations",
  },
  {
    key: "residency.tour.body",
    section: "Residency — Tour",
    label: "Paragraph",
    type: "textarea",
    defaultValue:
      "Experience New Creation Living firsthand! Come visit our beautiful, fully-furnished homes in Metro Atlanta & Middle Georgia before or during your application process.",
  },
  {
    key: "residency.tour.call_cta",
    section: "Residency — Tour",
    label: "Call button",
    type: "text",
    defaultValue: "Call (404) 731-2371",
  },
  {
    key: "residency.tour.schedule_cta",
    section: "Residency — Tour",
    label: "Schedule button",
    type: "text",
    defaultValue: "Schedule a Tour Now",
  },
  {
    key: "residency.after.title",
    section: "Residency — Info cards",
    label: "After-submit title",
    type: "text",
    defaultValue: "What happens after you submit",
  },
  {
    key: "residency.after.items",
    section: "Residency — Info cards",
    label: "After-submit bullets (one per line)",
    type: "list",
    defaultValue: [
      "We review the application or referral and confirm benefit type and eligibility",
      "We contact you or the individual directly, usually within a few hours",
      "If it's a fit, we can place most people within 24 to 48 hours",
      "You'll get a direct line to our team for follow-up",
    ].join("\n"),
  },
  {
    key: "residency.accept.title",
    section: "Residency — Info cards",
    label: "Who we accept title",
    type: "text",
    defaultValue: "Who we accept",
  },
  {
    key: "residency.accept.items",
    section: "Residency — Info cards",
    label: "Who we accept bullets (one per line)",
    type: "list",
    defaultValue: [
      "Adults on SSI, SSDI, VA Pension, VA Disability, or Social Security",
      "Patients being discharged from acute care, rehab, or skilled nursing",
      "Veterans transitioning from VA housing programs",
      "Anyone on fixed income!",
    ].join("\n"),
  },
  {
    key: "residency.apply.eyebrow",
    section: "Residency — Paths",
    label: "Apply card eyebrow",
    type: "text",
    defaultValue: "For You",
  },
  {
    key: "residency.apply.title",
    section: "Residency — Paths",
    label: "Apply card title",
    type: "text",
    defaultValue: "Applying for myself",
  },
  {
    key: "residency.apply.body",
    section: "Residency — Paths",
    label: "Apply card body",
    type: "textarea",
    defaultValue:
      "Start a guided application for your own residency. We'll ask about your situation, benefits, and readiness step by step.",
  },
  {
    key: "residency.apply.cta",
    section: "Residency — Paths",
    label: "Apply card button",
    type: "text",
    defaultValue: "Start application →",
  },
  {
    key: "residency.refer.eyebrow",
    section: "Residency — Paths",
    label: "Referral card eyebrow",
    type: "text",
    defaultValue: "For Professionals & Families",
  },
  {
    key: "residency.refer.title",
    section: "Residency — Paths",
    label: "Referral card title",
    type: "text",
    defaultValue: "Referral",
  },
  {
    key: "residency.refer.body",
    section: "Residency — Paths",
    label: "Referral card body",
    type: "textarea",
    defaultValue:
      "Refer someone else for placement. Walk through their eligibility and situation in a short guided flow.",
  },
  {
    key: "residency.refer.cta",
    section: "Residency — Paths",
    label: "Referral card button",
    type: "text",
    defaultValue: "Start referral →",
  },
  {
    key: "residency.call.title",
    section: "Residency — Call card",
    label: "Call card title",
    type: "text",
    defaultValue: "Prefer to call?",
  },

  // Benefits
  {
    key: "benefits.eyebrow",
    section: "Benefits",
    label: "Eyebrow",
    type: "text",
    defaultValue: "Free Eligibility Screening",
  },
  {
    key: "benefits.title",
    section: "Benefits",
    label: "Headline",
    type: "text",
    defaultValue: "We Help You Navigate Benefits",
  },
  {
    key: "benefits.body",
    section: "Benefits",
    label: "Intro paragraph",
    type: "textarea",
    defaultValue:
      "Evaluate your eligibility for SSI, SSDI, or VA Pension at no cost. We identify the strongest path to approval for your specific situation.",
  },
  {
    key: "benefits.cta.eyebrow",
    section: "Benefits",
    label: "CTA card eyebrow",
    type: "text",
    defaultValue: "Start Here",
  },
  {
    key: "benefits.cta.title",
    section: "Benefits",
    label: "CTA card title",
    type: "text",
    defaultValue: "Benefits Screening",
  },
  {
    key: "benefits.cta.body",
    section: "Benefits",
    label: "CTA card body",
    type: "textarea",
    defaultValue:
      "Answer a few guided questions about your work history, disability, and income. Takes a few minutes — we follow up within 72 hours.",
  },
  {
    key: "benefits.cta.button",
    section: "Benefits",
    label: "CTA card button",
    type: "text",
    defaultValue: "Start benefits screening →",
  },
  {
    key: "benefits.cost.title",
    section: "Benefits",
    label: "No-cost card title",
    type: "text",
    defaultValue: "No Upfront Cost",
  },
  {
    key: "benefits.cost.body",
    section: "Benefits",
    label: "No-cost card body",
    type: "textarea",
    defaultValue:
      "We work on a contingency basis. Our attorneys handle the paperwork, applications, and hearings on your behalf, and we do not charge you upfront or out-of-pocket. With our Attorneys, you are three times more likely to be approved!",
  },
  {
    key: "benefits.team.title",
    section: "Benefits",
    label: "Team card title",
    type: "text",
    defaultValue: "Vetted & Experienced Team",
  },
  {
    key: "benefits.team.body",
    section: "Benefits",
    label: "Team card body",
    type: "textarea",
    defaultValue:
      "From initial applications to hearings and appeals, we stand by you. If your application is denied, we appeal. We don't walk away.",
  },
  {
    key: "benefits.call.title",
    section: "Benefits",
    label: "Call card title",
    type: "text",
    defaultValue: "Prefer to call?",
  },

  // Locations
  {
    key: "locations.eyebrow",
    section: "Locations",
    label: "Eyebrow",
    type: "text",
    defaultValue: "Locations",
  },
  {
    key: "locations.title",
    section: "Locations",
    label: "Headline",
    type: "text",
    defaultValue: "Where we are",
  },
  {
    key: "locations.body",
    section: "Locations",
    label: "Intro paragraph",
    type: "textarea",
    defaultValue:
      "Every property is chosen for proximity to public transit, so you don't need a car to get where you're going.",
  },
  {
    key: "locations.status",
    section: "Locations",
    label: "Property status",
    type: "text",
    defaultValue: "Open & Accepting Residents",
  },
  {
    key: "locations.name",
    section: "Locations",
    label: "Property name",
    type: "text",
    defaultValue: "South Fulton Location",
  },
  {
    key: "locations.features",
    section: "Locations",
    label: "South Fulton features (one per line)",
    type: "list",
    defaultValue: [
      "Near MARTA bus routes",
      "All-inclusive $25/day",
      "On-site house manager",
      "Shared common areas",
    ].join("\n"),
  },
  {
    key: "locations.beltline.name",
    section: "Locations",
    label: "Atlanta BeltLine property name",
    type: "text",
    defaultValue: "Atlanta BeltLine Access",
  },
  {
    key: "locations.beltline.gallery_cta",
    section: "Locations",
    label: "Atlanta BeltLine gallery button",
    type: "text",
    defaultValue: "See the home",
  },
  {
    key: "locations.beltline.features",
    section: "Locations",
    label: "Atlanta BeltLine features (one per line)",
    type: "list",
    defaultValue: [
      "Atlanta BeltLine access",
      "All-inclusive $25/day",
      "On-site house manager",
      "Shared common areas",
    ].join("\n"),
  },
  {
    key: "locations.apply_cta",
    section: "Locations",
    label: "Apply button",
    type: "text",
    defaultValue: "Apply to This Location",
  },
  {
    key: "locations.video_cta",
    section: "Locations",
    label: "Video button",
    type: "text",
    defaultValue: "Watch Video Tour",
  },
  {
    key: "locations.expansion_title",
    section: "Locations",
    label: "Expansion title",
    type: "text",
    defaultValue: "Expanding across Metro & Middle Georgia",
  },
  {
    key: "locations.expansion_body",
    section: "Locations",
    label: "Expansion paragraph",
    type: "textarea",
    defaultValue:
      "We're actively adding new locations. Call (404) 731-2371 to ask about upcoming availability in your area.",
  },

  // FAQ headers
  {
    key: "faq.eyebrow",
    section: "FAQ",
    label: "Eyebrow",
    type: "text",
    defaultValue: "Frequently Asked Questions",
  },
  {
    key: "faq.title",
    section: "FAQ",
    label: "Headline",
    type: "text",
    defaultValue: "Frequently Asked Questions",
  },
  {
    key: "faq.body",
    section: "FAQ",
    label: "Intro paragraph",
    type: "textarea",
    defaultValue: "Find answers to common questions about housing, costs, benefits, and eligibility.",
  },
  {
    key: "faq.tab_general",
    section: "FAQ",
    label: "General tab label",
    type: "text",
    defaultValue: "General Questions",
  },
  {
    key: "faq.tab_common",
    section: "FAQ",
    label: "Common tab label",
    type: "text",
    defaultValue: "Common Concerns",
  },

  // General FAQs
  {
    key: "faq.g1.tag",
    section: "FAQ — General",
    label: "Q1 tag",
    type: "text",
    defaultValue: "Cost",
  },
  {
    key: "faq.g1.question",
    section: "FAQ — General",
    label: "Q1 question",
    type: "textarea",
    defaultValue: "How much does it actually cost?",
  },
  {
    key: "faq.g1.answer",
    section: "FAQ — General",
    label: "Q1 answer",
    type: "textarea",
    defaultValue:
      "It's $25 a day ($775 a month) and that includes your furnished room, all utilities, Wi-Fi, laundry access, on-site management and more. There's no separate deposit stack and no surprise bills.",
  },
  {
    key: "faq.g1.say_this",
    section: "FAQ — General",
    label: "Q1 highlighted note (optional)",
    type: "textarea",
    defaultValue:
      "Think of it like this: if you tried to piece together a room, electric, water, gas, Wi-Fi, and laundry on your own, you'd likely spend $1,600 to $1,800 a month. We give you all of it for $775.",
  },
  {
    key: "faq.g2.tag",
    section: "FAQ — General",
    label: "Q2 tag",
    type: "text",
    defaultValue: "Eligibility",
  },
  {
    key: "faq.g2.question",
    section: "FAQ — General",
    label: "Q2 question",
    type: "textarea",
    defaultValue: "Who is New Creation Living for?",
  },
  {
    key: "faq.g2.answer",
    section: "FAQ — General",
    label: "Q2 answer",
    type: "textarea",
    defaultValue:
      "Adults who receive SSI, SSDI, VA Pension, VA Disability, or Social Security. Specifically for independent adults who can manage their own daily lives. We're not a personal care home or clinical facility, so residents need to be able to handle their own basic self-care.",
  },
  {
    key: "faq.g3.tag",
    section: "FAQ — General",
    label: "Q3 tag",
    type: "text",
    defaultValue: "Timeline",
  },
  {
    key: "faq.g3.question",
    section: "FAQ — General",
    label: "Q3 question",
    type: "textarea",
    defaultValue: "How fast can someone move in?",
  },
  {
    key: "faq.g3.answer",
    section: "FAQ — General",
    label: "Q3 answer",
    type: "textarea",
    defaultValue:
      "Most approved applicants move in within 24 to 48 hours. There's no months-long waitlist like traditional affordable housing or Section 8.",
  },
  {
    key: "faq.g4.tag",
    section: "FAQ — General",
    label: "Q4 tag",
    type: "text",
    defaultValue: "Comparison",
  },
  {
    key: "faq.g4.question",
    section: "FAQ — General",
    label: "Q4 question",
    type: "textarea",
    defaultValue:
      "Is New Creation Living (NCL) a Personal Care Home(PCH) or a nursing home? If not, what are the differences?",
  },
  {
    key: "faq.g4.answer",
    section: "FAQ — General",
    label: "Q4 answer",
    type: "textarea",
    defaultValue:
      "New Creation Living provides all-inclusive housing for independent adults living on a fixed income. We are not a Personal Care Home (PCH) or a nursing home. The key difference is the level of care provided. Personal Care Homes offer housing along with assistance with activities of daily living, such as bathing, dressing, medication reminders, and meal assistance. Nursing homes provide 24/7 medical supervision and skilled nursing care for individuals with chronic illnesses or complex medical needs. Our residents are able to live independently and do not require personal care services or skilled nursing. As a result, New Creation Living operates as an independent, all-inclusive housing provider, not as a Personal Care Home or nursing home.",
  },
  {
    key: "faq.g5.tag",
    section: "FAQ — General",
    label: "Q5 tag",
    type: "text",
    defaultValue: "Benefits",
  },
  {
    key: "faq.g5.question",
    section: "FAQ — General",
    label: "Q5 question",
    type: "textarea",
    defaultValue: "What if I don't have my benefits approved yet?",
  },
  {
    key: "faq.g5.answer",
    section: "FAQ — General",
    label: "Q5 answer",
    type: "textarea",
    defaultValue:
      "That's not a dead end. We work with individuals in the process of applying for SSI, SSDI, VA benefits, or Social Security at no upfront cost to you. Once approved, you'd have the income to move in.",
  },
  {
    key: "faq.g6.tag",
    section: "FAQ — General",
    label: "Q6 tag",
    type: "text",
    defaultValue: "Section 8",
  },
  {
    key: "faq.g6.question",
    section: "FAQ — General",
    label: "Q6 question",
    type: "textarea",
    defaultValue: "Do we accept Section 8 Vouchers?",
  },
  {
    key: "faq.g6.answer",
    section: "FAQ — General",
    label: "Q6 answer",
    type: "textarea",
    defaultValue:
      'No, we do not, but we have partners whom we can refer you to. Please complete the "Apply for Residency" form.',
  },
  {
    key: "faq.g7.tag",
    section: "FAQ — General",
    label: "Q7 tag",
    type: "text",
    defaultValue: "Referrals",
  },
  {
    key: "faq.g7.question",
    section: "FAQ — General",
    label: "Q7 question",
    type: "textarea",
    defaultValue: "I'm a social worker or discharge planner. How does referring someone work?",
  },
  {
    key: "faq.g7.answer",
    section: "FAQ — General",
    label: "Q7 answer",
    type: "textarea",
    defaultValue:
      'Use the "Apply for residency" tab above. Submit the person\'s basic information and their benefit type, and we\'ll follow up directly, usually the same day. We can place most referrals within 24 to 48 hours.',
  },

  // Common FAQs
  {
    key: "faq.c1.tag",
    section: "FAQ — Common concerns",
    label: "C1 tag",
    type: "text",
    defaultValue: "Cost",
  },
  {
    key: "faq.c1.question",
    section: "FAQ — Common concerns",
    label: "C1 question",
    type: "textarea",
    defaultValue: '"That\'s too expensive, I can\'t afford that."',
  },
  {
    key: "faq.c1.answer",
    section: "FAQ — Common concerns",
    label: "C1 answer",
    type: "textarea",
    defaultValue:
      "New Creation Living isn't a waitlist program or a temporary stop. It's a home. One built specifically for people who value dignity and deserve better than the bare minimum most programs offer. Government assistance can bring your rent down, but you are often forced to accept a lower standard of living, often with undesirable housing conditions. Come see it for yourself. Schedule a tour today and experience the difference in person.",
  },
  {
    key: "faq.c2.tag",
    section: "FAQ — Common concerns",
    label: "C2 tag",
    type: "text",
    defaultValue: "Structure",
  },
  {
    key: "faq.c2.question",
    section: "FAQ — Common concerns",
    label: "C2 question",
    type: "textarea",
    defaultValue: '"I don\'t want to live with a bunch of rules. I like my freedom."',
  },
  {
    key: "faq.c2.answer",
    section: "FAQ — Common concerns",
    label: "C2 answer",
    type: "textarea",
    defaultValue:
      "The structure isn't there to control you. It's there to protect you. Our points system encourages every resident to follow the same community standards, creating a safe, respectful environment where you never have to worry about who's coming and going. Most residents say the structure and sense of accountability become one of their favorite parts of living here.",
  },
  {
    key: "faq.c3.tag",
    section: "FAQ — Common concerns",
    label: "C3 tag",
    type: "text",
    defaultValue: "Community",
  },
  {
    key: "faq.c3.question",
    section: "FAQ — Common concerns",
    label: "C3 question",
    type: "textarea",
    defaultValue: '"I don\'t want to share a house with strangers."',
  },
  {
    key: "faq.c3.answer",
    section: "FAQ — Common concerns",
    label: "C3 answer",
    type: "textarea",
    defaultValue:
      "Everyone living in the house went through the same screening you would. A background check and house rules orientation. They're not random strangers; they're adults in similar situations who want the same thing you do. Sharing the home is exactly what keeps the price at $25 a day, compared to $65 a night (the average price of a motel in GA).",
  },
  {
    key: "faq.c4.tag",
    section: "FAQ — Common concerns",
    label: "C4 tag",
    type: "text",
    defaultValue: "Location",
  },
  {
    key: "faq.c4.question",
    section: "FAQ — Common concerns",
    label: "C4 question",
    type: "textarea",
    defaultValue: '"Where is it? What if it\'s not near where I need to be?"',
  },
  {
    key: "faq.c4.answer",
    section: "FAQ — Common concerns",
    label: "C4 answer",
    type: "textarea",
    defaultValue:
      "Our properties are chosen specifically for proximity to public transit, bus lines in particular, so you don't need a car to get around.",
  },
  {
    key: "faq.c5.tag",
    section: "FAQ — Common concerns",
    label: "C5 tag",
    type: "text",
    defaultValue: "Timing",
  },
  {
    key: "faq.c5.question",
    section: "FAQ — Common concerns",
    label: "C5 question",
    type: "textarea",
    defaultValue: "Let me think about it. I'll get back to you.",
  },
  {
    key: "faq.c5.answer",
    section: "FAQ — Common concerns",
    label: "C5 answer",
    type: "textarea",
    defaultValue:
      "Take all the time you need. There's no pressure. The one thing worth knowing: beds do fill up, and we can't hold a spot. The application itself is free, takes about two minutes, and doesn't commit you to anything.",
  },
];

export const SITE_CONTENT_DEFAULTS: SiteContentMap = Object.fromEntries(
  SITE_CONTENT_FIELDS.map((field) => [field.key, field.defaultValue])
);

export function mergeSiteContent(overrides: Partial<SiteContentMap> | null | undefined): SiteContentMap {
  const merged: SiteContentMap = { ...SITE_CONTENT_DEFAULTS };
  if (!overrides) return merged;

  for (const [key, value] of Object.entries(overrides)) {
    if (typeof value === "string") {
      merged[key] = value;
    }
  }

  return merged;
}

export function splitContentList(value: string | undefined): string[] {
  return (value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}
