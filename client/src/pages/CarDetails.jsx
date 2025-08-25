import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets, dummyCarData } from '../assets/assets';
import Loader from '../components/Loader';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const currency=import.meta.env.VITE_CURRENCY

    useEffect(() => {
        const selectedCar = dummyCarData.find(car => car._id === id);
        setCar(selectedCar);
        window.scrollTo(0, 0);
    }, [id]);

    if (!car) {
        return <Loader />;
    }

    const carSpecs = [
        { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
        { icon: assets.fuel_icon, text: car.fuel_type },
        { icon: assets.transmission_icon, text: car.transmission },
        { icon: assets.location_icon, text: car.location },
    ];

    const handleSubmit = async(e)=>{
      e.preventDefault();
    }
    
    const carFeatures = ["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"];
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 mb-12'>
            <button onClick={() => navigate(-1)} className='flex items-center gap-2 text-[0.9rem] mb-6 text-gray-500 cursor-pointer'>
                <img src={assets.arrow_icon} alt="back arrow" className='rotate-180 opacity-65 w-3' />
                Back to all cars
            </button>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
                <div className='lg:col-span-2'>
                    <img src={car.image} alt={`${car.brand} ${car.model}`} className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md' />
                    
                    <div className='space-y-6'>
                        <div>
                            <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
                            <p className='text-gray-500 text-lg'>{car.category} • {car.year}</p>
                        </div>

                        <hr className=' border-gray-300' />

                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                            {carSpecs.map((spec, index) => (
                                <div key={index} className='flex flex-col items-center bg-[#F1F5F9] p-4 rounded-lg'>
                                    <img src={spec.icon} alt="" className='h-5 mb-2' />
                                    <p>{spec.text}</p>
                                </div>
                            ))}
                        </div>

                        <hr className='border-gray-300' />

                        <div>
                            <h1 className='text-xl font-medium mb-3'>Description</h1>
                            <p className='text-gray-500 text-[0.9rem]'>{car.description}</p>
                        </div>

                        <div>
                            <h1 className='text-xl font-medium mb-3'>Features</h1>
                            <ul className=' text-[0.9rem] grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                {carFeatures.map((item, index) => (
                                    <li key={index} className='flex items-center text-gray-500'>
                                        <img src={assets.check_icon} className='h-4 mr-2' alt="check icon" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div>
                    <form onSubmit={handleSubmit} className= ' text-[0.9rem]  shadow-lg h-max sticky top-24 rounded-xl p-6 space-y-6 text-gray-500'>
                        <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
                            {currency}{car.pricePerDay}
                            <span className='text-base text-[0.9rem] text-gray-400 font-normal'>/ per day</span>
                        </p>

                        <hr className='border-gray-300' />

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="pickup-date">Pickup Date</label>
                            <input type="date" className='border border-gray-300 px-3 py-2 rounded-lg' required id='pickup-date' min={today} />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="return-date">Return Date</label>
                            <input type="date" className='border border-gray-300 px-3 py-2 rounded-lg' required id='return-date' min={today}/>
                        </div>

                        <button type='submit' className='w-full bg-[#2A6BF8] transition-all py-3 font-medium text-white rounded-xl cursor-pointer'>
                            Book Now
                        </button>

                        <p className='text-center text-sm'>No credit card required to reserve</p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;