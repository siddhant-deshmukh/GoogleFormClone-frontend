import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setAboutForm } from '../../features/form/formSlice'

const FormTitleDesc = ({readOnly}:{readOnly?: boolean}) => {

  const aboutForm = useAppSelector((state)=> state.form.aboutForm)
  const dispatch = useAppDispatch()

  const [titleErr, setTitleErr] = useState<boolean>(aboutForm.title.length > 150 || aboutForm.title.length < 3)
  return (
    <div className='flex flex-col space-y-3 w-full  pt-2 pb-4 px-3 bg-white border-t-8 border-t-purple-800 rounded-lg '>
      {
        titleErr &&
        <div className='flex text-xs text-red-800 items-center pt-1'>
          <svg aria-hidden="true" className="flex-shrink-0 inline w-3  h-3 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
          <div>
            Form Title length should be between 3 to 150
          </div>
        </div>
      }
      <input
        className='text-2xl border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 py-1 '
        style={{ fontWeight: '500px' }}
        value={aboutForm?.title || ''}
        placeholder='Untitle Form'
        disabled={(readOnly)?true:false}
        onChange={(event) => {
          event.preventDefault();
          // console.log(event.target.value.length,event.target.value.length > 3 || event.target.value.length <10)
          if(event.target.value.length >= 3 && event.target.value.length <150) setTitleErr(false)
          else setTitleErr(true)
          dispatch(setAboutForm({title : event.target.value}))
        }}
      />
      <input
        onFocus={(event) => { event.target.select() }}
        value={aboutForm?.desc || ''}
        disabled={(readOnly)?true:false}
        placeholder='Form Description'
        className='text-xs border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 py-1 '
        onChange={(event) => { 
          event.preventDefault(); 
          if(event.target.value.length >150) return
          dispatch(setAboutForm({desc : event.target.value}))
        }}
      />
    </div>
  )
}

export default FormTitleDesc