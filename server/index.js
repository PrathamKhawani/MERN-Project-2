import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/userRoutes.js';

// Initialize express app
const app = express();
// CORS middleware
app.use(cors({origin: "http://localhost:3000"}));
// Middleware (to parse JSON and urlencoded data) (body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// dotenv config
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/mern_db2';

// MongoDB connection
mongoose.connect(MONGO_URL)
.then(() => {
    console.log('Connected to MongoDB')
    // Start the server after successful DB connection
    app.listen(PORT, () => {
        console.log(`Server is running on Port: ${PORT}`);
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Routes
app.use('/api/users', routes);