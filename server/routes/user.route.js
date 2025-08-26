import { Router } from "express";
import { getUserData, login, register } from "../controllers/User.controller.js";
import protect from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.get('/data',protect,getUserData);

export default userRouter;