# RahaSubs - Subscription Sharing Platform

RahaSubs is a modern web application that enables users to share subscription costs by forming groups. Split the cost of Netflix, Spotify, and other popular subscriptions with friends and save money!

## 🌟 Features

- **User Authentication**: Secure registration and login with JWT
- **Wallet System**: Add funds, make payments, and track transactions
- **Subscription Browsing**: Explore available subscription services
- **Group Management**: Join groups and share subscription costs
- **Payment Processing**: Secure payment handling with status tracking
- **Dashboard**: View active subscriptions and wallet balance
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

## 📦 Project Structure

```
rahasubs/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── store/             # Zustand stores
│   ├── utils/             # Utility functions and API
│   └── main.tsx           # Entry point
├── server/                # Backend source code
│   ├── config/            # Database configuration
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── server.js          # Server entry point
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- pnpm or npm

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/rahasubs.git
   cd rahasubs
   ```

2. **Install frontend dependencies**
   ```bash
   pnpm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Configure environment variables**
   
   Create `.env` in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_USE_MOCK_API=false
   ```
   
   Create `server/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/rahasubs
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   PORT=5000
   ```

5. **Seed the database** (optional)
   ```bash
   cd server
   npm run seed
   cd ..
   ```

6. **Start the backend**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend** (in a new terminal)
   ```bash
   pnpm run dev
   ```

8. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

### Using Mock API (No Backend Required)

For quick testing without setting up MongoDB:

1. Update `.env`:
   ```env
   VITE_USE_MOCK_API=true
   ```

2. Start only the frontend:
   ```bash
   pnpm run dev
   ```

The app will use localStorage to simulate backend functionality.

## 📱 Usage

1. **Register**: Create a new account
2. **Add Funds**: Top up your wallet
3. **Browse**: Explore available subscriptions
4. **Join Group**: Select a subscription and join a group
5. **Pay**: Complete your payment for the billing cycle
6. **Enjoy**: Access your shared subscription!

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to:
- **Vercel** (Frontend)
- **Render** (Backend)
- **MongoDB Atlas** (Database)

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Wallet
- `POST /api/wallet/topup` - Add funds to wallet
- `POST /api/wallet/withdraw` - Withdraw funds
- `GET /api/wallet/transactions` - Get transaction history

### Subscriptions
- `GET /api/subscriptions` - List all subscriptions
- `GET /api/subscriptions/:id` - Get subscription details

### Groups
- `GET /api/groups` - List all groups
- `GET /api/groups/:id` - Get group details
- `POST /api/groups/:id/join` - Join a group
- `POST /api/groups/:id/pay` - Make payment for group

## 🧪 Testing

```bash
# Run frontend tests
pnpm test

# Run backend tests
cd server
npm test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Deployed on [Vercel](https://vercel.com) and [Render](https://render.com)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ for subscription sharing**
