import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom';
import { Routes,Route } from 'react-router-dom';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Cars from './pages/Cars';
import MyBookings from './pages/MyBookings';
import Footer from './components/Footer';

const App = () => {

  const [showLogin,setShowLogin]=useState(false);
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <div>
      
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} ></Navbar>} 
      {showLogin? "show login":""}

      <Routes>
        <Route path='/' element={<Home></Home>} ></Route>
        <Route path='/car-details/:id' element={<CarDetails></CarDetails>} ></Route>
        <Route path='/cars' element={<Cars></Cars>} ></Route>
        <Route path='/my-bookings' element={<MyBookings></MyBookings>} ></Route>
        
      </Routes>

      {!isOwnerPath && <Footer></Footer>}

    </div>
  )
}

export default App