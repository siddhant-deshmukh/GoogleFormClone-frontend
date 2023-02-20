import React from 'react'
import NavBar from '../components/NavBar'
import { IUser } from '../types'

export const Home = ({userInfo}:{userInfo:IUser}) => {
  return (
    <div className='fixed w-screen h-screen left-0 top-0'>
        <NavBar userInfo={userInfo}/>
        <main className='w-full'>
        <div className='w-full bg-gray-100 py-2  px-5 flex'>
            <div className='mx-auto w-full xl:w-4/6'>
            <p className='mb-2 ml-1 font-sans'>Create new form</p>
            <button className='w-44 h-36 border border-gray-300 overflow-hidden'>
                <img className='w-full h-full' src="https://ssl.gstatic.com/docs/templates/thumbnails/forms-blank-googlecolors.png" alt="+"/>
            </button>
            <p className='my-0.5 ml-1 text-sm'>Blank</p>
            </div>
        </div>
        <div className='mx-auto w-full py-3 bg-white xl:w-4/6'>
            <h3 className='font-medium'>Your Forms</h3>
        </div>
        </main>
    </div>
  )
}
