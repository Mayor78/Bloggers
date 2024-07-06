import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from 'react-icons/ai';
import { motion } from "framer-motion";
import { UserContext } from '../context/UserProvider';

const Header = () => {
  const [navbar, setNavbar] = useState(window.innerWidth > 800);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 800) {
        setNavbar(false);
      } else {
        setNavbar(true);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLinkClick = () => {
    if (window.innerWidth < 800) {
      setNavbar(false);
    }
  };

  return (
    <nav className='sticky top-0 w-full h-20 border-b-4 bg-white-50 z-50 shadow-md backdrop-blur-lg'>
      <div className="container mx-auto flex justify-between items-center h-full">
        <Link to="/" className='w-12 h-12 mb-6' onClick={handleLinkClick}>
          <h1 className="nav_logo_img mx-4 md:mx-0 mt-6 font-sans text-[18px]">
            <span className='text-3xl font-bold text-pretty text-orange-500'>M</span>ayor
            <span className='text-primary font-serif text-3xl'>B</span><span className='fo font-mono text-xl font-extralight'>log</span>
          </h1>
        </Link>
        {currentUser?.id && navbar && (
          <ul className="hidden md:flex items-center space-x-8">
            <li><Link to={`/profile/${currentUser.id}`} onClick={handleLinkClick}>{currentUser?.name}</Link></li>
            <li><Link to="/create" onClick={handleLinkClick}>Create Post</Link></li>
            <li><Link to="/authors" onClick={handleLinkClick}>Authors</Link></li>
            <li><Link to="/logout" onClick={handleLinkClick}>Logout</Link></li>
          </ul>
        )}
        {!currentUser?.id && navbar && (
          <ul className="hidden md:flex items-center space-x-8">
            <li><Link to="/authors" onClick={handleLinkClick}>Authors</Link></li>
            <li><Link to="/login" onClick={handleLinkClick}>Login</Link></li>
          </ul>
        )}
        <motion.button
          whileHover={{ rotateY: 180 }}
          whileTap={{ scale: 0.9 }}
          className='md:hidden flex items-center mx-1'
          onClick={() => setNavbar(!navbar)}
        >
          {navbar ? <AiOutlineClose className='cursor-pointer mx-3' /> : <FaBars className='mx-3' />}
        </motion.button>
      </div>
      {currentUser?.id && navbar && (
        <motion.ul whileInView={{ height: "auto" }}
          initial={{ height: 0 }}
          transition={{ duration: 0.9 }}
          className="md:hidden flex flex-col items-center absolute right-0 mt-4 animate-drop backdrop-blur space-y-4 bg-white w-[60%] p-4 h-60">
          <li><Link to={`/profile/${currentUser.id}`} onClick={handleLinkClick}>{currentUser?.name}</Link></li>
          <li><Link to="/create" onClick={handleLinkClick}>Create Post</Link></li>
          <li><Link to="/authors" onClick={handleLinkClick}>Authors</Link></li>
          <li><Link to="/logout" onClick={handleLinkClick}>Logout</Link></li>
        </motion.ul>
      )}
      {!currentUser?.id && navbar && (
        <motion.ul whileInView={{ height: "auto" }}
          initial={{ height: 0 }}
          transition={{ duration: 10 }}
          className="md:hidden flex flex-col items-center absolute right-0 mt-4 animate-drop backdrop-blur space-y-4 bg-white w-[60%] p-4 h-60">
          <li><Link to="/authors" onClick={handleLinkClick}>Authors</Link></li>
          <li><Link to="/login" onClick={handleLinkClick}>Login</Link></li>
        </motion.ul>
      )}
    </nav>
  );
};

export default Header;
