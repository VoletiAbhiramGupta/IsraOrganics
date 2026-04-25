const express = require('express');
const pool = require('../config/db');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// POST /api/orders — place an order from the current cart contents
router.post('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Fetch cart items for this user
    const [cartItems] = await conn.query(
      `SELECT ci.quantity, p.id as product_id, p.price, p.stock, p.name
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock and calculate total
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await conn.rollback();
        return res.status(400).json({ message: `Insufficient stock for "${item.name}"` });
      }
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create the order record
    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [req.user.id, total, 'pending']
    );
    const orderId = orderResult.insertId;

    // Insert each order item and decrement stock
    for (const item of cartItems) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [
        item.quantity,
        item.product_id,
      ]);
    }

    // Clear the cart
    await conn.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    await conn.commit();
    res.status(201).json({ message: 'Order placed successfully', orderId, total });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    conn.release();
  }
});

// GET /api/orders — get the logged-in user's order history
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    // Attach items to each order
    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.quantity, oi.price_at_purchase, p.name, p.image_url
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

// GET /api/orders/:id — get one order (must belong to logged-in user)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Order not found' });

    const order = rows[0];
    const [items] = await pool.query(
      `SELECT oi.quantity, oi.price_at_purchase, p.name, p.image_url, p.id as product_id
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order.id]
    );
    order.items = items;

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
