import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";

// ✅ configure axios
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true; // send cookies automatically

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // Fetch user data
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        handleAuthFail();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      handleAuthFail();
    }
  };

  // Fetch cars
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      data.success ? setCars(data.cars) : toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Handle failed authentication
  const handleAuthFail = () => {
    setUser(null);
    setIsOwner(false);

    navigate("/");
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post("/api/user/logout");
      setUser(null);
      setIsOwner(false);
      toast.success("You have been logged out");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ run once on mount

  const value = {
    navigate,
    currency,
    user,
    setUser,
    isOwner,
    setIsOwner,
    fetchUser,
    fetchCars,
    cars,
    showLogin,
    setShowLogin,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    logout,
    axios,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};
