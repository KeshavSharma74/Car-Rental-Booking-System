import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Car from "../models/car.model.js";
import transporter from "../config/nodemailer.js";
import { REGISTRATION_EMAIL } from "../config/emailTemplate.js";

const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    if (!token) {
        return res.json({
            success: false,
            message: "Token cannot be generated"
        });
    }

    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password should be at least 8 characters"
            });
        }

        const isPresent = await User.findOne({ email });

        if (isPresent) {
            return res.json({
                success: false,
                message: "Email is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        generateToken(user._id, res);

        await transporter.sendMail({
            from:process.env.SENDER_MAIL,
            to: email,
            subject: "Welcome to CarRental",
            html:REGISTRATION_EMAIL
        })

        return res.json({
            success: true,
            message: "User registered successfully",
            user
        });

    } catch (error) {
        console.log("Error while registering the User", error);
        return res.json({
            success: false,
            message: error.message,
            
        });
    }
};

export const getCars = async (req, res) => {
    try {
        const cars = await Car.find({ isAvailable: true });
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "Email is not registered"
            });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (!isCorrectPassword) {
            return res.json({
                success: false,
                message: "Email or Password is incorrect"
            });
        }

        generateToken(user._id, res);

        return res.json({
            success: true,
            message: "User logged in successfully",
            user
        });

    } catch (error) {
        console.log("Error while logging in the user", error);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

const getUserData = async (req, res) => {
    try {
        return res.json({
            success: true,
            message: "User data fetched successfully",
            user: req.user
        });
    } catch (error) {
        console.log("Error in getUserData controller:", error);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });

        return res.json({
            success: true,
            message: "User logged out successfully"
        });

    } catch (error) {
        console.log("Error in logout controller:", error);
        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
};

export { register, login, getUserData, logout };
