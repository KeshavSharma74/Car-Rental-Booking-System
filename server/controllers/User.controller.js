import User from "../models/User.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import Car from "../models/car.model.js";

const generateToken = (userId,res) =>{
    
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    });

    if(!token){
        return res.status(400).json({
            success:false,
            message:"Token cannot be generated"
        })
    }

    res.cookie("jwt",token,{
        httpOnly:true,
        sameSite:"none",
        secure:true,
        maxAge:7*24*60*60*1000,
    })

}

const register = async(req,res)=>{

    const {name,email,password} = req.body;

    try{
        
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        if(password.length<8){
            return res.status(400).json({
                success:false,
                message:"Password should be atleast 8 characters"
            })
        }

        const isPresent = await User.findOne({email});

        if(isPresent){
           return res.status(400).json({
                success:false,
                message:"Email is already registered"
           }) 
        }

        const hashedPassword =await  bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashedPassword
        });

        generateToken(user._id,res);

        return res.status(200).json({
            success:true,
            message:"User registered successfully"
        }) 

    }
    catch(error){
        console.log("Error while registering the User");
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const getCars = async (req, res) => {
    try {
        const cars = await Car.find({ isAvailable: true });
        res.status(200).json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const login = async(req,res)=>{

    const {email,password} = req.body;

    try{

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Email is not registered"
            })
        }

        const isCorrectPassword = await bcrypt.compare(password,user.password);

        if(!isCorrectPassword){
            return res.status(400).json({
                success:false,
                message:"Email or Password is incorrect"
            })
        }

        generateToken(user._id,res);

        return res.status(200).json({
            success:true,
            message:"User LoggedIn successfully",
            user
        })

    }
    catch(error){
        console.log("Error while Logging In the user");
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const getUserData = async(req,res)=>{
    try {
        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            user: req.user
        });

    } catch (error) {
        console.log("Error in getUserData controller:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const logout = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,         // set true if using HTTPS
      sameSite: "none",     // must match your login cookie
      path: "/",            // ensure cookie path matches login
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully.",
    });

  } catch (error) {
    console.log("Error in logout controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export {register,login,getUserData,logout}