begin;

-- Import guard for the one-time CPA 1.2 bulk load. PostgreSQL row-level BEFORE
-- triggers can see rows already processed earlier in the same INSERT statement,
-- so this prevents a duplicate source row from reaching ON CONFLICT twice.
create or replace function public.cpa_curriculum_import_dedupe()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.certification_id = 'CPA'
     and new.program_version = '1.2'
     and exists (
       select 1
       from public.curriculum_items existing
       where existing.certification_id = new.certification_id
         and existing.pd_code = new.pd_code
     ) then
    return null;
  end if;

  return new;
end;
$$;

revoke all on function public.cpa_curriculum_import_dedupe() from public, anon, authenticated;

create trigger cpa_curriculum_import_dedupe
before insert on public.curriculum_items
for each row execute function public.cpa_curriculum_import_dedupe();

commit;
