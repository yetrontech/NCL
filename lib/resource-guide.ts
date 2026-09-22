export type DayId =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type FormatCode =
  | "O"
  | "D"
  | "LIT"
  | "TRD"
  | "WC"
  | "ME"
  | "ENG"
  | "VM"
  | "TOP"
  | "NEW"
  | "QA"
  | "SD"
  | "NS"
  | "BK"
  | "STP"
  | "PI"
  | "BT"
  | "SWG"
  | "JW"
  | "TC";

export const DAYS: { id: DayId; label: string; es: string }[] = [
  { id: "sunday", label: "Sunday", es: "Domingo" },
  { id: "monday", label: "Monday", es: "Lunes" },
  { id: "tuesday", label: "Tuesday", es: "Martes" },
  { id: "wednesday", label: "Wednesday", es: "Miércoles" },
  { id: "thursday", label: "Thursday", es: "Jueves" },
  { id: "friday", label: "Friday", es: "Viernes" },
  { id: "saturday", label: "Saturday", es: "Sábado" },
];

export const FORMAT_CODES: { code: FormatCode; label: string }[] = [
  { code: "O", label: "Open" },
  { code: "D", label: "Discussion" },
  { code: "LIT", label: "Literature" },
  { code: "TRD", label: "Tradition" },
  { code: "WC", label: "Wheelchair accessible" },
  { code: "ME", label: "Meditation" },
  { code: "ENG", label: "English" },
  { code: "VM", label: "Virtual meeting" },
  { code: "TOP", label: "Topic" },
  { code: "NEW", label: "Newcomer" },
  { code: "QA", label: "Question & answer" },
  { code: "SD", label: "Speaker / discussion" },
  { code: "NS", label: "Non-smoking" },
  { code: "BK", label: "Book study" },
  { code: "STP", label: "Step" },
  { code: "PI", label: "Public info" },
  { code: "BT", label: "Birthday" },
  { code: "SWG", label: "Step working guide" },
  { code: "JW", label: "Just for women" },
  { code: "TC", label: "Temporarily closed" },
];

export type Meeting = {
  day: DayId;
  name: string;
  time: string;
  minutes: number;
  duration: string;
  place?: string;
  address?: string;
  zoomId?: string;
  passcode?: string;
  codes: FormatCode[];
};

const HIGHLAND = {
  place: "Highland Club",
  address: "2163 Flat Shoals Road, Atlanta, GA 30316",
};

const CENTER_365 = {
  place: "365 Center Inc",
  address: "1472 Richard Road, Decatur, GA 30032",
};

const COMPOUND = {
  place: "The Compound",
  address: "377 Westchester Blvd NW, Atlanta, GA 30314",
};

const ST_PHILLIPS = {
  place: "St. Phillips AME Church",
  address: "240 Candler Road, Atlanta, GA 30317",
};

