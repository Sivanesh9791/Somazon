import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../axios';
import { clearCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const shippingAddress = useSelector((state) => state.cart.shippingAddress);
  const paymentMethod = useSelector((state) => state.cart.paymentMethod);
  const userInfo = useSelector((state) => state.auth.userInfo);

  // Calculate prices
  const itemsPrice = cartItems
    .reduce((sum, item) => sum + item.price * item.qty, 0)
    .toFixed(2);
  const shippingPrice = (itemsPrice > 100 ? 0 : 10).toFixed(2);
  const taxPrice = (itemsPrice * 0.15).toFixed(2);
  const totalPrice = (
    parseFloat(itemsPrice) +
    parseFloat(shippingPrice) +
    parseFloat(taxPrice)
  ).toFixed(2);

  // Handle place order
  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.post('/orders', orderData, config);

      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/order/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="placeorder-page">
      <h2>Place Order</h2>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* LEFT SIDE - Order Details */}
        <div className="placeorder-details">
          {/* Shipping Address */}
          <div className="summary-section">
            <h3>Shipping Address</h3>
            <p>
              {shippingAddress?.address}, {shippingAddress?.city}{' '}
              {shippingAddress?.postalCode}, {shippingAddress?.country}
            </p>
          </div>

          {/* Payment Method */}
          <div className="summary-section">
            <h3>Payment Method</h3>
            <p>{paymentMethod}</p>
          </div>

          {/* Order Items */}
          <div className="summary-section">
            <h3>Order Items</h3>
            {cartItems.map((item) => (
              <div key={item._id} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                />
                <Link to={`/product/${item._id}`}>{item.name}</Link>
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
          <p>Items: ${itemsPrice}</p>
          <p>Shipping: ${shippingPrice}</p>
          <p>Tax: ${taxPrice}</p>
          <h3>Total: ${totalPrice}</h3>
          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
