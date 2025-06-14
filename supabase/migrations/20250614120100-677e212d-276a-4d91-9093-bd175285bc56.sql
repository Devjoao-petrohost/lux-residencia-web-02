
-- Passo 1: Criar os tipos ENUM para os status, garantindo consistência dos dados.
CREATE TYPE public.quarto_status AS ENUM ('disponivel', 'ocupado', 'manutencao');
CREATE TYPE public.reserva_status AS ENUM ('confirmada', 'pendente', 'cancelada', 'concluida');

-- Passo 2: Criar uma função de trigger para atualizar o campo 'updated_at' automaticamente.
-- Isso é útil para rastrear quando um registro foi modificado pela última vez.
CREATE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Passo 3: Criar a tabela para armazenar os quartos do hotel.
CREATE TABLE public.hotel_quartos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_quarto TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco_noite NUMERIC(10, 2) NOT NULL,
  capacidade INTEGER NOT NULL,
  foto_url TEXT,
  status public.quarto_status NOT NULL DEFAULT 'disponivel',
  servicos TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adicionar o trigger de atualização à tabela de quartos.
CREATE TRIGGER set_hotel_quartos_updated_at
BEFORE UPDATE ON public.hotel_quartos
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

COMMENT ON TABLE public.hotel_quartos IS 'Armazena informações sobre os quartos do hotel.';
COMMENT ON COLUMN public.hotel_quartos.preco_noite IS 'Preço por noite na moeda local (ex: Kwanza).';

-- Passo 4: Criar a tabela para armazenar as reservas do hotel.
CREATE TABLE public.hotel_reservas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quarto_id UUID NOT NULL REFERENCES public.hotel_quartos(id) ON DELETE RESTRICT, -- Impede apagar um quarto que tenha reservas.
  nome_hospede TEXT NOT NULL,
  documento_hospede TEXT,
  telefone_hospede TEXT,
  email_hospede TEXT,
  data_checkin DATE NOT NULL,
  data_checkout DATE NOT NULL,
  numero_pessoas INTEGER NOT NULL,
  valor_total NUMERIC(10, 2) NOT NULL,
  status public.reserva_status NOT NULL DEFAULT 'pendente',
  metodo_pagamento TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adicionar o trigger de atualização à tabela de reservas.
CREATE TRIGGER set_hotel_reservas_updated_at
BEFORE UPDATE ON public.hotel_reservas
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

COMMENT ON TABLE public.hotel_reservas IS 'Armazena as reservas dos quartos do hotel.';
COMMENT ON COLUMN public.hotel_reservas.valor_total IS 'Valor total da reserva na moeda local (ex: Kwanza).';

-- Passo 5: Habilitar Row Level Security (RLS) para proteger os dados.
ALTER TABLE public.hotel_quartos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_reservas ENABLE ROW LEVEL SECURITY;

-- Passo 6: Criar as políticas de acesso (regras de segurança) para a tabela de quartos.
-- 6.1: Qualquer pessoa (mesmo não autenticada) pode ver os quartos.
CREATE POLICY "Public can view hotel rooms"
ON public.hotel_quartos FOR SELECT
USING (true);

-- 6.2: Apenas 'admin_hotel' e 'admin_total' podem gerenciar (criar, atualizar, apagar) os quartos.
-- A função get_user_role() já existe de uma migração anterior.
CREATE POLICY "Admins can manage hotel rooms"
ON public.hotel_quartos FOR ALL
USING (public.get_user_role(auth.uid()) IN ('admin_hotel', 'admin_total'))
WITH CHECK (public.get_user_role(auth.uid()) IN ('admin_hotel', 'admin_total'));

-- Passo 7: Criar as políticas de acesso para a tabela de reservas.
-- 7.1: Apenas 'admin_hotel' e 'admin_total' podem gerenciar todas as reservas.
CREATE POLICY "Admins can manage hotel reservations"
ON public.hotel_reservas FOR ALL
USING (public.get_user_role(auth.uid()) IN ('admin_hotel', 'admin_total'))
WITH CHECK (public.get_user_role(auth.uid()) IN ('admin_hotel', 'admin_total'));

-- Passo 8: Preparar as tabelas para atualizações em tempo real (Realtime).
ALTER TABLE public.hotel_quartos REPLICA IDENTITY FULL;
ALTER TABLE public.hotel_reservas REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.hotel_quartos, public.hotel_reservas;
  END IF;
END $$;
