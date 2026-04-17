import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../axios';
import { toast } from 'react-toastify';

const AdminPage = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);

  // Check authorization and fetch data
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      toast.error('Not authorized');
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products (no auth needed)
        const productsRes = await axios.get('/products');
        setProducts(productsRes.data);

        // Fetch orders with auth
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const ordersRes = await axios.get('/orders', config);
        setOrders(ordersRes.data);

        // Fetch users with auth
        const usersRes = await axios.get('/users', config);
        setUsers(usersRes.data);

        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo, navigate]);

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`/products/${productId}`, config);

      setProducts(products.filter((p) => p._id !== productId));
      toast.success('Product deleted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`/users/${userId}`, config);

      setUsers(users.filter((u) => u._id !== userId));
      toast.success('User deleted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="admin-page">
      <h2>Admin Panel</h2>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={activeTab === 'products' ? 'active-tab' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products ({products.length})
        </button>
        <button
          className={activeTab === 'orders' ? 'active-tab' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.length})
        </button>
        <button
          className={activeTab === 'users' ? 'active-tab' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {/* Products Tab */}
      {!loading && activeTab === 'products' && (
        <div>
          <button
            style={{
              padding: '10px 20px',
              marginBottom: '20px',
              background: '#131921',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/admin/addproduct')}
          >
            Add New Product
          </button>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img src={product.image} alt={product.name} />
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.countInStock}</td>
                  <td>
                    <button
                      style={{
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders Tab */}
      {!loading && activeTab === 'orders' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>${order.totalPrice}</td>
                <td>
                  <span style={{ color: order.isPaid ? 'green' : 'red' }}>
                    {order.isPaid ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  <span style={{ color: order.isDelivered ? 'green' : 'red' }}>
                    {order.isDelivered ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Users Tab */}
      {!loading && activeTab === 'users' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                  <button
                    style={{
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
