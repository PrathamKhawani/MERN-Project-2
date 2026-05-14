# PackPal - MERN Stack Application

PackPal is a comprehensive MERN (MongoDB, Express.js, React, Node.js) stack application designed for travel management and packing assistance.

## 🚀 Features

- **Authentication**: Secure user login and registration with JWT.
- **Dashboard**: Interactive user dashboard for managing trips.
- **Mission Brief**: Detailed trip overview and planning tools.
- **Checklist**: Pre-populated and customizable packing checklists.
- **Vault**: Secure storage for important documents.
- **Responsive Design**: Optimized for mobile, tablet, and desktop.
- **Dark/Light Mode**: Customizable theme settings.

## 🛠️ Tech Stack

- **Frontend**: React, CSS (Vanilla), Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: JSON Web Tokens (JWT), Bcrypt.js
- **Deployment**: Vercel (Frontend/Backend)

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
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
MONGO_URI=your_mongodb_connection_string
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
