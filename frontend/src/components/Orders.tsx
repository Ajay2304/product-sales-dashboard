import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  isActive: boolean;
}

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  customerName: string;
  orderDate: string;
  items: OrderItem[];
  totalAmount: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [total, setTotal] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
    fetchActiveProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      alert('Failed to load orders');
    }
  };

  const fetchActiveProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.filter((p: Product) => p.isActive));
    } catch (err) {
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fixed: Memoized calculateTotal to remove ESLint warning
  const calculateTotal = useCallback(() => {
    let sum = 0;
    orderItems.forEach((item) => {
      const product = products.find((p) => p._id === item.productId);
      if (product) {
        sum += product.price * item.quantity;
      }
    });
    setTotal(sum);
  }, [orderItems, products]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  const filteredOrders = orders.filter((o) =>
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const addItemRow = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1 }]);
  };

  // Fixed: Type-safe updateItem
  const updateItem = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    setOrderItems(prev => {
      const updated = [...prev];
      if (field === 'productId') {
        updated[index].productId = value as string;
      } else if (field === 'quantity') {
        updated[index].quantity = value as number;
      }
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Customer name required');
      return;
    }
    if (orderItems.some(i => !i.productId || i.quantity < 1)) {
      alert('Please select valid products and quantities');
      return;
    }

    try {
      await api.post('/orders', {
        customerName,
        items: orderItems
      });
      setShowModal(false);
      setCustomerName('');
      setOrderItems([]);
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create order');
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50' }}>Sales Orders</h1>
        <button
          onClick={() => {
            setCustomerName('');
            setOrderItems([]);
            setShowModal(true);
          }}
          style={{
            background: '#722ed1',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          + New Order
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by customer name..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '8px',
          border: '1px solid #d9d9d9',
          fontSize: '16px'
        }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <thead style={{ background: '#f8f9fa' }}>
          <tr>
            <th style={{ padding: '16px', textAlign: 'left' }}>Order ID</th>
            <th style={{ padding: '16px', textAlign: 'left' }}>Customer</th>
            <th style={{ padding: '16px', textAlign: 'left' }}>Date</th>
            <th style={{ padding: '16px', textAlign: 'left' }}>Items</th>
            <th style={{ padding: '16px', textAlign: 'right' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order) => (
            <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '16px' }}>{order._id.slice(-6)}</td>
              <td style={{ padding: '16px' }}>{order.customerName}</td>
              <td style={{ padding: '16px' }}>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td style={{ padding: '16px' }}>
                {order.items.map((item, i) => (
                  <div key={i}>{item.productName} × {item.quantity}</div>
                ))}
              </td>
              <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>
                ${order.totalAmount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              style={{
                padding: '10px 16px',
                background: page === i + 1 ? '#722ed1' : '#f0f0f0',
                color: page === i + 1 ? 'white' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Create Order Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '700px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Create New Order</h2>
            <form onSubmit={handleCreateOrder}>
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ccc' }}
              />

              <div style={{ marginBottom: '20px' }}>
                <h3>Order Items</h3>
                {orderItems.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      required
                      style={{ flex: 2, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    >
                      <option value="">Select Product</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} (${p.price.toFixed(2)})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      required
                      style={{ width: '100px', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                    <button type="button" onClick={() => removeItem(index)} style={{
                      background: '#f5222d',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '6px'
                    }}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addItemRow} style={{
                  background: '#1890ff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  marginTop: '10px'
                }}>
                  + Add Item
                </button>
              </div>

              <div style={{ textAlign: 'right', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                Total: ${total.toFixed(2)}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{
                  flex: 1,
                  padding: '14px',
                  background: '#722ed1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}>
                  Create Order
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex: 1,
                  padding: '14px',
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;