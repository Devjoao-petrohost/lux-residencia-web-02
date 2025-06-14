
import { useState, useEffect } from 'react';
import { supabase, type ReservaHotel, type ReservaHotelComQuarto } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export function useReservasHotel() {
  const [reservas, setReservas] = useState<ReservaHotelComQuarto[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarReservas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hotel_reservas')
        .select(`
          *,
          hotel_quartos (
            numero_quarto,
            nome
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar reservas:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as reservas.",
          variant: "destructive"
        });
      } else {
        setReservas((data as ReservaHotelComQuarto[]) || []);
      }
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const criarReserva = async (reserva: Omit<ReservaHotel, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('hotel_reservas')
        .insert([reserva])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar reserva:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criar a reserva.",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Reserva criada com sucesso!",
      });

      await carregarReservas();
      return data;
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      return null;
    }
  };

  const atualizarReserva = async (id: string, updates: Partial<ReservaHotel>) => {
    try {
      const { error } = await supabase
        .from('hotel_reservas')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar reserva:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a reserva.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Reserva atualizada com sucesso!",
      });

      await carregarReservas();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      return false;
    }
  };

  useEffect(() => {
    carregarReservas();
  }, []);

  return {
    reservas,
    loading,
    carregarReservas,
    criarReserva,
    atualizarReserva
  };
}
