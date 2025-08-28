import User from "../models/User.model.js";
import Car from "../models/car.model.js";
import cloudinary from "../config/cloudinary.js";
import Booking from '../models/booking.model.js'

const changeRoleToOwner = async(req, res) => {
    const user = req.user;
    try {
        if (user.role === 'owner') {
            return res.json({
                success: true,
                message: "User is already an owner."
            });
        }
        const userFromDatabase = await User.findByIdAndUpdate(user._id, { role: "owner" }, { new: true });
        if (!userFromDatabase) {
            return res.json({
                success: false,
                message: "User not found, role cannot be updated."
            });
        }
        return res.json({
            success: true,
            message: "Role changed successfully to owner."
        });
    } catch (error) {
        console.log("Error while changing the role from user to owner:", error);
        return res.json({
            success: false,
            message: "An internal server error occurred.",
            error: error.message,
        });
    }
}

const addCar = async(req, res) => {
    const {
        brand, model, image, year, category, seating_capacity, fuel_type, transmission, pricePerDay, location, description
    } = req.body;
    const user = req.user;
    try {
        if (user.role !== 'owner') {
            return res.json({ success: false, message: "Forbidden. Only owners are allowed to add cars." });
        }
        if (!brand || !model || !image || !year || !pricePerDay || !location) {
            return res.json({ success: false, message: "Please provide all required fields." });
        }
        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: "car_rental_images",
            resource_type: "auto",
        });
        const newCar = new Car({
            owner: user._id, brand, model, year, category, seating_capacity, fuel_type, transmission, pricePerDay, location, description,
            image: uploadedImage.secure_url,
        });
        await newCar.save();
        return res.json({ success: true, message: "Car added successfully!", car: newCar });
    } catch (error) {
        console.log("Error while adding a new car:", error);
        return res.json({ success: false, message: "An unexpected error occurred. Please try again.", error: error.message });
    }
};

const getOwnerCars = async(req, res) => {
    const ownerId = req.user._id;
    try {
        const cars = await Car.find({ owner: ownerId });
        if (cars.length === 0) {
            return res.json({
                success: true,
                message: "No cars found for this owner.",
                cars: []
            });
        }
        return res.json({
            success: true,
            message: "Owner cars fetched successfully.",
            cars
        });
    } catch (error) {
        console.log("Error while getting owner cars:", error);
        return res.json({
            success: false,
            message: "Error while getting owner cars.",
            error: error.message
        });
    }
}

const toggleCarAvailability = async(req, res) => {
    const ownerId = req.user._id;
    const { carId } = req.body;
    
    try {
        if (!carId) {
            return res.json({ success: false, message: "Car ID must be provided." });
        }
        const car = await Car.findById(carId);
        if (!car) {
            return res.json({ success: false, message: "Car not found with the provided ID." });
        }
        if (car.owner.toString() !== ownerId.toString()) {
            return res.json({ success: false, message: "Forbidden. You are not the owner of this car." });
        }
        car.isAvailable = !car.isAvailable;
        const updatedCar = await car.save();
        return res.json({
            success: true,
            message: updatedCar.isAvailable ? "Car listed as Available." : "Car marked as Unavailable.",
            car: updatedCar
        });
    } catch (error) {
        console.log("Error while toggling car availability:", error);
        return res.json({
            success: false,
            message: "Error while toggling car availability.",
            error: error.message
        });
    }
}

const deleteCar = async (req, res) => {
    const ownerId = req.user._id;
    const { carId } = req.body;

    try {
        if (!carId) {
            return res.json({ success: false, message: "Car ID is required." });
        }

        if (!carId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.json({ success: false, message: "Invalid Car ID format." });
        }

        const car = await Car.findById(carId);
        if (!car) {
            return res.json({ success: false, message: "Car not found." });
        }

        if (car.owner.toString() !== ownerId.toString()) {
            return res.json({ success: false, message: "Unauthorized. You are not the owner of this car." });
        }

        car.owner = null;
        car.isAvailable = false;
        car.description = "[REMOVED] " + (car.description || "");
        await car.save();

        return res.json({
            success: true,
            message: "Car removed successfully.",
            carId: carId
        });

    } catch (error) {
        console.error("Error while removing car:", error);
        return res.json({
            success: false,
            message: "An error occurred while removing the car.",
            error: error.message
        });
    }
};

const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;

        if (role !== 'owner') {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id }).sort({ createdAt: -1 });

        const pendingBookings = bookings.filter(b => b.status === 'pending');
        const completedBookings = bookings.filter(b => b.status === 'confirmed');

        const monthlyRevenue = completedBookings.reduce((acc, booking) => acc + booking.price, 0);
        
        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0, 3), 
            monthlyRevenue
        };

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log("Error fetching dashboard data:", error.message);
        res.json({ success: false, message: "Server error", error: error.message });
    }
};

const updateUserImage = async (req, res) => {
    const { _id } = req.user;
    const { image } = req.body;

    try {
        if (!image) {
            return res.json({ success: false, message: "No image provided." });
        }

        const user = await User.findById(_id);
        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: "user_profile_images",
            resource_type: "auto",
        });

        user.image = uploadedImage.secure_url;
        await user.save();
        user.password = undefined;

        return res.json({
            success: true,
            message: "Profile image updated successfully!",
            user: user
        });

    } catch (error) {
        console.log("Error while updating user image:", error);
        return res.json({
            success: false,
            message: "An unexpected error occurred. Please try again.",
            error: error.message
        });
    }
}

export {
    changeRoleToOwner,
    addCar,
    getOwnerCars,
    toggleCarAvailability,
    deleteCar,
    getDashboardData,
    updateUserImage
};
