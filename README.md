# MERN Auth Dashboard

A professional, high-end MERN stack application featuring a secure authentication system, interactive dashboard, and a "Zero-Config" smart database fallback system.

## 🌐 Live Demo
[**https://mern-project-2-gules.vercel.app**](https://mern-project-2-gules.vercel.app)

## 🚀 Smart Features

- **"Zero-Config" Database Fallback**: If MongoDB is down locally, the app automatically switches to a local JSON database so development never stops.
- **Auto-Repair System**: The server detects if the local MongoDB service is stopped and attempts to start it automatically (with user permission).
- **Advanced Authentication**: Secure login and registration with JWT and Bcrypt hashing.
- **Glassmorphic UI**: Premium aesthetics using smooth gradients and micro-animations.

## 🛠️ Tech Stack

- **Frontend**: React, Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Cloud) / Local JSON Fallback
- **Deployment**: Vercel

## 📦 Installation

1. **Clone & Install**:
   ```bash
   git clone https://github.com/PrathamKhawani/MERN-Project-2.git
   cd MERN-Project-2/server && npm install
   cd ../client && npm install
   ```

2. **Environment Setup**:
   Create `server/.env`:
   ```env
   MONGO_URL=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

## 🔧 Troubleshooting (Local)

If you see a "Connection Refused" error locally:
1. Find **`FixMongoDB.bat`** in the root folder.
2. **Right-click** and select **"Run as Administrator"**.
3. This will instantly start your local MongoDB service.

## 🏃 Running the Application

1. **Start Server**: `cd server && npm run dev`
2. **Start Client**: `cd client && npm start`

The application will be available at `http://localhost:3000`.
