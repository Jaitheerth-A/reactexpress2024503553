import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', stock: '' });

  const fetchItems = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/products?q=${search}`
    );
    setProducts(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, [search]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post(
      'http://localhost:5000/api/products',
      form
    );
    setForm({ name: '', stock: '' });
    fetchItems();
  };

  const handleReduce = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/products/${id}`
    );
    fetchItems();
  };

  return (
    <div className="container">
      <h1>Product Inventory Dashboard</h1>

      <form onSubmit={handleAdd} className="add-form">
        <input
          placeholder="Product Name"
          value={form.name}
          onChange={e =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={e =>
            setForm({
              ...form,
              stock: Number(e.target.value)
            })
          }
          required
        />

        <button type="submit" className="btn-add">
          Add Product
        </button>
      </form>

      <input
        className="search-input"
        placeholder="Search products..."
        onChange={e => setSearch(e.target.value)}
      />

      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Stock Quantity</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.stock}</td>
              <td>
                <button
                  onClick={() => handleReduce(p.id)}
                  className="btn-delete"
                >
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;