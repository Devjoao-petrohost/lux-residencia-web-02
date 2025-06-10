
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { 
  Hotel, 
  UtensilsCrossed, 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp,
  Activity
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DashboardStats {
  hotel: {
    totalQuartos: number;
    quartosOcupados: number;
    reservasHoje: number;
    receitaHotel: number;
  };
  restaurante: {
    pedidosHoje: number;
    receitaRestaurante: number;
    clientesAtivos: number;
  };
}

const AdminTotal = () => {
  return (
    <ProtectedRoute requiredRoles={['admin_total']}>
      <AdminTotalContent />
    </ProtectedRoute>
  );
};

const AdminTotalContent = () => {
  const { profile, signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    hotel: {
      totalQuartos: 0,
      quartosOcupados: 0,
      reservasHoje: 0,
      receitaHotel: 0
    },
    restaurante: {
      pedidosHoje: 0,
      receitaRestaurante: 0,
      clientesAtivos: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      setLoading(true);
      
      // Carregar dados do hotel
      const { data: quartos } = await supabase
        .from('hotel_quartos')
        .select('*');

      const { data: reservasHotel } = await supabase
        .from('hotel_reservas')
        .select('*')
        .eq('status', 'confirmada');

      const hoje = new Date().toISOString().split('T')[0];
      const { data: reservasHoje } = await supabase
        .from('hotel_reservas')
        .select('*')
        .gte('data_checkin', hoje)
        .lte('data_checkin', hoje);

      // Calcular receita do hotel
      const receitaHotel = reservasHotel?.reduce((total, reserva) => total + reserva.valor_total, 0) || 0;

      // Tentar carregar dados do restaurante (se existirem)
      let pedidosRestaurante = 0;
      let receitaRestaurante = 0;
      let clientesAtivos = 0;

      try {
        // Estas queries podem falhar se as tabelas do restaurante não existirem ainda
        const { data: pedidos } = await supabase
          .from('pedidos')
          .select('*')
          .gte('created_at', hoje);

        pedidosRestaurante = pedidos?.length || 0;
        receitaRestaurante = pedidos?.reduce((total, pedido) => total + (pedido.total || 0), 0) || 0;

        const { data: clientes } = await supabase
          .from('clientes')
          .select('*');

        clientesAtivos = clientes?.length || 0;
      } catch (error) {
        console.log('Dados do restaurante ainda não disponíveis');
      }

      setStats({
        hotel: {
          totalQuartos: quartos?.length || 0,
          quartosOcupados: quartos?.filter(q => q.status === 'ocupado').length || 0,
          reservasHoje: reservasHoje?.length || 0,
          receitaHotel
        },
        restaurante: {
          pedidosHoje: pedidosRestaurante,
          receitaRestaurante,
          clientesAtivos
        }
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Até breve!",
    });
  };

  const receitaTotal = stats.hotel.receitaHotel + stats.restaurante.receitaRestaurante;

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32">
        <section className="py-16 bg-off-white min-h-screen">
          <div className="container">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="font-sora text-4xl md:text-5xl font-bold text-charcoal mb-4">
                  Painel Executivo
                </h1>
                <p className="font-sora text-xl text-stone-grey">
                  Visão completa do negócio - Bem-vindo, {profile?.nome}
                </p>
              </div>
              <div className="flex space-x-4">
                <Link to="/admin/hotel" className="btn-secondary">
                  Hotel
                </Link>
                <Link to="/" className="btn-secondary">
                  ← Site Principal
                </Link>
                <button onClick={handleLogout} className="btn-primary">
                  Sair
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal mx-auto"></div>
                <p className="mt-4 font-sora text-stone-grey">Carregando estatísticas...</p>
              </div>
            ) : (
              <>
                {/* Resumo Executivo */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-gradient-to-r from-charcoal to-stone-grey text-pure-white p-8 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-sora text-3xl font-bold mb-2">
                          {receitaTotal.toLocaleString('pt-AO')} Kz
                        </h3>
                        <p className="font-sora text-sm opacity-90">Receita Total</p>
                      </div>
                      <DollarSign className="w-12 h-12 opacity-80" />
                    </div>
                  </div>

                  <div className="bg-pure-white p-8 shadow-lg border border-stone-grey">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-sora text-3xl font-bold text-charcoal mb-2">
                          {stats.hotel.totalQuartos}
                        </h3>
                        <p className="font-sora text-sm text-stone-grey">Quartos Totais</p>
                      </div>
                      <Hotel className="w-12 h-12 text-charcoal opacity-60" />
                    </div>
                  </div>

                  <div className="bg-pure-white p-8 shadow-lg border border-stone-grey">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-sora text-3xl font-bold text-charcoal mb-2">
                          {stats.restaurante.pedidosHoje}
                        </h3>
                        <p className="font-sora text-sm text-stone-grey">Pedidos Hoje</p>
                      </div>
                      <UtensilsCrossed className="w-12 h-12 text-charcoal opacity-60" />
                    </div>
                  </div>
                </div>

                {/* Seção Hotel */}
                <div className="bg-pure-white p-8 shadow-lg mb-8 border border-stone-grey">
                  <div className="flex items-center mb-6">
                    <Hotel className="w-8 h-8 text-charcoal mr-3" />
                    <h2 className="font-sora text-2xl font-bold text-charcoal">
                      Gestão Hoteleira
                    </h2>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Hotel className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="font-sora text-xl font-bold text-charcoal">
                        {stats.hotel.totalQuartos}
                      </h3>
                      <p className="font-sora text-sm text-stone-grey">Total de Quartos</p>
                    </div>

                    <div className="text-center">
                      <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="font-sora text-xl font-bold text-charcoal">
                        {stats.hotel.quartosOcupados}
                      </h3>
                      <p className="font-sora text-sm text-stone-grey">Quartos Ocupados</p>
                    </div>

                    <div className="text-center">
                      <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-sora text-xl font-bold text-charcoal">
                        {stats.hotel.reservasHoje}
                      </h3>
                      <p className="font-sora text-sm text-stone-grey">Check-ins Hoje</p>
                    </div>

                    <div className="text-center">
                      <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-8 h-8 text-yellow-600" />
                      </div>
                      <h3 className="font-sora text-xl font-bold text-charcoal">
                        {stats.hotel.receitaHotel.toLocaleString('pt-AO')} Kz
                      </h3>
                      <p className="font-sora text-sm text-stone-grey">Receita Hotel</p>
                    </div>
                  </div>
                </div>

                {/* Seção Restaurante */}
                <div className="bg-pure-white p-8 shadow-lg border border-stone-grey">
                  <div className="flex items-center mb-6">
                    <UtensilsCrossed className="w-8 h-8 text-charcoal mr-3" />
                    <h2 className="font-sora text-2xl font-bold text-charcoal">
                      Gestão do Restaurante
                    </h2>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <UtensilsCrossed className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="font-sora text-xl font-bold text-charcoal">
                        {stats.restaurante.pedidosHoje}
                      </h3>
                      <p className="font-sora text-sm text-stone-grey">Pedidos Hoje</p>
                    </div>

                    <div className="text-center">
                      <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Activity className="w-8 h-8 text-orange-600" />
                      </div>
                      <h3 className="font-sora text-xl font-bold text-charcoal">
                        {stats.restaurante.clientesAtivos}
                      </h3>
                      <p className="font-sora text-sm text-stone-grey">Clientes Cadastrados</p>
                    </div>

                    <div className="text-center">
                      <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <DollarSign className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-sora text-xl font-bold text-charcoal">
                        {stats.restaurante.receitaRestaurante.toLocaleString('pt-AO')} Kz
                      </h3>
                      <p className="font-sora text-sm text-stone-grey">Receita Restaurante</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminTotal;
