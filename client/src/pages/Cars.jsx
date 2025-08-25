import React, { useState } from 'react';
import Title from '../components/Title';
import CarCard from '../components/CarCard'; // Assuming you have a CarCard component
import { assets, dummyCarData } from '../assets/assets'; // Assuming car data is in assets

const Cars = () => {
    // State to manage the search input field
    const [input, setInput] = useState('');

    // Filter the car data based on the user's input
    const filteredCars = dummyCarData.filter(car =>
        car.brand.toLowerCase().includes(input.toLowerCase()) ||
        car.model.toLowerCase().includes(input.toLowerCase()) ||
        car.category.toLowerCase().includes(input.toLowerCase())
    );

    return (
        <div className='mb-12'>
            {/* Top Section with Title and Search Bar */}
            
            <div className=' flex flex-col bg-[#F1F5F9] items-center py-20 bg-light max-md:px-4'>
                <Title 
                    title='Available Cars' 
                    subTitle='Browse our selection of premium vehicles available for your next adventure' 
                />
                <div className='flex items-center bg-white px-4 mt-6 max-w-lg w-full h-12 rounded-full shadow'>
                    <img src={assets.search_icon} alt="search" className='w-4.5 h-4.5 mr-2' />
                    <input 
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        type="text" 
                        placeholder='Search by make, model, or features' 
                        className='w-full h-full outline-none text-gray-500' 
                    />
                    <img src={assets.filter_icon} alt="filter" className='w-4.5 h-4.5 ml-2 cursor-pointer' />
                </div>
            </div>

            {/* Car Listing Section */}
            <div className='px-6 md:px-16  m-auto max-w-[1360px] lg:px-24 xl:px-32 mt-12'>
                <p className='text-[1rem]  text-gray-600 mb-4'>Showing {filteredCars.length} {filteredCars.length===1 ? "Car" : "Cars"}</p>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {filteredCars.map((car) => (
                        <CarCard key={car._id} car={car} />
                    ))}
                </div>
                {/* Display a message if no cars are found */}
                {filteredCars.length === 0 && (
                    <p className='text-center text-gray-500 text-lg mt-8'>No cars found matching your search.</p>
                )}
            </div>
        </div>
    );
};

export default Cars;