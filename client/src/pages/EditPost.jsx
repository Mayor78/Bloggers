import React, { useContext, useEffect, useState } from 'react'
import { POST_CATEGORIES } from '../data'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../context/UserProvider'
import axios from 'axios'
import { toast } from 'react-toastify'





const EditPost = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Uncategorized')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [error, setError] = useState('')



  const navigate = useNavigate()
const { id} = useParams();
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



useEffect(()=>{
const getPost = async ()=>{
  try {
    const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/posts/${id}`)
    setTitle(response.data.title)
    setCategory(response.data.category)
    setDescription(response.data.description)
    
  } catch (error) {
    
  }

}

getPost()
},[])

const editPost = async (e) => {
  e.preventDefault()
  setError('')
  const formData = new FormData();
  formData.set('title', title)
  formData.set('category', category)
  formData.set('description', description)
  formData.set('thumbnail', thumbnail)
  try {
   
    const response = await axios.patch(`${import.meta.env.VITE_APP_BASE_URL}/posts/${id}`, formData, {headers: {'Authorization': `Bearer ${token}`}})
    if(response.status === 200){
      toast.success("Your Post has been updated successfuly")
      navigate('/')
    }
  } catch (error) {
    toast.info(error.response?.data?.message || "fill all field")
  }
}



  return (
    <div className='my-auto md:py-[6rem] md:mx-[5rem] py-1 mx-0'>
      <div className='container grid place-items-center mt-20'>
        <h2 className='font-bold text-2xl mb-5 text-green-600'>Edit Post</h2>
        {error  && <p className="form-error-message bg-red-400 font-serif mb-3 p-1 text-1xl">
          {error}
        </p>}
        <form className='create-post grid justify-center items-center h-[20rem]  ' 
        onSubmit={editPost}>
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
            <button type='submit' className='bg-primary w-24 rounded-full mt-5 text-white'>Update</button>

        </form>
      </div>

    </div>
  )
}

export default EditPost 