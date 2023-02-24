import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormCard from '../components/FormCard'
import NavBar from '../components/NavBar'
import { IFormSnippet, IUser } from '../types'

export const Home = ({ userInfo,setUserInfo  }: { userInfo: IUser,setUserInfo: React.Dispatch<React.SetStateAction<IUser | null>> }) => {
  const [warnMsg,setWarnMsg] = useState<string | undefined>(undefined)
  const navigate = useNavigate()

  const createNewForm = useCallback(()=>{
    if(userInfo.forms.length >= 10){
      setWarnMsg('User not create more than 10 forms')
      return 
    }
    axios.post(`${import.meta.env.VITE_API_URL}/f/`,{
      title:'Untitled Form',
      "questions":[
        {
          "required":false,
          "title":"Question title",
          "ans_type":"mcq",
          "options":["Option 1"],
        }
      ]
    },{
      withCredentials:true
    }).then((value)=>{
      const {data} = value
      if(data.formId){
        setUserInfo((prev)=>{
          if(!prev) return null
          return {
            ...prev,
            forms : [data.formId,...prev?.forms ]
          }
        })
      }
      navigate(`/form/${data.formId}/edit`)
      console.log(value)
    }).catch((err)=>{
      setWarnMsg('Some error occured while creating form!')
    })
  },[userInfo])

  const [formsInfo,setFormsInfo] = useState<(IFormSnippet | null)[]>([])
  const getFormsInfo = useCallback(async ()=>{
    const promiseInfo = userInfo.forms.map(async (formId)=>{
      const formdata = await axios.get(`${import.meta.env.VITE_API_URL}/f/${formId}`,{withCredentials:true})
      const {data} = formdata
      if(data){
        return data.form as IFormSnippet
      }
      return null 
    })

    const allForms = await Promise.all(promiseInfo)
    console.log(allForms)

    setFormsInfo(allForms)

  },[userInfo,setUserInfo])
  useEffect(()=>{
    getFormsInfo()
  },[])

  return (
    <div className='fixed w-screen h-screen left-0 top-0'>
      <NavBar userInfo={userInfo} />
      <main className='w-full'>
        <div className='w-full bg-gray-100 py-2  px-5 flex'>
          <div className='mx-auto w-full xl:w-4/6'>
            <p className='mb-2 ml-1 font-sans'>Create new form</p>
            <button 
              className='w-44 h-36 border border-gray-300 overflow-hidden'
              onClick={(event)=>{event.preventDefault(); createNewForm()}}>
              <img className='w-full h-full' src="https://ssl.gstatic.com/docs/templates/thumbnails/forms-blank-googlecolors.png" alt="+" />
            </button>
            <p className='my-0.5 ml-1 text-sm'>Blank</p>
          </div>
        </div>
        <div className='mx-auto w-full py-3 bg-white xl:w-4/6'>
          <div className={`${(warnMsg)?'flex':'hidden'} justify-between p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300`} role="alert">
            <span>{warnMsg}</span>
            <button onClick={(event)=>{event.preventDefault(); setWarnMsg(undefined)}} className="px-2 ">X</button>
          </div>
          <h3 className='font-medium'>Your Forms</h3>
          <div className='w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4'>
            { 
              formsInfo.map((formInfo)=>{
                if(formInfo){
                  return (
                    <FormCard key={formInfo?._id.toString()} formInfo={formInfo}/>
                  );
                }
              })
            }
          </div>

        </div>
      </main>
    </div>
  )
}
