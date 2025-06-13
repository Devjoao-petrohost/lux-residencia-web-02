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
      admin_access_logs: {
        Row: {
          action: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          id: string
          last_updated: string | null
          setting_name: string | null
          setting_value: Json | null
        }
        Insert: {
          id?: string
          last_updated?: string | null
          setting_name?: string | null
          setting_value?: Json | null
        }
        Update: {
          id?: string
          last_updated?: string | null
          setting_name?: string | null
          setting_value?: Json | null
        }
        Relationships: []
      }
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
          status: string | null
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
          status?: string | null
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
          status?: string | null
        }
        Relationships: []
      }
      hotel_reservas: {
        Row: {
          created_at: string
          data_checkin: string
          data_checkout: string
          documento_hospede: string
          email_hospede: string
          id: string
          metodo_pagamento: string | null
          nome_hospede: string
          numero_pessoas: number
          observacoes: string | null
          quarto_id: string | null
          status: string | null
          telefone_hospede: string
          valor_total: number
        }
        Insert: {
          created_at?: string
          data_checkin: string
          data_checkout: string
          documento_hospede: string
          email_hospede: string
          id?: string
          metodo_pagamento?: string | null
          nome_hospede: string
          numero_pessoas: number
          observacoes?: string | null
          quarto_id?: string | null
          status?: string | null
          telefone_hospede: string
          valor_total: number
        }
        Update: {
          created_at?: string
          data_checkin?: string
          data_checkout?: string
          documento_hospede?: string
          email_hospede?: string
          id?: string
          metodo_pagamento?: string | null
          nome_hospede?: string
          numero_pessoas?: number
          observacoes?: string | null
          quarto_id?: string | null
          status?: string | null
          telefone_hospede?: string
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
      menu_items: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          image: string
          is_available: boolean | null
          name: string
          price: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          image: string
          is_available?: boolean | null
          name: string
          price: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image?: string
          is_available?: boolean | null
          name?: string
          price?: string
          updated_at?: string
        }
        Relationships: []
      }
      mesas_restaurante: {
        Row: {
          capacidade: number
          created_at: string
          id: string
          numero_mesa: string
          status: string | null
        }
        Insert: {
          capacidade: number
          created_at?: string
          id?: string
          numero_mesa: string
          status?: string | null
        }
        Update: {
          capacidade?: number
          created_at?: string
          id?: string
          numero_mesa?: string
          status?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          item_price: string
          menu_item_id: string
          order_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          item_price: string
          menu_item_id: string
          order_id: string
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          item_price?: string
          menu_item_id?: string
          order_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_first_name: string
          customer_last_name: string
          id: string
          payment_method: string
          status: string
          table_number: string
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_first_name: string
          customer_last_name: string
          id?: string
          payment_method: string
          status?: string
          table_number: string
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_first_name?: string
          customer_last_name?: string
          id?: string
          payment_method?: string
          status?: string
          table_number?: string
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          last_login: string | null
          nome: string | null
          role: string | null
          status: string | null
          tentativas_login: number | null
          tentativas_login_total: number | null
          ultima_tentativa: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          last_login?: string | null
          nome?: string | null
          role?: string | null
          status?: string | null
          tentativas_login?: number | null
          tentativas_login_total?: number | null
          ultima_tentativa?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          last_login?: string | null
          nome?: string | null
          role?: string | null
          status?: string | null
          tentativas_login?: number | null
          tentativas_login_total?: number | null
          ultima_tentativa?: string | null
          username?: string | null
        }
        Relationships: []
      }
      quartos: {
        Row: {
          capacidade: number
          created_at: string | null
          descricao: string | null
          foto_url: string | null
          id: string
          nome: string
          numero_quarto: string
          preco_noite: number
          servicos: string[] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          capacidade: number
          created_at?: string | null
          descricao?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          numero_quarto: string
          preco_noite: number
          servicos?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          capacidade?: number
          created_at?: string | null
          descricao?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          numero_quarto?: string
          preco_noite?: number
          servicos?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quartos_hotel: {
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
          status: string | null
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
          status?: string | null
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
          status?: string | null
        }
        Relationships: []
      }
      reservas: {
        Row: {
          created_at: string | null
          data_checkin: string
          data_checkout: string
          documento_hospede: string
          email_hospede: string
          id: string
          metodo_pagamento: string | null
          nome_hospede: string
          numero_pessoas: number
          observacoes: string | null
          quarto_id: string | null
          status: string | null
          telefone_hospede: string
          updated_at: string | null
          valor_total: number
        }
        Insert: {
          created_at?: string | null
          data_checkin: string
          data_checkout: string
          documento_hospede: string
          email_hospede: string
          id?: string
          metodo_pagamento?: string | null
          nome_hospede: string
          numero_pessoas: number
          observacoes?: string | null
          quarto_id?: string | null
          status?: string | null
          telefone_hospede: string
          updated_at?: string | null
          valor_total: number
        }
        Update: {
          created_at?: string | null
          data_checkin?: string
          data_checkout?: string
          documento_hospede?: string
          email_hospede?: string
          id?: string
          metodo_pagamento?: string | null
          nome_hospede?: string
          numero_pessoas?: number
          observacoes?: string | null
          quarto_id?: string | null
          status?: string | null
          telefone_hospede?: string
          updated_at?: string | null
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "reservas_quarto_id_fkey"
            columns: ["quarto_id"]
            isOneToOne: false
            referencedRelation: "quartos"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas_hotel: {
        Row: {
          created_at: string
          data_checkin: string
          data_checkout: string
          documento_hospede: string
          email_hospede: string
          id: string
          metodo_pagamento: string | null
          nome_hospede: string
          numero_pessoas: number
          observacoes: string | null
          quarto_id: string | null
          status: string | null
          telefone_hospede: string
          valor_total: number
        }
        Insert: {
          created_at?: string
          data_checkin: string
          data_checkout: string
          documento_hospede: string
          email_hospede: string
          id?: string
          metodo_pagamento?: string | null
          nome_hospede: string
          numero_pessoas: number
          observacoes?: string | null
          quarto_id?: string | null
          status?: string | null
          telefone_hospede: string
          valor_total: number
        }
        Update: {
          created_at?: string
          data_checkin?: string
          data_checkout?: string
          documento_hospede?: string
          email_hospede?: string
          id?: string
          metodo_pagamento?: string | null
          nome_hospede?: string
          numero_pessoas?: number
          observacoes?: string | null
          quarto_id?: string | null
          status?: string | null
          telefone_hospede?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "reservas_hotel_quarto_id_fkey"
            columns: ["quarto_id"]
            isOneToOne: false
            referencedRelation: "quartos_hotel"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas_restaurante: {
        Row: {
          created_at: string
          data_reserva: string
          email_cliente: string
          id: string
          mesa_id: string | null
          nome_cliente: string
          numero_pessoas: number
          observacoes: string | null
          status: string | null
          telefone_cliente: string
        }
        Insert: {
          created_at?: string
          data_reserva: string
          email_cliente: string
          id?: string
          mesa_id?: string | null
          nome_cliente: string
          numero_pessoas: number
          observacoes?: string | null
          status?: string | null
          telefone_cliente: string
        }
        Update: {
          created_at?: string
          data_reserva?: string
          email_cliente?: string
          id?: string
          mesa_id?: string | null
          nome_cliente?: string
          numero_pessoas?: number
          observacoes?: string | null
          status?: string | null
          telefone_cliente?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservas_restaurante_mesa_id_fkey"
            columns: ["mesa_id"]
            isOneToOne: false
            referencedRelation: "mesas_restaurante"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          check_in_date: string | null
          check_out_date: string | null
          created_at: string
          guest_bi: string | null
          guest_contact: string | null
          guest_name: string | null
          id: string
          room_number: string
          status: string
          updated_at: string
        }
        Insert: {
          check_in_date?: string | null
          check_out_date?: string | null
          created_at?: string
          guest_bi?: string | null
          guest_contact?: string | null
          guest_name?: string | null
          id?: string
          room_number: string
          status?: string
          updated_at?: string
        }
        Update: {
          check_in_date?: string | null
          check_out_date?: string | null
          created_at?: string
          guest_bi?: string | null
          guest_contact?: string | null
          guest_name?: string | null
          id?: string
          room_number?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          password_hash: string
          role: string
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          password_hash: string
          role: string
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          password_hash?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_public_profile: {
        Args: { username_input: string }
        Returns: {
          email: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
