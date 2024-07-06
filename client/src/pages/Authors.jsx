import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import { Link } from 'react-router-dom'






const Authors = () => {
  const [authors,setAuthors] = useState([])
  const [isLoading, setIsLoading] = useState(false)



  useEffect(()=>{
  const getAuthors = async ()=>{
    setIsLoading(true)
    try {
     const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/users`)
     setAuthors(response.data)
     
    } catch (error) {
     
    }
    setIsLoading(false)
  }
  getAuthors();

  },[])

  if(isLoading){
    return <div className='container flex justify-center mt-12'><Loader/></div>
  }

  return (
    <div className=' section my-auto py-[6rem] mx-[5rem]'>
           {authors.length > 0 ? <div className='container grid sm:grid-cols-2 md:grid-cols-3 lg:grid-flow-col-4 gap-[3rem]'>
       
           {
            authors.map(({_id:id,avatar,name,posts})=>{
              return <Link key={id} to={`/posts/users/${id}`} 
              className='bg-white p-[1rem] rounded-md flex gap-[1rem] hover:box-content hover:shadow-md'>
                <div className='w-[4rem] h-[4rem] rounded-full overflow-hidden'>
                  <img src={`${import.meta.env.VITE_APP_ASSETS_URL}/uploads/${avatar}`} alt={`image of ${name}`} />
                </div>
                <div>
                  <h3 className=' font-semibold'>{name}</h3>
                  <p>Posts: {posts}</p>
                </div>
              </Link>
            })
           }
      </div> : <h2 className='font-bold text-3xl flex justify-center mt-12'>No users/authors found</h2>}
    </div>
  )
}

export default Authors