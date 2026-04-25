import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return; }
    await addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="spinner" />;
  if (!product) return (
    <div className="page container empty-state">
      <h3>Product not found</h3>
      <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Shop</Link>
    </div>
  );

  const hairCodes = product.hair_type_codes ? product.hair_type_codes.split(',') : [];

  return (
    <div className="page">
      <div className="container">
        <Link to="/products" className="detail__back">← Back to Products</Link>
        <div className="detail__layout">
          <div className="detail__img-wrap">
            <img
              src={product.image_url || 'https://via.placeholder.com/600x500?text=Product'}
              alt={product.name}
            />
          </div>
          <div className="detail__info">
            <span className="badge">{product.product_type}</span>
            <h1 className="detail__name">{product.name}</h1>
            <p className="detail__price">£{parseFloat(product.price).toFixed(2)}</p>

            {hairCodes.length > 0 && (
              <div className="detail__hair-types">
                <p className="detail__label">Suitable for hair types:</p>
                <div className="detail__badges">
                  {hairCodes.map((code) => (
                    <span key={code} className="badge">{code.trim().toUpperCase()}</span>
                  ))}
                </div>
              </div>
            )}

            <p className="detail__desc">{product.description}</p>

            <div className="detail__stock">
              {product.stock > 0 ? (
                <span className="detail__in-stock">✓ In stock ({product.stock} available)</span>
              ) : (
                <span className="detail__out">Out of stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="detail__add">
                <div className="detail__qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <button
                  className={`btn ${added ? 'btn-outline' : 'btn-primary'}`}
                  onClick={handleAdd}
                >
                  {added ? '✓ Added to Cart!' : 'Add to Cart'}
                </button>
              </div>
            )}

            <Link to="/cart" className="btn btn-outline" style={{ marginTop: '.75rem', width: '100%' }}>
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
