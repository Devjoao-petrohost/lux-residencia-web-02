import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tbbifdwzuxxtbaheqgpy.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiYmlmZHd6dXh4dGJhaGVxZ3B5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2ODk2NzcsImV4cCI6MjA2NTI2NTY3N30.A4XGZMQXDxWkpJKVxmk8uGM8cLz-ZySBKRqTXHBvdJM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para o sistema do hotel
export interface QuartoHotel {
  id: string;
  numero_quarto: string;
  nome: string;
  descricao: string;
  preco_noite: number;
  capacidade: number;
  foto_url: string;
  status: 'disponivel' | 'ocupado' | 'manutencao';
  servicos: string[];
  created_at: string;
  updated_at: string;
}

export interface ReservaHotel {
  id: string;
  quarto_id: string;
  nome_hospede: string;
  documento_hospede: string;
  telefone_hospede: string;
  email_hospede: string;
  data_checkin: string;
  data_checkout: string;
  numero_pessoas: number;
  valor_total: number;
  status: 'confirmada' | 'pendente' | 'cancelada' | 'concluida';
  metodo_pagamento: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export type ReservaHotelComQuarto = ReservaHotel & {
  hotel_quartos: {
    numero_quarto: string;
    nome: string;
  } | null;
};

export interface PerfilUsuario {
  id: string;
  nome?: string;
  email?: string;
  role: 'admin_restaurante' | 'admin_hotel' | 'admin_total';
  created_at: string;
  updated_at: string;
}
