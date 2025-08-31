import { useState } from 'react';
import { api } from '../api';

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const path = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await api(path, { method: 'POST', body: form });
      if (!res.token || !res.user) throw new Error('Invalid response from server');
      onAuth(res.token, res.user);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="card">
      <h2>{mode === 'login' ? 'Login' : 'Create account'}</h2>
      <form onSubmit={submit} className="flex" style={{ flexDirection: 'column' }}>
        {mode === 'register' && (
          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        )}
        <input
          className="input"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {err && <div style={{ color: '#fda4af', marginTop: '8px' }}>{err}</div>}
        <button className="button" style={{ marginTop: '8px' }}>
          {mode === 'login' ? 'Login' : 'Sign up'}
        </button>
      </form>

      <div style={{ marginTop: 8 }}>
        {mode === 'login' ? (
          <span>
            New here?{' '}
            <button className="link" type="button" onClick={() => setMode('register')}>
              Create account
            </button>
          </span>
        ) : (
          <span>
            Already have an account?{' '}
            <button className="link" type="button" onClick={() => setMode('login')}>
              Login
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
