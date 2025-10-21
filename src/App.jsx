import React from "react";
import authManager from "./authManager";
import apiClient from "./axiosConfig";

export default function App() {
  const [isExpired, setIsExpired] = React.useState(false);
  const [protectedData, setProtectedData] = React.useState(null);
  const [token, setToken] = React.useState(authManager.getToken());
  const [username, setUsername] = React.useState(authManager.getUsername());

  const fetchProtectedData = async () => {
    try {
      const response = await apiClient.get("/api/ip");
      console.log("Protected data:", response.data);
      setProtectedData(response.data);
    } catch (error) {
      console.error("Error fetching protected data:", error);
      setProtectedData(`Error fetching protected data: Check your endpoint (${error.message})`);
    }
  };

  const handleUpdateToken = () => {
    authManager.updateToken(() => {
      console.log("Token updated");
      setToken(authManager.getToken());
      setUsername(authManager.getUsername());
      setIsExpired(false);
    });
  };

  const handleLogin = () => {
    authManager.login();
  };

  const handleLogout = () => {
    authManager.logout();
    setToken(null);
    setUsername(null);
    setProtectedData(null);
    setIsExpired(null);
  };

  const handleCheckExpired = () => {
    setIsExpired(authManager.isTokenExpired());
  };

  const isLoggedIn = authManager.isLoggedIn();

  return (
    <div className="App">
      <h1 className="text-center font-bold text-2xl mt-6 mb-2">Keycloak Authentication</h1>
      <hr className="my-6" />

      {isLoggedIn && (
        <div className="flex justify-center my-5">
          <div className="grid" style={{ gridTemplateColumns: "120px 1fr", gap: "12px 16px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9", maxWidth: "800px", width: "100%" }}>
            <div className="text-right font-bold font-sans">Username:</div>
            <div className="text-left font-mono">{username}</div>
      
            <div className="text-right font-bold font-sans">Token:</div>
            <div className="text-left font-mono">
              <pre className="font-mono text-xs  p-2 rounded" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>
                {token.match(/.{1,80}/g).join("\n")}
              </pre>
            </div>
      
            <div className="text-right font-bold font-sans">Token expired:</div>
            <div className="text-left font-mono">{String(isExpired)}</div>
          </div>
        </div>
      )}
    
      {!isLoggedIn ? (
        <div className="flex justify-center mt-5">
          <button
            type="button"
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3 mt-5">
          <button
            type="button"
            onClick={handleCheckExpired}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Is Token Expired?
          </button>
          <button
            type="button"
            onClick={handleUpdateToken}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Update Token
          </button>
          <button
            type="button"
            onClick={fetchProtectedData}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Fetch Protected Data
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}

      <hr className="my-6" />

      {protectedData && (
        <div className="flex flex-col items-center mt-6">
          <h2 className="text-center font-bold text-lg mb-2">Protected Data:</h2>
          <div className="w-full flex justify-center padding: 30px">
            <pre className="bg-gray-100 p-3 rounded font-mono text-sm text-left w-auto">
              {JSON.stringify(protectedData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
