import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface SummaryData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/dashboard/summary');
        setData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', fontSize: '24px' }}>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'red', fontSize: '20px' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '50px', color: '#2c3e50', fontSize: '36px' }}>
        Product & Sales Management Dashboard
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Total Products Card */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          transition: 'transform 0.3s',
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', opacity: 0.9 }}>
            Total Active Products
          </h3>
          <h2 style={{ margin: 0, fontSize: '60px', fontWeight: 'bold' }}>
            {data?.totalProducts || 0}
          </h2>
        </div>

        {/* Total Orders Card */}
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', opacity: 0.9 }}>
            Total Orders
          </h3>
          <h2 style={{ margin: 0, fontSize: '60px', fontWeight: 'bold' }}>
            {data?.totalOrders || 0}
          </h2>
        </div>

        {/* Total Revenue Card */}
        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', opacity: 0.9 }}>
            Total Revenue
          </h3>
          <h2 style={{ margin: 0, fontSize: '60px', fontWeight: 'bold' }}>
            ${data?.totalRevenue.toFixed(2) || '0.00'}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;