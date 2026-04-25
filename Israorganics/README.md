# IsraOrganics — Hair Care E-Commerce Platform

A full-stack e-commerce website for hair care products catering to women of colour, covering all hair types from 1A to 4C.

---

## Project Structure

```
Israorganics/
├── backend/     Node.js + Express REST API  (port 5000)
├── frontend/    React + Vite customer app   (port 5173)
└── admin/       React + Vite admin panel    (port 5174)
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MySQL](https://www.mysql.com/) 8.0 or higher (MySQL Workbench recommended)

---

## Step 1 — Set Up the Database

1. Open **MySQL Workbench** (or any MySQL client)
2. Run **`backend/schema.sql`** — creates the `israorganics` database and all tables
3. Run **`backend/seed.sql`** — inserts the admin account and 17 sample products

---

## Step 2 — Configure the Backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your MySQL password:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=israorganics
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
ADMIN_JWT_SECRET=change_this_to_another_long_random_string
```

Then install dependencies and start the server:

```bash
npm install
npm run dev
```

The API will be running at `http://localhost:5000`

---

## Step 3 — Start the Customer App

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Step 4 — Start the Admin Dashboard

```bash
cd admin
npm install
npm run dev
```

Open `http://localhost:5174` in your browser.

**Default admin login:**
- Email: `admin@israorganics.com`
- Password: `Admin123!`

---

## Features

### Customer App
| Feature | Description |
|---|---|
| Sign Up | Register with name, email, password, and optional hair type |
| Sign In / Sign Out | JWT-based session, persisted in localStorage |
| Delete Account | Permanently removes account and cart data |
| Browse Products | All 17 seeded products with images |
| Search | Live search by product name or description |
| Filter | Filter by hair type (1a–4c) and product category |
| Pagination | 12 products per page |
| Product Detail | Full product page with quantity selector |
| Add to Cart | Requires login; shows cart badge count in navbar |
| Cart / Basket | Update quantities, remove items, view subtotals |
| Checkout | Review order + place without payment |
| Order Confirmation | Summary page with order ID and status |
| Order History | View all past orders under My Account |
| Edit Profile | Update name and hair type |

### Admin Dashboard
| Feature | Description |
|---|---|
| Overview Stats | Total users, products, orders, revenue |
| Recent Orders | Last 5 orders on the dashboard home |
| Products CRUD | Add, edit, delete products via modal form |
| Orders Management | View all orders, update status (pending → delivered) |
| Users Management | View all customers, search, delete accounts |

---

## Hair Type System

Products are tagged with compatible hair type codes:

| Range | Types |
|---|---|
| Straight | 1a, 1b, 1c |
| Wavy | 2a, 2b, 2c |
| Curly | 3a, 3b, 3c |
| Coily / Kinky | 4a, 4b, 4c |

Customers select their hair type at registration; products can be filtered by any single type code.

---

## API Reference (Backend)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register customer |
| POST | `/api/auth/login` | None | Login customer |
| GET | `/api/auth/me` | Customer | Get own profile |
| PUT | `/api/auth/me` | Customer | Update profile |
| DELETE | `/api/auth/account` | Customer | Delete own account |
| GET | `/api/products` | None | List/search products |
| GET | `/api/products/featured` | None | 8 newest products |
| GET | `/api/products/:id` | None | Single product |
| GET | `/api/cart` | Customer | View cart |
| POST | `/api/cart` | Customer | Add to cart |
| PUT | `/api/cart/:id` | Customer | Update quantity |
| DELETE | `/api/cart/:id` | Customer | Remove item |
| POST | `/api/orders` | Customer | Place order |
| GET | `/api/orders` | Customer | Order history |
| POST | `/api/admin/login` | None | Admin login |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET/POST | `/api/admin/products` | Admin | List / create products |
| PUT/DELETE | `/api/admin/products/:id` | Admin | Edit / delete product |
| GET | `/api/admin/orders` | Admin | All orders |
| PUT | `/api/admin/orders/:id/status` | Admin | Update order status |
| GET | `/api/admin/users` | Admin | All users |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
