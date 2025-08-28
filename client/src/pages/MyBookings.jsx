import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const { currency, axios, user } = useAppContext();

    const fetchMyBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/user');
            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        user && fetchMyBookings();
    }, [user]);

        const noop = () => motion;
        noop();

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm mb-12'>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <Title 
                    title='My Bookings' 
                    subTitle='View and manage all your car bookings' 
                    align='left' 
                />
            </motion.div>

            <div className='mt-5 md:mt-12 flex flex-col gap-6'>
                {bookings.map((booking, index) => (
                    <motion.div
                        key={booking._id}
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border-gray-300 border rounded-lg'
                    >
                        {/* Car Image + Info */}
                        <div className='md:col-span-1'>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                className='rounded-md overflow-hidden mb-3'
                            >
                                <img src={booking.car.image} alt="car" className='w-full h-auto aspect-video object-cover' />
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.35 + index * 0.1 }}
                                className='text-lg font-medium'
                            >
                                {booking.car.brand} {booking.car.model}
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                className='text-gray-500'
                            >
                                {booking.car.year} • {booking.car.category} • {booking.car.location}
                            </motion.p>
                        </div>

                        {/* Booking Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.45 + index * 0.1 }}
                            className='md:col-span-2 space-y-4'
                        >
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
                        </motion.div>

                        {/* Price */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                            className='md:col-span-1 flex flex-col text-sm text-gray-500 md:text-right'
                        >
                            <p>Total Price</p>
                            <div>
                                <h1 className='text-2xl font-semibold text-[#2A6BF8]'>{currency}{booking.price}</h1>
                                <p>Booked on {booking.createdAt.split('T')[0]}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MyBookings;
