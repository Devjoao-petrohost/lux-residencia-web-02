
-- Insere o perfil para o usuário 'hotel' se não existir
INSERT INTO public.profiles (id, email, nome, role, created_at)
VALUES 
  ('381d5441-888b-4011-a9ce-ae07ddd4f7ec', 'hotel@masperesidencial.com', 'Hotel Maspé', 'admin_hotel', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insere o perfil para o usuário 'admin total' se não existir
INSERT INTO public.profiles (id, email, nome, role, created_at)
VALUES 
  ('afb957aa-07ff-487c-8253-3d351018640f', 'administrador@masperesidencial.com', 'Administrador', 'admin_total', NOW())
ON CONFLICT (id) DO NOTHING;
