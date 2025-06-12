
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Settings, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBackToSite?: boolean;
  showExecutiveLink?: boolean;
}

export function AdminLayout({ 
  children, 
  title, 
  subtitle, 
  showBackToSite = true,
  showExecutiveLink = false 
}: AdminLayoutProps) {
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Sessão encerrada com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-off-white">
      {/* Top Bar */}
      <div className="bg-pure-white border-b border-stone-grey shadow-sm">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img 
                src="/logo1.png" 
                alt="Maspe Residencial" 
                className="h-10 w-auto border border-stone-grey rounded bg-white"
              />
              <div>
                <h1 className="font-sora text-xl font-bold text-charcoal">
                  {title}
                </h1>
                {subtitle && (
                  <p className="font-sora text-sm text-stone-grey">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="font-sora text-sm font-medium text-charcoal">
                  {profile?.nome || profile?.email || 'Usuário'}
                </p>
                <p className="font-sora text-xs text-stone-grey">
                  {profile?.role === 'admin_hotel' ? 'Gestão Hotel' : 
                   profile?.role === 'admin_total' ? 'Administração Total' : 
                   'Administrador'}
                </p>
              </div>
              
              {showExecutiveLink && profile?.role === 'admin_total' && (
                <Link 
                  to="/admin/total" 
                  className="btn-secondary text-sm px-3 py-2 flex items-center space-x-1"
                >
                  <Settings className="w-4 h-4" />
                  <span>Painel Executivo</span>
                </Link>
              )}
              
              {showBackToSite && (
                <Link 
                  to="/" 
                  className="btn-secondary text-sm px-3 py-2 flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Site Principal</span>
                </Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="btn-primary text-sm px-3 py-2 flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container py-8">
        {children}
      </main>
    </div>
  );
}
