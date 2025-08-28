import React from 'react';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import CarCard from './CarCard';
import { assets } from '../assets/assets';
import { useAppContext   } from '../context/AppContext';
import { motion } from 'motion/react';

const FeaturedSection = () => {
  const navigate = useNavigate();

  const {cars}=useAppContext();

  const handleExploreClick = () => {
    navigate('/cars');
    window.scrollTo(0, 0);
  };

  const noop = () => motion;
  noop();
  // console.log(cars);

  return (
    <motion.div 
        initial={{y:40,opacity:0}}
        whileInView={{opacity:1,y:0}}
        transition={{duration:1,ease:"easeOut"}}
    className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'>
      <motion.div
        initial={{y:20,opacity:0}}
        whileInView={{opacity:1,y:0}}
        transition={{duration:1,delay:0.5}}
      >
        <Title 
          title='Featured Vehicles' 
          subTitle='Explore our selection of premium vehicles available for your next adventure.'
        />
      </motion.div>

      <motion.div
        initial={{y:100,opacity:0}}
        whileInView={{opacity:1,y:0}}
        transition={{duration:1,delay:0.5}}
      className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18'>
        {cars.slice(0, 6).map((car) => (
          <motion.div 
          initial={{scale:0.95,opacity:0}}
          whileInView={{opacity:1,scale:1}}
          transition={{duration:0.4,ease:"easeOut"}}
          key={car._id}>
            <CarCard car={car} />
          </motion.div>
        ))}
      </motion.div>

      <motion.button
          initial={{y:20,opacity:0}}
          whileInView={{opacity:1,y:0}}
          transition={{duration:0.4,delay:0.6}}
        onClick={handleExploreClick}
        className='flex items-center justify-center gap-2 px-6 py-2 text-gray-800  border border-gray-300 hover:bg-gray-50 rounded-md mt-18 cursor-pointer'
      >
        Explore all cars <img src={assets.arrow_icon} alt="arrow" />
      </motion.button>
    </motion.div>
  );
};

export default FeaturedSection;