-- Editable marketing-site copy.
-- Public can READ. Only the dashboard service role should WRITE.
-- Safe to re-run: seeds with ON CONFLICT DO NOTHING.

create table if not exists public.site_content (
  key text primary key,
  value text not null,
  section text not null,
  label text not null,
  field_type text not null default 'text',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Allow public read of site content" on public.site_content;
create policy "Allow public read of site content"
  on public.site_content
  for select
  to anon, authenticated
  using (true);

insert into public.site_content (key, value, section, label, field_type, sort_order)
values
  ('brand.tagline', 'From Benefits to Belonging', 'Brand', 'Tagline under the logo', 'text', 1),
  ('footer.blurb', 'Structured independent living for adults on fixed government income across Metro Atlanta & middle Georgia.', 'Footer', 'Footer description', 'textarea', 2),
  ('footer.contact_phone', '(404) 731-2371', 'Footer', 'Contact phone', 'text', 3),
  ('footer.contact_email', 'SUPPORT@NEWCREATIONLIVING.ORG', 'Footer', 'Contact email', 'text', 4),
  ('footer.contact_area', 'Atlanta & Middle Georgia', 'Footer', 'Contact area', 'text', 5),
  ('footer.disclaimer', 'Structured Independent Living. Not a licensed personal care home.', 'Footer', 'Footer disclaimer', 'text', 6),
  ('home.hero.tag', 'A Trusted Structured Independent Living Provider', 'Home — Hero', 'Hero badge', 'text', 7),
  ('home.hero.headline', 'New Creation Living', 'Home — Hero', 'Hero headline', 'text', 8),
  ('home.hero.lead', 'An All-Inclusive Home for Independent Adults on Fixed Income', 'Home — Hero', 'Hero lead line', 'textarea', 9),
  ('home.hero.locations', 'Locations Available in Atlanta & Middle GA', 'Home — Hero', 'Hero locations line', 'text', 10),
  ('home.hero.cta_residency', 'Residency', 'Home — Hero', 'Primary button', 'text', 11),
  ('home.hero.cta_tour', 'Schedule a Tour', 'Home — Hero', 'Secondary button', 'text', 12),
  ('home.cost.title', 'All-Inclusive Living', 'Home — Cost card', 'Cost card title', 'text', 13),
  ('home.cost.items', 'Furnished Room
Water, Gas & Electricity
Wifi
Laundry
High End Finishes & High Standard of Living
Sober & Drug Free Environment
Access to Public Transportation
Community Support
On Site Management', 'Home — Cost card', 'Included items (one per line)', 'list', 14),
  ('home.cost.price', '$26.60', 'Home — Cost card', 'Price amount', 'text', 15),
  ('home.cost.period', '/day', 'Home — Cost card', 'Price period', 'text', 16),
  ('home.cost.note', '(Everything included at no cost. No hidden deposits/fees)', 'Home — Cost card', 'Price note', 'text', 17),
  ('home.philosophy.eyebrow', 'Our Philosophy', 'Home — Philosophy', 'Eyebrow', 'text', 18),
  ('home.philosophy.title', 'Independence forged through structure and accountability', 'Home — Philosophy', 'Headline', 'textarea', 19),
  ('home.philosophy.lead', 'We build our homes around structure and support to secure your peace of mind.', 'Home — Philosophy', 'Lead paragraph', 'textarea', 20),
  ('home.philosophy.pillar1_title', 'Move in within 48 hours', 'Home — Philosophy', 'Pillar 1 title', 'text', 21),
  ('home.philosophy.pillar1_body', 'No long waitlists. Once your application clears, you have keys. You are officially one of us!', 'Home — Philosophy', 'Pillar 1 body', 'textarea', 22),
  ('home.philosophy.pillar2_title', 'A Home, not just a House', 'Home — Philosophy', 'Pillar 2 title', 'text', 23),
  ('home.philosophy.pillar2_body', 'New Creation Living provides a community for all residents through community collaboration, events and support.', 'Home — Philosophy', 'Pillar 2 body', 'textarea', 24),
  ('home.philosophy.badge', 'Premium Living', 'Home — Philosophy', 'Image badge', 'text', 25),
  ('home.serve.title', 'Who we are built for', 'Home — Who we serve', 'Headline', 'text', 26),
  ('home.serve.body', 'Independent adults who receive fixed government benefits and need stable, structured housing.', 'Home — Who we serve', 'Paragraph', 'textarea', 27),
  ('home.serve.recipients', 'SSI RECIPIENTS
SSDI RECIPIENTS
VA PENSION & DISABILITY RECIPIENTS
SOCIAL SECURITY RETIREMENT RECIPIENTS', 'Home — Who we serve', 'Recipient cards (one per line)', 'list', 28),
  ('home.partners.title', 'Who We Partner With', 'Home — Partners', 'Headline', 'text', 29),
  ('home.partners.body', 'We collaborate closely with healthcare professionals, advocates, and families to coordinate placements and support.', 'Home — Partners', 'Paragraph', 'textarea', 30),
  ('home.partners.row1', 'SOCIAL WORKERS & CASE MANAGERS
REHABILITATION HOSPITALS & EMERGENCY DEPARTMENTS
BEHAVIORAL HEALTH ORGANIZATIONS
SUBSTANCE USE TREATMENT CENTERS
SKILLED NURSING FACILITIES
VETERAN HOUSING, SHELTERS & HOSPITALS
FAMILY MEMBERS/FRIENDS', 'Home — Partners', 'Partner row 1 (one per line)', 'list', 31),
  ('home.partners.row2', 'COUNSELORS
SENIOR CENTERS & AREA AGENCIES ON AGING
NON PROFIT ORGANIZATIONS AND MORE
DETOX & OUTPATIENT PROGRAMS
FAITH COMMUNITIES & CHURCHES
PRIMARY CARE CLINICS', 'Home — Partners', 'Partner row 2 (one per line)', 'list', 32),
  ('about.eyebrow', 'About Us', 'About', 'Eyebrow', 'text', 33),
  ('about.title', 'What we do', 'About', 'Headline', 'text', 34),
  ('about.body', 'New Creation Living is a Structured Independent Living Housing Provider. Not a shelter, not a Personal Care Home. We give adults on fixed government income a safe, stable, affordable place to live while shattering traditional "low-quality" housing assumptions, proving that a fixed income doesn''t have to mean compromising on quality or dignity.', 'About', 'About paragraph', 'textarea', 35),
  ('about.structure_title', 'Structure', 'About', 'Structure card title', 'text', 36),
  ('about.structure_body', 'A House Manager on-site, a daily rhythm, and a community of people who want the same thing: Safety, Stability, Structure with a high standard of living', 'About', 'Structure card body', 'textarea', 37),
  ('about.how.eyebrow', 'How It Works', 'About — How it works', 'Eyebrow', 'text', 38),
  ('about.how.title', 'From First Call to Move-In', 'About — How it works', 'Headline', 'text', 39),
  ('about.step1_title', 'Apply', 'About — How it works', 'Step 1 title', 'text', 40),
  ('about.step1_body', 'A short application: Click the link below, give us a call, or get help from a case worker or a family member.', 'About — How it works', 'Step 1 body', 'textarea', 41),
  ('about.step1_cta', 'Apply now', 'About — How it works', 'Step 1 button', 'text', 42),
  ('about.step2_title', 'We Review', 'About — How it works', 'Step 2 title', 'text', 43),
  ('about.step2_body', 'We confirm benefit eligibility and run a standard background check within 24 to 48 hours.', 'About — How it works', 'Step 2 body', 'textarea', 44),
  ('about.step3_title', 'We Connect', 'About — How it works', 'Step 3 title', 'text', 45),
  ('about.step3_body', 'Approved applicants are matched to an available room based on location and needs.', 'About — How it works', 'Step 3 body', 'textarea', 46),
  ('about.step4_title', 'Move In', 'About — How it works', 'Step 4 title', 'text', 47),
  ('about.step4_body', 'Usually within 48 hours of approval. Onboarding covers house rules, your room, and your community.', 'About — How it works', 'Step 4 body', 'textarea', 48),
  ('life.eyebrow', 'Life at NCL', 'Life at NCL', 'Eyebrow', 'text', 49),
  ('life.title', 'The NCL Mindset', 'Life at NCL', 'Headline', 'text', 50),
  ('life.body', 'New Creation Living isn''t just a home. It''s a system built around one simple idea: when you show up for yourself, you earn something back. Through our unique rewards program, your everyday consistency turns into real gift cards, rent credits, birthday celebrations, and a safe, supportive community that gets better the longer you stay.', 'Life at NCL', 'Intro paragraph', 'textarea', 51),
  ('life.cta', 'Apply for residency', 'Life at NCL', 'Button', 'text', 52),
  ('life.rewards_title', 'Rewards Program', 'Life at NCL', 'Rewards card title', 'text', 53),
  ('life.rewards_body', 'Show up for yourself — and earn something real back.', 'Life at NCL', 'Rewards card body', 'textarea', 54),
  ('life.rewards_items', 'Gift cards & rent credits
Birthday celebrations
Stronger community', 'Life at NCL', 'Rewards items (one per line)', 'list', 55),
  ('life.culture.eyebrow', 'The Culture', 'Life at NCL — Culture', 'Eyebrow', 'text', 56),
  ('life.culture.title', 'This is what living here feels like', 'Life at NCL — Culture', 'Headline', 'text', 57),
  ('life.culture.lead', 'Community isn''t a slogan. It''s a schedule.', 'Life at NCL — Culture', 'Lead line', 'text', 58),
  ('life.card1.tag', 'Every Saturday · 7 PM', 'Life at NCL — Culture', 'Card 1 tag', 'text', 59),
  ('life.card1.title', 'Game Night', 'Life at NCL — Culture', 'Card 1 title', 'text', 60),
  ('life.card1.body', 'Cards, board games, laughter. The common area fills up. You show up as you are.', 'Life at NCL — Culture', 'Card 1 body', 'textarea', 61),
  ('life.card2.tag', 'Last Saturday · Monthly', 'Life at NCL — Culture', 'Card 2 tag', 'text', 62),
  ('life.card2.title', 'House Cookout', 'Life at NCL — Culture', 'Card 2 title', 'text', 63),
  ('life.card2.body', 'Every last Saturday of the month, the whole house eats together. Food and drinks provided. Residents only: this table is yours.', 'Life at NCL — Culture', 'Card 2 body', 'textarea', 64),
  ('life.card3.tag', 'Twice a Year', 'Life at NCL — Culture', 'Card 3 tag', 'text', 65),
  ('life.card3.title', 'The Big Event', 'Life at NCL — Culture', 'Card 3 title', 'text', 66),
  ('life.card3.body', 'An outdoor gathering with food, games, raffles, and partners from across the community. Free for every resident. Points unlock extras: bring a family member, earn VIP seating, get raffle tickets for real prizes.', 'Life at NCL — Culture', 'Card 3 body', 'textarea', 67),
  ('residency.eyebrow', 'Apply or Refer', 'Residency', 'Eyebrow', 'text', 68),
  ('residency.title', 'Residency', 'Residency', 'Headline', 'text', 69),
  ('residency.body', 'Choose how you''d like to get started. We''ll walk you through a short guided application — typically a few minutes — and follow up within a few hours.', 'Residency', 'Intro paragraph', 'textarea', 70),
  ('residency.tour.eyebrow', 'Schedule a Tour', 'Residency — Tour', 'Eyebrow', 'text', 71),
  ('residency.tour.title', 'Schedule a Tour of Our Locations', 'Residency — Tour', 'Headline', 'text', 72),
  ('residency.tour.body', 'Experience New Creation Living firsthand! Come visit our beautiful, fully-furnished homes in Metro Atlanta & Middle Georgia before or during your application process.', 'Residency — Tour', 'Paragraph', 'textarea', 73),
  ('residency.tour.call_cta', 'Call (404) 731-2371', 'Residency — Tour', 'Call button', 'text', 74),
  ('residency.tour.schedule_cta', 'Schedule a Tour Now', 'Residency — Tour', 'Schedule button', 'text', 75),
  ('residency.after.title', 'What happens after you submit', 'Residency — Info cards', 'After-submit title', 'text', 76),
  ('residency.after.items', 'We review the application or referral and confirm benefit type and eligibility
We contact you or the individual directly, usually within a few hours
If it''s a fit, we can place most people within 24 to 48 hours
You''ll get a direct line to our team for follow-up', 'Residency — Info cards', 'After-submit bullets (one per line)', 'list', 77),
  ('residency.accept.title', 'Who we accept', 'Residency — Info cards', 'Who we accept title', 'text', 78),
  ('residency.accept.items', 'Adults on SSI, SSDI, VA Pension, VA Disability, or Social Security
Patients being discharged from acute care, rehab, or skilled nursing
Veterans transitioning from VA housing programs
Anyone on fixed income!', 'Residency — Info cards', 'Who we accept bullets (one per line)', 'list', 79),
  ('residency.apply.eyebrow', 'For You', 'Residency — Paths', 'Apply card eyebrow', 'text', 80),
  ('residency.apply.title', 'Applying for myself', 'Residency — Paths', 'Apply card title', 'text', 81),
  ('residency.apply.body', 'Start a guided application for your own residency. We''ll ask about your situation, benefits, and readiness step by step.', 'Residency — Paths', 'Apply card body', 'textarea', 82),
  ('residency.apply.cta', 'Start application →', 'Residency — Paths', 'Apply card button', 'text', 83),
  ('residency.refer.eyebrow', 'For Professionals & Families', 'Residency — Paths', 'Referral card eyebrow', 'text', 84),
  ('residency.refer.title', 'Referral', 'Residency — Paths', 'Referral card title', 'text', 85),
  ('residency.refer.body', 'Refer someone else for placement. Walk through their eligibility and situation in a short guided flow.', 'Residency — Paths', 'Referral card body', 'textarea', 86),
  ('residency.refer.cta', 'Start referral →', 'Residency — Paths', 'Referral card button', 'text', 87),
  ('residency.call.title', 'Prefer to call?', 'Residency — Call card', 'Call card title', 'text', 88),
  ('benefits.eyebrow', 'Free Eligibility Screening', 'Benefits', 'Eyebrow', 'text', 89),
  ('benefits.title', 'We Help You Navigate Benefits', 'Benefits', 'Headline', 'text', 90),
  ('benefits.body', 'Evaluate your eligibility for SSI, SSDI, or VA Pension at no cost. We identify the strongest path to approval for your specific situation.', 'Benefits', 'Intro paragraph', 'textarea', 91),
  ('benefits.cta.eyebrow', 'Start Here', 'Benefits', 'CTA card eyebrow', 'text', 92),
  ('benefits.cta.title', 'Benefits Screening', 'Benefits', 'CTA card title', 'text', 93),
  ('benefits.cta.body', 'Answer a few guided questions about your work history, disability, and income. Takes a few minutes — we follow up within 72 hours.', 'Benefits', 'CTA card body', 'textarea', 94),
  ('benefits.cta.button', 'Start benefits screening →', 'Benefits', 'CTA card button', 'text', 95),
  ('benefits.cost.title', 'No Upfront Cost', 'Benefits', 'No-cost card title', 'text', 96),
  ('benefits.cost.body', 'We work on a contingency basis. Our attorneys handle the paperwork, applications, and hearings on your behalf, and we do not charge you upfront or out-of-pocket. With our Attorneys, you are three times more likely to be approved!', 'Benefits', 'No-cost card body', 'textarea', 97),
  ('benefits.team.title', 'Vetted & Experienced Team', 'Benefits', 'Team card title', 'text', 98),
  ('benefits.team.body', 'From initial applications to hearings and appeals, we stand by you. If your application is denied, we appeal. We don''t walk away.', 'Benefits', 'Team card body', 'textarea', 99),
  ('benefits.call.title', 'Prefer to call?', 'Benefits', 'Call card title', 'text', 100),
  ('locations.eyebrow', 'Locations', 'Locations', 'Eyebrow', 'text', 101),
  ('locations.title', 'Where we are', 'Locations', 'Headline', 'text', 102),
  ('locations.body', 'Every property is chosen for proximity to public transit, so you don''t need a car to get where you''re going.', 'Locations', 'Intro paragraph', 'textarea', 103),
  ('locations.status', 'Open & Accepting Residents', 'Locations', 'Property status', 'text', 104),
  ('locations.name', 'South Fulton Location', 'Locations', 'Property name', 'text', 105),
  ('locations.features', 'Near MARTA bus routes
All-inclusive $26.60/day
On-site house manager
Shared common areas', 'Locations', 'Property features (one per line)', 'list', 106),
  ('locations.apply_cta', 'Apply to This Location', 'Locations', 'Apply button', 'text', 107),
  ('locations.video_cta', 'Watch Video Tour', 'Locations', 'Video button', 'text', 108),
  ('locations.expansion_title', 'Expanding across Metro & Middle Georgia', 'Locations', 'Expansion title', 'text', 109),
  ('locations.expansion_body', 'We''re actively adding new locations. Call (404) 731-2371 to ask about upcoming availability in your area.', 'Locations', 'Expansion paragraph', 'textarea', 110),
  ('faq.eyebrow', 'Frequently Asked Questions', 'FAQ', 'Eyebrow', 'text', 111),
  ('faq.title', 'Frequently Asked Questions', 'FAQ', 'Headline', 'text', 112),
  ('faq.body', 'Find answers to common questions about housing, costs, benefits, and eligibility.', 'FAQ', 'Intro paragraph', 'textarea', 113),
  ('faq.tab_general', 'General Questions', 'FAQ', 'General tab label', 'text', 114),
  ('faq.tab_common', 'Common Concerns', 'FAQ', 'Common tab label', 'text', 115),
  ('faq.g1.tag', 'Cost', 'FAQ — General', 'Q1 tag', 'text', 116),
  ('faq.g1.question', 'How much does it actually cost?', 'FAQ — General', 'Q1 question', 'textarea', 117),
  ('faq.g1.answer', 'It''s $26.60 a day ($798 a month) and that includes your furnished room, all utilities, Wi-Fi, laundry access, on-site management and more. There''s no separate deposit stack and no surprise bills.', 'FAQ — General', 'Q1 answer', 'textarea', 118),
  ('faq.g1.say_this', 'Think of it like this: if you tried to piece together a room, electric, water, gas, Wi-Fi, and laundry on your own, you''d likely spend $1,600 to $1,800 a month. We give you all of it for $798.', 'FAQ — General', 'Q1 highlighted note (optional)', 'textarea', 119),
  ('faq.g2.tag', 'Eligibility', 'FAQ — General', 'Q2 tag', 'text', 120),
  ('faq.g2.question', 'Who is New Creation Living for?', 'FAQ — General', 'Q2 question', 'textarea', 121),
  ('faq.g2.answer', 'Adults who receive SSI, SSDI, VA Pension, VA Disability, or Social Security. Specifically for independent adults who can manage their own daily lives. We''re not a personal care home or clinical facility, so residents need to be able to handle their own basic self-care.', 'FAQ — General', 'Q2 answer', 'textarea', 122),
  ('faq.g3.tag', 'Timeline', 'FAQ — General', 'Q3 tag', 'text', 123),
  ('faq.g3.question', 'How fast can someone move in?', 'FAQ — General', 'Q3 question', 'textarea', 124),
  ('faq.g3.answer', 'Most approved applicants move in within 24 to 48 hours. There''s no months-long waitlist like traditional affordable housing or Section 8.', 'FAQ — General', 'Q3 answer', 'textarea', 125),
  ('faq.g4.tag', 'Comparison', 'FAQ — General', 'Q4 tag', 'text', 126),
  ('faq.g4.question', 'Is New Creation Living (NCL) a Personal Care Home(PCH) or a nursing home? If not, what are the differences?', 'FAQ — General', 'Q4 question', 'textarea', 127),
  ('faq.g4.answer', 'New Creation Living provides all-inclusive housing for independent adults living on a fixed income. We are not a Personal Care Home (PCH) or a nursing home. The key difference is the level of care provided. Personal Care Homes offer housing along with assistance with activities of daily living, such as bathing, dressing, medication reminders, and meal assistance. Nursing homes provide 24/7 medical supervision and skilled nursing care for individuals with chronic illnesses or complex medical needs. Our residents are able to live independently and do not require personal care services or skilled nursing. As a result, New Creation Living operates as an independent, all-inclusive housing provider, not as a Personal Care Home or nursing home.', 'FAQ — General', 'Q4 answer', 'textarea', 128),
  ('faq.g5.tag', 'Benefits', 'FAQ — General', 'Q5 tag', 'text', 129),
  ('faq.g5.question', 'What if I don''t have my benefits approved yet?', 'FAQ — General', 'Q5 question', 'textarea', 130),
  ('faq.g5.answer', 'That''s not a dead end. We work with individuals in the process of applying for SSI, SSDI, VA benefits, or Social Security at no upfront cost to you. Once approved, you''d have the income to move in.', 'FAQ — General', 'Q5 answer', 'textarea', 131),
  ('faq.g6.tag', 'Section 8', 'FAQ — General', 'Q6 tag', 'text', 132),
  ('faq.g6.question', 'Do we accept Section 8 Vouchers?', 'FAQ — General', 'Q6 question', 'textarea', 133),
  ('faq.g6.answer', 'No, we do not, but we have partners whom we can refer you to. Please complete the "Apply for Residency" form.', 'FAQ — General', 'Q6 answer', 'textarea', 134),
  ('faq.g7.tag', 'Referrals', 'FAQ — General', 'Q7 tag', 'text', 135),
  ('faq.g7.question', 'I''m a social worker or discharge planner. How does referring someone work?', 'FAQ — General', 'Q7 question', 'textarea', 136),
  ('faq.g7.answer', 'Use the "Apply for residency" tab above. Submit the person''s basic information and their benefit type, and we''ll follow up directly, usually the same day. We can place most referrals within 24 to 48 hours.', 'FAQ — General', 'Q7 answer', 'textarea', 137),
  ('faq.c1.tag', 'Cost', 'FAQ — Common concerns', 'C1 tag', 'text', 138),
  ('faq.c1.question', '"That''s too expensive, I can''t afford that."', 'FAQ — Common concerns', 'C1 question', 'textarea', 139),
  ('faq.c1.answer', 'New Creation Living isn''t a waitlist program or a temporary stop. It''s a home. One built specifically for people who value dignity and deserve better than the bare minimum most programs offer. Government assistance can bring your rent down, but you are often forced to accept a lower standard of living, often with undesirable housing conditions. Come see it for yourself. Schedule a tour today and experience the difference in person.', 'FAQ — Common concerns', 'C1 answer', 'textarea', 140),
  ('faq.c2.tag', 'Structure', 'FAQ — Common concerns', 'C2 tag', 'text', 141),
  ('faq.c2.question', '"I don''t want to live with a bunch of rules. I like my freedom."', 'FAQ — Common concerns', 'C2 question', 'textarea', 142),
  ('faq.c2.answer', 'The structure isn''t there to control you. It''s there to protect you. Our points system encourages every resident to follow the same community standards, creating a safe, respectful environment where you never have to worry about who''s coming and going. Most residents say the structure and sense of accountability become one of their favorite parts of living here.', 'FAQ — Common concerns', 'C2 answer', 'textarea', 143),
  ('faq.c3.tag', 'Community', 'FAQ — Common concerns', 'C3 tag', 'text', 144),
  ('faq.c3.question', '"I don''t want to share a house with strangers."', 'FAQ — Common concerns', 'C3 question', 'textarea', 145),
  ('faq.c3.answer', 'Everyone living in the house went through the same screening you would. A background check and house rules orientation. They''re not random strangers; they''re adults in similar situations who want the same thing you do. Sharing the home is exactly what keeps the price at $26.60 a day, compared to $65 a night (the average price of a motel in GA).', 'FAQ — Common concerns', 'C3 answer', 'textarea', 146),
  ('faq.c4.tag', 'Location', 'FAQ — Common concerns', 'C4 tag', 'text', 147),
  ('faq.c4.question', '"Where is it? What if it''s not near where I need to be?"', 'FAQ — Common concerns', 'C4 question', 'textarea', 148),
  ('faq.c4.answer', 'Our properties are chosen specifically for proximity to public transit, bus lines in particular, so you don''t need a car to get around.', 'FAQ — Common concerns', 'C4 answer', 'textarea', 149),
  ('faq.c5.tag', 'Timing', 'FAQ — Common concerns', 'C5 tag', 'text', 150),
  ('faq.c5.question', 'Let me think about it. I''ll get back to you.', 'FAQ — Common concerns', 'C5 question', 'textarea', 151),
  ('faq.c5.answer', 'Take all the time you need. There''s no pressure. The one thing worth knowing: beds do fill up, and we can''t hold a spot. The application itself is free, takes about two minutes, and doesn''t commit you to anything.', 'FAQ — Common concerns', 'C5 answer', 'textarea', 152)
on conflict (key) do nothing;

create or replace function public.touch_site_content_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at
before update on public.site_content
for each row
execute function public.touch_site_content_updated_at();
