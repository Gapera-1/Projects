import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import AppPage from "./pages/AppPage";
import ContraIndicationsPage from "./pages/ContraIndicationsPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Safe auto-login check
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (loggedIn === "true" && savedUser?.username && savedUser?.password) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <Router>
      <Routes>

        {/* Login + Signup */}
        <Route
          path="/"
          element={<AuthPage setIsAuthenticated={setIsAuthenticated} />}
        />

        {/* Protected App Page */}
        <Route
          path="/app"
          element={
            isAuthenticated ? (
              <AppPage setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
       <Route path="/contra-indications/:name" element={<ContraIndicationsPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;