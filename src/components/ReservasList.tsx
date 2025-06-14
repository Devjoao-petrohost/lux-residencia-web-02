import { useState } from 'react';
import { Calendar, User, Phone, Mail, CreditCard, Filter, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { useReservasHotel } from '@/hooks/useReservasHotel';
import { toast } from '@/hooks/use-toast';
import type { ReservaHotelComQuarto } from '@/lib/supabase';

interface ReservasListProps {
  quartoId?: string;
}

export function ReservasList({ quartoId }: ReservasListProps) {
  const { reservas, loading, atualizarReserva } = useReservasHotel();
  const [selectedStatus, setSelectedStatus] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'name'>('date');

  const reservasFiltradas = (reservas as ReservaHotelComQuarto[]).filter(reserva => {
    const matchQuarto = !quartoId || reserva.quarto_id === quartoId;
    const matchStatus = selectedStatus === 'todas' || reserva.status === selectedStatus;
    const matchSearch = !searchTerm || 
      reserva.nome_hospede.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.documento_hospede.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.telefone_hospede.includes(searchTerm) ||
      reserva.email_hospede.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchQuarto && matchStatus && matchSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'value':
        return b.valor_total - a.valor_total;
      case 'name':
        return a.nome_hospede.localeCompare(b.nome_hospede);
      default:
        return 0;
    }
  });

  const handleStatusChange = async (reservaId: string, novoStatus: string) => {
    const success = await atualizarReserva(reservaId, { status: novoStatus as any });
    if (success) {
      toast({
        title: "Status atualizado",
        description: "Status da reserva foi alterado com sucesso.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-800 border-green-200';
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'concluida': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const statsReservas = {
    total: reservasFiltradas.length,
    confirmadas: reservasFiltradas.filter(r => r.status === 'confirmada').length,
    pendentes: reservasFiltradas.filter(r => r.status === 'pendente').length,
    canceladas: reservasFiltradas.filter(r => r.status === 'cancelada').length,
    concluidas: reservasFiltradas.filter(r => r.status === 'concluida').length,
    receitaTotal: reservasFiltradas
      .filter(r => r.status === 'confirmada' || r.status === 'concluida')
      .reduce((total, r) => total + r.valor_total, 0)
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal mx-auto"></div>
        <p className="mt-4 font-sora text-stone-grey">Carregando reservas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header e Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="font-sora text-xl font-bold text-charcoal">
            {quartoId ? 'Reservas do Quarto' : 'Todas as Reservas'}
          </h3>
          <p className="font-sora text-sm text-stone-grey">
            {statsReservas.total} reserva{statsReservas.total !== 1 ? 's' : ''} encontrada{statsReservas.total !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="text-center">
            <div className="font-sora text-lg font-bold text-green-600">
              {statsReservas.receitaTotal.toLocaleString('pt-AO')} Kz
            </div>
            <div className="font-sora text-xs text-stone-grey">Receita Total</div>
          </div>
          <div className="text-center">
            <div className="font-sora text-lg font-bold text-blue-600">{statsReservas.confirmadas}</div>
            <div className="font-sora text-xs text-stone-grey">Confirmadas</div>
          </div>
          <div className="text-center">
            <div className="font-sora text-lg font-bold text-yellow-600">{statsReservas.pendentes}</div>
            <div className="font-sora text-xs text-stone-grey">Pendentes</div>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-pure-white p-4 rounded-lg border border-stone-grey">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-grey w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nome, documento, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-grey rounded font-sora text-sm"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-stone-grey rounded font-sora text-sm min-w-[120px]"
            >
              <option value="todas">Todos Status</option>
              <option value="pendente">Pendentes</option>
              <option value="confirmada">Confirmadas</option>
              <option value="concluida">Concluídas</option>
              <option value="cancelada">Canceladas</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-stone-grey rounded font-sora text-sm min-w-[120px]"
            >
              <option value="date">Data</option>
              <option value="value">Valor</option>
              <option value="name">Nome</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Reservas */}
      {reservasFiltradas.length === 0 ? (
        <div className="bg-pure-white p-12 text-center rounded-lg border border-stone-grey">
          <Calendar className="w-16 h-16 text-stone-grey mx-auto mb-4" />
          <h4 className="font-sora text-lg font-semibold text-charcoal mb-2">Nenhuma reserva encontrada</h4>
          <p className="font-sora text-stone-grey">
            {searchTerm || selectedStatus !== 'todas' 
              ? 'Tente ajustar os filtros para encontrar reservas.' 
              : 'Ainda não há reservas registradas.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservasFiltradas.map((reserva) => (
            <div key={reserva.id} className="bg-pure-white rounded-lg border border-stone-grey shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-charcoal" />
                    <div>
                      <h4 className="font-sora font-semibold text-charcoal text-lg">
                        {reserva.nome_hospede}
                      </h4>
                      <p className="font-sora text-sm text-stone-grey">
                        Reserva #{reserva.id.slice(0, 8).toUpperCase()}
                        {reserva.hotel_quartos && (
                          <span className="ml-2 font-medium">
                            - Quarto {reserva.hotel_quartos.numero_quarto} ({reserva.hotel_quartos.nome})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <select
                      value={reserva.status}
                      onChange={(e) => handleStatusChange(reserva.id, e.target.value)}
                      className={`px-3 py-2 text-sm font-sora font-medium border rounded-lg ${getStatusColor(reserva.status)}`}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="concluida">Concluída</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                    
                    <div className="text-right">
                      <div className="font-sora font-bold text-charcoal">
                        {reserva.valor_total.toLocaleString('pt-AO')} Kz
                      </div>
                      <div className="font-sora text-xs text-stone-grey">
                        {reserva.metodo_pagamento}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-stone-grey" />
                    <div>
                      <div className="font-sora text-charcoal font-medium">
                        {new Date(reserva.data_checkin).toLocaleDateString('pt-AO')}
                      </div>
                      <div className="font-sora text-stone-grey text-xs">
                        até {new Date(reserva.data_checkout).toLocaleDateString('pt-AO')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-stone-grey" />
                    <div>
                      <div className="font-sora text-charcoal">{reserva.telefone_hospede}</div>
                      <div className="font-sora text-stone-grey text-xs">{reserva.documento_hospede}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-stone-grey" />
                    <div>
                      <div className="font-sora text-charcoal">{reserva.email_hospede || 'Não informado'}</div>
                      <div className="font-sora text-stone-grey text-xs">
                        {reserva.numero_pessoas} pessoa{reserva.numero_pessoas > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-right flex-1">
                      <div className="font-sora text-charcoal text-xs">
                        Criada em {new Date(reserva.created_at).toLocaleDateString('pt-AO')}
                      </div>
                      <div className="font-sora text-stone-grey text-xs">
                        às {new Date(reserva.created_at).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>

                {reserva.observacoes && (
                  <div className="mt-4 p-3 bg-off-white rounded border-l-4 border-charcoal">
                    <p className="font-sora text-sm text-charcoal">
                      <strong>Observações:</strong> {reserva.observacoes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
