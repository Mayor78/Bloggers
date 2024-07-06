import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserProvider'; // Assuming UserContext is exported correctly

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { setCurrentUser } = useContext(UserContext); // Correctly use useContext with UserContext

  const changeInputHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/users/login`, userData, {
        withCredentials: true // Ensure credentials (cookies) are sent
      });
      const user = response.data;
      setCurrentUser(user);
      toast.success(`Welcome!!! ${user.name}`);
      navigate('/'); // Redirect to homepage after successful login

      console.log('Response from server:', response);
    } catch (err) {
      console.error('Error logging in user:', err);
      toast(err.response?.data?.error?.message || 'Internal Server Error');
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='max-w-lg w-full bg-white p-8 rounded-lg shadow-lg'>
        <h2 className='text-3xl font-bold text-center mb-8'>Login</h2>
        <form className='space-y-4' onSubmit={loginUser}>
          <div className='flex flex-col space-y-2'>
            <label htmlFor='email' className='text-sm font-medium'>Email</label>
            <input
              type='email'
              id='email'
              name='email'
              value={userData.email}
              onChange={changeInputHandler}
              className='border border-gray-300 w-[80%] rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <label htmlFor='password' className='text-sm font-medium'>Password</label>
            <input
              type='password'
              id='password'
              name='password'
              value={userData.password}
              onChange={changeInputHandler}
              className='border border-gray-300 w-[80%] rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          {error && <p className='text-red-500 text-sm'>{error}</p>}
          <button type='submit' className='bg-blue-500 text-white p-6 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'>
            Login
          </button>
        </form>
        <p className='mt-4 text-sm text-center'>
          Don't have an account? <Link to='/register' className='text-blue-500 hover:underline'>Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
