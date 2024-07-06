import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div className='mt-6'>
         <div className='flex justify-center items-center pt-5'>
          <Link to="/" className='bg-primary text-white p-2 rounded-lg hover:bg-slate-400 '> Go Back Home</Link>
         </div>
         <h1 className='text-center text-3xl font-bold mt-[3rem]'>Page Not Found</h1>
    </div>
  )
}

export default ErrorPage