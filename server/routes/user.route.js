import { Router } from "express";
import { getCars, getUserData, login, logout, register } from "../controllers/User.controller.js";
import protect from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.get('/data',protect,getUserData);
userRouter.get('/cars',getCars);
userRouter.post('/logout',logout);

export default userRouter;