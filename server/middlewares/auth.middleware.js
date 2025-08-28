import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.model.js";

const protect = async (req, res, next) => {
    const token = req.cookies.jwt;
    
    try {
        if (!token) {
            return res.json({
                success: false,
                message: "Please login first to continue"
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            return res.json({
                success: false,
                message: "Unauthorized - Invalid token."
            });
        }

        const user = await User.findById(decodedToken.userId).select("-password");

        if (!user) {
            return res.json({
                success: false,
                message: "User not found."
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

export default protect;
