
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { useQuartosHotel } from '@/hooks/useQuartosHotel';
import { useReservasHotel } from '@/hooks/useReservasHotel';
import { BarChart3, Hotel, Calendar, Users, DollarSign, TrendingUp, Building, Activity } from 'lucide-react';

const AdminTotal = () => {
  return (
    <ProtectedRoute requiredRoles={['admin_total']}>
      <AdminTotalContent />
    </ProtectedRoute>
  );
};

const AdminTotalContent = () => {
  const { profile } = useAuth();
  const { quartos, loading: loadingQuartos } = useQuartosHotel();
  const { reservas, loading: loadingReservas } = useReservasHotel();

  const stats = {
    // Hotel Stats
    totalQuartos: quartos.length,
    quartosDisponiveis: quartos.filter(q => q.status === 'disponivel').length,
    quartosOcupados: quartos.filter(q => q.status === 'ocupado').length,
    taxaOcupacao: quartos.length > 0 ? Math.round((quartos.filter(q => q.status === 'ocupado').length / quartos.length) * 100) : 0,
    
    // Reservas Stats  
    totalReservas: reservas.length,
    reservasAtivas: reservas.filter(r => r.status === 'confirmada').length,
    reservasPendentes: reservas.filter(r => r.status === 'pendente').length,
    
    // Financial Stats
    receitaTotal: reservas
      .filter(r => r.status === 'confirmada' || r.status === 'concluida')
      .reduce((total, r) => total + r.valor_total, 0),
    receitaMedia: reservas.length > 0 ? 
      reservas.filter(r => r.status === 'confirmada' || r.status === 'concluida')
        .reduce((total, r) => total + r.valor_total, 0) / reservas.filter(r => r.status === 'confirmada' || r.status === 'concluida').length : 0,
    
    // Hoje
    reservasHoje: reservas.filter(r => {
      const hoje = new Date().toISOString().split('T')[0];
      return r.data_checkin === hoje;
    }).length,
    
    checkoutsHoje: reservas.filter(r => {
      const hoje = new Date().toISOString().split('T')[0];
      return r.data_checkout === hoje;
    }).length
  };

  const isLoading = loadingQuartos || loadingReservas;

  if (isLoading) {
    return (
      <AdminLayout title="Painel Executivo" subtitle="Carregando dados...">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal mx-auto"></div>
          <p className="mt-4 font-sora text-stone-grey">Carregando dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Painel Executivo"
      subtitle={`Bem-vindo, ${profile?.nome || profile?.email || 'Administrador'} - Visão Completa`}
      showBackToSite={true}
    >
      <div className="space-y-8">
        {/* Quick Access */}
        <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
          <h3 className="font-sora text-lg font-semibold text-charcoal mb-4">Acesso Rápido</h3>
          <div className="flex flex-wrap gap-4">
            <a 
              href="/admin/hotel" 
              className="btn-primary flex items-center space-x-2"
            >
              <Hotel className="w-5 h-5" />
              <span>Gestão do Hotel</span>
            </a>
            <button className="btn-secondary flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Gestão Restaurante</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded ml-2">Em breve</span>
            </button>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sora text-sm text-stone-grey">Receita Total</p>
                <p className="font-sora text-2xl font-bold text-green-600">
                  {stats.receitaTotal.toLocaleString('pt-AO')} Kz
                </p>
                <p className="font-sora text-xs text-stone-grey mt-1">
                  Média: {stats.receitaMedia.toLocaleString('pt-AO')} Kz
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sora text-sm text-stone-grey">Taxa de Ocupação</p>
                <p className="font-sora text-3xl font-bold text-blue-600">{stats.taxaOcupacao}%</p>
                <p className="font-sora text-xs text-stone-grey mt-1">
                  {stats.quartosOcupados} de {stats.totalQuartos} quartos
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sora text-sm text-stone-grey">Reservas Ativas</p>
                <p className="font-sora text-3xl font-bold text-orange-600">{stats.reservasAtivas}</p>
                <p className="font-sora text-xs text-stone-grey mt-1">
                  {stats.reservasPendentes} pendentes
                </p>
              </div>
              <Users className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>

          <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sora text-sm text-stone-grey">Atividade Hoje</p>
                <p className="font-sora text-3xl font-bold text-purple-600">{stats.reservasHoje}</p>
                <p className="font-sora text-xs text-stone-grey mt-1">
                  {stats.checkoutsHoje} check-outs
                </p>
              </div>
              <Activity className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Hotel Overview */}
          <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-sora text-lg font-semibold text-charcoal flex items-center space-x-2">
                <Hotel className="w-5 h-5" />
                <span>Gestão do Hotel</span>
              </h3>
              <a href="/admin/hotel" className="btn-secondary text-sm">
                Ver Detalhes
              </a>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-sora text-sm text-stone-grey">Total de Quartos</span>
                <span className="font-sora font-semibold text-charcoal">{stats.totalQuartos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sora text-sm text-stone-grey">Quartos Disponíveis</span>
                <span className="font-sora font-semibold text-green-600">{stats.quartosDisponiveis}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sora text-sm text-stone-grey">Quartos Ocupados</span>
                <span className="font-sora font-semibold text-red-600">{stats.quartosOcupados}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-stone-grey">
                <span className="font-sora text-sm text-stone-grey">Taxa de Ocupação</span>
                <span className="font-sora font-bold text-blue-600">{stats.taxaOcupacao}%</span>
              </div>
            </div>
          </div>

          {/* Reservas Overview */}
          <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-sora text-lg font-semibold text-charcoal flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Reservas</span>
              </h3>
              <a href="/admin/hotel" className="btn-secondary text-sm">
                Gerenciar
              </a>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-sora text-sm text-stone-grey">Total de Reservas</span>
                <span className="font-sora font-semibold text-charcoal">{stats.totalReservas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sora text-sm text-stone-grey">Confirmadas</span>
                <span className="font-sora font-semibold text-green-600">{stats.reservasAtivas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sora text-sm text-stone-grey">Pendentes</span>
                <span className="font-sora font-semibold text-yellow-600">{stats.reservasPendentes}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-stone-grey">
                <span className="font-sora text-sm text-stone-grey">Check-ins Hoje</span>
                <span className="font-sora font-bold text-blue-600">{stats.reservasHoje}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
          <h3 className="font-sora text-lg font-semibold text-charcoal mb-6 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Resumo Financeiro</span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="font-sora text-2xl font-bold text-green-600">
                {stats.receitaTotal.toLocaleString('pt-AO')} Kz
              </div>
              <div className="font-sora text-sm text-stone-grey mt-1">Receita Total</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="font-sora text-2xl font-bold text-blue-600">
                {stats.receitaMedia.toLocaleString('pt-AO')} Kz
              </div>
              <div className="font-sora text-sm text-stone-grey mt-1">Valor Médio por Reserva</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="font-sora text-2xl font-bold text-purple-600">
                {Math.round((stats.receitaTotal / stats.totalQuartos))} Kz
              </div>
              <div className="font-sora text-sm text-stone-grey mt-1">Receita por Quarto</div>
            </div>
          </div>
        </div>

        {/* Sistema Info */}
        <div className="bg-pure-white p-6 rounded-lg shadow-sm border border-stone-grey">
          <h3 className="font-sora text-lg font-semibold text-charcoal mb-4">Informações do Sistema</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-sora text-stone-grey mb-2">
                <strong>Usuário Ativo:</strong> {profile?.nome || profile?.email}
              </p>
              <p className="font-sora text-stone-grey mb-2">
                <strong>Nível de Acesso:</strong> Administração Total
              </p>
              <p className="font-sora text-stone-grey">
                <strong>Última Atualização:</strong> {new Date().toLocaleString('pt-AO')}
              </p>
            </div>
            <div>
              <p className="font-sora text-stone-grey mb-2">
                <strong>Módulos Ativos:</strong> Hotel
              </p>
              <p className="font-sora text-stone-grey mb-2">
                <strong>Módulos Pendentes:</strong> Restaurante
              </p>
              <p className="font-sora text-stone-grey">
                <strong>Status do Sistema:</strong> <span className="text-green-600">Operacional</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTotal;
