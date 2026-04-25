import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const HAIR_TYPES = ['1a','1b','1c','2a','2b','2c','3a','3b','3c','4a','4b','4c'];
const PRODUCT_TYPES = ['shampoo','conditioner','treatment','relaxer','moisturizer','oil','gel','other'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const search      = searchParams.get('search') || '';
  const hair_type   = searchParams.get('hair_type') || '';
  const product_type = searchParams.get('product_type') || '';
  const page        = parseInt(searchParams.get('page') || '1');
  const limit       = 12;

  useEffect(() => {
    setLoading(true);
    const params = { page, limit };
    if (search)       params.search = search;
    if (hair_type)    params.hair_type = hair_type;
    if (product_type) params.product_type = product_type;

    api.get('/products', { params })
      .then(({ data }) => { setProducts(data.products); setTotal(data.total); })
      .finally(() => setLoading(false));
  }, [search, hair_type, product_type, page]);

  const set = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="page products-page">
      <div className="container">
        <h1 className="products-page__title">All Products</h1>

        {/* ── Filters ── */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => set('search', e.target.value)}
            className="filters__search"
          />
          <select value={hair_type} onChange={(e) => set('hair_type', e.target.value)}>
            <option value="">All Hair Types</option>
            {HAIR_TYPES.map((ht) => (
              <option key={ht} value={ht}>{ht.toUpperCase()}</option>
            ))}
          </select>
          <select value={product_type} onChange={(e) => set('product_type', e.target.value)}>
            <option value="">All Product Types</option>
            {PRODUCT_TYPES.map((pt) => (
              <option key={pt} value={pt} style={{ textTransform: 'capitalize' }}>{pt.charAt(0).toUpperCase() + pt.slice(1)}</option>
            ))}
          </select>
          {(search || hair_type || product_type) && (
            <button className="btn btn-outline btn-sm" onClick={() => setSearchParams({})}>
              Clear Filters
            </button>
          )}
        </div>

        <p className="products-page__count">
          {total} product{total !== 1 ? 's' : ''} found
        </p>

        {loading ? (
          <div className="spinner" />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page === 1}
                  onClick={() => set('page', String(page - 1))}
                >
                  ← Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page === totalPages}
                  onClick={() => set('page', String(page + 1))}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
