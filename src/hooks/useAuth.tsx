import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, type PerfilUsuario } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: PerfilUsuario | null;
  loading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PerfilUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 AuthProvider: Iniciando verificação de sessão...');
    
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.error('⏰ AuthProvider: Timeout na verificação de sessão inicial (10s)');
        setAuthError('Timeout na verificação de autenticação inicial');
        setLoading(false);
      }
    }, 10000); // 10 segundos timeout

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('❌ AuthProvider: Erro ao buscar sessão inicial:', error);
        setAuthError(error.message);
        setLoading(false);
        return;
      }

      console.log('🔍 AuthProvider: Sessão inicial encontrada:', !!session?.user);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 AuthProvider: Usuário da sessão inicial encontrado, buscando perfil...');
        // setLoading(true) é desnecessário aqui pois já é true por padrão
        buscarPerfil(session.user.id);
      } else {
        console.log('🚫 AuthProvider: Nenhum usuário logado na sessão inicial');
        setLoading(false);
      }
    }).catch((error) => {
      clearTimeout(timeoutId);
      console.error('💥 AuthProvider: Erro inesperado ao buscar sessão inicial:', error);
      setAuthError('Erro inesperado na autenticação inicial');
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Limpar o timeout inicial aqui, pois onAuthStateChange fornece um estado definitivo.
        clearTimeout(timeoutId); 
        console.log('🔄 AuthProvider: Mudança de estado de autenticação:', event, session);
        setUser(session?.user ?? null);
        setAuthError(null); // Limpar erros anteriores ao mudar o estado
        
        if (session?.user) {
          console.log('👤 AuthProvider: Usuário detectado via onAuthStateChange, buscando perfil...');
          setLoading(true); // Indicar que o carregamento do perfil começou
          await buscarPerfil(session.user.id);
        } else {
          console.log('🚫 AuthProvider: Usuário deslogado via onAuthStateChange');
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const buscarPerfil = async (userId: string) => {
    console.log('🔍 buscarPerfil: Iniciando busca para userId:', userId);
    // Não é necessário setLoading(true) aqui se já foi setado antes da chamada
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ buscarPerfil: Erro ao buscar perfil:', error);
        setAuthError(`Erro ao carregar perfil: ${error.message}`);
        setProfile(null);
      } else if (!data) {
        console.error('❌ buscarPerfil: Perfil não encontrado para userId:', userId);
        setAuthError('Perfil de usuário não encontrado');
        setProfile(null);
      } else {
        console.log('✅ buscarPerfil: Perfil encontrado:', { id: data.id, role: data.role });
        setProfile(data as PerfilUsuario); // Cast para PerfilUsuario
        setAuthError(null); // Limpar erro se o perfil for carregado com sucesso
      }
    } catch (error) {
      console.error('💥 buscarPerfil: Erro inesperado:', error);
      setAuthError('Erro inesperado ao carregar perfil');
      setProfile(null);
    } finally {
      console.log('🏁 buscarPerfil: Finalizando loading do perfil');
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    console.log('🚪 signOut: Fazendo logout...');
    await supabase.auth.signOut();
    setProfile(null);
    setAuthError(null);
  };

  const hasRole = (roles: string[]) => {
    if (!profile) {
      console.log('🔒 hasRole: Sem perfil, negando acesso');
      return false;
    }
    const hasAccess = roles.includes(profile.role);
    console.log(`🔒 hasRole: Verificando [${roles.join(', ')}] contra "${profile.role}":`, hasAccess);
    return hasAccess;
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      authError,
      signIn,
      signOut,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
