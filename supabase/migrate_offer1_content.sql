-- Offer 1 copy, edited from Website copy in the dashboard.
-- Public can read. The dashboard service role writes.
-- Safe to re-run: existing edits are left as they are.

insert into public.site_content (key, value, section, label, field_type, sort_order)
values
  (
    'offer1.seo_title',
    'Limited space offer — New Creation Living',
    'Offer 1',
    'Google title',
    'text',
    900
  ),
  (
    'offer1.seo_description',
    'Bring your friends and pay $125 in rent. The month you move in is free, with a 100% refund within 7 days.',
    'Offer 1',
    'Google description',
    'textarea',
    901
  ),
  (
    'offer1.headline',
    'When you love our home, bring your friends and pay *$125* in rent.',
    'Offer 1',
    'Headline. Put *asterisks* around words that should stand out.',
    'textarea',
    902
  ),
  (
    'offer1.package',
    'Limited Space Offer',
    'Offer 1',
    'Line under the headline',
    'text',
    903
  ),
  (
    'offer1.until',
    'This offer is only until the end of the month. Only until {date}.',
    'Offer 1',
    'Deadline line. {date} becomes the last day of next month.',
    'text',
    904
  ),
  (
    'offer1.body',
    E'We''ll pay for your transportation to our home. The month you move in is *free*.\n\nWe guarantee you safety, stability, and a home.\n\nIf you decide this is not the place for you, we''ll give you a *100% refund* within 7 days of move-in.\n\nOnce you become a resident, on your second successful referral, your full month''s rent will be only *$125* for the whole month.\n\nEach additional successful referral gives you another month of *$125* in rent.',
    'Offer 1',
    'Offer paragraphs. A blank line starts a new paragraph. *asterisks* stand out.',
    'textarea',
    905
  ),
  (
    'offer1.more',
    'Plus, we help you earn more and keep more.',
    'Offer 1',
    'Line above the three programs. Leave blank to hide it.',
    'text',
    906
  ),
  (
    'offer1.programs',
    E'NCL Rewards\nEarn free rent credits, gift cards, MARTA passes, and even paid hotel nights for your progress.\n\nNCL Thrive\nWe help you find work and build the skills that raise your income.\n\nNCL Guide\nThe connections and resources to help you move forward.',
    'Offer 1',
    'Programs. First line is the title, the next line is the description. A blank line starts the next program.',
    'textarea',
    907
  ),
  (
    'offer1.home_title',
    'Everything You Need in a Home',
    'Offer 1',
    'Home list heading',
    'text',
    908
  ),
  (
    'offer1.home_items',
    E'Furnished Home\nKitchen\nUtilities\nLaundry\nMARTA Access\nSober & Drug-Free Environment\nAnd More',
    'Offer 1',
    'Home list (one per line)',
    'list',
    909
  ),
  (
    'offer1.future_title',
    'A FEW MONTHS FROM NOW...',
    'Offer 1',
    'Closing heading',
    'text',
    910
  ),
  (
    'offer1.future_lead',
    'Your friends, family, and peers may wonder:',
    'Offer 1',
    'Line under the closing heading',
    'text',
    911
  ),
  (
    'offer1.quotes',
    E'How did you find this home?\nHow did you get so far ahead?\nWhat changed?',
    'Offer 1',
    'Closing questions (one per line)',
    'list',
    912
  ),
  (
    'offer1.sale',
    'Only you will know. *New location sale with limited space. Only until {date}.*',
    'Offer 1',
    'Last line. {date} becomes the last day of next month. *asterisks* stand out.',
    'textarea',
    913
  ),
  (
    'offer1.cta',
    'See if you''re a good fit',
    'Offer 1',
    'Button',
    'text',
    914
  )
on conflict (key) do nothing;
