# Architecture Overview

This project follows a standard MERN architecture:

- Client: React application (Create React App)
  - Routes, pages, components, Tailwind for styling
  - State: Redux Toolkit for auth and cart
  - Real-time: Socket.IO client for notifications

- Server: Node.js + Express
  - REST API endpoints under `/api`
  - Authentication via JWT
  - Real-time: Socket.IO server for events

- Database: MongoDB (Mongoose models)

Data flow (high level):

User -> React UI -> axios -> Express API -> MongoDB
            ^                         |
            |------ Socket.IO <------|

Deployment notes
- Store secrets (DB URI, JWT secret) in environment variables or secret manager
- Use production build of React and serve via CDN or static host (Vercel, Netlify) while API runs on Render/Heroku

Diagram (ASCII)

Client (React)
  |-- /products            -> GET /api/products
  |-- /products/:id        -> GET /api/products/:id
  |-- /cart                -> POST /api/cart
  |-- Socket.IO client <-----> Socket.IO server

Server (Express)
  |-- Controllers -> Business logic
  |-- Models (Mongoose) -> MongoDB
