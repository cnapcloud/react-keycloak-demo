import { useState, useEffect } from 'react';
import keycloak, { initKeycloak } from '@/lib/keycloak';

export interface ParsedTokenInfo {
  sub: string | undefined;
  email: string | undefined;
  groups: string[];
}

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  username: string | undefined;
  token: string | undefined;
  parsedTokenInfo: ParsedTokenInfo;
}

export interface UseAuthReturn extends AuthState {
  login: () => void;
  logout: () => void;
  updateToken: () => Promise<{ refreshed: boolean; token: string | undefined }>;
  isTokenExpired: () => boolean;
  tokenExpiresAt: Date | undefined;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    isInitialized: false,
    isAuthenticated: false,
    username: undefined,
    token: undefined,
    parsedTokenInfo: { sub: undefined, email: undefined, groups: [] },
  });

  useEffect(() => {
    initKeycloak(() => {
      const tp = keycloak.tokenParsed as Record<string, unknown> | undefined;
      const idtp = keycloak.idTokenParsed as Record<string, unknown> | undefined;
      console.log('[useAuth] tokenParsed:', tp);
      console.log('[useAuth] idTokenParsed:', idtp);
      const groups =
        Array.isArray(tp?.groups) ? (tp.groups as string[]) :
        Array.isArray(idtp?.groups) ? (idtp.groups as string[]) : [];
      setState({
        isInitialized: true,
        isAuthenticated: !!keycloak.authenticated,
        username: tp?.preferred_username as string | undefined,
        token: keycloak.token,
        parsedTokenInfo: {
          sub: tp?.sub as string | undefined,
          email: tp?.email as string | undefined,
          groups,
        },
      });
    });
  }, []);

  const login = () => keycloak.login();

  const logout = () => keycloak.logout();

  const updateToken = async (): Promise<{ refreshed: boolean; token: string | undefined }> => {
    const refreshed = await keycloak.updateToken(5);
    setState((prev) => ({ ...prev, token: keycloak.token }));
    return { refreshed, token: keycloak.token };
  };

  const isTokenExpired = () => keycloak.isTokenExpired();

  const exp = keycloak.tokenParsed?.exp as number | undefined;
  const tokenExpiresAt = exp ? new Date(exp * 1000) : undefined;

  return { ...state, login, logout, updateToken, isTokenExpired, tokenExpiresAt };
}
