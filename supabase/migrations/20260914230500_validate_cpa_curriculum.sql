begin;

do $$
declare
  item_count integer;
  orphan_count integer;
  wrong_version_count integer;
  root_count integer;
  weight_sum numeric;
begin
  select count(*)
    into item_count
  from public.curriculum_items
  where certification_id = 'CPA';

  if item_count <> 590 then
    raise exception 'CPA 1.2 curriculum validation failed: expected 590 items, found %', item_count;
  end if;

  select count(*)
    into wrong_version_count
  from public.curriculum_items
  where certification_id = 'CPA'
    and coalesce(program_version, '') <> '1.2';

  if wrong_version_count <> 0 then
    raise exception 'CPA 1.2 curriculum validation failed: % items have a different program version', wrong_version_count;
  end if;

  select count(*)
    into root_count
  from public.curriculum_items
  where certification_id = 'CPA'
    and parent_id is null;

  if root_count <> 4 then
    raise exception 'CPA 1.2 curriculum validation failed: expected 4 root macrothemes, found %', root_count;
  end if;

  select count(*)
    into orphan_count
  from public.curriculum_items child
  where child.certification_id = 'CPA'
    and child.pd_code like '%.%'
    and child.parent_id is null;

  if orphan_count <> 0 then
    raise exception 'CPA 1.2 curriculum validation failed: % non-root items have no parent', orphan_count;
  end if;

  select coalesce(sum(weight), 0)
    into weight_sum
  from public.curriculum_items
  where certification_id = 'CPA'
    and pd_code in ('1', '2', '3', '4');

  if weight_sum <> 100 then
    raise exception 'CPA 1.2 curriculum validation failed: macrotheme weights total %, expected 100', weight_sum;
  end if;

  if exists (
    select 1
    from public.curriculum_items child
    join public.curriculum_items parent on parent.id = child.parent_id
    where child.certification_id = 'CPA'
      and parent.certification_id = 'CPA'
      and child.pd_code like '%.%'
      and parent.pd_code <> regexp_replace(child.pd_code, '\.[^.]+$', '')
  ) then
    raise exception 'CPA 1.2 curriculum validation failed: invalid parentCode relationship detected';
  end if;
end;
$$;

commit;
