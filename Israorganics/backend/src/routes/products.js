const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET /api/products — list all products, with optional filters
// Query params: ?hair_type=3b&product_type=shampoo&search=curl&page=1&limit=12
router.get('/', async (req, res) => {
  const { hair_type, product_type, search, page = 1, limit = 12 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (hair_type) {
    query += ' AND hair_type_codes LIKE ?';
    params.push(`%${hair_type}%`);
  }
  if (product_type) {
    query += ' AND product_type = ?';
    params.push(product_type);
  }
  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');

  try {
    const [[{ total }]] = await pool.query(countQuery, params);
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [products] = await pool.query(query, params);
    res.json({ products, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/products/featured — 8 newest products for the home page
router.get('/featured', async (req, res) => {
  try {
    const [products] = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC LIMIT 8'
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/products/:id — single product detail
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
