import Users from "../models/userModel.js";
import { MockUsers } from "../models/dbFallback.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

// Helper to use local JSON DB if MongoDB is down
const getDB = () => mongoose.connection.readyState === 1 ? Users : MockUsers;


// Register User
export const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({ errorMessage: "Please fill all the fields" });
        }

        const existingUser = await getDB().findOne({ email });
        if(existingUser){
            return res.status(400).json({ errorMessage: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await getDB().create({ name, email, password: hashedPassword });
        res.status(200).json({ message: "User registered successfully", userId: user._id });
    }
    catch(error){
        res.status(500).json({ errorMessage: error.message })
    }
}

// Login User
export const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await getDB().findOne({ email }).select("+password");
        if(!user){
            return res.status(400).json({ errorMessage: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ errorMessage: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({ message: "Login successful", token });
    }
    catch(error){
        res.status(500).json({ errorMessage: error.message })
    }
}

// Get Profile
export const getMe = async (req, res) => {
    try{
        res.status(200).json({ user: req.user });
    }
    catch(error){
        res.status(500).json({ errorMessage: error.message })
    }
}

// Update Profile
export const updateProfile = async (req, res) => {
    try{
        // Prevent password update through this route
        const { password, ...updateData } = req.body;

        const updatedUser = await getDB().findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true }
        ).select("-password");
        res.status(200).json({ user: updatedUser });
    }
    catch(error){
        res.status(500).json({ errorMessage: error.message })
    }
}

// Change Password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await getDB().findById(req.user._id).select("+password");
        if (!user) {
            return res.status(404).json({ errorMessage: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ errorMessage: "Incorrect current password" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ errorMessage: "New password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    }
    catch(error){
        res.status(500).json({ errorMessage: error.message })
    }
}

// Logout User
export const logoutUser = async (req, res) => {
    try{
        res.status(200).json({ message: "Logout successful" });
    }
    catch(error){
        res.status(500).json({ errorMessage: error.message })
    }
}