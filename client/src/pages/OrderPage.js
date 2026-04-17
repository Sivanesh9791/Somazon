import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../axios';
import { toast } from 'react-toastify';

const OrderPage = () => {
  const { id } = useParams();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchOrder = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const response = await axios.get(`/orders/${id}`, config);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order');
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrder();
    }
  }, [id, userInfo]);

  // Handle mark as paid
  const handleMarkAsPaid = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.put(`/orders/${id}/pay`, {}, config);
      setOrder(response.data);
      toast.success('Order marked as paid!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark order as paid');
    }
  };

  return (
    <div className="order-page">
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {order && (
        <>
          <h2>Order: {order._id}</h2>

          <div style={{ display: 'flex', gap: '20px' }}>
            {/* LEFT SIDE - Order Details */}
            <div className="order-details">
              {/* Shipping Address */}
              <div className="summary-section">
                <h3>Shipping Address</h3>
                <p>
                  {order.shippingAddress?.address},{' '}
                  {order.shippingAddress?.city}{' '}
                  {order.shippingAddress?.postalCode},{' '}
                  {order.shippingAddress?.country}
                </p>
                <p className={order.isDelivered ? 'paid' : 'not-paid'}>
                  {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                </p>
              </div>

              {/* Payment Method */}
              <div className="summary-section">
                <h3>Payment Method</h3>
                <p>{order.paymentMethod}</p>
                <p className={order.isPaid ? 'paid' : 'not-paid'}>
                  {order.isPaid ? 'Paid' : 'Not Paid'}
                </p>
              </div>

              {/* Order Items */}
              <div className="summary-section">
                <h3>Order Items</h3>
                {order.orderItems?.map((item) => (
                  <div
                    key={item.product}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      marginBottom: '10px',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                    />
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                    <p>
                      {item.qty} x ${item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE - Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <p>Items: ${order.itemsPrice}</p>
              <p>Shipping: ${order.shippingPrice}</p>
              <p>Tax: ${order.taxPrice}</p>
              <h3>Total: ${order.totalPrice}</h3>

              {userInfo?.isAdmin && !order.isPaid && (
                <button onClick={handleMarkAsPaid}>Mark As Paid</button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderPage;
