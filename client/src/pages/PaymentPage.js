import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../redux/slices/cartSlice';

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shippingAddress = useSelector((state) => state.cart.shippingAddress);
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  // Redirect if shipping address not set
  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="auth-page">
      <h2>Payment Method</h2>
      <form onSubmit={handleSubmit}>
        <h4>Select Payment Method</h4>

        <label>
          <input
            type="radio"
            value="PayPal"
            checked={paymentMethod === 'PayPal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          PayPal or Credit Card
        </label>

        <label>
          <input
            type="radio"
            value="CashOnDelivery"
            checked={paymentMethod === 'CashOnDelivery'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash on Delivery
        </label>

        <button type="submit">Continue to Place Order</button>
      </form>
    </div>
  );
};

export default PaymentPage;