export const MEETINGS: Meeting[] = [
  // Sunday
  {
    day: "sunday",
    name: "First Of All",
    time: "8:00 AM",
    minutes: 8 * 60,
    duration: "1 hour",
    ...CENTER_365,
    zoomId: "362 103 5358",
    passcode: "HqWPj5",
    codes: ["O", "STP", "TRD", "LIT"],
  },
  {
    day: "sunday",
    name: "Halftime Group",
    time: "11:30 AM",
    minutes: 11 * 60 + 30,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "VM"],
  },
  {
    day: "sunday",
    name: "Killer Parrot II Group",
    time: "Noon",
    minutes: 12 * 60,
    duration: "1 hour",
    ...HIGHLAND,
    codes: ["O", "STP", "WC"],
  },
  {
    day: "sunday",
    name: "High Noon Group",
    time: "Noon",
    minutes: 12 * 60,
    duration: "1 hour",
    ...CENTER_365,
    codes: ["O", "WC", "ENG"],
  },
  {
    day: "sunday",
    name: "Serenity on Sunday",
    time: "2:00 PM",
    minutes: 14 * 60,
    duration: "1 hour",
    ...HIGHLAND,
    codes: ["O", "D"],
  },
  {
    day: "sunday",
    name: "Recovery at the Compound",
    time: "2:00 PM",
    minutes: 14 * 60,
    duration: "2 hours",
    ...COMPOUND,
    codes: ["O", "D", "WC"],
  },
  {
    day: "sunday",
    name: "Home Sweet Home Group",
    time: "5:30 PM",
    minutes: 17 * 60 + 30,
    duration: "1.5 hours",
    place: "All Saints Episcopal",
    address: "27 North Avenue NE, Atlanta, GA 30308",
    codes: ["SD"],
  },
  {
    day: "sunday",
    name: "Recovery At 6 Group",
    time: "6:00 PM",
    minutes: 18 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "WC", "ENG"],
  },
  {
    day: "sunday",
    name: "Good Orderly Direction Group",
    time: "6:00 PM",
    minutes: 18 * 60,
    duration: "1.5 hours",
    place: "Zoom",
    zoomId: "2731729854",
    passcode: "good",
    codes: ["VM"],
  },
  {
    day: "sunday",
    name: "Open Gate",
    time: "6:00 PM",
    minutes: 18 * 60,
    duration: "1.5 hours",
    address: "95 Renaissance Pkwy NE, Atlanta, GA 30308",
    codes: ["O", "D"],
  },
  {
    day: "sunday",
    name: "Peace and Serene Group",
    time: "8:00 PM",
    minutes: 20 * 60,
    duration: "1.5 hours",
    place: "Decatur, GA 30032",
    codes: ["O", "WC", "ENG"],
  },

  // Monday
  {
    day: "monday",
    name: "Hard Knocks",
    time: "10:00 AM",
    minutes: 10 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "WC", "ME"],
  },
  {
    day: "monday",
    name: "High Noon Group",
    time: "Noon",
    minutes: 12 * 60,
    duration: "1 hour",
    ...CENTER_365,
    codes: ["O", "WC", "ENG"],
  },
  {
    day: "monday",
    name: "Recovery at the Compound",
    time: "2:00 PM",
    minutes: 14 * 60,
    duration: "1 hour",
    ...COMPOUND,
    codes: ["O", "D", "WC"],
  },
  {
    day: "monday",
    name: "Bring Your Own Problems Group",
    time: "6:00 PM",
    minutes: 18 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "D", "WC"],
  },
  {
    day: "monday",
    name: "Peace and Serene Group",
    time: "8:00 PM",
    minutes: 20 * 60,
    duration: "1.5 hours",
    place: "Decatur, GA 30032",
    codes: ["O", "WC", "ENG"],
  },
  {
    day: "monday",
    name: "New Beginnings Group",
    time: "11:30 PM",
    minutes: 23 * 60 + 30,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "D", "WC"],
  },

  // Tuesday
  {
    day: "tuesday",
    name: "Hard Knocks",
    time: "10:00 AM",
    minutes: 10 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "WC", "PI"],
  },
  {
    day: "tuesday",
    name: "Recovery At 6 Group",
    time: "2:00 PM",
    minutes: 14 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "SD", "ENG"],
  },
  {
    day: "tuesday",
    name: "Come Clean",
    time: "2:00 PM",
    minutes: 14 * 60,
    duration: "1 hour",
    ...HIGHLAND,
    codes: ["O", "D", "LIT"],
  },
  {
    day: "tuesday",
    name: "New Beginnings Group",
    time: "6:00 PM",
    minutes: 18 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "WC", "ENG"],
  },
  {
    day: "tuesday",
    name: "Recovery, Comfort, Success",
    time: "6:00 PM",
    minutes: 18 * 60,
    duration: "1.5 hours",
    place: "Westchester Blvd, Atlanta, GA 30314",
    codes: ["LIT", "VM"],
  },
  {
    day: "tuesday",
    name: "Serenity on Sunday",
    time: "11:30 PM",
    minutes: 23 * 60 + 30,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "VM"],
  },

  // Wednesday
  {
    day: "wednesday",
    name: "Hard Knocks",
    time: "10:00 AM",
    minutes: 10 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "WC", "PI"],
  },
  {
    day: "wednesday",
    name: "High Noon Group",
    time: "Noon",
    minutes: 12 * 60,
    duration: "1 hour",
    ...CENTER_365,
    codes: ["O", "VM"],
  },
  {
    day: "wednesday",
    name: "Halftime Group",
    time: "2:00 PM",
    minutes: 14 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "VM"],
  },
  {
    day: "wednesday",
    name: "New Beginnings Group",
    time: "6:00 PM",
    minutes: 18 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "SD", "STP", "WC"],
  },
  {
    day: "wednesday",
    name: "Good Orderly Direction Group",
    time: "6:00 PM",
    minutes: 18 * 60,
    duration: "1.5 hours",
    place: "Zoom",
    passcode: "good",
    codes: ["O", "WC", "ENG"],
  },
  {
    day: "wednesday",
    name: "Thank God It Ain't Monday",
    time: "8:00 PM",
    minutes: 20 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O"],
  },

  // Thursday
  {
    day: "thursday",
    name: "Hard Knocks",
    time: "10:00 AM",
    minutes: 10 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "QA", "WC"],
  },
  {
    day: "thursday",
    name: "New Beginnings Group",
    time: "11:30 AM",
    minutes: 11 * 60 + 30,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "STP"],
  },
  {
    day: "thursday",
    name: "High Noon Group",
    time: "Noon",
    minutes: 12 * 60,
    duration: "1 hour",
    ...CENTER_365,
    codes: ["O", "WC", "ENG"],
  },
  {
    day: "thursday",
    name: "Keep Coming Back Group",
    time: "2:00 PM",
    minutes: 14 * 60,
    duration: "1.5 hours",
    ...CENTER_365,
    codes: ["O", "WC", "ENG"],
  },
  {
    day: "thursday",
    name: "Halftime Group",
    time: "6:00 PM",
    minutes: 18 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "VM"],
  },
  {
    day: "thursday",
    name: "Powerless Group",
    time: "7:00 PM",
    minutes: 19 * 60,
    duration: "1.5 hours",
    ...ST_PHILLIPS,
    codes: ["O", "D", "STP", "WC"],
  },
  {
    day: "thursday",
    name: "Stay Down For Your Crown",
    time: "7:30 PM",
    minutes: 19 * 60 + 30,
    duration: "1.5 hours",
    ...ST_PHILLIPS,
    codes: ["O", "D", "NS", "ENG"],
  },
  {
    day: "thursday",
    name: "Step By Step",
    time: "8:00 PM",
    minutes: 20 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O"],
  },
  {
    day: "thursday",
    name: "Recovery at 6 Group",
    time: "8:00 PM",
    minutes: 20 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "SD", "ENG"],
  },
  {
    day: "thursday",
    name: "Recovery at 6 Group",
    time: "11:30 PM",
    minutes: 23 * 60 + 30,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "STP"],
  },

  // Friday
  {
    day: "friday",
    name: "Hard Knocks",
    time: "10:00 AM",
    minutes: 10 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "WC"],
  },
  {
    day: "friday",
    name: "New Beginnings Group",
    time: "11:30 AM",
    minutes: 11 * 60 + 30,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "WC", "ENG"],
  },
  {
    day: "friday",
    name: "Stepping Into Life, Ascensa Health",
    time: "6:00 PM",
    minutes: 18 * 60,
    duration: "1.5 hours",
    ...CENTER_365,
    zoomId: "362 103 5358",
    codes: ["O", "BT", "STP", "SWG", "JW"],
  },
  {
    day: "friday",
    name: "Recovery Good Orderly Direction",
    time: "6:30 PM",
    minutes: 18 * 60 + 30,
    duration: "1.5 hours",
    place: "Zoom",
    passcode: "good",
    codes: ["O", "BT", "STP", "WC", "JW"],
  },
  {
    day: "friday",
    name: "Miracles Happen Group",
    time: "8:00 PM",
    minutes: 20 * 60,
    duration: "1.5 hours",
    ...CENTER_365,
    codes: ["O", "WC", "ENG", "VM"],
  },

  // Saturday
  {
    day: "saturday",
    name: "Hard Knocks",
    time: "10:00 AM",
    minutes: 10 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "WC", "TC"],
  },
  {
    day: "saturday",
    name: "Just 4 Today Meditation",
    time: "10:00 AM",
    minutes: 10 * 60,
    duration: "1.5 hours",
    ...CENTER_365,
    codes: ["O", "WC", "TC", "ENG"],
  },
  {
    day: "saturday",
    name: "High Noon Group",
    time: "Noon",
    minutes: 12 * 60,
    duration: "1 hour",
    ...CENTER_365,
    codes: ["O", "WC", "ENG"],
  },
  {
    day: "saturday",
    name: "Atmosphere of Recovery",
    time: "2:00 PM",
    minutes: 14 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "D"],
  },
  {
    day: "saturday",
    name: "Surrender Group",
    time: "3:30 PM",
    minutes: 15 * 60 + 30,
    duration: "1.5 hours",
    place: "The Door",
    address: "4086 Covington Hwy, Decatur, GA 30032",
    codes: ["O", "SD", "ENG"],
  },
  {
    day: "saturday",
    name: "Halftime Group",
    time: "6:00 PM",
    minutes: 18 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "D"],
  },
  {
    day: "saturday",
    name: "Dogwood Group",
    time: "8:00 PM",
    minutes: 20 * 60,
    duration: "1.5 hours",
    ...HIGHLAND,
    codes: ["O", "D", "STP", "WC"],
  },
];

