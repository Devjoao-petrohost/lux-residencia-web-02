export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      hotel_quartos: {
        Row: {
          capacidade: number
          created_at: string
          descricao: string | null
          foto_url: string | null
          id: string
          nome: string
          numero_quarto: string
          preco_noite: number
          servicos: string[] | null
          status: Database["public"]["Enums"]["quarto_status"]
          updated_at: string
        }
        Insert: {
          capacidade: number
          created_at?: string
          descricao?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          numero_quarto: string
          preco_noite: number
          servicos?: string[] | null
          status?: Database["public"]["Enums"]["quarto_status"]
          updated_at?: string
        }
        Update: {
          capacidade?: number
          created_at?: string
          descricao?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          numero_quarto?: string
          preco_noite?: number
          servicos?: string[] | null
          status?: Database["public"]["Enums"]["quarto_status"]
          updated_at?: string
        }
        Relationships: []
      }
      hotel_reservas: {
        Row: {
          created_at: string
          data_checkin: string
          data_checkout: string
          documento_hospede: string | null
          email_hospede: string | null
          id: string
          metodo_pagamento: string | null
          nome_hospede: string
          numero_pessoas: number
          observacoes: string | null
          quarto_id: string
          status: Database["public"]["Enums"]["reserva_status"]
          telefone_hospede: string | null
          updated_at: string
          valor_total: number
        }
        Insert: {
          created_at?: string
          data_checkin: string
          data_checkout: string
          documento_hospede?: string | null
          email_hospede?: string | null
          id?: string
          metodo_pagamento?: string | null
          nome_hospede: string
          numero_pessoas: number
          observacoes?: string | null
          quarto_id: string
          status?: Database["public"]["Enums"]["reserva_status"]
          telefone_hospede?: string | null
          updated_at?: string
          valor_total: number
        }
        Update: {
          created_at?: string
          data_checkin?: string
          data_checkout?: string
          documento_hospede?: string | null
          email_hospede?: string | null
          id?: string
          metodo_pagamento?: string | null
          nome_hospede?: string
          numero_pessoas?: number
          observacoes?: string | null
          quarto_id?: string
          status?: Database["public"]["Enums"]["reserva_status"]
          telefone_hospede?: string | null
          updated_at?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "hotel_reservas_quarto_id_fkey"
            columns: ["quarto_id"]
            isOneToOne: false
            referencedRelation: "hotel_quartos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nome: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          nome?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { p_user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      quarto_status: "disponivel" | "ocupado" | "manutencao"
      reserva_status: "confirmada" | "pendente" | "cancelada" | "concluida"
      user_role: "admin_restaurante" | "admin_hotel" | "admin_total"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      quarto_status: ["disponivel", "ocupado", "manutencao"],
      reserva_status: ["confirmada", "pendente", "cancelada", "concluida"],
      user_role: ["admin_restaurante", "admin_hotel", "admin_total"],
    },
  },
} as const
