import React from 'react'
import LoadingGif from '../assets/loader/Running heart.gif'

const Loader = () => {
  return (
    <>
      <div className="loader section my-auto py-[6rem] mx-[5rem]">
        <div className="loader-image">
            <img src={LoadingGif} alt="loading" />
        </div>
      </div>
    
    </>
  )
}

export default Loader