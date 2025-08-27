import express from "express"
import cors from "cors"
import "dotenv/config"
import dbConnect from "./config/database.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import ownerRouter from "./routes/owner.routes.js";
import bookingRouter from "./routes/booking.routes.js";

const app = express();

app.use(express.json({ limit: "10mb" })); // for JSON payloads
app.use(express.urlencoded({ limit: "10mb", extended: true })); // for form data


// ✅ Configure CORS to allow credentials (cookies)
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));

app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/bookings', bookingRouter);

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
    return res.send(`Server is live`)
})

app.listen(port, () => {
    console.log(`Server is listening on port : ${port}`)
})

dbConnect();
