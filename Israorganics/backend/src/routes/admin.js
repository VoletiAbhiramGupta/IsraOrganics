const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { adminProtect } = require('../middleware/auth');

const router = express.Router();

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.ADMIN_JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── Products ──────────────────────────────────────────────────────────────────

// GET /api/admin/products
router.get('/products', adminProtect, async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/admin/products
router.post('/products', adminProtect, async (req, res) => {
  const { name, description, price, stock, image_url, product_type, hair_type_codes } = req.body;
  if (!name || !price || !product_type) {
    return res.status(400).json({ message: 'name, price, and product_type are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, stock, image_url, product_type, hair_type_codes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, parseFloat(price), parseInt(stock) || 0, image_url, product_type, hair_type_codes]
    );
    res.status(201).json({ message: 'Product created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/admin/products/:id
router.put('/products/:id', adminProtect, async (req, res) => {
  const { name, description, price, stock, image_url, product_type, hair_type_codes } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE products SET name=?, description=?, price=?, stock=?, image_url=?, product_type=?, hair_type_codes=? WHERE id=?',
      [name, description, parseFloat(price), parseInt(stock), image_url, product_type, hair_type_codes, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', adminProtect, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── Orders ────────────────────────────────────────────────────────────────────

// GET /api/admin/orders
router.get('/orders', adminProtect, async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.first_name, u.last_name, u.email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );

    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.quantity, oi.price_at_purchase, p.name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/admin/orders/:id/status — update order status
router.put('/orders/:id/status', adminProtect, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [
      status,
      req.params.id,
    ]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── Users ─────────────────────────────────────────────────────────────────────

// GET /api/admin/users
router.get('/users', adminProtect, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, first_name, last_name, email, hair_type, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', adminProtect, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [req.params.id]);
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── Stats ─────────────────────────────────────────────────────────────────────

// GET /api/admin/stats — dashboard overview numbers
router.get('/stats', adminProtect, async (req, res) => {
  try {
    const [[{ total_users }]] = await pool.query('SELECT COUNT(*) as total_users FROM users');
    const [[{ total_products }]] = await pool.query('SELECT COUNT(*) as total_products FROM products');
    const [[{ total_orders }]] = await pool.query('SELECT COUNT(*) as total_orders FROM orders');
    const [[{ revenue }]] = await pool.query(
      "SELECT COALESCE(SUM(total), 0) as revenue FROM orders WHERE status != 'cancelled'"
    );

    res.json({ total_users, total_products, total_orders, revenue });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
