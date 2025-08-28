import React from 'react'
import { assets } from '../assets/assets'
import { Search } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

const Hero = () => {

  // take from context instead of local state
  const {
    pickupLocation,
    setPickupLocation,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate
  } = useAppContext()

  const navigate = useNavigate()

  const cityList = ["Kolkata", "New Delhi", "Mumbai", "Bangalore","Chandigarh"]

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(
      `/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`
    )
  }

  const noop = () => motion;
  noop();

  return (
    <motion.div
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{duration:0.8}}
    
    className='h-screen flex flex-col items-center justify-center gap-17 bg-[#F1F5F9] text-center'>
      <motion.h1
        initial={{y:50,opacity:0}}
        animate={{y:0,opacity:1}}
        transition={{duration:0.8,delay:0.2}}
        className='text-4xl md:text-5xl font-bold'>Luxury cars on Rent</motion.h1>

      <motion.form 
        initial={{scale:0.95,opacity:0,y:50}}
        animate={{scale:1,opacity:1,y:0}}
        transition={{duration:0.6,delay:0.4}}
        onSubmit={handleSearch}
        className='flex flex-col md:flex-row items-center justify-between gap-6 p-6 px-12 rounded-lg md:rounded-full w-[49rem] max-w-4xl bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'
      >
        <div className='flex gap-10'>
          <div className='flex flex-col items-start gap-3'>
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className='w-[10rem] rounded-md outline-none'
            >
              <option value="">Pickup Location</option>
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
              className='rounded-md outline-none text-sm text-gray-500'
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
              className='rounded-md outline-none text-sm text-gray-500'
              required
            />
          </div>
        </div>

        <motion.button
          whileHover={{scale:1.05}}
          whileTap={{scale:0.95}}
          type="submit"
          className='cursor-pointer px-6 gap-2 py-3 border-none bg-[#2a6bf8] text-white pr-8 text-[0.91rem] transition-all rounded-3xl flex items-center'
        >
          <Search className='h-[18px] text-white' /> 
          <p className='text-[1rem]'>Search</p>
        </motion.button>
      </motion.form>

      <motion.img
        initial={{y:100,opacity:0}}
        animate={{y:0,opacity:1}}
        transition={{duration:0.8,delay:0.6}}
      src={assets.main_car} alt="car" className='max-h-74' />
    </motion.div>
  )
}

export default Hero
