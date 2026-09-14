begin;

update public.certifications
set
  program_version = '1.2',
  description = 'CPA — Certificado Profissional ANBIMA. Programa Detalhado versão 1.2, revisão de 04/06/2025, vigente desde 01/01/2026.',
  updated_at = now()
where id = 'CPA';

commit;
