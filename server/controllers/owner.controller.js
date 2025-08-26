import User from "../models/User.model.js";
import Car from "../models/car.model.js";
import cloudinary from "../config/cloudinary.js";

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


export {
    changeRoleToOwner,
    addCar,
    getOwnerCars,
    toggleCarAvailability,
    deleteCar,
};