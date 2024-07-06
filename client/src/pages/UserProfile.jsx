import React, { useContext, useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
 import { FaEdit, FaCheck } from "react-icons/fa";
import { UserContext } from '../context/UserProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
 


const UserProfile = () => {
  const navigate = useNavigate()

const {currentUser} = useContext(UserContext)
const token = currentUser?.token;

//redirect to login page for any user who is not login
useEffect(() =>{
  if(!token){
    navigate('/login')
  }
}, [])


//fetch user details from server


useEffect(()=>{
  const fetchUserDetails = async ()=>{
    try{
      const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/users/${currentUser.id}`,{withCredentials: true, headers: {Authorization: `Bearer ${token}`,}, })
      const {name, email, avatar} = response.data;
      setName(name);
      setEmail(email);
      setAvatar(avatar)
    }catch(error){
      console.error(error)
    }
  }
  fetchUserDetails()
},[])
  const [avatar, setAvatar] = useState("");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [error, setError] = useState('');

    const [isAvatarTouched, setIsAvatarTouched] = useState(false)

    const changeAvatar = async (e) => {
      e.preventDefault();
      setIsAvatarTouched(false);
    
      if (!avatar) {
        console.error('No avatar selected.');
        return;
      }
    
      try {
        const fileInput = document.querySelector('input[type="file"]');
       const formData = new FormData();
  
  // Assuming 'avatar' is the name expected by the server
     formData.set('avatar', fileInput.files[0]);
    
        const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/users/change-avater`, formData,
          { withCredentials: true,headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data',}, } );
          toast.success("Avatar updated successfully")
          console.log('Avatar updated successfully:', response.data);
          const avatarImg = document.querySelector('#avatarImage'); // Example image element
            // avatarImg.src = response.data.fileUrl;
            setAvatarUrl(`${import.meta.env.VITE_APP_ASSETS_URL}/upload/${response?.data.fileUrl}`);
            console.log("avata",avatarImg)
        
      } catch (error) {
        console.error('Failed to change avatar:', error);
      }
    };
    

    const updateUserDetails = async (e) => {
      e.preventDefault();
      try {
          const userData = new FormData();
          userData.set('name', name);
          userData.set('email', email);
          userData.set('currentPassword', currentPassword);
          userData.set('newPassword', newPassword);
          userData.set('confirmNewPassword', confirmNewPassword);
  
          const response = await axios.patch(`${import.meta.env.VITE_APP_BASE_URL}/users/edit-user`, 
          userData, {
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` }
          });
  
          if (response.status === 200) {
              navigate('/logout');
              toast.success("User details updated successfully");
          }
  
      } catch (error) {
          console.error('Failed to update user details:', error);
  
          // Check if error.response exists
          if (error.response) {
              // Server responded with a status other than 200 range
              setError(error.response.data.message);
              toast.error(error.response.data.message);
          } else if (error.request) {
              // Request was made but no response was received
              setError('No response received from server.');
              toast.error('No response received from server.');
          } else {
              // Something else happened
              setError('An error occurred while updating user details.');
              toast.error('An error occurred while updating user details.');
          }
      }
  };
  
  return (
    <div className="flex flex-col items-center max-w-md mx-auto bg-white shadow-md rounded-md overflow-hidden mt-10">
 
      <div className="self-center m-4">
        <Link to={`/myposts/${currentUser.id}`} className="bg-white text-black py-2 px-4 rounded hover:bg-blue-700 hover:text-white">
          My Post
        </Link>
      </div>
      
  
      <div className="w-32 h-32">
        <img
          className="w-full h-full rounded-full object-cover  border-8"
           id="avatarImage" src={`${import.meta.env.VITE_APP_ASSETS_URL}/uploads/${avatar}`}   alt={"avatarUrl"}

         
        />
      </div>
      <form  >
          <input type="file"
           name="avatar"
            id="avatar"
             accept="image/*" 
             className='hidden'
              onChange={e => setAvatar(URL.createObjectURL(e.target.files[0]))} />
              <label htmlFor="avatar" className='relative' onClick={()=> setIsAvatarTouched(true)}>
                <FaEdit className='text-2xl absolute  text-gray-700 cursor-pointer bottom-[30px] left-[3rem]' />
              </label>
             
            </form>
            <button className='profile-avatar relative  text-white h-8 p-1 rounded-full left-10 bottom-8 '
              onClick={changeAvatar} >
             {isAvatarTouched &&  <FaCheck className='text-3xl absolute bottom-[28px] right-[-20px] bg-primary rounded-xl ' />}
            </button>

      <div className="mt-2">
        <h2 className="text-2xl font-bold text-gray-800">{currentUser.name}</h2>
      </div>

    
      <form className="w-full px-8 py-4 space-y-4" onSubmit={updateUserDetails}>
      { error && <p className="form-error flex place-content-center bg-red-400 py-2 font-serif text-white w-auto">
              {error}
 
           </p>}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current-password">
            Current Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
            New Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="new-password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
            Confirm New Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirm-password"
            type="password"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UserProfile;


















