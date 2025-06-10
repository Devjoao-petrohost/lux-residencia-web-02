
import { useState } from 'react';
import { Calendar, User, Phone, Mail, CreditCard } from 'lucide-react';
import { useReservasHotel } from '@/hooks/useReservasHotel';
import type { ReservaHotel } from '@/lib/supabase';

interface ReservasListProps {
  quartoId?: string;
}

export function ReservasList({ quartoId }: ReservasListProps) {
  const { reservas, loading, atualizarReserva } = useReservasHotel();
  const [selectedStatus, setSelectedStatus] = useState<string>('todas');

  const reservasFiltradas = reservas.filter(reserva => {
    const matchQuarto = !quartoId || reserva.quarto_id === quartoId;
    const matchStatus = selectedStatus === 'todas' || reserva.status === selectedStatus;
    return matchQuarto && matchStatus;
  });

  const handleStatusChange = async (reservaId: string, novoStatus: string) => {
    await atualizarReserva(reservaId, { status: novoStatus as any });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'concluida': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmada': return 'Confirmada';
      case 'pendente': return 'Pendente';
      case 'cancelada': return 'Cancelada';
      case 'concluida': return 'Concluída';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal mx-auto"></div>
        <p className="mt-2 font-sora text-stone-grey">Carregando reservas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-sora text-xl font-bold text-charcoal">
          Reservas {quartoId ? 'do Quarto' : 'Gerais'}
        </h3>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-stone-grey font-sora text-sm"
        >
          <option value="todas">Todas</option>
          <option value="pendente">Pendentes</option>
          <option value="confirmada">Confirmadas</option>
          <option value="concluida">Concluídas</option>
          <option value="cancelada">Canceladas</option>
        </select>
      </div>

      {reservasFiltradas.length === 0 ? (
        <div className="bg-pure-white p-8 text-center border border-stone-grey">
          <Calendar className="w-12 h-12 text-stone-grey mx-auto mb-4" />
          <p className="font-sora text-stone-grey">Nenhuma reserva encontrada</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservasFiltradas.map((reserva) => (
            <div key={reserva.id} className="bg-pure-white p-6 border border-stone-grey shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-charcoal" />
                  <h4 className="font-sora font-semibold text-charcoal">
                    {reserva.nome_hospede}
                  </h4>
                </div>
                <select
                  value={reserva.status}
                  onChange={(e) => handleStatusChange(reserva.id, e.target.value)}
                  className={`px-3 py-1 text-xs font-sora border-0 ${getStatusColor(reserva.status)}`}
                >
                  <option value="pendente">Pendente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-stone-grey" />
                  <span className="font-sora text-charcoal">
                    {new Date(reserva.data_checkin).toLocaleDateString('pt-AO')} - 
                    {new Date(reserva.data_checkout).toLocaleDateString('pt-AO')}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-stone-grey" />
                  <span className="font-sora text-charcoal">{reserva.telefone_hospede}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-stone-grey" />
                  <span className="font-sora text-charcoal">{reserva.email_hospede}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-stone-grey" />
                  <span className="font-sora font-semibold text-charcoal">
                    {reserva.valor_total.toLocaleString('pt-AO')} Kz
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center text-xs">
                <span className="font-sora text-stone-grey">
                  {reserva.numero_pessoas} pessoa{reserva.numero_pessoas > 1 ? 's' : ''}
                </span>
                <span className="font-sora text-stone-grey">
                  {reserva.metodo_pagamento}
                </span>
              </div>

              {reserva.observacoes && (
                <div className="mt-3 p-3 bg-off-white">
                  <p className="font-sora text-sm text-charcoal">{reserva.observacoes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
