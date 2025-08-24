import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Search } from 'lucide-react'

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const cityList = ["Houston", "New York", "Chicago", "Los Angeles"];

  return (
    <div className='h-screen flex flex-col items-center justify-center gap-17 bg-[#F1F5F9] text-center'>
      <h1 className='text-4xl md:text-5xl font-bold'>Luxury cars on Rent</h1>

      <form className=' flex flex-col md:flex-row items-center justify-between gap-6 p-6 px-12 rounded-lg md:rounded-full w-[49rem] max-w-4xl bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>
        <div className='flex gap-10'>
            <div className='flex flex-col items-start gap-3'>
          <select
            required
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className='w-[10rem] rounded-md outline-none'
          >
            <option value="" >Pickup Location</option>
            {cityList.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <p className='px-1 text-sm text-gray-500'>
            {pickupLocation ? pickupLocation : "Please select location"}
          </p>
        </div>

        <div className='flex flex-col items-start gap-2'>
          <label htmlFor="pickup-date">Pick-up Date</label>
          <input
            type="date"
            id="pickup-date"
            value={pickupDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setPickupDate(e.target.value)}
            className=' rounded-md outline-none text-sm text-gray-500'
            required
          />
        </div>

        <div className='flex flex-col items-start gap-2'>
          <label htmlFor="return-date">Return Date</label>
          <input
            type="date"
            id="return-date"
            value={returnDate}
            min={pickupDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => setReturnDate(e.target.value)}
            className=' rounded-md outline-none text-sm text-gray-500'
            required
          />

        </div>
        </div>
        

        <button
          type="submit"
          className='cursor-pointer px-6 gap-2 py-3 border-none bg-[#2a6bf8] text-white pr-8 text-[0.91rem] transition-all rounded-3xl flex items-center'
        >
          <Search className='h-[18px] text-white' /> <p className='text-[1rem]'>Search</p>
        </button>
      </form>

      <img src={assets.main_car} alt="car" className='max-h-74' />
    </div>
  )
}

export default Hero
