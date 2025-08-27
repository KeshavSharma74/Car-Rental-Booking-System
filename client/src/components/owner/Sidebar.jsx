import React, { useState } from 'react';
import { assets, ownerMenuLinks} from '../../assets/assets';
import { useLocation, NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const Sidebar = () => {
  const { user, fetchUser,axios } = useAppContext(); // ✅ include fetchUser for refreshing user data
  const location = useLocation();

  const [image, setImage] = useState('');

  // Function to upload image to backend API
  const updateImage = async () => {
    try {
      if (!image) return;

      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result;

          // send { image } to backend
          const { data } = await axios.post("/api/owner/update-image", { image: base64Image });

          if (data.success) {
            fetchUser(); // refresh user info
            toast.success(data.message);
            setImage('');
          } else {
            toast.error(data.message || "Image update failed");
          }
        } catch (err) {
          console.error("Error updating image:", err);
          toast.error("Something went wrong while updating image");
        }
      };
    } catch (error) {
      console.error("Error preparing image:", error);
      toast.error("Could not process the image");
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
