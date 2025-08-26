import { addCar, changeRoleToOwner, deleteCar, getOwnerCars, toggleCarAvailability } from "../controllers/owner.controller.js";
import express from "express";
import protect from "../middlewares/auth.middleware.js";
const ownerRouter = express.Router();

ownerRouter.post('/change-role',protect,changeRoleToOwner);
ownerRouter.post('/add-car',protect,addCar);
ownerRouter.get('/cars',protect,getOwnerCars);
ownerRouter.post('/toggle-car',protect,toggleCarAvailability);
ownerRouter.delete('/delete-car',protect,deleteCar);

export default ownerRouter;