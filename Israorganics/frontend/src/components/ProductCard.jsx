import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart(product.id);
    } catch {
      // silently fail — user sees cart count update
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card__img-wrap">
        <img
          src={product.image_url || 'https://via.placeholder.com/400x300?text=Product'}
          alt={product.name}
          className="product-card__img"
        />
        <span className="product-card__type badge">{product.product_type}</span>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__hair">Hair types: {product.hair_type_codes || 'All'}</p>
        <div className="product-card__footer">
          <span className="product-card__price">£{parseFloat(product.price).toFixed(2)}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
