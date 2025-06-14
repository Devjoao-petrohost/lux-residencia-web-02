
-- Corrigindo o cast para que o UNION funcione corretamente
SELECT 'auth.users' AS tabela, id::text AS id, email, created_at::text AS created_at
FROM auth.users 
WHERE id::text IN (
  '381d5441-888b-4011-a9ce-ae07ddd4f7ec',
  'afb957aa-07ff-487c-8253-3d351018640f'
)
UNION ALL
SELECT 'profiles', id::text, email, created_at::text
FROM profiles 
WHERE id::text IN (
  '381d5441-888b-4011-a9ce-ae07ddd4f7ec', 
  'afb957aa-07ff-487c-8253-3d351018640f'
);

-- Atualizar a senha, confirmação e timestamps nos users
UPDATE auth.users 
SET encrypted_password = crypt('hotel123!', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now()
WHERE id = '381d5441-888b-4011-a9ce-ae07ddd4f7ec';

UPDATE auth.users 
SET encrypted_password = crypt('total123!', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now()
WHERE id = 'afb957aa-07ff-487c-8253-3d351018640f';

-- Se não existirem, criá-los
INSERT INTO auth.users (
  id, 
  instance_id, 
  email, 
  encrypted_password, 
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  aud,
  role
) VALUES
(
  '381d5441-888b-4011-a9ce-ae07ddd4f7ec',
  '00000000-0000-0000-0000-000000000000',
  'hotel@masperesidencial.com',
  crypt('hotel123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"role": "admin_hotel"}',
  'authenticated',
  'authenticated'
),
(
  'afb957aa-07ff-487c-8253-3d351018640f',
  '00000000-0000-0000-0000-000000000000',
  'administrador@masperesidencial.com',
  crypt('total123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"role": "admin_total"}',
  'authenticated',
  'authenticated'
)
ON CONFLICT (id) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  updated_at = EXCLUDED.updated_at;

-- Atualizar/criar perfis correspondentes
INSERT INTO profiles (
  id,
  email,
  nome,
  role,
  status,
  created_at
) VALUES
(
  '381d5441-888b-4011-a9ce-ae07ddd4f7ec',
  'hotel@masperesidencial.com',
  'Administrador Hotel',
  'admin_hotel',
  'ativo',
  now()
),
(
  'afb957aa-07ff-487c-8253-3d351018640f',
  'administrador@masperesidencial.com',
  'Administrador Total',
  'admin_total',
  'ativo',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  nome = EXCLUDED.nome,
  role = EXCLUDED.role,
  status = EXCLUDED.status;
