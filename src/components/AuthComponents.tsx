import { useGoogleLogin } from '@react-oauth/google'
import React, { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'


const LoginComponent = ({authTypeToggle}:{authTypeToggle : 'login' | 'register'}) => {
  // const [authTypeToggle, setAuthTypeToggle] = useState<'login' | 'register'>('login')
  const location = useLocation();
  const [formState, setFormState] = useState<{ email: string, name?: string, password: string }>({ email: '', name: '', password: '' })
  const navigate = useNavigate()

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setFormState((prev) => {
      return { ...prev, [event.target.name]: event.target.value }
    })
  }
  const login = useGoogleLogin({
    onSuccess: (auth_res) =>{
      const { code } = auth_res
      console.log("Sucessfully!",auth_res,code)
      fetch(`${import.meta.env.VITE_API_URL}/login-google`,{
        method:'POST',
        credentials:'include',
        mode:'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({code})
      }).then((res)=>res.json())
      .then((data)=>{
        console.log(data)
        window.location.href= `${import.meta.env.BASE_URL}`
      })
      .catch((err)=>console.error("Error after onSucess callback ",err))
    },
    onError : (res)=>{console.error("error while login",res)} ,
    flow: 'auth-code',
  });

  const githublogin = () => {
    const rootURl = 'https://github.com/login/oauth/authorize';

    const options = {
      client_id: import.meta.env.VITE_Github_ClientId as string,
      redirect_uri: "http://localhost:5173/login-github",// `${import.meta.env.BASE_URL}/login-github`,
      scope: 'user:email',
      state:  ((location.state as any)?.from?.pathname as string) || '/',
    };
    
    const qs = new URLSearchParams(options);
    
    window.location.href= `${rootURl}?${qs.toString()}`
  }

  return (
    <div className="flex  w-auto">
      
      <div
        className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center hidden">
        <div>
          <h1 className="text-white ml-2 font-bold text-4xl font-sans">Just want to try!</h1>
          <p className="text-white ml-2 mt-1">click to see demo!</p>
          <Link to={'/demo'} type="submit" className="block w-fit  px-4 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2">Demo</Link>
        </div>
        <div className="absolute -bottom-32 opacity-50 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 opacity-50 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 opacity-50 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 opacity-50 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>

      <div className="flex flex-col space-y-10 justify-center p-10 rounded-lg border border-gray-300 items-center bg-white">
        <div className='flex mx-auto w-fit items-center space-x-4'>
          <img src={'/googleForm.png'} className="w-10 h-10"/>
          <h1 className="text-gray-800 font-bold  text-2xl ">GoogleFormClone</h1>
        </div>
        {authTypeToggle === 'register' &&
          <form className="bg-white">    
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd" />
              </svg>
              <input value={formState.email} onChange={handleFormChange} className="pl-2 outline-none border-none" type="text" name="email"  placeholder="Full name" />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input value={formState.name} onChange={handleFormChange} className="pl-2 outline-none border-none" type={'email'} name="name"  placeholder="Email Address" />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd" />
              </svg>
              <input value={formState.password} onChange={handleFormChange} className="pl-2 outline-none border-none" type={'password'} name="password" id="" placeholder="Password" />
            </div>
            <button type="submit" className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Register</button>
            {/* <span className="text-sm ml-2 hover:text-blue-500 cursor-pointer">Forgot Password ?</span> */}
            <div className='text-xs font-mono'>
              Already have account! 
              <Link 
                to="/login"
                className='text-blue-500 font-semibold' 
                // onClick={(event)=>{event.preventDefault(); setAuthTypeToggle('login')}}
                >
                Login
              </Link> 
            </div>
          </form>
        }
        {authTypeToggle === 'login' &&
          <form className="bg-white">
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd" />
              </svg>
              <input value={formState.email} onChange={handleFormChange} className="pl-2 outline-none border-none" type="text" name="email" id="" placeholder="Full name" />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd" />
              </svg>
              <input value={formState.password} onChange={handleFormChange} className="pl-2 outline-none border-none" type={'password'} name="password" id="" placeholder="Password" />
            </div>
            <button type="submit" className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Login</button>
            {/* <span className="text-sm ml-2 hover:text-blue-500 cursor-pointer">Forgot Password ?</span> */}
            <div className='text-xs font-mono'>
              Don't have account! 
              <Link 
                to="/register" 
                className='text-blue-500 font-semibold'
                // onClick={(event)=>{event.preventDefault(); setAuthTypeToggle('register')}}
                >Register
              </Link> 
            </div>
          </form>
        }

        <div className='flex w-full items-center  '>
          <hr className='bg-black w-full h-0.5' />
          <div className='text-xs w-auto font-serif px-2'>OR</div>
          <hr className='bg-black w-full h-0.5' />
        </div>

        <div className='w-full flex flex-col space-y-3'>
          <button
            onClick={()=>login()}
            // disabled={renderProps.disabled} 
            className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100">
            <div className="relative flex items-center space-x-4 justify-center">
              <img src="https://tailus.io/sources/blocks/social/preview/images/google.svg" className="absolute left-0 w-5" alt="google logo" />
              <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">Continue with Google</span>
            </div>
          </button>
          <button 
            onClick={(event)=>{event.preventDefault(); githublogin()}}
            className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300  hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100">
            <div className="relative flex items-center space-x-4 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="absolute left-0 w-5 text-gray-700" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">Continue with Github</span>
            </div>
          </button>
        </div>
      </div>


    </div>
  )
}

export default LoginComponent