import React from 'react'
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom';
import { Routes,Route } from 'react-router-dom';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Cars from './pages/Cars';
import MyBookings from './pages/MyBookings';
import Footer from './components/Footer';
import Layout from './pages/owner/Layout';
import AddCar from './pages/owner/AddCar';
import ManageCars from './pages/owner/ManageCars';
import ManageBookings from './pages/owner/ManageBookings';
import Dashboard from './pages/owner/Dashboard';
import Login from './components/Login';
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext';

const App = () => {

  // const [showLogin,setShowLogin]=useState(false);
  const {showLogin}=useAppContext();
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <div>
      <Toaster></Toaster>
      {showLogin && <Login></Login> }
      {!isOwnerPath && <Navbar ></Navbar>} 
      

      <Routes>
        <Route path='/' element={<Home></Home>} ></Route>
        <Route path='/car-details/:id' element={<CarDetails></CarDetails>} ></Route>
        <Route path='/cars' element={<Cars></Cars>} ></Route>
        <Route path='/my-bookings' element={<MyBookings></MyBookings>} ></Route>
        <Route path='/owner' element={<Layout></Layout>}>
          <Route index element={<Dashboard></Dashboard>} ></Route>
          <Route path='add-car' element={<AddCar></AddCar>} ></Route>
          <Route path='manage-cars' element={<ManageCars></ManageCars>} ></Route>
          <Route path='manage-bookings' element={<ManageBookings></ManageBookings>} ></Route>
        </Route>
      </Routes>

      {!isOwnerPath && <Footer></Footer>}

    </div>
  )
}

export default App