
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
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

  const buscarPerfil = useCallback(async (userId: string) => {
    setLoading(true); // Iniciar loading ao buscar perfil
    console.log('🔍 buscarPerfil: Iniciando busca para userId:', userId);
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('id, nome, email, username, role, created_at') // Explicitamente select columns
        .eq('id', userId)
        .single();

      console.log('🔍 buscarPerfil: Resposta Supabase:', { userId, data, error, status });

      if (error && status !== 406) { // 406 significa que .single() não encontrou registros, o que é ok
        console.error('❌ buscarPerfil: Erro ao buscar perfil:', error);
        setAuthError(`Erro ao carregar perfil: ${error.message}`);
        setProfile(null);
      } else if (!data) {
        console.warn('⚠️ buscarPerfil: Perfil não encontrado para userId:', userId);
        // Não definir authError aqui, pode ser um usuário novo sem perfil ainda criado pelo trigger.
        // Se o RLS estiver correto, e o trigger funcionando, o perfil deve ser encontrado.
        // Se o usuário acabou de se registrar, pode levar um momento para o trigger popular o perfil.
        setProfile(null);
      } else {
        console.log('✅ buscarPerfil: Perfil encontrado:', { id: data.id, role: data.role });
        setProfile(data as PerfilUsuario);
        setAuthError(null);
      }
    } catch (err: any) {
      console.error('💥 buscarPerfil: Erro inesperado:', err);
      setAuthError(`Erro inesperado ao carregar perfil: ${err?.message || 'Erro desconhecido'}`);
      setProfile(null);
    } finally {
      console.log('🏁 buscarPerfil: Finalizando loading do perfil');
      setLoading(false); // Garantir que setLoading(false) seja chamado
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      if (currentUser) {
        await buscarPerfil(currentUser.id);
      } else {
        setProfile(null);
        setLoading(false); // Se não há sessão, não há perfil, então para de carregar
      }
    }).catch(error => {
      console.error("Auth Provider: Erro no getSession", error);
      setAuthError("Erro ao obter sessão: " + error.message);
      setUser(null);
      setProfile(null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔄 AuthProvider: onAuthStateChange evento: ${event}.`);
        const currentUser = session?.user;
        setUser(currentUser ?? null);
        
        if (currentUser) {
          console.log(`👤 AuthProvider: Usuário detectado via onAuthStateChange (evento: ${event}), buscando perfil...`);
          await buscarPerfil(currentUser.id);
        } else {
          console.log(`🚫 AuthProvider: Usuário deslogado ou sessão nula via onAuthStateChange (evento: ${event}).`);
          setProfile(null);
          setAuthError(null); // Limpa erro de autenticação ao deslogar
          setLoading(false); // Se deslogou, para de carregar
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [buscarPerfil]);

  const signIn = async (email: string, password: string) => {
    console.log('🚪 signIn: Tentando login com email:', email);
    setLoading(true); // Iniciar loading ao tentar signIn
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('❌ signIn: Erro no login:', error);
      setAuthError(error.message);
      setLoading(false); // Parar loading se signIn falhar
    } else if (!data.user) {
      console.error('❌ signIn: Login bem-sucedido mas sem dados de usuário.');
      setAuthError('Login bem-sucedido mas sem dados de usuário.');
      setLoading(false);
    }
    // Se signIn for bem-sucedido, onAuthStateChange cuidará de buscar o perfil e setar setLoading(false)
    return { error };
  };

  const signOut = async () => {
    console.log('🚪 signOut: Fazendo logout...');
    setLoading(true); // Iniciar loading ao tentar signOut
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ signOut: Erro no logout:', error);
      setAuthError(error.message);
      setLoading(false); // Parar loading se signOut falhar
    }
    // onAuthStateChange cuidará de limpar user, profile e setar setLoading(false)
    console.log('🚪 signOut: Logout concluído (Supabase respondeu).');
  };

  const hasRole = (roles: string[]) => {
    if (!profile) { // Não precisa checar loading aqui, pois o perfil é o que importa
      console.log('🔒 hasRole: Sem perfil, negando acesso para roles:', roles);
      return false;
    }
    const hasAccess = roles.includes(profile.role);
    console.log(`🔒 hasRole: Verificando [${roles.join(', ')}] contra "${profile.role}": Acesso ${hasAccess ? 'CONCEDIDO' : 'NEGADO'}`);
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
