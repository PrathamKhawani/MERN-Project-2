# MERN Auth Dashboard

A professional, high-end MERN (MongoDB, Express.js, React, Node.js) stack application featuring a secure authentication system and an interactive user dashboard.

## 🌐 Live Demo
[**https://mern-project-2-gules.vercel.app**](https://mern-project-2-gules.vercel.app)

## 🚀 Features

- **Advanced Authentication**: Secure login and registration with JWT (JSON Web Tokens) and Bcrypt hashing.
- **Interactive Dashboard**: Modern, glassmorphic UI with real-time greetings and user stats.
- **Profile Management**: Update personal information like full name and view account details.
- **Security Settings**: Full password management including the ability to change current passwords securely.
- **App Settings**: Customizable user experience with Dark/Light mode toggle and notification preferences.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- **Glassmorphic UI**: Premium aesthetics using smooth gradients and micro-animations.

## 🛠️ Tech Stack

- **Frontend**: React, Vanilla CSS, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: JWT, Bcrypt.js
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PrathamKhawani/MERN-Project-2.git
   cd MERN-Project-2
   ```

2. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory and add the following:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## 🏃 Running the Application

1. **Start the Server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Client**:
   ```bash
   cd client
   npm start
   ```

The application will be available at `http://localhost:3000`.

## 📄 License

This project is licensed under the ISC License.
