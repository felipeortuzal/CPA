begin;

drop trigger if exists cpa_curriculum_import_dedupe on public.curriculum_items;
drop function if exists public.cpa_curriculum_import_dedupe();

commit;
