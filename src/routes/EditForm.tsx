import { useCallback, useEffect, useState } from 'react'

import { IAllFormQuestions, IForm} from '../types';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Types } from 'mongoose'
import NavBar from '../components/NavBar';
import FormEditor from '../components/FormEditor/FormEditor';
import FormPreview from '../components/FormEditor/FormPreview';

const defaultAllQuestions: IAllFormQuestions = { "0": { _id: "newId0", formId: undefined, title: 'Untitled Question', 'required': false, ans_type: 'mcq', optionsArray: ['Option 1'], correct_ans: undefined } }

function EditForm() {

  const { formId } = useParams()
  const [aboutForm,setAboutForm] = useState<{title:string,desc?:string}>({title:'',desc:''})
  const [queSeq, setQueSeq] = useState<(Types.ObjectId | string)[]>([])
  const [allQuestions, setAllQues] = useState<IAllFormQuestions | null>(null)
  const [currentState, setCurrentState] = useState<'Edit'|'Preview'>('Edit')

  // ------------------------------------------------------------------------------------------------------------------
  // -------                           functions to add and edit questions     ----------------------------------------
  // ------------------------------------------------------------------------------------------------------------------
  
  useEffect(() => {
    console.log("formId", formId)
    if (!formId) {
      setAllQues(defaultAllQuestions)
      setQueSeq(["0"])
      return
    }
    axios.get(`${import.meta.env.VITE_API_URL}/f/${formId}?withQuestions=true`, { withCredentials: true })
      .then((res) => {
        const { data } = res
        if (data) {
          const formInfo: IForm = data.form
          const allQ: IAllFormQuestions = data.questions
          console.log("Form data", formId, data)
          setQueSeq(formInfo.questions)
          for (let ques in allQ) {
            allQ[ques].savedChanges = true
          }
          setAllQues(allQ)
          setAboutForm({title:formInfo.title,desc:formInfo.desc})
        }
      })
  }, [formId])

  return (
    <div className="flex flex-col w-screen h-screen bg-purple-100" style={{ minWidth: '352px' }}>
      <div className='w-full bg-white hidden sm:block'>
        <NavBar />
        <div className='flex  space-x-5 mx-auto w-fit h-fit text-xs'>
          <button 
            className='font-medium pb-2' 
            onClick={(event)=>{event.preventDefault(); setCurrentState('Edit')}}
            >Questions</button>
          <button className='font-medium pb-2' >Responses</button>
          <button className='font-medium pb-2' >Settings</button>
          <button 
            onClick={(event)=>{event.preventDefault(); setCurrentState('Preview')}}
            className='font-medium pb-2 flex items-center space-x-2' >
            Preview
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
      <div className='w-full relative  justify-center  h-full overflow-y-auto'>
        <div className='w-full block sm:hidden'>
          <NavBar />
          <div className='flex space-x-3 mx-auto w-fit h-fit text-sm'>
            <div className='font-medium' >Questions</div>
            <div className='font-medium' >Responses</div>
            <div className='font-medium' >Settings</div>
          </div>
        </div>
        <main className={`${(currentState!=='Edit')?'hidden':''} flex space-x-2 w-full`}>
          <FormEditor aboutForm={aboutForm} formId={formId } queSeq={queSeq} allQuestions={allQuestions} 
            setAboutForm={setAboutForm} setQueSeq={setQueSeq} setAllQues={setAllQues} />
        </main>
        <main className={`${(currentState!=='Preview')?'hidden':''} flex space-x-2 w-full`}>
          <FormPreview  
            aboutForm={aboutForm} formId={formId} queSeq={queSeq} allQuestions={allQuestions} />
        </main>

      </div>
    </div>
  )
}



export default EditForm
