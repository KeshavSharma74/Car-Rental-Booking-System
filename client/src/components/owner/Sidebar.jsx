import React, { useState } from 'react';
import { assets, dummyUserData ,ownerMenuLinks} from '../../assets/assets';
import { useLocation, NavLink } from 'react-router-dom';

const Sidebar = () => {
  // Get user data and current location from router
  const user = dummyUserData;
  const location = useLocation();

  // State to manage the selected image file for upload
  const [image, setImage] = useState('');

  // Function to simulate updating the user's image
  const updateImage = async () => {
    if (image) {
      console.log("Updating image with:", image.name);
      user.image = URL.createObjectURL(image); 
      setImage(''); 
    }
  };

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r-gray-300 border-r border-borderColor text-[0.85rem]'>
      
      {/* Profile Image Section */}
      <div className='group relative'>
        <label htmlFor='image'>
          <img 
            src={image ? URL.createObjectURL(image) : user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"} 
            alt="profile"
            className='w-16 h-16 md:w-24 md:h-24 rounded-full object-cover cursor-pointer'
          />
          <input 
            type='file' 
            id='image' 
            accept='image/*' 
            hidden 
            onChange={(e) => setImage(e.target.files[0])}
          />

          {/* Edit Icon Overlay */}
          <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
            <img src={assets.edit_icon} alt="edit" />
          </div>
        </label>

        {/* Save Button appears when a new image is selected */}
        {image && (
          <button 
            onClick={updateImage} 
            className='absolute -top-6 -right-16 flex px-2 py-1 gap-1 bg-blue-100 text-[#2463EB] cursor-pointer rounded-full'
          >
            Save <img src={assets.check_icon} width={13} alt="save" />
          </button>
        )}
      </div>

      <p className='mt-2 text-base max-md:hidden'>{user?.name}</p>

      {/* Navigation Menu */}
      <div className='w-full mt-1'>
        {ownerMenuLinks.map((link, index) => (
          <NavLink 
            key={index} 
            to={link.path} 
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
              location.pathname === link.path 
              ? 'bg-blue-100 text-primary' 
              : 'text-gray-600'
            }`}
          >
            <img 
              src={location.pathname === link.path ? link.coloredIcon : link.icon} 
              alt="icon"
              className='w-5'
            />
            <span className='max-md:hidden'>{link.name}</span>
            <div className={`${
              location.pathname === link.path && 'bg-[#5183f0]'
            } w-1.5 h-8 rounded-l-md right-0 absolute`}></div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