export type ResourceLink = {
  label: string;
  href: string;
};

export type VolunteerOpportunity = {
  name: string;
  summary: string;
  address?: string;
  phone?: string;
  link?: ResourceLink;
};

export const VOLUNTEER_OPPORTUNITIES: VolunteerOpportunity[] = [
  {
    name: "Atlanta Community Food Bank — Hunger Action Center",
    summary:
      "Sort and pack donated food for distribution to over 600 partner agencies. Closed-toe shoes required.",
    address: "3400 North Desert Drive, Atlanta, GA 30344",
    phone: "(404) 892-9822",
    link: { label: "acfb.org/volunteer", href: "https://acfb.org/volunteer" },
  },
  {
    name: "Atlanta Community Food Bank — Community Food Center",
    summary:
      "Direct-to-family food pantry, close to SW Atlanta properties. Volunteer roles in food distribution.",
    address: "3500 Martin Luther King Jr Drive SW, Atlanta, GA 30331",
  },
  {
    name: "Meals On Wheels Atlanta",
    summary: "Meal prep and delivery to homebound seniors. Ongoing volunteer needs.",
    address: "1705 Commerce Drive NW, Atlanta, GA 30318",
    link: { label: "mowatl.org", href: "https://mowatl.org" },
  },
  {
    name: "Atlanta Habitat for Humanity",
    summary:
      "Construction and non-construction roles (ReStore, family services, event support). No experience necessary.",
    link: {
      label: "atlantahabitat.org/volunteer",
      href: "https://atlantahabitat.org/volunteer",
    },
  },
  {
    name: "Atlanta Mission",
    summary:
      "Meal service, thrift store assistance, and donation sorting for men, women, and families experiencing homelessness. Volunteers 16+ (13+ for some roles).",
    link: {
      label: "atlantamission.org/volunteer",
      href: "https://atlantamission.org/volunteer",
    },
  },
  {
    name: "HOPE Atlanta — Women's Community Kitchen",
    summary:
      "Meal service Tuesday, Wednesday, and Thursday, 9:30 AM–12:30 PM. Prepares and serves warm meals to food-insecure women and children.",
  },
  {
    name: "United Way of Greater Atlanta — Homelessness Compassion Outreach",
    summary:
      "Weekly outreach providing meals, hygiene products, and clothing to individuals experiencing homelessness.",
    link: { label: "unitedwayatlanta.org", href: "https://unitedwayatlanta.org" },
  },
  {
    name: "Hands On Atlanta",
    summary:
      "Wide variety of ongoing projects in education, food insecurity, and environment. Flexible scheduling.",
    address: "384 Northyards Blvd, Atlanta, GA 30313",
  },
  {
    name: "YMCA of Metro Atlanta",
    summary:
      "19 branches across metro Atlanta. General volunteer roles supporting programs and community events.",
    link: { label: "ymcaatlanta.org", href: "https://ymcaatlanta.org" },
  },
  {
    name: "Fernbank Museum of Natural History",
    summary: "Museum volunteer roles for adults of all ages.",
    address: "767 Clifton Road NE, Atlanta, GA 30307",
    link: { label: "fernbankmuseum.org", href: "https://fernbankmuseum.org" },
  },
];

