import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Correctly call useNavigate as a function

  const changeInputHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/users/register`, userData, {
        withCredentials: true, // Ensure credentials (cookies) are sent
      });
      const newUser = response.data;
      console.log('Response from server:', response);
      console.log(newUser);
      if (!newUser) {
        setError("Couldn't register new user, please try again later");
      }
      toast.success(`${newUser.name || "Welcome"} registered successfully`);
      navigate('/login');
    } catch (err) {
      console.error('Error registering user:', err);
      toast.error(err.response?.data?.error?.message || 'Internal Server Error');
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-4xl w-full bg-white shadow-2xl p-6 md:p-10 rounded-lg ">
        <h2 className="font-bold text-2xl text-center mb-8 md:text-left md:text-4xl">
         <span className='font-bold text-3xl text-orange-400'>Welcome</span>  to Mayor Blog
        
        </h2>
        <h2 className='m mb-6'><span className='tex text-cyan-300 font-semi-bold text-2xl'>Quickly Sign Up</span> <span className='text-2xl font-light '>Let Carry You Along</span></h2>
        <form onSubmit={registerUser} className="space-y-4 ">
          {/* Form inputs */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={userData.name}
              onChange={changeInputHandler}
              className='border border-gray-300 w-[80%]  rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={userData.email}
              onChange={changeInputHandler}
              className='border border-gray-300 w-[80%]  rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={userData.password}
              onChange={changeInputHandler}
              className='border border-gray-300 w-[80%]  rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={changeInputHandler}
              className='border border-gray-300 w-[80%]  rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <button
            type="submit"
            className="btn-submit bg-primary w-auto p-4 rounded-full text-white hover:bg-blue-400"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 md:text-left">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
