import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Email format validation using validator
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and include a mix of uppercase, lowercase, digits, and special characters." });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Use bcrypt to hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create user without returning password
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        const userResponse = { _id: user._id, name: user.name, email: user.email };
        res.status(201).json({ message: "User registered successfully", user: userResponse });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Login a user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user without returning password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const message = user.role === "admin" ? "Admin login successful" : "User login successful";
        // Generate JWT with more secure options
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { 
                expiresIn: "1h",
                audience: "Learnix", // Audience for your application
                issuer: "localhost:5000", // Issuer as the local server (adjust port as needed)
            }
        );

        // Set HTTP-only cookie with secure options
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
            sameSite: "strict", // Prevent CSRF attacks
        });

        // Don't send password in response
        const userResponse = { _id: user._id, name: user.name, email: user.email, role: user.role };
        res.status(200).json({ user: userResponse, message });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async(req, res) => {
    try {
        res.cookie("token", "",{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(0), // Set expiration date to the past
        })
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}