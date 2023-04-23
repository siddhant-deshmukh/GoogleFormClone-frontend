import React, { useEffect,  useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { Link, useLocation } from 'react-router-dom'

// --------------------------------------------------    4 components    ----------------------------------------------------
//                                               
//                         1.AuthPage
//                         2.Register  3.Login   4.AppDemo  


const AuthPage = ({ authTypeToggle }: { authTypeToggle: 'login' | 'register' }) => {
  // const [authTypeToggle, setAuthTypeToggle] = useState<'login' | 'register'>('login')
  const location = useLocation();
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [warnMsg, setWarnMsg] = useState<string | null>('Password authentication is under improvement.\n Try other way!')

  
  const googleLogin = useGoogleLogin({
    onSuccess: (auth_res) => {
      const { code } = auth_res
      console.log("Sucessfully!", auth_res, code)
      fetch(`${import.meta.env.VITE_API_URL}/login-google`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      }).then((res) => {
        if (res.status !== 201) {
          throw 'Some error occured!'
        }else{
          return res.json()
        }
      })
      // .catch((err) => {
        //   setErrMsg('Google Authentication Failed! ' + JSON.stringify(err))
        //   alert('Google Login failed!  ')
        //   console.error("Error after onSucess callback ", err)
        // })
        .then((data) => {
          console.log('Here is the data', data)
          window.location.href = `${import.meta.env.BASE_URL}?redirect=google`
          //window.location.href = `${import.meta.env.BASE_URL}?redirect=google`
        })
        .catch((err) => {
          // alert('Google login failed!  '+ err)

          setErrMsg('Google Authentication Failed!')

          console.error("Error after onSucess callback ", err)
        })
    },
    onError: (res) => {
      console.error("error while login", res)
      alert('Google Login failed!  ')
      setErrMsg('Google Authentication Failed!')
    },
    flow: 'auth-code',
    redirect_uri: `${import.meta.env.BASE_URL.slice(0, -1)}?redirect=google`
  });
  const githublogin = () => {
    const rootURl = 'https://github.com/login/oauth/authorize';

    const options = {
      client_id: import.meta.env.VITE_Github_ClientId as string,
      redirect_uri: `${import.meta.env.BASE_URL}/login-github`,// `${import.meta.env.BASE_URL}/login-github`,
      scope: 'user:email',
      state: ((location.state as any)?.from?.pathname as string) || '/',
    };

    const qs = new URLSearchParams(options);

    window.location.href = `${rootURl}?${qs.toString()}`
  }

  //    to show error when app is offline
  useEffect(() => {
    const offlineEventListner = (e: any) => {
      setErrMsg('No Internet Connection!')
      console.warn('offline', e)
    }
    const onlineEventListner = (e: any) => {
      if (errMsg == 'No Internet Connection!') setErrMsg(null)
      console.log('online', e, errMsg, errMsg === 'No Internet Connection!')
    }
    window.addEventListener('offline', offlineEventListner)
    window.addEventListener('online', onlineEventListner)
    return () => {
      window.removeEventListener('offline', offlineEventListner)
      window.removeEventListener('online', onlineEventListner)
    }
  }, [])

  return (
    <div className="flex flex-col sm:flex-row w-auto">

      <AppDemo />

      <div className="flex flex-col space-y-2  justify-center p-10 rounded-lg border border-gray-300 items-center bg-white">
        <div className='flex mb-5 mx-auto w-fit items-center space-x-2'>
          <img src={'/google-form.svg'} className="w-16 h-16" />
          <h1 className="text-gray-800 font-bold  text-2xl ">GoogleFormClone</h1>
        </div>
        {
          errMsg && <div className='p-4 mb-4 w-72 flex items-center justify-between bg-red-50 dark:bg-gray-800'>
            <div className="text-sm text-red-800 rounded-lg  dark:text-red-400" role="alert">
              {errMsg}
            </div>
            <button className='p-1 ml-auto ' onClick={(event) => { event.preventDefault(); setErrMsg(null) }}>X</button>
          </div>
        }
        {
          warnMsg && <div className='p-4 mb-4 w-72 flex items-center justify-between bg-yellow-50 dark:bg-gray-800'>
            <div className="  text-sm text-yellow-800 rounded-lg  dark:text-yellow-300" role="alert">
              {warnMsg}
            </div>
            <button className='p-1 ml-auto' onClick={(event) => { event.preventDefault(); setWarnMsg(null) }}>X</button>
          </div>
        }
        
        {authTypeToggle === 'register' &&
          <Register setWarnMsg={setWarnMsg}/>
        }
        {authTypeToggle === 'login' &&
          <Login setWarnMsg={setWarnMsg}/>
        }

        <div className='flex w-full items-center pt-8 pb-5'>
          <hr className='bg-black w-full h-0.5' />
          <div className='text-xs w-auto font-serif px-2'>OR</div>
          <hr className='bg-black w-full h-0.5' />
        </div>

        <div className='w-full flex flex-col space-y-3'>
          <button
            onClick={() => googleLogin()}
            // disabled={renderProps.disabled} 
            className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100">
            <div className="relative flex items-center space-x-4 justify-center">
              <img src="https://tailus.io/sources/blocks/social/preview/images/google.svg" className="absolute left-0 w-5" alt="google logo" />
              <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">Continue with Google</span>
            </div>
          </button>
          <button
            onClick={(event) => { event.preventDefault(); githublogin() }}
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
function Register({setWarnMsg}:{setWarnMsg: React.Dispatch<React.SetStateAction<string | null>>}) {
  const [formState, setFormState] = useState<{ email: string,name:string, password: string }>({ email: '',name:'', password: '' })
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setFormState((prev) => {
      return { ...prev, [event.target.name]: event.target.value }
    })
  }
  const passwordRegister = (email: string, password: string, fullname: string) => {

  }
  return (
    <form className="bg-white">
      <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
          fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd" />
        </svg>
        <input value={formState.email} onChange={handleFormChange} className="pl-2 outline-none border-none" type="text" name="email" placeholder="Full name" />
      </div>
      <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
        <input value={formState.name} onChange={handleFormChange} className="pl-2 outline-none border-none" type={'email'} name="name" placeholder="Email Address" />
      </div>
      <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
          fill="currentColor">
          <path fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd" />
        </svg>
        <input value={formState.password} onChange={handleFormChange} className="pl-2 outline-none border-none" type={'password'} name="password" id="password" placeholder="Password" />
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
  )
}
function Login({setWarnMsg}:{setWarnMsg: React.Dispatch<React.SetStateAction<string | null>>}) {
  const [formState, setFormState] = useState<{ email: string, password: string }>({ email: '', password: '' })
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setFormState((prev) => {
      return { ...prev, [event.target.name]: event.target.value }
    })
  }
  const passwordLogin = (email: string, password: string) => {
    if (!email || !password || email === "" || password === "") {

    }
  }
  return <form className="bg-white">
    <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
        fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd" />
      </svg>
      <input value={formState.email} onChange={handleFormChange} className="pl-2 outline-none border-none" type="text" name="email" id="email" placeholder="Full name" />
    </div>
    <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
        fill="currentColor">
        <path fillRule="evenodd"
          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
          clipRule="evenodd" />
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
function AppDemo() {
  return <div
    className="relative overflow-hidden w-full h-52 flex sm:w-1/2 sm:h-auto  bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center ">
    <div className='pl-2 z-10'>
      <h1 className="text-white  font-bold text-4xl font-sans">Just want to try!</h1>
      <p className="text-white  mt-1">click to see demo!</p>
      <Link to={'/demo'} className="block w-fit  px-4  bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2">Demo</Link>
    </div>
    <div className="absolute   -bottom-32 opacity-50 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
    <div className="absolute  -bottom-40 opacity-50 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
    <div className="absolute  -top-40 opacity-50 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
    <div className="absolute  -top-20 opacity-50 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
  </div>
}

export default AuthPage