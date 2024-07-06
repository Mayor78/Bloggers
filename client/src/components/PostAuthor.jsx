import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en.json';
import ru from 'javascript-time-ago/locale/ru.json';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState({});

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/users/${authorID}`);
        console.log('Author Response:', response);
        setAuthor(response?.data);
      } catch (error) {
        console.log('Error fetching author:', error);
      }
    };
    if (authorID) {
      getAuthor();
    }
  }, [authorID]);

  console.log('createdAt prop:', createdAt); // Check the value of createdAt

  const validDate = new Date(createdAt);
  const isValidDate = !isNaN(validDate.getTime());

  return (
    <div>
      <Link to={`/posts/users/${authorID}`} className='flex gap-2 items-start'>
        <div className='w-[3rem] aspect-square rounded-md overflow-hidden'>
          <img src={`${import.meta.env.VITE_APP_ASSETS_URL}/uploads/${author?.avatar}`} alt={author?.name} />
        </div>
        <div>
          <h5 className='font-bold left-4 font-1xl'>By: {author?.name || 'Unknown Author'}</h5>
          {isValidDate ? (
            <p>
              <ReactTimeAgo date={validDate} locale='en' />
            </p>
          ) : (
            <p>Date not available</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PostAuthor;
