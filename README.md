# React Keycloak Integration Guide

This guide explains how to integrate **Keycloak** with a **React** application on **macOS**.


## 1. Register Self-Signed Certificate

To trust the Keycloak self-signed certificate

1. Open **Keychain Access**
2. Drag [root-ca.pem](https://github.com/cnapcloud/gitops-demo/tree/main/cert/root-ca) into **System**
3. Right-click → **Get Info**
4. Expand **Trust** section
5. Set **When using this certificate** → **Always Trust**
6. Close the window to update Keychain

⚠️ If the Keycloak certificate is not trusted, Chrome debugging in VS Code with `react-keycloak-js` may fail due to SSL errors.


## 2. Add Keycloak Config to `.env`

Create or edit the `.env` file in your React project root:

```env
VITE_KEYCLOAK_REALM=cnap
VITE_KEYCLOAK_AUTH_SERVER_URL=https://keycloak.cnap.dev
VITE_KEYCLOAK_CLIENT_ID=react
```


## 3. Configure Keycloak Client

In the **Keycloak Admin Console**, create a new client named `react` with the following settings:

- Client ID: react
- Authentication Flow: Standard Flow ✔︎
- Home URL: http://localhost:5173
- Redirect URI: *
- Web Origins: http://localhost:5173


## 4. Run the React App

Install dependencies and start the app:

```bash
npm i
npm run dev
```

Open the app in your browser: http://localhost:5173


## Reference

- [React와 Keycloak 연동 인증 가이드](https://cnapcloud.com/blog/react-keycloak/)

###  Note

To ensure proper HTTPS communication between React and Keycloak,  
make sure the Keycloak certificate is trusted in macOS Keychain.
