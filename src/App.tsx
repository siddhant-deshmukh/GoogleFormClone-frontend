import { useEffect, useState } from 'react'
import $ from 'jquery';
import TitleDescFormElement from './components/TitleDescFormElement';
import QuestionFormElement from './components/QuestionFormElement';
import { FormProvider } from './context/FormContext';
import EditForm from './routes/EditForm';
import { googleLogout, GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';


function App() {
  const [googleLoginState,setGoogleLoginState] = useState<any>(null)
  const [msg,setMsg] = useState(null)
  const login = useGoogleLogin({
    onSuccess : (res)=> {console.log("Sucessfully login!"); setGoogleLoginState(res)},
    onError : (err) => {console.error("While login",err)}
  })
  useEffect(()=>{
    if(googleLoginState){
      fetch('https://google-clone-server-01.azurewebsites.net/',{method:'GET',mode: 'no-cors'})
        .then((res)=>res.json())
        .then((data)=>{console.log("Data from that link!!!",data), setMsg(data)})
    }
  },[googleLoginState])                                                          
  return (
    <>
    
      <FormProvider>
        <EditForm />
      </FormProvider> 
      {/* <GoogleLogin  onError={()=>{console.error("Error in google login")}}/> */}
      {
        !googleLoginState &&
        <button onClick={()=>{login()}}>Google Login</button>
      }
      {
        googleLoginState &&
        <button onClick={()=>{googleLogout(); setGoogleLoginState(null)}}>Logout</button>
      }
      {
        googleLoginState &&
        <div>{JSON.stringify(googleLoginState)}</div>
      }
      {
        msg &&
        <div>msg -- : <hr/><hr/>{JSON.stringify(msg)}</div>
      }
    
    </>
  )
}



export default App
