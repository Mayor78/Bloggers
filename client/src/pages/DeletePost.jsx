import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import ConfirmationModal from '../components/ConfirmationModal'; 

const DeletePost = ({ postId }) => {
  const navigate = useNavigate();
  const location = useLocation();
 const [loading, setLoading] = useState(false)
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/posts/${postId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.status === 200) {
        if (location.pathname === `/myposts/${currentUser.id}`) {
          navigate(0);
        } else {
          toast.success('Post deleted successfully');
          navigate('/');
        }
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete post');
    }
  };
  if(loading){
    return <Loader />;
  }

  const confirmDelete = () => {
    setShowModal(false);
    handleDelete();
  };

  return (
    <>
      <div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white h-8 p-1 rounded-[10px] hover:bg-red-700 font-sm"
        >
          Delete
        </button>
      </div>
      <ConfirmationModal
        show={showModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
};

export default DeletePost;
