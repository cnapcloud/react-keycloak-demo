interface AppEnv {
  KEYCLOAK_REALM: string;
  KEYCLOAK_AUTH_SERVER_URL: string;
  KEYCLOAK_CLIENT_ID: string;
  API_BASE_URL: string;
  API_BACKEND_URL: string;
}

export function getEnv(): AppEnv {
  const env = (window as unknown as { __ENV__?: Partial<AppEnv> }).__ENV__ ?? {};
  return {
    KEYCLOAK_REALM: env.KEYCLOAK_REALM ?? 'cnap',
    KEYCLOAK_AUTH_SERVER_URL: env.KEYCLOAK_AUTH_SERVER_URL ?? 'http://localhost:8080',
    KEYCLOAK_CLIENT_ID: env.KEYCLOAK_CLIENT_ID ?? 'react',
    API_BASE_URL: env.API_BASE_URL ?? '/api',
    API_BACKEND_URL: env.API_BACKEND_URL ?? 'https://httpbin.org/',
  };
}
