import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthModal = () => {
  // track whether the modal is for login or signup
  const [mode, setMode] = useState("login");
  const {setShowLogin,axios,setUser}=useAppContext();

  const navigate = useNavigate();

  // form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const actualMode = mode==="signup"?"register":"login";
      // API call (mode = "login" or "signup")
      const { data } = await axios.post(
        `/api/user/${actualMode}`,
        { name, email, password },
        { withCredentials: true } // ensures cookies like jwt are sent/received
      );

      if (data.success) {
        // store token
        // redirect and close modal
        navigate("/");
        setShowLogin(false);
        setUser(data.user);

        toast.success(
          mode === "login"
            ? "Login successful"
            : "Account created successfully"
        );
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(
        error.response?.data?.message || "Server error. Please try again."
      );
    } finally {
      // reset fields
      setName("");
      setEmail("");
      setPassword("");
      setMode("login");
    }
  };

  return (
    <div 
      onClick={() => setShowLogin(false)} 
      className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center text-sm text-gray-600 bg-black/50'
    >
      <form 
        onClick={(e) => e.stopPropagation()} 
        onSubmit={handleSubmit} 
        className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
            <span className='text-blue-600'>User </span>
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          {mode === "login" ? "Please sign in to continue" : "Create your account"}
        </p>

        {/* Only show name field in signup */}
        {mode === "signup" && (
          <div className="flex items-center w-full mt-6 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 8a4 4 0 100-8 4 4 0 000 8zm0 1.6c-2.67 0-8 1.34-8 4v1.4h16V13.6c0-2.66-5.33-4-8-4z" fill="#6B7280"/>
            </svg>
            <input
              type="text"
              placeholder="Full Name"
              className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        {/* Email input */}
        <div className={`flex items-center ${mode==="login" ? "mt-6" : "mt-4"} w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2`}>
          <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280"/>
          </svg>
          <input 
            type="email" 
            placeholder="Email id" 
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        {/* Password input */}
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280"/>
          </svg>
          <input 
            type="password" 
            placeholder="Password" 
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        {/* Forgot password only in login */}
        {/* {mode === "login" && (
          <div className="mt-5 text-left text-indigo-500">
            <a className="text-sm" href="#">Forgot password?</a>
          </div>
        )} */}

        <button 
          type="submit" 
          className="mt-5 w-full h-11 rounded-full text-white bg-blue-600 hover:opacity-90 transition-opacity"
        >
          {mode === "login" ? "Login" : "Sign Up"}
        </button>

        <p className="text-gray-500 text-sm mt-3 mb-11">
          {mode === "login" 
            ? <>Don't have an account? <span onClick={() => setMode("signup")} className="text-blue-600 cursor-pointer">Sign up</span></> 
            : <>Already have an account? <span onClick={() => setMode("login")} className="text-blue-600 cursor-pointer">Login</span></>
          }
        </p>
      </form>
    </div>
  );
};

export default AuthModal;
