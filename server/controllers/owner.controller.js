import User from "../models/User.model.js";
import Car from "../models/car.model.js";
import cloudinary from "../config/cloudinary.js";
import Booking from '../models/Booking.model.js'

const changeRoleToOwner = async(req, res) => {
    const user = req.user;
    try {
        if (user.role === 'owner') {
            return res.status(200).json({
                success: true,
                message: "User is already an owner."
            });
        }
        const userFromDatabase = await User.findByIdAndUpdate(user._id, { role: "owner" }, { new: true });
        if (!userFromDatabase) {
            return res.status(404).json({
                success: false,
                message: "User not found, role cannot be updated."
            });
        }
        return res.status(200).json({
            success: true,
            message: "Role changed successfully to owner."
        });
    } catch (error) {
        console.log("Error while changing the role from user to owner:", error);
        return res.status(500).json({
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
            return res.status(403).json({ success: false, message: "Forbidden. Only owners are allowed to add cars." });
        }
        if (!brand || !model || !image || !year || !pricePerDay || !location) {
            return res.status(400).json({ success: false, message: "Please provide all required fields." });
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
        return res.status(201).json({ success: true, message: "Car added successfully!", car: newCar });
    } catch (error) {
        console.log("Error while adding a new car:", error);
        return res.status(500).json({ success: false, message: "An unexpected error occurred. Please try again.", error: error.message });
    }
};

const getOwnerCars = async(req, res) => {
    const ownerId = req.user._id;
    try {
        const cars = await Car.find({ owner: ownerId });
        if (cars.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No cars found for this owner.",
                cars: []
            });
        }
        return res.status(200).json({
            success: true,
            message: "Owner cars fetched successfully.",
            cars
        });
    } catch (error) {
        console.log("Error while getting owner cars:", error);
        return res.status(500).json({
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
            return res.status(400).json({ success: false, message: "Car ID must be provided." });
        }
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ success: false, message: "Car not found with the provided ID." });
        }
        if (car.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({ success: false, message: "Forbidden. You are not the owner of this car." });
        }
        car.isAvailable = !car.isAvailable;
        const updatedCar = await car.save();
        return res.status(200).json({
            success: true,
            message: `Car availability successfully set to ${updatedCar.isAvailable}.`,
            car: updatedCar
        });
    } catch (error) {
        console.log("Error while toggling car availability:", error);
        return res.status(500).json({
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
        // 1. Check if carId is provided
        if (!carId) {
            return res.status(400).json({
                success: false,
                message: "Car ID is required."
            });
        }

        // 2. Validate carId format (must be a valid MongoDB ObjectId)
        if (!carId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Car ID format."
            });
        }

        // 3. Find car
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: "Car not found."
            });
        }

        // 4. Verify ownership
        if (car.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized. You are not the owner of this car."
            });
        }

        // 5. Soft delete (mark unavailable & remove owner)
        car.owner = null;
        car.isAvailable = false;
        car.description = "[REMOVED] " + (car.description || ""); // mark description
        await car.save();

        // ✅ Alternatively: Hard delete (completely remove document)
        // await Car.findByIdAndDelete(carId);

        return res.status(200).json({
            success: true,
            message: "Car removed successfully.",
            carId: carId
        });

    } catch (error) {
        console.error("Error while removing car:", error);
        return res.status(500).json({
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
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        // --- Data Fetching ---
        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id }).sort({ createdAt: -1 });

        // --- Calculations ---
        const pendingBookings = bookings.filter(b => b.status === 'pending');
        const completedBookings = bookings.filter(b => b.status === 'confirmed');

        // Calculate total revenue from completed bookings
        const monthlyRevenue = completedBookings.reduce((acc, booking) => acc + booking.price, 0);
        
        // --- Response Object ---
        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0, 3), 
            monthlyRevenue
        };

        res.status(200).json({ success: true, dashboardData });

    } catch (error) {
        console.log("Error fetching dashboard data:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const updateUserImage = async (req, res) => {
    // 1. Get user ID from middleware and image from request body
    const { _id } = req.user;
    const { image } = req.body;

    try {
        // 2. Validate that an image was provided
        if (!image) {
            return res.status(400).json({ success: false, message: "No image provided." });
        }

        // 3. Find the user in the database
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // 4. Upload the new image to Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: "user_profile_images", // A dedicated folder for profile pictures
            resource_type: "auto",
        });

        // 5. Update the user's image URL and save the document
        user.image = uploadedImage.secure_url;
        await user.save();
        
        // Exclude password from the response
        user.password = undefined;

        // 6. Send a success response
        return res.status(200).json({
            success: true,
            message: "Profile image updated successfully!",
            user: user
        });

    } catch (error) {
        console.log("Error while updating user image:", error);
        return res.status(500).json({
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