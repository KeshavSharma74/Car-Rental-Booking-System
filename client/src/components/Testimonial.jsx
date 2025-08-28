import React from 'react'
import { motion } from 'motion/react';

const Testimonial = () => {

    const testimonials = [
        { id: 1, name: "Emma Rodriguez", address: "Barcelona, Spain", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200", rating: 5, review: "I've rented cars from various companies, but the experience with CarRental was exceptional Highly impressed." },
        { id: 2, name: "Liam Johnson", address: "New York, USA", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200", rating: 4, review: "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!" },
        { id: 3, name: "Sophia Lee", address: "Seoul, South Korea", image: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=200", rating: 5, review: "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service." }
    ];

        const Star = ({ filled }) => (
        <svg className="w-4 h-4 text-yellow-400" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25l-6.16 3.73 1.64-7.03L2.5 9.77l7.19-.61L12 2.5l2.31 6.66 7.19.61-5 4.18 1.64 7.03z" />
        </svg>
    );

      const noop = () => motion;
  noop();

  return (
            <div className=" flex flex-col items-center px-6 md:px-16 lg:px-24 pt-20 pb-30">
            <div className="flex flex-col justify-center items-center text-center">
                <h1 className="text-4xl md:text-[40px] font-bold">Customer Testimonials</h1>
                <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-[696px]">Discover why discerning travelers choose StayVenture for their luxury accommodations around the world.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-20 mb-10">
                {testimonials.map((testimonial,index) => (
                    <motion.div 
                        initial={{y:40,opacity:0}}
                        whileInView={{opacity:1,y:0}}
                        transition={{duration:0.6,delay:index*0.2,ease:"easeOut"}}
                        viewport={{once:true,amount:0.3}}
                    key={testimonial.id} className="bg-white p-6 rounded-xl shadow max-w-xs">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="font-playfair text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <Star key={index} filled={testimonial.rating > index} />
                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4">"{testimonial.review}"</p>
                    </motion.div>
                ))}
            </div>
        </div>
  )
}

export default Testimonial