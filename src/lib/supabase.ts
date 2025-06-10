
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://niwmjfpyetfhthwloqms.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pd21qZnB5ZXRmaHRod2xvcW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MjUxMzQsImV4cCI6MjA2NTEwMTEzNH0.DgAMcL_Eyf-Bx75pppKadlNrtlfzqH3SCgplo2bkJc0";

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
}

export interface PerfilUsuario {
  id: string;
  nome?: string;
  email?: string;
  username?: string;
  role: 'admin_restaurante' | 'admin_hotel' | 'admin_total';
  created_at: string;
}
