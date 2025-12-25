import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  isActive: boolean;
  createdAt: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', sku: '', price: '' });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setError('');
    } catch (err: any) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', sku: '', price: '' });
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, sku: product.sku, price: product.price.toString() });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Deactivate this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', sku: '', price: '' });
    setShowModal(true);
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading products...</div>;
  if (error) return <div style={{ padding: '100px', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50' }}>Products Management</h1>
        <button
          onClick={openCreateModal}
          style={{
            background: '#52c41a',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          + Add Product
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name or SKU..."
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
            <th style={{ padding: '16px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '16px', textAlign: 'left' }}>SKU</th>
            <th style={{ padding: '16px', textAlign: 'left' }}>Price</th>
            <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '16px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product) => (
            <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '16px' }}>{product.name}</td>
              <td style={{ padding: '16px' }}>{product.sku}</td>
              <td style={{ padding: '16px' }}>${product.price.toFixed(2)}</td>
              <td style={{ padding: '16px' }}>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  background: product.isActive ? '#d4edda' : '#f8d7da',
                  color: product.isActive ? '#155724' : '#721c24',
                  fontSize: '14px'
                }}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td style={{ padding: '16px', textAlign: 'center' }}>
                <button onClick={() => handleEdit(product)} style={{ marginRight: '10px', color: '#1890ff', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(product._id)} style={{ color: '#f5222d', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Deactivate
                </button>
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
                background: page === i + 1 ? '#1890ff' : '#f0f0f0',
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

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '500px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginBottom: '20px' }}>
              {editingProduct ? 'Edit Product' : 'Create New Product'}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <input
                type="text"
                placeholder="SKU (Unique)"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                required
                style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0.01"
                step="0.01"
                style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{
                  flex: 1,
                  padding: '12px',
                  background: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  {editingProduct ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: '6px',
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

export default Products;