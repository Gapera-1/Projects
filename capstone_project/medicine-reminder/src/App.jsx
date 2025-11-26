import React, { useState } from 'react';
import MedicineForm from './components/MedicineForm';
import MedicineList from './components/MedicineList';
import Snackbar from './components/Snackbar';
import ReminderChecker from './ReminderChecker';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    if (isSignup) {
      if (!username || !password) {
        setError('All fields are required');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      setSuccess('Signup successful! You can now log in.');
      setError('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setIsSignup(false);
      setTimeout(() => setSuccess(''), 2000);
    } else {
      // Demo login: user/pass: user/pass
      if (username === 'user' && password === 'pass') {
        setError('');
        setShowAuth(false);
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded transition"
          onClick={() => { setShowAuth(true); setIsSignup(false); }}
        >
          Login
        </button>
        <button
          className="ml-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded transition"
          onClick={() => { setShowAuth(true); setIsSignup(true); }}
        >
          Signup
        </button>
      </div>
      {showAuth && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form onSubmit={handleAuth} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-4 relative">
            <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => { setShowAuth(false); setError(''); setSuccess(''); }}>&times;</button>
            <h2 className="text-2xl font-bold text-center mb-2">{isSignup ? 'Signup' : 'Login'}</h2>
            <input
              type="text"
              placeholder="Username"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {isSignup && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            )}
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-500 text-sm text-center">{success}</div>}
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition">{isSignup ? 'Signup' : 'Login'}</button>
            <div className="text-center text-sm mt-2">
              {isSignup ? (
                <span>Already have an account? <button type="button" className="text-blue-500 hover:underline" onClick={() => { setIsSignup(false); setError(''); setSuccess(''); }}>Login</button></span>
              ) : (
                <span>Don't have an account? <button type="button" className="text-green-500 hover:underline" onClick={() => { setIsSignup(true); setError(''); setSuccess(''); }}>Signup</button></span>
              )}
            </div>
          </form>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Medicine Reminder</h1>
      <MedicineForm />
      <MedicineList />
      <Snackbar />
      <ReminderChecker />
    </div>
  );
}

export default App;
