import React, { useState } from 'react';
import Title from '../../components/owner/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddCar = () => {
    const [image, setImage] = useState(null);
    const { currency, axios } = useAppContext();

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

    const [loading, setLoading] = useState(false);

    // Convert file to base64
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Submit handler
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!image) {
            toast.error("Please upload a car image");
            return;
        }

        try {
            setLoading(true);

            // convert image → base64
            const base64Image = await getBase64(image);

            // send data + image to backend
            const res = await axios.post(
                `/api/owner/add-car`,
                { ...car, image: base64Image },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success("Car listed successfully");
                setCar({
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
                setImage(null);
            } else {
                toast.error(res.data.message || "Failed to list car");
            }

        } catch (error) {
            console.error("Error while adding car:", error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setCar(prevCar => ({ ...prevCar, [name]: value }));
    };

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
                
                {/* Form Inputs */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <label className={labelStyle}>Brand
                        <input type="text" name="brand" required className={inputStyle} value={car.brand} onChange={onChangeHandler} />
                    </label>
                    <label className={labelStyle}>Model
                        <input type="text" name="model" required className={inputStyle} value={car.model} onChange={onChangeHandler} />
                    </label>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    <label className={labelStyle}>Year
                        <input type="number" name="year" required className={inputStyle} value={car.year} onChange={onChangeHandler} />
                    </label>
                    <label className={labelStyle}>Daily Price ({currency})
                        <input type="number" name="pricePerDay" required className={inputStyle} value={car.pricePerDay} onChange={onChangeHandler} />
                    </label>
                    <label className={labelStyle}>Category
                        <select name="category" required className={inputStyle} value={car.category} onChange={onChangeHandler}>
                            <option value="">Select</option>
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Van">Van</option>
                            <option value="Hatchback">Hatchback</option>
                        </select>
                    </label>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    <label className={labelStyle}>Transmission
                        <select name="transmission" required className={inputStyle} value={car.transmission} onChange={onChangeHandler}>
                            <option value="">Select</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                            <option value="Semi-Automatic">Semi-Automatic</option>
                        </select>
                    </label>
                    <label className={labelStyle}>Fuel Type
                        <select name="fuel_type" required className={inputStyle} value={car.fuel_type} onChange={onChangeHandler}>
                            <option value="">Select</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </label>
                    <label className={labelStyle}>Seating Capacity
                        <input type="number" name="seating_capacity" required className={inputStyle} value={car.seating_capacity} onChange={onChangeHandler} />
                    </label>
                </div>

                <div className='flex flex-col w-full'>
                    <label>Location</label>
                    <select name="location" onChange={onChangeHandler} value={car.location} required className={inputStyle}>
                        <option value="">Select</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="New Delhi">New Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chandigarh">Chandigarh</option>
                    </select>
                </div>

                <div className='flex flex-col w-full'>
                    <label>Description</label>
                    <textarea name="description" rows={5} required className={inputStyle} value={car.description} onChange={onChangeHandler}></textarea>
                </div>
                
                {/* Submit */}
                <button 
                    type="submit" 
                    disabled={loading} 
                    className='flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-md font-medium w-max cursor-pointer -mb-1'
                >
                    
                    {loading ? "Listing..." : "List Your Car"}
                </button>
            </form>
        </div>
    );
};

export default AddCar;
