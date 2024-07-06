import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900  mt-[6rem] pt-[6rem]">
      <div className="grid-col">
        <ul className="  md:flex grid justify-center gap-[1.5rem] mb-[4rem]">
          <li className="bg-gray-700 text-white p-2 rounded-md hover:bg-white hover:text-gray-900 w-auto md:w-auto lg:w-auto">
            <Link to="posts/categories/Agriculture">Agriculture</Link>
          </li>
          <li className="bg-gray-700 text-white p-2 rounded-md hover:bg-white hover:text-gray-900 w-auto md:w-auto lg:w-auto">
            <Link to="posts/categories/Business">Business</Link>
          </li>
          <li className="bg-gray-700 text-white p-2 rounded-md hover:bg-white hover:text-gray-900 w-auto md:w-auto lg:w-auto">
            <Link to="posts/categories/Education">Education</Link>
          </li>
          <li className="bg-gray-700 text-white p-2 rounded-md hover:bg-white hover:text-gray-900 w-auto md:w-auto lg:w-auto">
            <Link to="posts/categories/Entertainment">Entertainment</Link>
          </li>
          <li className="bg-gray-700 text-white p-2 rounded-md hover:bg-white hover:text-gray-900 w-auto md:w-auto lg:w-auto">
            <Link to="posts/categories/Art">Art</Link>
          </li>
          <li className="bg-gray-700 text-white p-2 rounded-md hover:bg-white hover:text-gray-900 w-auto md:w-auto lg:w-auto">
            <Link to="posts/categories/Investment">Investment</Link>
          </li>
          <li className="bg-gray-700 text-white p-2 rounded-md hover:bg-white hover:text-gray-900 w-auto md:w-auto lg:w-auto">
            <Link to="posts/categories/Uncategoriezed">Uncategoriezed</Link>
          </li>
          <li className="bg-gray-700 text-white p-2 rounded-md hover:bg-white hover:text-gray-900 w-auto md:w-auto lg:w-auto">
            <Link to="posts/categories/Weather">Weather</Link>
          </li>
        </ul>
        </div>
        <div className="flex items-center border-t-2 border-gray-700 p-[1rem] text-white font-400 justify-center">
          <p>All Right Reserved &copy; Copyright, MayorDev 2024</p>
        </div>
      
    </footer>
  );
};

export default Footer;
