import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { clearCart } from '../redux/slices/cartSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/login');
  };

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        🛒 Somazon
      </Link>
      <div className="nav-links">
        <Link to="/cart">Cart ({totalCartItems})</Link>
        {userInfo ? (
          <>
            <span>{userInfo.name}</span>
            <button onClick={handleLogout}>Logout</button>
            {userInfo.isAdmin && <Link to="/admin">Admin Panel</Link>}
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
