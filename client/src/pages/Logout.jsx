import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ModalForLogout from '../components/ModalForLogout'; // Make sure to adjust the path if necessary

const Logout = () => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    setShowModal(true); // Trigger modal on component mount
  }, []);

  const confirmLogout = () => {
    setCurrentUser(null);
    toast.success("You have successfully logged out.");
    navigate("/login");
    setShowModal(false);
  };

  const cancelLogout = () => {
    toast.info("Logout cancelled.");
    navigate("/"); // Redirect to home or any other page you prefer
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <ModalForLogout
          message="Are you sure you want to logout?"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}

      
    </>
  );
};

export default Logout;
