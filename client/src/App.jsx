import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom';

const App = () => {

  const [showLogin,setShowLogin]=useState(false);
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <div>
      
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} ></Navbar>} 
      {showLogin? "show login":"not showlogin"}
    </div>
  )
}

export default App