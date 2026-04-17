import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.auth.userInfo);

  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.price * item.qty, 0)
    .toFixed(2);

  // Handle remove from cart
  const handleRemove = (item) => {
    dispatch(removeFromCart(item._id));
    toast.success('Item removed from cart');
  };

  // Handle quantity change
  const handleQtyChange = (item, newQty) => {
    dispatch(
      addToCart({
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        countInStock: item.countInStock,
        qty: parseInt(newQty),
      })
    );
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!userInfo) {
      navigate('/login');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div>
          <p>Your cart is empty</p>
          <Link to="/">Continue Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* LEFT SIDE - Cart Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} />

                <div>
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                </div>

                <select
                  value={item.qty}
                  onChange={(e) => handleQtyChange(item, e.target.value)}
                >
                  {Array.from(
                    { length: item.countInStock },
                    (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    )
                  )}
                </select>

                <button onClick={() => handleRemove(item)}>Remove</button>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE - Order Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>Total Items: {totalItems}</p>
            <h3>Total: ${totalPrice}</h3>
            <button onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
