import React, { useEffect, useState } from 'react'
import PostItem from './PostItem'
import axios from 'axios'
import Loader from '../components/Loader'



const Posts = () => {
    const [posts, SetPost] = useState([])
    const [loading, setLoading] = useState(false)
    



    useEffect(()=>{
      const fetchPosts = async () =>{
          setLoading(true);
          try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/posts`);
            SetPost(response?.data)
            
          } catch (error) {
            console.log(error)
            
          }
          setLoading(false);    
      }
      fetchPosts();
    },[])
    if(loading){
      return <div className='flex items-center justify-center '><Loader/></div>
    }
  return (
    <div className='my-auto py-2 mx-1 md:py-[6rem] md:mx-[5rem]'>
       {posts.length > 0 ? <div className='grid lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-[4rem]'>
        {
            posts.map(({_id: id, thumbnail, category, title,description, creator, createdAt})=> 
            <PostItem key={id} postID={id} thumbnail={thumbnail} category={category} title={title}
            desc={description} authorID={creator} createdAt={createdAt}/>)
        }
        </div>: <h2 className='font-bold text-3xl flex items-center justify-center'>No Post Found </h2>}
    </div>
  )
}

export default Posts