import Keycloak from 'keycloak-js';
import { getEnv } from '@/config/env';

const env = getEnv();

const keycloak = new Keycloak({
  realm: env.KEYCLOAK_REALM,
  url: env.KEYCLOAK_AUTH_SERVER_URL,
  clientId: env.KEYCLOAK_CLIENT_ID,
});

let initStarted = false;

export function initKeycloak(onReady: () => void): void {
  if (initStarted) {
    onReady();
    return;
  }
  initStarted = true;

  keycloak
    .init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    })
    .then(() => {
      onReady();
    })
    .catch((err: unknown) => {
      console.warn('Keycloak init failed:', err);
      window.history.replaceState({}, '', window.location.pathname);
      keycloak.authenticated = false;
      keycloak.token = undefined;
      keycloak.tokenParsed = undefined;
      onReady();
    });
}

export default keycloak;
