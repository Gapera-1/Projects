import React, { useState } from 'react';
import MedicineForm from './components/MedicineForm';
import MedicineList from './components/MedicineList';
import Snackbar from './components/Snackbar';
import ReminderChecker from './ReminderChecker';
import useAuthStore from './store/useAuthStore';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleAuth = (e) => {
    e.preventDefault();
    if (isSignup) {
      if (!email || !password) {
        setError('All fields are required');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      // call backend signup
      fetch('http://127.0.0.1:8000/api/auth/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
        .then((r) => r.json().then(data => ({ ok: r.ok, status: r.status, data })))
        .then(({ ok, status, data }) => {
          if (!ok) {
            throw new Error(data.detail || `Error ${status}`);
          }
          setSuccess(data.detail || 'Signup successful! You can now log in.');
          setError('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setIsSignup(false);
          setTimeout(() => setSuccess(''), 3000);
        })
        .catch((err) => {
          console.error('Signup error:', err);
          setError(err.message || 'Signup failed. Please try again.');
        });
      return;
    } else {
      // login via token endpoint
      fetch('http://127.0.0.1:8000/api/auth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      })
        .then((r) => {
          if (!r.ok) throw r;
          return r.json();
        })
        .then((data) => {
          setError('');
          setAuth(data.access, data.refresh, email);
          setShowAuth(false);
        })
        .catch(async (err) => {
          let msg = 'Invalid credentials';
          try { const body = await err.json(); msg = body.detail || JSON.stringify(body); } catch {}
          setError(msg);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Top-right Auth Buttons */}
      <div className="fixed top-6 right-6 flex gap-3 z-40">
        <button
          className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:bg-blue-700 hover:scale-105 transform transition duration-300 ease-out active:scale-95"
          onClick={() => { setShowAuth(true); setIsSignup(false); }}
        >
          Login
        </button>
        <button
          className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:bg-green-700 hover:scale-105 transform transition duration-300 ease-out active:scale-95"
          onClick={() => { setShowAuth(true); setIsSignup(true); }}
        >
          Signup
        </button>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <form onSubmit={handleAuth} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col gap-4 relative transform transition duration-300">
            <button 
              type="button" 
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center text-2xl transition duration-200" 
              onClick={() => { setShowAuth(false); setError(''); setSuccess(''); }}
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-center text-gray-500 text-sm mb-4">
              {isSignup ? 'Join us today!' : 'Sign in to your account'}
            </p>
            <input
              type="email"
              placeholder="Email"
              className="border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 placeholder-gray-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              className="border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 placeholder-gray-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {isSignup && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 placeholder-gray-400"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            )}
            {error && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg border border-green-200">{success}</div>}
            <button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 rounded-lg transition duration-300 shadow-md hover:shadow-lg hover:scale-105 transform active:scale-95"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
            <div className="text-center text-sm mt-4 text-gray-600">
              {isSignup ? (
                <span>Already have an account? <button type="button" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition duration-200" onClick={() => { setIsSignup(false); setError(''); setSuccess(''); }}>Login</button></span>
              ) : (
                <span>Don't have an account? <button type="button" className="text-green-600 hover:text-green-800 font-semibold hover:underline transition duration-200" onClick={() => { setIsSignup(true); setError(''); setSuccess(''); }}>Create one</button></span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-xl mx-auto pt-24 px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 drop-shadow-sm">💊 Medicine Reminder</h1>
        <MedicineForm />
        <MedicineList />
        <Snackbar />
        <ReminderChecker />
      </div>
    </div>
  );
}

export default App;
