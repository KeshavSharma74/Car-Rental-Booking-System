import express from "express"
import cors from "cors"
import "dotenv/config"
import dbConnect from "./config/database.js";
import cookieParser from "cookie-parser";

const app=express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const port=process.env.PORT || 4000;

app.get('/',(req,res)=>{
    return res.send(`Server is live`)
})

app.listen(port,()=>{
    console.log(`Server is litening on port : ${port}`)
})

dbConnect();

