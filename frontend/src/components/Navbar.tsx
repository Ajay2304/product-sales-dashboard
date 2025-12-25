import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      padding: '15px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
        <h2 style={{ color: '#ecf0f1', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/')}>
          Sales Dashboard
        </h2>
        <button
          onClick={() => navigate('/')}
          style={navButtonStyle(true)}
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate('/products')}
          style={navButtonStyle(false)}
        >
          Products
        </button>
        <button
          onClick={() => navigate('/orders')}
          style={navButtonStyle(false)}
        >
          Orders
        </button>
      </div>

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Logout
      </button>
    </nav>
  );
};

const navButtonStyle = (active: boolean) => ({
  backgroundColor: active ? '#3498db' : 'transparent',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: active ? 'bold' : 'normal' as any
});

export default Navbar;