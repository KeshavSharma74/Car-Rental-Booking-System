import React, { useEffect, useState } from 'react';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageBookings = () => {
    // State to hold the list of all bookings
    const [bookings, setBookings] = useState([]);
    const { axios, currency } = useAppContext();

    // Function to fetch booking data
    const fetchOwnerBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/owner');
            data.success ? setBookings(data.bookings) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchOwnerBookings();
    }, []);

    // Handler to update the status of a booking
    const changeBookingStatus = async (bookingId, status) => {
        try {
            const { data } = await axios.post('/api/bookings/change-status', { 
                bookingId, status 
            });
            if (data.success) {
                toast.success(data.message);
                fetchOwnerBookings();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className='px-2 pt-5 md:px-10 w-full'>
            <Title 
                title='Manage Bookings' 
                subTitle='Track all customer bookings, approve or cancel requests, and manage booking statuses.' 
            />

            <div className='max-w-4xl w-full rounded-md overflow-hidden border border-gray-300 mt-6'>
                <table className='w-full border-collapse text-left text-sm text-gray-600'>
                    <thead className='text-gray-500'>
                        <tr>
                            <th className='p-3 font-medium'>Car</th>
                            <th className='p-3 font-medium max-md:hidden'>Date Range</th>
                            <th className='p-3 font-medium'>Total</th>
                            <th className='p-3 font-medium max-md:hidden'>Payment</th>
                            <th className='p-3 font-medium'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking._id} className='border-t border-gray-300'>
                                <td className='p-3 flex items-center gap-3'>
                                    <img 
                                        src={booking.car.image} 
                                        alt={booking.car.model} 
                                        className='h-12 w-12 aspect-square rounded-md object-cover' 
                                    />
                                    <div className='max-md:hidden'>
                                        <p className='font-medium'>
                                            {booking.car.brand} {booking.car.model}
                                        </p>
                                    </div>
                                </td>
                                <td className='p-3 max-md:hidden'>
                                    {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
                                </td>
                                <td className='p-3'>
                                    {currency}{booking.price.toLocaleString()}
                                </td>
                                <td className='p-3 max-md:hidden'>
                                    <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>
                                        Offline
                                    </span>
                                </td>
                                <td className='p-3'>
                                    {booking.status === 'pending' ? (
                                        <select 
                                            value={booking.status} 
                                            onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                                            className='px-2 py-1.5 text-gray-500 border border-gray-300 rounded-md outline-none bg-light'
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    ) : (
                                        <span 
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                booking.status === 'confirmed' 
                                                ? 'bg-green-100 text-green-500' 
                                                : 'bg-red-100 text-red-500'
                                            }`}
                                        >
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageBookings;
