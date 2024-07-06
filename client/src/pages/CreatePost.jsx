import React, { useState, useContext, useEffect } from 'react'
import { POST_CATEGORIES } from '../data'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {useNavigate} from "react-router-dom"
import {UserContext} from '../context/UserProvider'
import axios from 'axios'
import { toast} from 'react-toastify'




const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Uncategorized')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const navigate = useNavigate()
  const [error, setError] = useState('')

const {currentUser} = useContext(UserContext)
const token = currentUser?.token;

//redirect to login page for any user who is not login
useEffect(() =>{
  if(!token){
    navigate('/login')
  }
}, [])

   const modules ={
    toolbar:[
        [{"header": [1,2,3,4,5,6, false]}],
        ['bold','italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
    ]
}

 const formats =[
    'header', 'bold', 'italic', 'underline','strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]


const createPost = async(e) =>{
  e.preventDefault();
setError()

  const postData = new FormData();
  postData.set('title', title);
  postData.set('category', category)
  postData.set('description', description)
  postData.set('thumbnail', thumbnail);

  try {
    const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/posts`,postData, {
      withCredentials: true, headers: {Authorization: `Bearer ${token}`}
    })
    if(response.status ===201){
      toast.success('Post created successfully')
      return navigate('/')
    }
  } catch (error) {
     setError(error.response?.data?.message)
     // show error message here to user
     {error &&toast.error(error.response?.data?.message || 'Failed to create post' || {error})}
     return
    // show error message here to user
    // toast.error( error || 'Failed to create post')
    
    
  }


 

}



  return (
    <div className='my-auto md:py-[1rem] md:mx-[5rem] py-1 mx-0'>
      <div className='container grid  mt-20'>
        <div className='grid place-items-center'>
        <h2 className='font-bold text-2xl mb-5 text-green-600'>Create Post</h2>
       
        </div>
       
        <form className='create-post grid justify-center items-center h-[20rem]  ' 
        onSubmit={createPost}>
          <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} 
          className=' h-9 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md' 
          autoFocus/>
          <select name="category" className='h-6 mb-4' value={category} onChange={e => setCategory(e.target.value)} id="">
            {
              POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)
            }
            
          </select>
          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} 
          className='  md:w-[50rem] w-[20rem] md:h-[10rem] h-[6rem]' />
            <input type="file"   onChange={e => setThumbnail(e.target.files[0])} accept='png,jpg,jpeg' className='mt-28'/>
            <button type='submit' className='bg-primary w-24 rounded-full mt-5 text-white'>Create</button>

        </form>
      </div>

    </div>
  )
}

export default CreatePost