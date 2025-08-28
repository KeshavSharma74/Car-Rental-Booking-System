import jwt from "jsonwebtoken"
import "dotenv/config"
import User from "../models/User.model.js";

const protect = async(req,res,next) =>{

    const token=req.cookies.jwt;

    // console.log("mei protext mei agya");

    try{
        
        // console.log("token : ",token);
        if(!token){
            return res.json({
                success:false,
                message:"Please login first to continue"
            })
        }
        // console.log("token check ke baad")

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);

        if(!decodedToken){
            return res.status(400).json({
                success: false,
                message: "Unauthorized - Invalid token."
            });
        }

        const user = await User.findById(decodedToken.userId).select("-password");

        // console.log("user lelo : ",user);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        req.user=user;
        next();

    }
    catch(error){
        console.log("Error in protectRoute middleware:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

}

export default protect;