-- Seed opcional de desenvolvimento.
-- Intencionalmente não cria usuários, senhas, questões ou conteúdo regulatório.
-- As certificações-base também são criadas pela migration para manter o schema utilizável sem seed.

insert into public.certifications (id, name, full_name, available)
values
  ('CPA', 'CPA', 'Certificado Profissional ANBIMA', true),
  ('C-PRO-R', 'C-Pro R', 'C-Pro R', false),
  ('C-PRO-I', 'C-Pro I', 'C-Pro I', false),
  ('CFG', 'CFG', 'CFG', false),
  ('CGA', 'CGA', 'CGA', false),
  ('CGE', 'CGE', 'CGE', false)
on conflict (id) do update set
  name = excluded.name,
  full_name = excluded.full_name,
  available = excluded.available;
