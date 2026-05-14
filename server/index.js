import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/userRoutes.js';
import { exec } from 'child_process';

// Initialize express app
const app = express();
// CORS middleware
app.use(cors());
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
    console.log('✅ Connected to MongoDB');
    // Only listen if running locally
    if (process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on Port: ${PORT}`);
        });
    }
})
.catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
        console.log('🔄 MongoDB is not running. Attempting to start it for you...');
        exec('powershell -Command "Start-Process cmd -ArgumentList \'/c net start MongoDB\' -Verb RunAs"', (err) => {
            if (err) {
                console.error('❌ Automatic start failed (Access Denied).');
                console.error('👉 Tip: Please right-click the "FixMongoDB.bat" file in your project folder and select "Run as Administrator".');
            } else {
                console.log('🚀 Elevation prompt sent! Please click YES on your screen to start MongoDB.');
            }
        });
    }
});

// Routes
app.use('/api/users', routes);

// Export the app for Vercel
export default app;
