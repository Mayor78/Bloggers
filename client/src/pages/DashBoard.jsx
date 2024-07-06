import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../context/UserProvider'
import axios from 'axios'
import Loader from '../components/Loader'
import DeletePost from './DeletePost'


const DashBoard = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

const {currentUser} = useContext(UserContext)
const token = currentUser?.token;

//redirect to login page for any user who is not login
useEffect(() =>{
  if(!token){
    navigate('/login')
  }
}, [])





useEffect(()=>{
  const fetchPosts = async ()=>{
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/posts/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("response",response.data)
      setPosts(response.data)
      
    } catch (error) {

      
    }
    setLoading(false)
  }
  fetchPosts()


},[])


if(loading){
  return <Loader />
}
  
  return (
    <div className='my-auto py-2 mx-2 md:py-[6rem] md:mx-[5rem]'>
      <div>
            {
              posts.length ? <div className="container-dashboard  ">
                       {
                        posts.map(post => {
                          return<article key={post.id} className='flex justify-between  flex-col bg-white my-4 py-4 w-full rounded-md'>
                            <div className="dashboard-post-info block items-center  w-[100%]   md:flex  gap-8">
                              <div className="thumbnai w-[4rem] rounded-md overflow-hidden">
                                <img src={`${import.meta.env.VITE_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" className='  ml-4 ' />
                               
                              </div>
                              <h5 className=' mx-2 md:mx-0 '>{post.title}</h5>
                              
                            </div>
                            <div className="dashboard-post-action flex place-content-end gap-5">
                              <Link to={`/posts/${post._id}`} 
                              className="btn bg-white text-black hover:bg-black hover:text-white h-8 p-1 rounded-[10px]"
                                  >view</Link>
                              <Link to={`/posts/${post._id}/edit`} className="btn bg-primary text-white h-8 p-1 rounded-[10px] hover:bg-blue-800 font-sm">Edit</Link>
                             <DeletePost postId={post._id}/>
                            </div>
                          </article>
                        })
                       }
              </div> : <h2 className='plac place-items-center flex place-content-center font-bold
               text-2xl'> You have no posts yet.</h2>
            }
      </div>
    </div>
  )
}

export default DashBoard