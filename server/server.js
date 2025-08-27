import express from "express"
import cors from "cors"
import "dotenv/config"
import dbConnect from "./config/database.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import ownerRouter from "./routes/owner.routes.js";
import bookingRouter from "./routes/booking.routes.js";

const app=express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/api/user',userRouter);
app.use('/api/owner',ownerRouter)
app.use('/api/bookings',bookingRouter)

const port=process.env.PORT || 4000;

app.get('/',(req,res)=>{
    return res.send(`Server is live`)
})

app.listen(port,()=>{
    console.log(`Server is litening on port : ${port}`)
})

dbConnect();

