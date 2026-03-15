import Keycloak from "keycloak-js";

const env = window.__ENV__ || {};
const keycloakConfig = {
  realm: env.KEYCLOAK_REALM,
  url: env.KEYCLOAK_AUTH_SERVER_URL,
  clientId: env.KEYCLOAK_CLIENT_ID
};

// Keycloak instance creation
const _kc = new Keycloak(keycloakConfig);

// Keycloak initialization function 
const initKeycloak = (onAuthenticatedCallback) => {
  _kc.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
  })
    .then((authenticated) => {
      if (!authenticated) {
        console.log("User is not authenticated!");
        // delete cookies for auth here        
      }
      onAuthenticatedCallback();
    })
    .catch((err) => {
      console.warn('Keycloak init failed:', err);
      window.history.replaceState({}, '', window.location.pathname);
      _kc.authenticated = false;
      _kc.token = null;
      _kc.tokenParsed = null;
      onAuthenticatedCallback();
    });
};


const authService = {
  login: () => _kc.login(),
  logout: () => _kc.logout(),
  isTokenExpired: () => _kc.isTokenExpired(),
  updateToken: (successCallback, errorCallback) => {
    _kc.updateToken(5) //
      .then((refreshed) => {
        if (refreshed) {
          console.log("Token was refreshed");
        } else {
          console.log("Token is still valid, no refresh needed");
        }
        if (typeof successCallback === "function") {
          successCallback({ token: _kc.token, refreshed });
        }
      })
      .catch((error) => {
        console.error("Token update failed", error);
        if (typeof errorCallback === "function") {
          errorCallback(error);
        } else {
          _kc.login(); // fallback to login
        }
      });
  },
};


const authInfo = {
  isLoggedIn: () => !!_kc.token,
  getToken: () => _kc.token,
  getTokenParsed: () => _kc.tokenParsed,
  getUsername: () => _kc.tokenParsed?.preferred_username,
  hasRole: (roles) => roles.some((role) => _kc.hasRealmRole(role)),
};


const authManager = {
  ...authService,
  ...authInfo,
  initKeycloak,
};

export default authManager;
