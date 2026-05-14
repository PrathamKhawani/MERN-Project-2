import jwt from 'jsonwebtoken';
import Users from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if header exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ errorMessage: "Access denied. No token provided." });
        }

        // Extract token from header
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user to request
        req.user = await Users.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({message: "User not found"});
        }

        next();
    } catch (error) {
        res.status(401).json({ errorMessage: "Invalid token." });
    }
}

export default authMiddleware;