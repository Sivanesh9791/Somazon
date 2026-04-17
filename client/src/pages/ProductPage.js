import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from '../axios';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch product by ID
  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load product');
        setLoading(false);
      });
  }, [id]);

  // Handle add to cart
  const handleAddToCart = () => {
    if (product.countInStock === 0) {
      toast.error('Out of Stock');
      return;
    }

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        countInStock: product.countInStock,
        qty: parseInt(qty),
      })
    );

    toast.success('Added to cart!');
    navigate('/cart');
  };

  return (
    <div className="product-page">
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {product && (
        <>
          <button
            className="back-button"
            onClick={() => navigate('/')}
          >
            ← Back
          </button>

          <div className="product-detail">
            {/* LEFT SIDE - Image */}
            <div>
              <img src={product.image} alt={product.name} />
            </div>

            {/* RIGHT SIDE - Details */}
            <div>
              <h2>{product.name}</h2>
              <p>Brand: {product.brand}</p>
              <p>Category: {product.category}</p>
              <p>
                ⭐ {product.rating} ({product.numReviews} reviews)
              </p>
              <h3>${product.price}</h3>
              <p>{product.description}</p>

              {/* Stock Status */}
              <p
                style={{
                  color: product.countInStock > 0 ? 'green' : 'red',
                }}
              >
                Status: {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </p>

              {/* Quantity and Add to Cart */}
              {product.countInStock > 0 && (
                <>
                  <div>
                    <label htmlFor="qty">Quantity:</label>
                    <select
                      id="qty"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                    >
                      {Array.from(
                        { length: product.countInStock },
                        (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <button onClick={handleAddToCart}>Add to Cart</button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
