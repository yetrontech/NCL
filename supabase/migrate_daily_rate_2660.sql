-- Daily rate $25 → $26.60, and the monthly rent that goes with it $775 → $798.
-- Safe to re-run. Run in the Supabase SQL Editor.

update public.site_content
set value = replace(value, '$25', '$26.60')
where value like '%$25%';

update public.site_content
set value = replace(value, '$775', '$798')
where value like '%$775%';
