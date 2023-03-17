import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { IUser } from '../types';

const NavBar = ({ userInfo, currentState, setCurrentState, createNewForm }: {
  userInfo?: IUser,
  currentState?: "Edit" | "Preview" | "Res",
  setCurrentState?: React.Dispatch<React.SetStateAction<"Edit" | "Preview" | "Res">>,
  createNewForm?: () => void
}) => {
  const [dropdownToggle, setToggle] = useState<boolean>(false)
  const navigate = useNavigate()
  return (
    <header className='flex  px-5 py-2 bg-white  items-center w-full justify-between'>
      <Link to='/' className='w-fit flex items-center space-x-1'>
        <img src={'/google-form.svg'} className="w-12 h-12" />
        <span className='font-bold text-lg text-gray-500'>Form</span>
      </Link>
      {
        currentState && setCurrentState &&
        <div className='flex  space-x-5 mx-auto w-fit h-fit text-xs'>
          <button
            className={`font-medium rounded-full ${(currentState === 'Edit') ? 'bg-purple-100 p-2.5 text-black' : 'text-black bg-white'}`}
            onClick={(event) => { event.preventDefault(); setCurrentState('Edit') }}
          >Questions</button>
          <button
            className={`font-medium rounded-full ${(currentState === 'Res') ? 'bg-purple-100 p-2.5 text-black' : 'text-black bg-white'}`}
            onClick={(event) => { event.preventDefault(); setCurrentState('Res') }}
          >Responses</button>
          {/* <button className='font-medium pb-2' >Settings</button> */}
          <button
          className={`font-medium rounded-full ${(currentState === 'Preview') ? 'bg-purple-100 p-2.5 text-black' : 'text-black bg-white'} flex items-center space-x-2`}
            onClick={(event) => { event.preventDefault(); setCurrentState('Preview') }}
          >
            Preview
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      }
      <div className='flex items-center w-fit space-x-3'>

        {
          createNewForm &&
          <button
            className='rounded-xl h-fit py-0.5 px-3 text-sm border items-center flex space-x-1 border-purple-300 '
            onClick={(event) => { event.preventDefault(); createNewForm() }}>
            <span className='text-purple-400 font-medium '>
              +
            </span>
            <span>
              Create Form
            </span>
          </button>
        }

        <div className='w-fit relative'>
          <button
            className='w-fit rounded-full'
            onClick={(event) => { event.preventDefault(); setToggle((prev) => !prev) }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          {
            userInfo && dropdownToggle && <div id="dropdownAvatar" className="absolute z-10 border top-10 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
              <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div>{userInfo.name}</div>
                {userInfo.email && <div className="font-medium truncate text-xs text-gray-500">{userInfo.email}</div>}
              </div>
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUserAvatarButton">
                <li>
                  <Link to="/" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link>
                </li>
                <li>
                  <Link to="/settings/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">View Profile</Link>
                </li>
                <li>
                  <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</Link>
                </li>
              </ul>
              <div className="py-2">
                <button
                  className="block px-4 py-2 w-full text-left text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  onClick={(event) => {
                    event.preventDefault();
                    axios.get(`${import.meta.env.VITE_API_URL}/logout`, { withCredentials: true })
                      .then((res) => {
                        if (res.data) {
                          console.log("LOgout", res)
                          window.location.href = `${import.meta.env.BASE_URL}`

                        }
                      })
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          }
          {
            !userInfo && dropdownToggle && <div id="dropdownAvatar" className="absolute z-10 border top-10 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
            
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUserAvatarButton">
              <li>
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Login</Link>
              </li>
            </ul>
            
          </div>
          }
        </div>
      </div>
    </header>
  )
}

export default NavBar