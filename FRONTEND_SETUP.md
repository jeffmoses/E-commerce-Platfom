# Frontend Setup & Running Guide

## Quick Start

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Environment Configuration
Ensure `.env.local` file exists in the `client/` directory with:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another available port).

### 4. Backend Must Be Running
Ensure the backend server is running on `http://localhost:5000` with:
```bash
cd server
npm install
npm start
```

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Header.js          # Navigation header
│   │   ├── Footer.js          # Footer component
│   │   ├── ProductCard.jsx    # Product display card
│   │   └── CartItem.jsx       # Cart item component
│   ├── pages/
│   │   ├── Home.js            # Home page
│   │   ├── ProductList.js     # Products listing
│   │   ├── ProductDetail.js   # Single product view
│   │   ├── Cart.js            # Shopping cart
│   │   ├── Checkout.js        # Multi-step checkout
│   │   ├── Login.js           # Login page
│   │   ├── Register.js        # Registration page
│   │   └── Profile.js         # User profile
│   ├── store/
│   │   ├── store.js           # Redux store
│   │   └── slices/
│   │       ├── authSlice.js   # Auth state
│   │       └── cartSlice.js   # Cart state
│   ├── utils/
│   │   ├── api.js             # Axios client
│   │   └── socket.js          # Socket.IO client
│   ├── App.js                 # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.local                 # Environment variables
```

## Available Scripts

### Development
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Features Implemented

### Pages
- ✅ Home page with hero and featured products
- ✅ Product listing with search, filter, and pagination
- ✅ Product details page
- ✅ Shopping cart
- ✅ Multi-step checkout
- ✅ User authentication (login/register)
- ✅ User profile with orders

### Components
- ✅ Responsive header with mobile menu
- ✅ Product cards
- ✅ Cart items
- ✅ Footer with links

### Functionality
- ✅ Add/remove items from cart
- ✅ Update item quantities
- ✅ Calculate totals and taxes
- ✅ User registration and login
- ✅ Profile management
- ✅ Order creation
- ✅ Form validation

## Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically use the next available port. Check the console output.

### API Connection Error
- Ensure backend is running on `http://localhost:5000`
- Check `.env.local` has correct API URL
- Check browser console for specific errors

### Dependencies Missing
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Issues
```bash
# Clean build
npm run build
```

## Testing the App

1. **Home Page**: Browse to `http://localhost:5173`
2. **Products**: Click "Shop Now" or navigate to `/products`
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Registration**: Create account at `/register`
5. **Login**: Sign in at `/login`
6. **Checkout**: Go to `/cart` and proceed to checkout
7. **Profile**: View profile at `/profile` after login

## API Endpoints Used

```
GET    /api/products              # Get all products
GET    /api/products/:id          # Get single product
POST   /api/users/register        # Register
POST   /api/users/login           # Login
GET    /api/users/me              # Get current user
PUT    /api/users/profile         # Update profile
POST   /api/orders                # Create order
GET    /api/orders                # Get user orders
```

## Performance Notes

- Vite's hot module replacement (HMR) for fast development
- Tailwind CSS with PurgeCSS for optimized CSS
- Lazy component loading can be added
- Redux for efficient state management

## Production Deployment

### Build
```bash
npm run build
```

### Environment Variables (Production)
Update `.env.local` with production API URL:
```
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_SOCKET_URL=https://your-api-domain.com
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

Or push to GitHub and connect to Vercel for auto-deployment.

## Support

For issues or questions:
1. Check the console for error messages
2. Verify backend is running
3. Check network requests in DevTools
4. Review API responses

---

**Happy coding! 🚀**
