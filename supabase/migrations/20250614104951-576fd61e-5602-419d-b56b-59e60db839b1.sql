
-- Garante que o Row Level Security (RLS) esteja habilitado para a tabela de perfis.
-- Se já estiver habilitado, este comando não fará nada prejudicial.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Permite que usuários autenticados leiam (SELECT) seus próprios dados da tabela 'profiles'.
-- Isso é crucial para que a função buscarPerfil() consiga carregar os dados do usuário logado.
DROP POLICY IF EXISTS "Authenticated users can view their own profile" ON public.profiles;
CREATE POLICY "Authenticated users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Permite que usuários autenticados atualizem (UPDATE) seus próprios dados na tabela 'profiles'.
-- Isso será útil para futuras funcionalidades de edição de perfil.
DROP POLICY IF EXISTS "Authenticated users can update their own profile" ON public.profiles;
CREATE POLICY "Authenticated users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Assegura que a função handle_new_user (que cria o perfil quando um novo usuário se registra)
-- também popule o email no perfil. O campo 'role' geralmente é definido administrativamente
-- ou por outra lógica, então vamos focar no email por agora.
-- A função existente apenas insere o ID.
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, nome) -- Adicionado email e nome
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name'); -- Obtendo email do objeto 'new' e nome de raw_user_meta_data
  RETURN new;
END;
$function$
