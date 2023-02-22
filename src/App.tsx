import { useCallback, useContext, useEffect, useState } from 'react'
import $ from 'jquery';
import TitleDescFormElement from './components/TitleDescFormElement';
import QuestionFormElement from './components/QuestionFormElement';
import EditForm from './routes/EditForm';
import { googleLogout, GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import LoginComponent from './components/AuthComponents';
import { IUser } from './types';
import { Route, Routes, useNavigate } from 'react-router-dom';
import GithubLandingPage from './routes/GithubLandingPage';
import { Home } from './routes/Home';

function App() {

  const [initialPageLoading, setInitialPageLoading] = useState<boolean>(true)
  const [userInfo, setUserInfo] = useState<IUser | null>(null)
  
  const refreshUserInfo = useCallback(()=>{
    fetch(import.meta.env.VITE_API_URL, {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .catch(err => console.error('While getting client', err))
      .finally(() => {setUserInfo(null); setInitialPageLoading(false); console.log("Meow") })
      .then(data => {setUserInfo(data?.user); console.log({data},data.user);})
      .catch(err => {console.error('Modifying data', err); setUserInfo(null);})
      .finally(() => { setInitialPageLoading(false); console.log("Meow")})
  },[userInfo,setUserInfo])

  useEffect(() => {
    console.log("Here in useEffect")
    refreshUserInfo()
  }, [setUserInfo])

  if(initialPageLoading){
    return (
      <div className='fixed w-screen h-screen left-0 top-0 flex items-center'>
        <div className='mx-auto text-8xl font-extrabold'>
          Loading ........
        </div>
      </div>
    )
  }else{
    if(!userInfo){
      return (
        <div className='fixed w-screen h-screen left-0 top-0 flex items-center'>
          <div className='mx-auto'>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GoogleClientId}>
              <Routes>
                <Route path="/" element={<LoginComponent authTypeToggle={'login'}/>} />
                <Route path="/login" element={<LoginComponent authTypeToggle={'login'}/>} />
                <Route path="/register" element={<LoginComponent authTypeToggle={'register'}/>} />
                <Route path="/demo" element={<EditForm/>} />
                <Route path="/login-github" element={<GithubLandingPage />} />
              </Routes>
            </GoogleOAuthProvider>
          </div>
        </div>
      )
    }else{
      return (
        <Routes>
          <Route path="/" element={<Home userInfo={userInfo} setUserInfo={setUserInfo}/>} />
          <Route path="/demo" element={<EditForm/>} />
          <Route path="/form/:formId/edit" element={<EditForm/>} />
          <Route path="/form/:formId/preview" element={<EditForm/>} />
          <Route path="*" element={<Home userInfo={userInfo} setUserInfo={setUserInfo}/>} />
        </Routes>
      )
    }
  }
  
}

// function App() {
//   const [googleLoginState,setGoogleLoginState] = useState<any>(null)
//   const [msg,setMsg] = useState(null)
//   const login = useGoogleLogin({
//     onSuccess : (res)=> {console.log("Sucessfully login!"); setGoogleLoginState(res)},
//     onError : (err) => {console.error("While login",err)}
//   })
//   useEffect(()=>{
//     if(googleLoginState){
//       fetch('https://google-clone-server-01.azurewebsites.net/',{
//         method:'GET',
//         credentials: 'include'
//       }).then((response) => {console.log('response',response) ;return response.json()})
//         .catch(err=>{
//           console.log("SOme error has occured!!",err)
//         })
//         .then((data) => console.log(data))
//         .catch(err=>{
//           console.log("SOme error has occured!! while data!",err)
//         });
//     }
//   },[googleLoginState])                                                          
//   return (
//     <>
    
//       <FormProvider>
//         <EditForm />
//       </FormProvider> 
//       {/* <GoogleLogin  onError={()=>{console.error("Error in google login")}}/> */}
//       {
//         !googleLoginState &&
//         <button onClick={()=>{login()}}>Google Login</button>
//       }
//       {
//         googleLoginState &&
//         <button onClick={()=>{googleLogout(); setGoogleLoginState(null)}}>Logout</button>
//       }
//       {
//         googleLoginState &&
//         <div>{JSON.stringify(googleLoginState)}</div>
//       }
//       {
//         msg &&
//         <div>msg -- : <hr/><hr/>{JSON.stringify(msg)}</div>
//       }
    
//     </>
//   )
// }



export default App
