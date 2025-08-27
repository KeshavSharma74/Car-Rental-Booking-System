import React from 'react';
import NavbarOwner from '../../components/owner/NavbarOwner';
import Sidebar from '../../components/owner/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useEffect } from 'react';

const Layout = () => {

  const {isOwner}=useAppContext();
  const navigate = useNavigate();

  useEffect( ()=>{
    if(!isOwner){
      navigate('/');
    }
  },[isOwner] )

  return (
    <div className='flex flex-col min-h-screen'>
      <NavbarOwner />
      <div className='flex flex-1'>
        <Sidebar />
        <div className='flex-1 p-8'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;