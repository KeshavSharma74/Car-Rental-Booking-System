import { assets, menuLinks } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ setShowLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className={`flex justify-center  text-[0.95rem] border-b border-b-gray-300
         ${
        location.pathname === '/' && 'bg-[#F1F5F9]'
      }`}
    >
      <div
        className={`flex items-center w-[1355px] justify-between px-24 py-3 text-gray-600 transition-all`}
      >
        {/* Logo */}
        <Link to='/'>
          <img src={assets.logo} alt='logo' className='h-8 mr-[18rem]' />
        </Link>

        {/* Menu Links */}
            <div
            className={`flex flex-row items-center gap-8 p-2 text-gray-700 text-[0.95rem] z-50 ${
                location.pathname === '/' && 'bg-[#F1F5F9]'
            }`}
            >
          {menuLinks.map((link, index) => (
            <Link key={index} to={link.path}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <div className='flex items-center text-sm gap-2 border border-gray-400 px-3 rounded-full w-56'>
          <input
            type='text'
            className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500 text-sm placeholder:text-sm'
            placeholder='Search cars'
          />
          <img src={assets.search_icon} alt='search' />
        </div>

        {/* Buttons */}
        <div className='flex items-center gap-6'>
          <button
            onClick={() => navigate('/owner')}
            className='cursor-pointer'
          >
            Dashboard
          </button>
          <button
            onClick={() => setShowLogin(true)}
            className='cursor-pointer px-8 py-2 border-none bg-[#2a6bf8] text-white text-[0.91rem] transition-all rounded-lg'
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
