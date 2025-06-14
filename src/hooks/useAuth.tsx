import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { PerfilUsuario } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: PerfilUsuario | null;
  loading: boolean; // True enquanto o estado de autenticação/perfil está sendo resolvido
  authError: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PerfilUsuario | null>(null);
  const [loading, setLoading] = useState(true); // Inicia true, pois a autenticação está sendo verificada
  const [authError, setAuthError] = useState<string | null>(null);

  // Limpa o estado de autenticação e perfil
  const clearAuthAndProfileState = useCallback(() => {
    setUser(null);
    setProfile(null);
    setAuthError(null);
    console.log('🔄 AuthProvider: Estado de autenticação e perfil limpos.');
  }, []);

  // Busca o perfil do usuário. Não gerencia o loading global diretamente.
  // Retorna true se o perfil foi encontrado, false caso contrário ou erro.
  const fetchProfile = useCallback(async (userId: string): Promise<boolean> => {
    console.log('🔍 fetchProfile: Iniciando busca para userId:', userId);
    setProfile(null); // Limpa perfil anterior
    setAuthError(null); // Limpa erro anterior referente a perfil

    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('id, nome, email, role, created_at, updated_at')
        .eq('id', userId)
        .single();

      console.log('🔍 fetchProfile: Resposta Supabase:', { userId, data, error, status });

      if (error && status !== 406) { // 406: .single() não encontrou, o que pode ser ok ou não
        console.error('❌ fetchProfile: Erro ao buscar perfil:', error.message);
        setAuthError(`Erro ao carregar perfil: ${error.message}`);
        return false;
      }
      if (!data) {
        console.warn('⚠️ fetchProfile: Perfil não encontrado para userId:', userId);
        setAuthError("Perfil de usuário não encontrado. Sua conta pode não estar configurada corretamente.");
        return false;
      }
      console.log('✅ fetchProfile: Perfil encontrado:', data.role);
      setProfile(data as PerfilUsuario);
      return true;
    } catch (err: any) {
      console.error('💥 fetchProfile: Erro inesperado:', err);
      setAuthError(`Erro inesperado ao carregar perfil: ${err?.message || 'Erro desconhecido'}`);
      return false;
    }
  }, []);

  useEffect(() => {
    setLoading(true); // Processo de autenticação (inicial ou mudança) começando
    console.log('🔄 AuthProvider useEffect: Iniciando verificação de estado de autenticação...');

    // Verificação da sessão inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('🔄 AuthProvider getSession: Sessão inicial:', session ? `User ID: ${session.user.id}` : 'Nenhuma');
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null); // Sem usuário, sem perfil
      }
      setLoading(false); // Concluída verificação inicial
      console.log('🏁 AuthProvider getSession: Verificação inicial completa. Loading:', loading);
    }).catch(error => {
      console.error("❌ AuthProvider getSession - Erro:", error);
      clearAuthAndProfileState();
      setAuthError("Erro ao obter sessão inicial: " + error.message);
      setLoading(false);
      console.log('🏁 AuthProvider getSession - Erro na verificação inicial. Loading:', loading);
    });

    // Listener para mudanças no estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔄 AuthProvider onAuthStateChange - Evento: ${event}. Usuário na sessão: ${session?.user?.id ?? 'Nenhum'}`);
        setLoading(true); // Mudança de estado, define loading como true

        const currentUser = session?.user;
        setUser(currentUser ?? null);

        if (event === 'SIGNED_OUT') {
          clearAuthAndProfileState();
        } else if (event === 'USER_UPDATED' && currentUser) {
           // Se apenas o usuário foi atualizado (ex: email), recarregar perfil
           console.log('👤 AuthProvider onAuthStateChange: Usuário atualizado, recarregando perfil...');
           await fetchProfile(currentUser.id);
        } else if (currentUser && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
          // INITIAL_SESSION é tratado pelo getSession acima, mas onAuthStateChange também pode dispará-lo.
          // Se getSession já resolveu, este fetchProfile pode ser redundante mas garante consistência.
          // Se USER_DELETED, currentUser será null e cairá no 'else'
          console.log(`👤 AuthProvider onAuthStateChange: Usuário detectado/atualizado (evento: ${event}), buscando perfil...`);
          await fetchProfile(currentUser.id);
        } else if (!currentUser) { // Sem usuário (ex: token expirado não renovado, USER_DELETED)
            clearAuthAndProfileState();
        }
        
        setLoading(false); // Processamento do evento concluído
        console.log(`🏁 AuthProvider onAuthStateChange - Evento ${event} processado. Loading:`, loading);
      }
    );

    return () => {
      console.log('🧹 AuthProvider: Limpando listener onAuthStateChange.');
      authListener?.subscription.unsubscribe();
    };
  }, [fetchProfile, clearAuthAndProfileState, loading]); // Adicionado loading para depuração

  const signIn = async (email: string, password: string) => {
    console.log('🚪 signIn: Tentando login com email:', email);
    setLoading(true);
    setAuthError(null); // Limpa erros anteriores

    const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('❌ signIn: Erro no login:', signInError.message);
      clearAuthAndProfileState();
      setAuthError(signInError.message);
      setLoading(false); // Para o loading se o signIn falhar diretamente
      return { error: signInError };
    }
    
    if (!signInData.user) {
        console.error('❌ signIn: Login bem-sucedido mas sem dados de usuário retornados pelo Supabase.');
        clearAuthAndProfileState();
        setAuthError('Falha no login: dados de usuário não retornados.');
        setLoading(false);
        return { error: { name: 'AuthApiError', message: 'Falha no login: dados de usuário não retornados.'} };
    }

    // Se signIn bem-sucedido, onAuthStateChange (SIGNED_IN) será disparado.
    // Esse evento cuidará de chamar fetchProfile e, por fim, setar setLoading(false).
    // Não é preciso setar setLoading(false) aqui, pois o processo de autenticação completo inclui o perfil.
    console.log('✅ signIn: Login via Supabase bem-sucedido. Evento SIGNED_IN cuidará do perfil.');
    return { error: null };
  };

  const signOut = async () => {
    console.log('🚪 signOut: Fazendo logout...');
    setLoading(true); // Logout é um processo de mudança de estado de auth
    setAuthError(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ signOut: Erro no logout:', error.message);
      setAuthError(error.message);
      // Mesmo com erro no signOut, onAuthStateChange(SIGNED_OUT) deve ser acionado ou
      // o estado pode ficar inconsistente. Forçar setLoading(false) se houver erro.
      setLoading(false);
    }
    // Se signOut bem-sucedido, onAuthStateChange (SIGNED_OUT) cuidará de limpar user/profile
    // e setar setLoading(false).
    console.log('🏁 signOut: Chamada ao Supabase.signOut() concluída. Evento SIGNED_OUT finalizará.');
  };

  const hasRole = (rolesToCheck: string[]) => {
    if (loading || !profile) { // Se carregando ou sem perfil, não pode ter a role
      console.log(`🔒 hasRole: Checagem de role [${rolesToCheck.join(', ')}] abortada (loading: ${loading}, profile: ${!!profile})`);
      return false;
    }
    const hasAccess = rolesToCheck.includes(profile.role);
    console.log(`🔒 hasRole: Verificando [${rolesToCheck.join(', ')}] contra "${profile.role}": Acesso ${hasAccess ? 'CONCEDIDO' : 'NEGADO'}`);
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
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
