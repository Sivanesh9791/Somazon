import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from '../axios';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

function HomePage() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1,
      })
    );
    toast.success('Added to cart!');
  };

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <div className="hero-banner">
        <h1>Welcome to Somazon</h1>
        <p>Discover millions of products at amazing prices</p>
        <button onClick={() => {
          document.querySelector('.products-grid').scrollIntoView({ behavior: 'smooth' });
        }}>
          Shop Now
        </button>
      </div>

      <h1>Latest Products</h1>
      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`}>
              <img src={product.image} alt={product.name} />
              <div className="product-card-info">
                <h3>{product.name}</h3>
                <p className="brand">{product.brand}</p>
                <p className="price">${product.price}</p>
                <p className="rating">
                  {product.rating} ⭐ ({product.numReviews} reviews)
                </p>
              </div>
            </Link>
            {product.countInStock > 0 ? (
              <button onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            ) : (
              <button disabled>Out of Stock</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
