import React, { useState } from 'react';
import api from '../services/api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);

      // Full page reload to clear any dev state and go to dashboard
      window.location.href = '/';
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please check if backend is running on port 5000.';
      setError(message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          padding: '40px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          width: '420px',
          maxWidth: '90%',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: '#1a1a1a',
            fontSize: '28px',
            fontWeight: '600',
          }}
        >
          Product & Sales Dashboard
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#333',
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              required
              placeholder="admin"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                fontSize: '16px',
                transition: 'border 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#1890ff')}
              onBlur={(e) => (e.target.style.borderColor = '#d9d9d9')}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#333',
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="password"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
                fontSize: '16px',
                transition: 'border 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#1890ff')}
              onBlur={(e) => (e.target.style.borderColor = '#d9d9d9')}
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#fff2f0',
                border: '1px solid #ffccc7',
                color: '#cf1322',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '30px',
            color: '#666',
            fontSize: '14px',
          }}
        >
          Default credentials: <strong>admin</strong> / <strong>password</strong>
        </p>
      </div>
    </div>
  );
};

export default Login;