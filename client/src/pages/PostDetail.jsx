import React, { useContext, useEffect, useState } from 'react'
import PostAuthor from '../components/PostAuthor'
import { Link,useNavigate, useParams } from 'react-router-dom'

import UserProvider, { UserContext } from '../context/UserProvider'
import DeletePost from './DeletePost'
import Loader from '../components/Loader'
import axios from 'axios'

const PostDetail = () => {
  const navigate = useNavigate()
  const {id} = useParams()
  const [post, setPost] = useState(null)

 const [erro, setError] = useState(null)
 const [isLoading, setIsLoading] = useState(false)

 const {currentUser} = useContext(UserContext)


 useEffect(()=>{
  const getPost = async ()=>{
    setIsLoading(true);
    try {
       const respoonse  = await axios(`${import.meta.env.VITE_APP_BASE_URL}/posts/${id}`)
       setPost(respoonse.data)
       setCreatorID(respoonse.data.creator)
    } catch (error) {
      setError(error.message)
      
    }
    setIsLoading(false)
  }
  getPost()
 },[])







 if(isLoading){
   return <Loader/>
 }




  return (
    <div className='my-auto md:py-[6rem] md:mx-[5rem] py-2 mx-2 '>

         {post && <div className='w-[100%] md:w[60%] md:bg-white bg-white bg-transparent my-auto mx-auto py-[2rem] px-0'>
            <div className='flex justify-between mb-5 px-10'>
                <PostAuthor authorID={post.creator}/>
                {currentUser?.id ==post?.creator &&
                <div className='post-detail-button flex gap-1 items-center p-5 '>
                <Link to={`/posts/${post?._id}/edit`} className='bg-primary text-white h-8 p-1 rounded-[10px] hover:bg-blue-800 font-sm'>Edit</Link>
                  <DeletePost postId={id}/>

              </div>
                }
            </div>
             <h1 className='font-semi-bold leading-7 px-10 text-3xl '>{post.title}</h1>
             <div className='thumbnail px-10 my-4 mx-0 h-fit max-h-[30rem] overflow-hidden'>
              <img src={`${import.meta.env.VITE_APP_ASSETS_URL}/uploads/${post.thumbnail}`}alt="" />
             </div>
             <div className=' px-10 mb-3'>
               <h2 className='font-bold mb-2 text-2xl'>{post.category}</h2>
            <p className='text-gray-600 mb-4'>{post.createdAt.split('T')[0]}</p>
                 <p dangerouslySetInnerHTML={{__html:post.description }} className='font font-extralight text-1xl'/>
                
               
                  
             </div>
          </div>}
    </div>
  )
}

export default PostDetail