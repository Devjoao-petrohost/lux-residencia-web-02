
-- Atualizar senhas para usuários específicos e garantir que estão confirmados e ativos

-- Usuário Hotel: hotel@masperesidencial.com
-- UID: 381d5441-888b-4011-a9ce-ae07ddd4f7ec
-- Nova Senha: QfxGArPG06+5
UPDATE auth.users
SET
  encrypted_password = crypt('QfxGArPG06+5', gen_salt('bf')),
  email_confirmed_at = now(), -- Garante que o email está confirmado
  updated_at = now()
WHERE id = '381d5441-888b-4011-a9ce-ae07ddd4f7ec';

UPDATE public.profiles
SET
  email = 'hotel@masperesidencial.com', -- Garante que o email no perfil está correto
  status = 'ativo'                   -- Garante que o perfil está ativo
WHERE id = '381d5441-888b-4011-a9ce-ae07ddd4f7ec';

-- Usuário Admin Total: administrador@masperesidencial.com
-- UID: afb957aa-07ff-487c-8253-3d351018640f
-- Nova Senha: QfxGArPG06+4
UPDATE auth.users
SET
  encrypted_password = crypt('QfxGArPG06+4', gen_salt('bf')),
  email_confirmed_at = now(), -- Garante que o email está confirmado
  updated_at = now()
WHERE id = 'afb957aa-07ff-487c-8253-3d351018640f';

UPDATE public.profiles
SET
  email = 'administrador@masperesidencial.com', -- Garante que o email no perfil está correto
  status = 'ativo'                              -- Garante que o perfil está ativo
WHERE id = 'afb957aa-07ff-487c-8253-3d351018640f';

