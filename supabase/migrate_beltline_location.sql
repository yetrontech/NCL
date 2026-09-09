-- Add editable copy for the Atlanta BeltLine Access location card.
-- Safe to re-run.

insert into public.site_content (key, value, section, label, field_type, sort_order)
values
  (
    'locations.beltline.name',
    'Atlanta BeltLine Access',
    'Locations',
    'Atlanta BeltLine property name',
    'text',
    106
  ),
  (
    'locations.beltline.features',
    'Atlanta BeltLine access
All-inclusive $25/day
On-site house manager
Shared common areas',
    'Locations',
    'Atlanta BeltLine features (one per line)',
    'list',
    107
  )
on conflict (key) do nothing;