export type EducationProgram = {
  name: string;
  summary: string;
  tag?: string;
  address?: string;
  phone?: string;
  link?: ResourceLink;
};

export const EDUCATION_PROGRAMS: EducationProgram[] = [
  {
    name: "Atlanta Technical College — HOPE Career Grant Programs",
    tag: "Tuition-free",
    summary:
      "Certificate programs in cybersecurity, CompTIA A+, computer programming, networking, and more, for HOPE Grant-eligible Georgia residents. Closest technical college to SW Atlanta properties.",
    address: "1560 Metropolitan Pkwy SW, Atlanta, GA 30310",
    phone: "(404) 225-4400",
  },
  {
    name: "Atlanta Technical College — Patient Care Assistant / CNA",
    summary:
      "Certified Nursing Assistant training combining classroom, lab, and clinical work. High-demand healthcare field. Same campus as the HOPE Career Grant programs.",
    address: "1560 Metropolitan Pkwy SW, Atlanta, GA 30310",
    phone: "(404) 225-4400",
  },
  {
    name: "Georgia Piedmont Technical College — HOPE Career Grant",
    tag: "Tuition-free",
    summary:
      "Diploma and certificate programs through the HOPE Career Grant for eligible Georgia residents.",
    address: "495 N Indian Creek Dr, Clarkston, GA 30021",
  },
  {
    name: "Goodwill Career & Technical Academy (GCTA)",
    tag: "Little to no cost",
    summary:
      "Career certification training in nursing and medical, construction, electrical, and more. One-on-one career guidance and job placement assistance included.",
    link: { label: "gctatraining.org", href: "https://gctatraining.org" },
  },
  {
    name: "Goodwill of North Georgia — Technology Career Program",
    tag: "Free",
    summary:
      "16-week program with TechBridge. Includes industry certifications, job placement support, a free laptop upon completion, and meals during training. Must have a high school diploma or GED.",
  },
  {
    name: "Goodwill of North Georgia — Career Centers",
    tag: "Free",
    summary:
      "14 metro locations. Computer and internet access, resume help, job search assistance, and skills training. Open to all backgrounds, including justice-involved individuals.",
    link: { label: "goodwillng.org", href: "https://goodwillng.org" },
  },
  {
    name: "Atlanta Public Schools Adult Education — GED / HiSET",
    tag: "Free classes",
    summary:
      "Classes are free. The GED exam fee is about $46 per test (4 tests) and is often covered by the HOPE GED Grant.",
    address: "Atlanta-Fulton Public Library, 1 Margaret Mitchell Square NW, Atlanta, GA 30303",
    phone: "(404) 802-3560",
  },
  {
    name: "HOPE GED / HiSET Grant",
    tag: "Up to $200",
    summary:
      "Covers up to $200 toward GED or HiSET test fees for eligible Georgia residents. One award per subject area. Apply online before testing.",
    link: { label: "HSEtest4Free.com", href: "https://hsetest4free.com" },
  },
  {
    name: "WorkSource Atlanta Regional — Career Resource Center",
    tag: "Free",
    summary: "Resume help, job search workshops, and training referrals every week.",
    address:
      "Clayton County Career Resource Center, 3000 Corporate Center Dr, Suite 350, Morrow, GA 30260",
  },
  {
    name: "WIOA-Funded CNA Training",
    tag: "Free",
    summary:
      "Federal Workforce Innovation and Opportunity Act funding covers CNA training costs for economically disadvantaged adults, including those on fixed income. Ask at any Goodwill Career Center or WorkSource office for current WIOA-approved CNA providers.",
  },
];

export function meetingsOn(day: DayId): Meeting[] {
  return MEETINGS.filter((meeting) => meeting.day === day).sort(
    (a, b) => a.minutes - b.minutes || a.name.localeCompare(b.name)
  );
}

export function formatLabel(code: FormatCode): string {
  return FORMAT_CODES.find((item) => item.code === code)?.label ?? code;
}

export function mapsHref(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `tel:+1${digits.replace(/^1/, "")}`;
}
