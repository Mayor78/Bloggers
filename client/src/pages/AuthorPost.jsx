import React, { useEffect, useState } from 'react'
import Loader from "../components/Loader"
import PostItem from '../components/PostItem'
import { useParams } from 'react-router-dom'

import axios from 'axios'







const AuthorPost = () => {
  const [posts, SetPost] = useState([])
  const [loading, setLoading] = useState(false)
  const {id} = useParams()



  useEffect(()=>{
    const fetchPosts = async () =>{
        setLoading(true);
        try {
          const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/posts/users/${id}`);
          SetPost(response?.data)
          
        } catch (error) {
          console.log(error)
          
        }
        setLoading(false);    
    }
    fetchPosts();
  },[id])
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

export default AuthorPost