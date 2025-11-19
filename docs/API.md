# API Reference

Base URL: `/api`

## Users

- `POST /api/users/register` — Register a new user
  - Body: `{ name, email, password }`
  - Success: `201` `{ success: true, token, data: user }`

- `POST /api/users/login` — Login
  - Body: `{ email, password }`
  - Success: `200` `{ success: true, token, data: user }`

- `GET /api/users/me` — Get current user (Protected)
  - Header: `Authorization: Bearer <token>`
  - Success: `200` `{ success: true, data: user }`

- `PUT /api/users/profile` — Update user profile (Protected)
  - Body: partial user fields

- `PUT /api/users/change-password` — Change password (Protected)

## Products

- `GET /api/products` — List products
  - Query params: `category`, `search`, `page`, `limit`, `sort`

- `GET /api/products/:id` — Get product details

- `POST /api/products` — Create product (Admin)

- `PUT /api/products/:id` — Update product (Admin)

- `DELETE /api/products/:id` — Delete product (Admin)

## Cart

- `GET /api/cart` — Get user's cart (Protected)
- `POST /api/cart` — Add/update item in cart (Protected)
- `PUT /api/cart` — Replace cart (Protected)
- `DELETE /api/cart/items/:itemId` — Remove item (Protected)

## Orders

- `POST /api/orders` — Create order (Protected)
- `GET /api/orders` — List orders (Protected; admin can view all)
- `GET /api/orders/:id` — Get order details (Protected)
- `PUT /api/orders/:id/status` — Update order status (Admin)

## Real-time events (Socket.IO)

- Server emits `stock-update` when product inventory changes
- Server emits `order-notification` for new orders and status changes

---

This document is a concise reference. For example requests and full response shapes, see the controllers in `server/routes/` and `server/models/`.
