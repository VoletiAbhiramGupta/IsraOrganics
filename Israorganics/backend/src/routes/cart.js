const express = require('express');
const pool = require('../config/db');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All cart routes require the user to be logged in
router.use(protect);

// GET /api/cart — get all items in the user's cart with product details
router.get('/', async (req, res) => {
  try {
    const [items] = await pool.query(
      `SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/cart — add an item or increase quantity if already in cart
router.post('/', async (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  if (!product_id) return res.status(400).json({ message: 'product_id is required' });

  try {
    const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [product_id]);
    if (product.length === 0) return res.status(404).json({ message: 'Product not found' });

    const [existing] = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, req.user.id, product_id]
      );
    } else {
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.id, product_id, quantity]
      );
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/cart/:itemId — update quantity of a specific cart item
router.put('/:itemId', async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.itemId, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/cart/:itemId — remove one item from cart
router.delete('/:itemId', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [
      req.params.itemId,
      req.user.id,
    ]);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/cart — clear the entire cart
router.delete('/', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
