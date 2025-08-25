import React, { useEffect, useState } from 'react';
// Assuming your assets and a Title component are structured this way
import { assets,dummyMyBookingsData } from '../assets/assets';
import Title from '../components/Title';

const MyBookings = () => {
    // State to hold the list of bookings
    const [bookings, setBookings] = useState([]);
    // State for currency symbol
    const currency=import.meta.env.VITE_CURRENCY;

    // Function to fetch booking data (simulated with dummy data)
    const fetchMyBookings = async () => {
        setBookings(dummyMyBookingsData);
    };

    // Fetch bookings when the component mounts
    useEffect(() => {
        fetchMyBookings();
    }, []);

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm mb-12'>
            <Title 
                title='My Bookings' 
                subTitle='View and manage all your car bookings' 
                align='left' 
            />

            <div className='mt-5 md:mt-12 flex flex-col gap-6'>
                {bookings.map((booking, index) => (
                    <div key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border-gray-300 border rounded-lg'>
                        
                        {/* Car Image + Info */}
                        <div className='md:col-span-1'>
                            <div className='rounded-md overflow-hidden mb-3'>
                                <img src={booking.car.image} alt="car" className='w-full h-auto aspect-video object-cover' />
                            </div>
                            <p className='text-lg font-medium'>{booking.car.brand} {booking.car.model}</p>
                            <p className='text-gray-500'>{booking.car.year} • {booking.car.category} • {booking.car.location}</p>
                        </div>

                        {/* Booking Info */}
                        <div className='md:col-span-2 space-y-4'>
                            <div className='flex items-center gap-2'>
                                <p className='px-3 py-1.5 bg-light rounded'>Booking #{index + 1}</p>
                                <p className={`px-3 py-1 text-xs rounded-full ${
                                    booking.status === 'confirmed' 
                                    ? 'bg-green-400/15 text-green-600' 
                                    : 'bg-red-400/15 text-red-600'
                                }`}>{booking.status}</p>
                            </div>
                            <div className='flex items-start gap-2 mt-3'>
                                <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1' />
                                <div>
                                    <p className='text-gray-500'>Rental Period</p>
                                    <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-2 mt-3'>
                                <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1' />
                                <div>
                                    <p className='text-gray-500'>Pick-up Location</p>
                                    <p>{booking.car.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className='md:col-span-1 flex flex-col text-sm text-gray-500 md:text-right'>
                            <p>Total Price</p>
                            <div>
                                <h1 className='text-2xl font-semibold text-[#2A6BF8]'>{currency}{booking.price}</h1>
                                <p>Booked on {booking.createdAt.split('T')[0]}</p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookings;