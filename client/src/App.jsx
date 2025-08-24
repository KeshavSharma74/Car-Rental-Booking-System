import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom';
import { Routes,Route } from 'react-router-dom';
import Home from './pages/Home';

const App = () => {

  const [showLogin,setShowLogin]=useState(false);
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <div>
      
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} ></Navbar>} 
      {showLogin? "show login":""}

      <Routes>
        <Route path='/' element={<Home></Home>} ></Route>
      </Routes>
    </div>
  )
}

export default App