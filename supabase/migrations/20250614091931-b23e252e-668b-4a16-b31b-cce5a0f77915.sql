
-- Habilita Row Level Security na tabela 'profiles' se ainda não estiver habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários visualizem seus próprios perfis
CREATE POLICY "Usuários podem visualizar seus próprios perfis"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Política para permitir que usuários atualizem seus próprios perfis
-- (Útil para futuras funcionalidades de edição de perfil)
CREATE POLICY "Usuários podem atualizar seus próprios perfis"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Nota: A inserção de novos perfis (com apenas o ID) já é tratada pelo trigger 'handle_new_user',
-- que opera com permissões elevadas (SECURITY DEFINER).
