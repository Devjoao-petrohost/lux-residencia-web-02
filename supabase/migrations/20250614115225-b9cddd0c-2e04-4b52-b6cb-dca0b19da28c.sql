
-- Passo 1: Limpar objetos antigos para evitar conflitos.
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.get_user_role(uuid);
DROP TABLE IF EXISTS public.profiles;
DROP TYPE IF EXISTS public.user_role;

-- Passo 2: Criar um tipo de role para consistência dos dados, incluindo todas as roles do app.
CREATE TYPE public.user_role AS ENUM ('admin_restaurante', 'admin_hotel', 'admin_total');

-- Passo 3: Criar a tabela de perfis.
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  email TEXT UNIQUE,
  role public.user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Passo 4: Habilitar Row Level Security (RLS) na nova tabela.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Passo 5: Criar as políticas de acesso para os perfis.
-- 5.1: Usuários podem ver seu próprio perfil.
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- 5.2: Usuários podem atualizar seu próprio perfil.
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5.3: Criar uma função para verificar a role do usuário sem causar recursão.
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID)
RETURNS public.user_role AS $$
DECLARE
  v_role public.user_role;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = p_user_id;
  RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5.4: Permitir que 'admin_total' veja todos os perfis.
CREATE POLICY "Total admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.get_user_role(auth.uid()) = 'admin_total');

-- Passo 6: Criar um gatilho (trigger) para criar um perfil automaticamente para novos usuários.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insere um perfil básico. A role será 'admin_hotel' por padrão.
  INSERT INTO public.profiles (id, email, nome, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'nome', 'admin_hotel');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

