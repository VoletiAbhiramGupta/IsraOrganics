import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const HAIR_TYPES = [
  { code: '1a', label: 'Type 1A', desc: 'Fine & straight' },
  { code: '2b', label: 'Type 2B', desc: 'Wavy, medium' },
  { code: '3b', label: 'Type 3B', desc: 'Curly, springy' },
  { code: '4c', label: 'Type 4C', desc: 'Coily & kinky' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/featured')
      .then(({ data }) => setFeatured(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <p className="hero__eyebrow">Hair care for every texture</p>
            <h1 className="hero__title">
              From 1A to 4C —<br />
              <span>Your Hair, Your Rules</span>
            </h1>
            <p className="hero__sub">
              Discover shampoos, conditioners, treatments and more,
              curated specifically for the full range of hair textures for women of colour.
            </p>
            <div className="hero__ctas">
              <Link to="/products" className="btn btn-primary">Shop All Products</Link>
              <Link to="/register" className="btn btn-outline">Create Account</Link>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__img-wrap">
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600"
                alt="Woman with natural afro hair"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Hair Type Finder ── */}
      <section className="section hair-types">
        <div className="container">
          <h2 className="section__title">Shop by Hair Type</h2>
          <p className="section__sub">Find products matched to your exact texture.</p>
          <div className="hair-types__grid">
            {HAIR_TYPES.map((ht) => (
              <Link
                key={ht.code}
                to={`/products?hair_type=${ht.code}`}
                className="hair-type-card"
              >
                <div className="hair-type-card__icon">{ht.code.toUpperCase()}</div>
                <div>
                  <strong>{ht.label}</strong>
                  <p>{ht.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section featured">
        <div className="container">
          <h2 className="section__title">Featured Products</h2>
          <p className="section__sub">Our most popular picks across all hair types.</p>
          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/products" className="btn btn-outline">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ── Why IsraOrganics ── */}
      <section className="section why">
        <div className="container">
          <h2 className="section__title">Why IsraOrganics?</h2>
          <div className="why__grid">
            {[
              { icon: '🌿', title: 'All Textures Welcome', text: 'Products covering every hair type from fine and straight to coily and kinky.' },
              { icon: '🔍', title: 'Smart Filtering', text: 'Filter by hair type code, product category, and more to find exactly what you need.' },
              { icon: '✨', title: 'Curated Selection', text: 'Every product is hand-picked for quality and suitability for women of colour.' },
            ].map((item) => (
              <div key={item.title} className="why__card card">
                <div className="why__icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
