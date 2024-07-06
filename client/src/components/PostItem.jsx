import React from 'react';
import { Link } from 'react-router-dom';
import PostAuthor from './PostAuthor';

const PostItem = ({ postID, category, title, desc, authorID, thumbnail, createdAt }) => {
  const shortDescription = desc.length > 145 ? `${desc.substr(0, 145)}... ` : desc;
  const postTitle = title.length > 30 ? `${title.substr(0, 30)}...` : title;
  const imageUrl = `${import.meta.env.VITE_APP_ASSETS_URL}/uploads/${thumbnail}`;

  return (
    <div>
      <article className='bg-white p-[1rem] h-[33rem] pb-[2rem] cursor-default hover:border-x-1 hover:shadow-md rounded-[1.8rem]'>
        <div className='overflow-hidden rounded-xl h-[17rem]'>
          <img
            src={imageUrl}
            onError={(e) => e.currentTarget.src = "/path/to/placeholder.jpg"} // Fallback image
            alt={postTitle}
            className='w-full h-full object-cover'
          />
        </div>
        <div className='mt-[1.5rem]'>
          <Link to={`/posts/${postID}`}>
            <h3 className='font-bold my-[1rem] mx-[0.6rem] w-auto text-clip'>{postTitle}</h3>
          </Link>
          <p dangerouslySetInnerHTML={{ __html: shortDescription }} />
          <div className='flex justify-between items-end mt-[2rem]'>
            <PostAuthor authorID={authorID} createdAt={createdAt} />
            <Link to={`/posts/categories/${category}`} className='p-1 rounded-md hover:bg-gray-950 hover:text-white bg-slate-300 text-slate-50'>{category}</Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostItem;
