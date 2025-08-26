import User from "../models/User.model.js";

const changeRoleToOwner = async(req,res)=>{

    const user = req.user;

    try{

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Not authorised"
            })
        }

        const userFromDatabase = await User.findByIdAndUpdate(user._id,
            {role:"owner"},
            {new:true});

        if(!userFromDatabase){
            return res.status(400).json({
                success:false,
                message:"Role cannot be updated"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Role changed Successfully"
        })

    }
    catch(error){

        console.log("Error while changing the role from user to owner");
        console.log(error);
        return res.status(500).json({
            success:true,
            message:error.message,
        })

    }
}

export {changeRoleToOwner}