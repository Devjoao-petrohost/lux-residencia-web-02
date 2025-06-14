import { useState, useEffect } from 'react';
import { supabase, type QuartoHotel } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export function useQuartosHotel() {
  const [quartos, setQuartos] = useState<QuartoHotel[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarQuartos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hotel_quartos')
        .select('*')
        .order('numero_quarto');

      if (error) {
        console.error('Erro ao carregar quartos:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os quartos.",
          variant: "destructive"
        });
      } else {
        setQuartos(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar quartos:', error);
    } finally {
      setLoading(false);
    }
  };

  const criarQuarto = async (quarto: Omit<QuartoHotel, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('hotel_quartos')
        .insert([quarto])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar quarto:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criar o quarto.",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Sucesso",
        description: "Quarto criado com sucesso!",
      });

      await carregarQuartos();
      return data;
    } catch (error) {
      console.error('Erro ao criar quarto:', error);
      return null;
    }
  };

  const atualizarQuarto = async (id: string, updates: Partial<QuartoHotel>) => {
    try {
      const { error } = await supabase
        .from('hotel_quartos')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar quarto:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o quarto.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Quarto atualizado com sucesso!",
      });

      await carregarQuartos();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar quarto:', error);
      return false;
    }
  };

  const excluirQuarto = async (id: string) => {
    try {
      const { error } = await supabase
        .from('hotel_quartos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir quarto:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o quarto.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Quarto excluído com sucesso!",
      });

      await carregarQuartos();
      return true;
    } catch (error) {
      console.error('Erro ao excluir quarto:', error);
      return false;
    }
  };

  useEffect(() => {
    carregarQuartos();
  }, []);

  return {
    quartos,
    loading,
    carregarQuartos,
    criarQuarto,
    atualizarQuarto,
    excluirQuarto
  };
}
