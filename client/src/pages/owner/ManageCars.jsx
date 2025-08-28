import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageCars = () => {
    // State to hold the list of cars
    const [cars, setCars] = useState([]);

    const { currency, axios, isOwner } = useAppContext();

    // Fetch owner's car data
    const fetchOwnerCars = async () => {
        try {
            const { data } = await axios.get('/api/owner/cars');
            if (data.success) {
                setCars(data.cars);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Toggle car availability
    const toggleAvailability = async (carId) => {
        try {
            const { data } = await axios.post('/api/owner/toggle-car', { carId });
            if (data.success) {
                toast.success(data.message);
                fetchOwnerCars();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Delete a car
    const deleteCar = async (carId) => {
        try {
            // console.log("carId : ",carId);
            const { data } = await axios.delete('/api/owner/delete-car', { data:{carId} });

            if (data.success) {
                toast.success(data.message);
                fetchOwnerCars();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Fetch car data when the component mounts
    useEffect(() => {
        if (isOwner) fetchOwnerCars();
    }, [isOwner]);

    return (
        <div className='px-2 pt-5 md:px-10 w-full'>
            <Title
                title='Manage Cars'
                subTitle='View all listed cars, update their details, or remove them from the booking platform.'
            />

            <div className='max-w-4xl w-full rounded-md overflow-hidden border border-gray-300 mt-6'>
                <table className='w-full border-collapse text-left text-sm text-gray-600'>
                    <thead className='text-gray-500'>
                        <tr>
                            <th className='p-3 font-medium'>Car</th>
                            <th className='p-3 font-medium max-md:hidden'>Category</th>
                            <th className='p-3 font-medium'>Price</th>
                            <th className='p-3 font-medium max-md:hidden'>Status</th>
                            <th className='p-3 font-medium'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map((car) => (
                            <tr key={car._id} className='border-t border-gray-300'>
                                <td className='p-3 flex items-center gap-3'>
                                    <img src={car.image} alt={car.model} className='h-12 w-12 aspect-square rounded-md object-cover' />
                                    <div className='max-md:hidden'>
                                        <p className='font-medium'>{car.brand} {car.model}</p>
                                        <p className='text-xs text-gray-500'>{car.seating_capacity} seats • {car.transmission}</p>
                                    </div>
                                </td>
                                <td className='p-3 max-md:hidden'>{car.category}</td>
                                <td className='p-3'>{currency}{car.pricePerDay}/day</td>
                                <td className='p-3 max-md:hidden'>
                                    <span className={`px-3 py-1 rounded-full text-xs ${
                                        car.isAvailable
                                            ? 'bg-green-100 text-green-500'
                                            : 'bg-red-100 text-red-500'
                                    }`}>
                                        {car.isAvailable ? "Available" : "Unavailable"}
                                    </span>
                                </td>
                                <td className='p-3'>
                                    <div className='flex items-center gap-3'>
                                        <img
                                            src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon}
                                            alt="toggle visibility"
                                            className='cursor-pointer w-10'
                                            onClick={() => toggleAvailability(car._id)}
                                        />
                                        <img
                                            src={assets.delete_icon}
                                            alt="delete"
                                            className='cursor-pointer w-10'
                                            onClick={() => deleteCar(car._id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageCars;
