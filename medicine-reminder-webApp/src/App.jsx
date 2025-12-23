import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import AppPage from "./pages/AppPage";
import ContraIndicationsPage from "./pages/ContraIndicationsPage";
import useAuthStore from "./store/useAuthStore";

function App() {
  const access = useAuthStore((state) => state.access); // reactive access token

  return (
    <Router>
      <Routes>
        <Route path="/" element={access ? <Navigate to="/app" /> : <AuthPage />} />
        <Route path="/app" element={access ? <AppPage /> : <Navigate to="/" />} />
        <Route path="/contra-indications/:name" element={<ContraIndicationsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
