import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import useAuthStore from "../store/useAuthStore";

function AuthPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState(""); // changed from username
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // changed username -> email
      });
      if (!res.ok) throw res;
      const data = await res.json();
      setAuth(data.access, data.refresh, email); // changed username -> email
      setIsAuthenticated(true);
      navigate("/app");
    } catch (err) {
      let msg = "Invalid credentials";
      try {
        const body = await err.json();
        msg = body.detail || msg;
      } catch {
        // Ignore JSON parsing errors
      }
      setError(msg);
    }
  };

  // ✅ SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !confirmPassword) { // changed username -> email
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // changed username -> email
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Signup failed");
      setSuccess("Signup successful! You can now log in.");
      setTimeout(() => {
        setSuccess("");
        setIsSignup(false);
      }, 2000);
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/Login_background.jpg')" }}
    >
      <div className="auth-container">
        {isSignup ? (
          <SignupForm
            email={email} // changed username -> email
            password={password}
            confirmPassword={confirmPassword}
            error={error}
            success={success}
            setEmail={setEmail} // changed setUsername -> setEmail
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            handleSignup={handleSignup}
            setIsSignup={setIsSignup}
          />
        ) : (
          <LoginForm
            email={email} // changed username -> email
            password={password}
            error={error}
            setEmail={setEmail} // changed setUsername -> setEmail
            setPassword={setPassword}
            handleLogin={handleLogin}
            setIsSignup={setIsSignup}
          />
        )}
      </div>
    </div>
  );
}

export default AuthPage;
