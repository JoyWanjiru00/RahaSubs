# Project Summary
**RahaSubs** is a modern web application designed for users to share subscription costs by forming groups. It allows individuals to split the expenses of services like Netflix and Spotify, facilitating cost savings while enhancing user experience through a responsive interface and robust backend integration.

# Project Module Description
- **Frontend**: Built with React and TypeScript, this module includes various UI components and pages for user interactions, utilizing Vite for fast development.
- **Backend**: A Node.js server that manages authentication, user accounts, subscription services, and payment processing.
- **Database**: Uses MongoDB for persistent storage, with optional mock backend capabilities for testing.

# Directory Tree
```
rahasubs/
├── README.md                  # Project overview and setup instructions
├── DEPLOYMENT.md             # Deployment guide for production
├── .gitignore                 # Files and directories to ignore in version control
├── vercel.json                # Frontend deployment configuration for Vercel
├── server/                    # Backend server files
│   ├── config/                # Configuration files for database and environment
│   ├── middleware/            # Middleware functions for Express
│   ├── models/                # MongoDB models
│   ├── routes/                # API routes
│   ├── seedData.js            # Script to seed database
│   ├── server.js              # Main server file
│   └── .env.example           # Template for environment variables
├── src/                       # Frontend source files
│   ├── components/            # Reusable components
│   ├── pages/                 # Application pages
│   ├── store/                 # Zustand state management
│   ├── utils/                 # Utility functions and API services
│   └── main.tsx               # Entry point for React app
└── public/                    # Static assets
```

# File Description Inventory
- **README.md**: Contains project setup, usage instructions, and feature overview.
- **DEPLOYMENT.md**: Detailed steps for deploying the application to production.
- **vercel.json**: Configuration for deploying the frontend on Vercel.
- **server/**: Contains backend-related files including models, routes, and server configuration.
- **src/**: Contains frontend components, pages, hooks, and styles.
- **server/.env.example**: Template for environment variables required for the backend.

# Technology Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Zustand, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

# Usage
1. **Install dependencies**:
   ```bash
   pnpm install
   cd server
   npm install
   cd ..
   ```
2. **Configure environment variables**:
   - Create `.env` in the root directory:
     ```env
     VITE_API_URL=http://localhost:5000/api
     VITE_USE_MOCK_API=false
     ```
   - Create `server/.env`:
     ```env
     MONGODB_URI=mongodb://localhost:27017/rahasubs
     JWT_SECRET=your-secret-key-here
     NODE_ENV=development
     PORT=5000
     ```
3. **Seed the database (optional)**:
   ```bash
   cd server
   npm run seed
   cd ..
   ```
4. **Start the backend**:
   ```bash
   cd server
   npm run dev
   ```
5. **Start the frontend** (in a new terminal):
   ```bash
   pnpm run dev
   ```
