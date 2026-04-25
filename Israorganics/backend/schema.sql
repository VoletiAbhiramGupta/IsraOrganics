-- IsraOrganics Database Schema
-- Run this file in MySQL Workbench or your MySQL client before starting the server

-- CREATE DATABASE IF NOT EXISTS israorganics;
-- USE israorganics;

-- ─── Users (customers) ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  hair_type     VARCHAR(10)  DEFAULT NULL,  -- e.g. '3b', '4c'
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ─── Admins ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ─── Products ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(255)   NOT NULL,
  description      TEXT,
  price            DECIMAL(10, 2) NOT NULL,
  stock            INT            DEFAULT 0,
  image_url        VARCHAR(500)   DEFAULT NULL,
  product_type     ENUM('shampoo', 'conditioner', 'treatment', 'relaxer', 'moisturizer', 'oil', 'gel', 'other') NOT NULL,
  -- Comma-separated list of compatible hair type codes, e.g. '3a,3b,3c,4a'
  hair_type_codes  VARCHAR(255)   DEFAULT NULL,
  created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- ─── Cart Items ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  product_id INT NOT NULL,
  quantity   INT NOT NULL DEFAULT 1,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- ─── Orders ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT            NOT NULL,
  total      DECIMAL(10, 2) NOT NULL,
  status     ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Order Items ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  order_id           INT            NOT NULL,
  product_id         INT            NOT NULL,
  quantity           INT            NOT NULL,
  price_at_purchase  DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);
