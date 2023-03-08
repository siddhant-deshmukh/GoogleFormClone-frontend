import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

const GithubLandingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      setErrorMsg('Invalid Code')
      return;
    }
    axios.get(`${import.meta.env.VITE_API_URL}/login-github?code=${code}`, { withCredentials: true })
      .then((value) => {
        console.log("Response from login github", value)
        window.location.href = `${import.meta.env.BASE_URL}`
      })
      .catch((err) => {
        setErrorMsg(JSON.stringify(err))
        console.log(err)
      })
  }, [])
  return (
    <div className='fixed top-0 left-0 w-screen h-screen flex items-center'>
      <div role="status" className="w-fit mx-auto">
        {!errorMsg &&
          <>
            <div className='flex flex-col'>
              <img src={'/google-form.svg'} className='w-32 h-40 mx-auto' />
              <h1 className='mx-auto w-fit font-bold text-2xl text-purple-400'>Login using GitHub</h1>
              <h3 className='mx-auto w-fit text-gray-500 mt-10 text-sm'>Loading</h3>
            </div>
          </>
        }
        {
          errorMsg &&

          <div className='p-10 text-center rounded-lg bg-red-50 text-black'>
            <div className=' text-center'>Login failed!</div>
            <div className=' text-center underline'><Link to='/login'>Go back to login page! </Link></div>
          </div>
        }
      </div>
    </div>
  )
}

export default GithubLandingPage