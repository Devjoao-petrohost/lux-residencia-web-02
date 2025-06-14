
import { useState, useEffect, createContext, useContext, useRef } from 'react';
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

  const initialAuthEventReceived = useRef(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const buscarPerfil = async (userId: string) => {
    console.log('🔍 buscarPerfil: Iniciando busca para userId:', userId);
    // setLoading(true) é chamado antes desta função ser invocada se um usuário for detectado.
    
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('🔍 buscarPerfil: Resposta Supabase:', { userId, data, error, status });

      if (error && status !== 406) { // 406 means single() found 0 or multiple rows, not necessarily a DB error.
        console.error('❌ buscarPerfil: Erro ao buscar perfil:', error);
        setAuthError(`Erro ao carregar perfil: ${error.message}`);
        setProfile(null);
      } else if (!data) {
        console.error('❌ buscarPerfil: Perfil não encontrado para userId:', userId, '(Data é null ou undefined)');
        setAuthError('Perfil de usuário não encontrado.');
        setProfile(null);
      } else {
        console.log('✅ buscarPerfil: Perfil encontrado:', { id: data.id, role: data.role });
        setProfile(data as PerfilUsuario);
        setAuthError(null);
      }
    } catch (error: any) {
      console.error('💥 buscarPerfil: Erro inesperado:', error);
      setAuthError(`Erro inesperado ao carregar perfil: ${error?.message || 'Erro desconhecido'}`);
      setProfile(null);
    } finally {
      console.log('🏁 buscarPerfil: Finalizando loading do perfil');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔄 AuthProvider: useEffect iniciado. Configurando verificação de sessão...');
    setLoading(true);
    initialAuthEventReceived.current = false;

    // Limpar timeout anterior, se houver (importante para StrictMode em dev)
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      console.log('🧹 AuthProvider: Timeout anterior (do ref) limpo no início do useEffect.');
    }

    timeoutIdRef.current = setTimeout(() => {
      if (!initialAuthEventReceived.current) {
        console.error('⏰ AuthProvider: Timeout! Nenhum evento de autenticação inicial (getSession/onAuthStateChange) recebido em 20 segundos.');
        setAuthError('Timeout na verificação de autenticação inicial (20s)');
        setLoading(false);
      } else {
        console.log('ℹ️ AuthProvider: Timeout callback executado, mas evento de autenticação já foi recebido. Nenhuma ação de erro.');
      }
    }, 20000); // Aumentado para 20 segundos

    console.log(`🕒 AuthProvider: Timeout inicial de 20s configurado (ID: ${timeoutIdRef.current})`);

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('ℹ️ AuthProvider: getSession() callback executado.');
      if (initialAuthEventReceived.current && timeoutIdRef.current) {
         // Se onAuthStateChange já tratou, podemos ter um log para saber.
         console.log('ℹ️ AuthProvider: getSession() - Evento de autenticação já processado por onAuthStateChange, mas limpando timeout por segurança.');
      }
      initialAuthEventReceived.current = true;
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        console.log(`✅ AuthProvider: Timeout inicial (ID: ${timeoutIdRef.current}) LIMPADO por getSession().`);
        timeoutIdRef.current = null;
      }
      
      if (error) {
        console.error('❌ AuthProvider: Erro ao buscar sessão inicial via getSession():', error);
        setAuthError(error.message);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      console.log('🔍 AuthProvider: Sessão inicial via getSession():', session ? `User ID: ${session.user.id}` : 'Nenhuma sessão ativa.');
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 AuthProvider: Usuário da sessão inicial (getSession) encontrado, buscando perfil...');
        setLoading(true);
        buscarPerfil(session.user.id);
      } else {
        setProfile(null); // Garante que o perfil seja limpo se não houver sessão
        setLoading(false);
      }
    }).catch((error) => {
      console.error('💥 AuthProvider: Erro inesperado no CATCH de getSession():', error);
      if (!initialAuthEventReceived.current && timeoutIdRef.current) { // Proteger contra setStates se já desmontado ou tratado
          initialAuthEventReceived.current = true;
          clearTimeout(timeoutIdRef.current);
          console.log(`💥 AuthProvider: Timeout inicial (ID: ${timeoutIdRef.current}) LIMPADO no CATCH de getSession().`);
          timeoutIdRef.current = null;
      }
      setAuthError('Erro inesperado na autenticação inicial (catch getSession)');
      setUser(null);
      setProfile(null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔄 AuthProvider: onAuthStateChange evento: ${event}. Sessão:`, session ? `User ID: ${session.user.id}` : 'Nula');
        
        if (!initialAuthEventReceived.current && timeoutIdRef.current) {
            console.log('ℹ️ AuthProvider: onAuthStateChange - Primeiro evento recebido.');
        }
        initialAuthEventReceived.current = true;
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
          console.log(`✅ AuthProvider: Timeout inicial (ID: ${timeoutIdRef.current}) LIMPADO por onAuthStateChange (evento: ${event}).`);
          timeoutIdRef.current = null;
        }

        setUser(session?.user ?? null);
        setAuthError(null); 
        
        if (session?.user) {
          console.log(`👤 AuthProvider: Usuário detectado via onAuthStateChange (evento: ${event}), buscando perfil...`);
          setLoading(true);
          await buscarPerfil(session.user.id);
        } else {
          console.log(`🚫 AuthProvider: Usuário deslogado ou sessão nula via onAuthStateChange (evento: ${event}).`);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('🧹 AuthProvider: useEffect cleanup. Cancelando inscrição e timeout restante (se houver).');
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        console.log(`🧹 AuthProvider: Timeout (ID: ${timeoutIdRef.current}) LIMPADO no cleanup.`);
        timeoutIdRef.current = null;
      }
      subscription.unsubscribe();
    };
  }, []); // Mantém array de dependências vazio para rodar apenas no mount/unmount

  const signIn = async (email: string, password: string) => {
    console.log('🚪 signIn: Tentando login com email:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('❌ signIn: Erro no login:', error);
    } else {
      console.log('✅ signIn: Login bem-sucedido (Supabase respondeu). Aguardando onAuthStateChange...');
    }
    return { error };
  };

  const signOut = async () => {
    console.log('🚪 signOut: Fazendo logout...');
    await supabase.auth.signOut();
    // onAuthStateChange cuidará de limpar user e profile e setLoading(false)
    console.log('🚪 signOut: Logout concluído (Supabase respondeu).');
  };

  const hasRole = (roles: string[]) => {
    if (loading) {
      console.log('🔒 hasRole: Verificação de role adiada, ainda carregando perfil...');
      return false; // Ou poderia retornar um estado de "incerteza"
    }
    if (!profile) {
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
