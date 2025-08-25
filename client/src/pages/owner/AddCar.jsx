import React, { useState } from 'react';
import Title from '../../components/owner/Title';
import { assets } from '../../assets/assets';

const AddCar = () => {
    // State for the car image file
    const [image, setImage] = useState(null);
    // State for the currency symbol
    const currency=import.meta.env.VITE_CURRENCY
    // State object for all car details
    const [car, setCar] = useState({
        brand: '',
        model: '',
        year: '',
        pricePerDay: '',
        category: '',
        transmission: '',
        fuel_type: '',
        seating_capacity: '',
        location: '',
        description: '',
    });

    // Handler for form submission
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        // In a real application, you would use FormData to send both
        // the image file and the car data to your server.
        console.log("Submitting Car Data:", car);
        console.log("Submitting Image:", image.name);
        // Here you would typically make an API call.
    };

    // Generic handler to update the car state object
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setCar(prevCar => ({ ...prevCar, [name]: value }));
    };

    // Reusable styles for inputs and labels
    const inputStyle = "px-3 py-2 mt-1 border border-borderColor rounded-md outline-none w-full";
    const labelStyle = "flex flex-col w-full";

    return (
        <div className='px-2 pt-5 md:px-10 flex-1'>
            <Title 
                title='Add New Car' 
                subTitle='Fill in details to list a new car for booking, including pricing, availability, and car specifications.' 
            />

            <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-4xl'>
                
                {/* Car Image Upload */}
                <div>
                    <label htmlFor="car-image" className='flex items-center gap-4 w-full cursor-pointer'>
                        <img 
                            src={image ? URL.createObjectURL(image) : assets.upload_icon} 
                            alt="upload" 
                            className='h-24 w-32 object-cover rounded' 
                        />
                        <input 
                            type="file" 
                            id="car-image" 
                            accept='image/*' 
                            hidden 
                            required
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        <p className='text-sm text-gray-500'>Upload a picture of your car</p>
                    </label>
                </div>
                
                {/* Car Brand & Model */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <label className={labelStyle}>Brand
                        <input type="text" name="brand" placeholder='e.g. BMW, Mercedes, Audi...' required className={inputStyle} value={car.brand} onChange={onChangeHandler} />
                    </label>
                    <label className={labelStyle}>Model
                        <input type="text" name="model" placeholder='e.g. X5, E-Class, M4...' required className={inputStyle} value={car.model} onChange={onChangeHandler} />
                    </label>
                </div>

                {/* Year, Price, Category */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    <label className={labelStyle}>Year
                        <input type="number" name="year" placeholder='2025' required className={inputStyle} value={car.year} onChange={onChangeHandler} />
                    </label>
                    <label className={labelStyle}>Daily Price ({currency})
                        <input type="number" name="pricePerDay" placeholder='100' required className={inputStyle} value={car.pricePerDay} onChange={onChangeHandler} />
                    </label>
                    <label className={labelStyle}>Category
                        <select name="category" required className={inputStyle} value={car.category} onChange={onChangeHandler}>
                            <option value="">Select a category</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Van">Van</option>
                            <option value="Hatchback">Hatchback</option>
                        </select>
                    </label>
                </div>

                {/* Transmission, Fuel Type, Seating Capacity */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    <label className={labelStyle}>Transmission
                        <select name="transmission" required className={inputStyle} value={car.transmission} onChange={onChangeHandler}>
                            <option value="">Select a transmission</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                            <option value="Semi-Automatic">Semi-Automatic</option>
                        </select>
                    </label>
                    <label className={labelStyle}>Fuel Type
                        <select name="fuel_type" required className={inputStyle} value={car.fuel_type} onChange={onChangeHandler}>
                            <option value="">Select a fuel type</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </label>
                    <label className={labelStyle}>Seating Capacity
                        <input type="number" name="seating_capacity" placeholder='4' required className={inputStyle} value={car.seating_capacity} onChange={onChangeHandler} />
                    </label>
                </div>
                
                {/* Car Location */}
                <div className='flex flex-col w-full'>
                    <label>Location</label>
                    <select name="location" onChange={onChangeHandler} value={car.location} required className={inputStyle}>
                        <option value="">Select a location</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="New Delhi">New Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                    </select>
                </div>

                {/* Car Description */}
                <div className='flex flex-col w-full'>
                    <label>Description</label>
                    <textarea name="description" rows={5} placeholder='e.g. A luxurious SUV with a spacious interior and a powerful engine.' required className={inputStyle} value={car.description} onChange={onChangeHandler}></textarea>
                </div>
                
                {/* Submit Button */}
                <button type="submit" className='flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-md font-medium w-max cursor-pointer -mb-1'>
                    <img src={assets.tick_icon} alt="list car" />
                    List Your Car
                </button>
            </form>
        </div>
    );
};

export default AddCar;