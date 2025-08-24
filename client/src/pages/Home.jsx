import React from 'react'
import Hero from '../components/Hero'
import CarCard from '../components/CarCard'
import FeaturedSection from '../components/FeaturedSection'
// import { assets } from '../assets/assets'
import Banner from '../components/Banner'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'
// import Footer from '../components/Footer'

const Home = () => {

  // const car=    {
  //         "_id": "67ff5bc069c03d4e45f30b77",
  //         "owner": "67fe3467ed8a8fe17d0ba6e2",
  //         "brand": "BMW",
  //         "model": "X5",
  //         "image": assets.car_image1,
  //         "year": 2006,
  //         "category": "SUV",
  //         "seating_capacity": 4,
  //         "fuel_type": "Hybrid",
  //         "transmission": "Semi-Automatic",
  //         "pricePerDay": 300,
  //         "location": "New York",
  //         "description": "The BMW X5 is a mid-size luxury SUV produced by BMW. The X5 made its debut in 1999 as the first SUV ever produced by BMW.",
  //         "isAvaliable": true,
  //         "createdAt": "2025-04-16T07:26:56.215Z",
  //     }

  return (
    <div >
      <Hero></Hero>
        <FeaturedSection></FeaturedSection>
        <Banner></Banner>
        <Testimonial></Testimonial>
        <Newsletter></Newsletter>
        
    </div>
  )
}

export default Home