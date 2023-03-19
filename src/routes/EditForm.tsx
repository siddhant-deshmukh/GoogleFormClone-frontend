import { useCallback, useEffect, useState } from 'react'

import { IAllFormQuestions, IForm, IUser } from '../types';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Types } from 'mongoose'
import NavBar from '../components/NavBar';
import FormEditor, { ItemType } from '../components/FormEditor';
import FormPreview from '../components/FormPreview';
import Res from '../components/FormEditor/Res';

const defaultAllQuestions: IAllFormQuestions = { "0": { _id: "newId0", formId: undefined, title: 'Untitled Question', 'required': false, ans_type: 'mcq', optionsArray: ['Option 1'], correct_ans: undefined } }

function EditForm({ userInfo }: { userInfo?: IUser }) {

  const { formId } = useParams()
  const [aboutForm, setAboutForm] = useState<{ title: string, desc?: string }>({ title: 'Untitled Form', desc: '' })
  const [queSeq, setQueSeq] = useState<(Types.ObjectId | string)[]>([])
  const [allQuestions, setAllQues] = useState<IAllFormQuestions | null>(null)
  const [queListState, setQueListState] = useState<ItemType[]>([]);

  const [currentState, setCurrentState] = useState<'Edit' | 'Preview' | 'Res'>('Edit')
  const [errMsg, setErrMsg] = useState<string>('')
  const [warnMsg, setWarnMsg] = useState<string>('')
  const [successMsg, setSuccessMsg] = useState<string>('')

  // ------------------------------------------------------------------------------------------------------------------
  // -------                           functions to add and edit questions     ----------------------------------------
  // ------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    console.log("formId", formId)
    if (!formId) {
      setAllQues(defaultAllQuestions)
      setQueListState([{ id: "0" }])
      return
    }
    axios.get(`${import.meta.env.VITE_API_URL}/f/${formId}?withQuestions=true`, { withCredentials: true })
      .then((res) => {
        const { data } = res
        if (data) {
          const formInfo: IForm = data.form
          const allQ: IAllFormQuestions = data.questions
          console.log("Form data", formId, data)

          const allQueList_ = formInfo.questions.map((queKey) => { return { id: queKey.toString() } })
          setQueListState(allQueList_)
          for (let ques in allQ) {
            allQ[ques].savedChanges = true
          }
          setAllQues(allQ)
          setAboutForm({ title: formInfo.title, desc: formInfo.desc })
        }
      })
  }, [formId])

  return (
    <div className="flex flex-col w-screen h-screen bg-purple-100" style={{ minWidth: '352px' }}>
      <div className='w-full bg-white hidden sm:block'>
        <NavBar currentState={currentState} setCurrentState={setCurrentState} userInfo={userInfo} />
      </div>
      {
        errMsg !== '' && <div className='absolute w-full block top-24 z-30'>
          <div className='px-4  top-0 w-full py-1 shadow-md border mb-4 z-30  max-w-md mx-auto flex items-center justify-between bg-red-100 dark:bg-gray-800'>
            <div className="text-sm text-red-800 rounded-lg  dark:text-red-400" role="alert">
              {errMsg}
            </div>
            <button className='p-2 ml-auto ' onClick={(event) => { event.preventDefault(); setErrMsg('') }}>X</button>
          </div>
        </div>
      }
      {
        successMsg !== '' && <div className='absolute w-full block top-24 z-30'>
          <div className='px-4  top-0 w-full py-1 shadow-md border mb-4 z-30  max-w-md mx-auto flex items-center justify-between bg-blue-100 dark:bg-gray-800'>
            <div className="text-sm text-blue-800 rounded-lg  dark:text-blue-400" role="alert">
              {errMsg}
            </div>
            <button className='p-2 ml-auto ' onClick={(event) => { event.preventDefault(); setSuccessMsg('') }}>X</button>
          </div>
        </div>
      }
      <div className='w-full relative  justify-center  h-full overflow-y-auto'>
        <div className='w-full block bg-white sm:hidden'>
          <NavBar />
          <div className='flex space-x-3 mx-auto w-fit h-fit text-sm '>
            <button
              className={`font-medium rounded-full`}
              onClick={(event) => { event.preventDefault(); setCurrentState('Edit') }}
            >Questions
              <div className={`w-full h-1 bg-purple-800 rounded-t-md ${(currentState === 'Edit') ? 'block' : 'hidden'}`}></div>
            </button>
            <button
              className={`font-medium rounded-full`}
              onClick={(event) => { event.preventDefault(); setCurrentState('Res') }}
            >Responses
              <div className={`w-full h-1 bg-purple-800 rounded-t-md ${(currentState === 'Res') ? 'block' : 'hidden'}`}></div>
            </button>
            {/* <button className='font-medium pb-2' >Settings</button> */}
            <button
              className={`font-medium rounded-full`}
              onClick={(event) => { event.preventDefault(); setCurrentState('Preview') }}
            >
              Preview
              <div className={`w-full h-1 bg-purple-800 rounded-t-md ${(currentState === 'Preview') ? 'block' : 'hidden'}`}></div>
            </button>
          </div>
        </div>
        {/* {
          JSON.stringify(queSeq)
        }
        <hr/>
        {
          JSON.stringify(allQuestions)
        }
        <hr/> */}

        <main 
          className={` flex space-x-2 w-full ${(currentState === 'Edit')?'block':'hidden'}`}
          >
          <FormEditor aboutForm={aboutForm} formId={formId} queSeq={queSeq} allQuestions={allQuestions}
            setAboutForm={setAboutForm} setQueSeq={setQueSeq} setAllQues={setAllQues} setErrMsg={setErrMsg}
            queListState={queListState} setQueListState={setQueListState} 
            setSuccessMsg={setSuccessMsg}/>
        </main>
        
        
        <main className={` flex space-x-2 w-full ${(currentState === 'Preview')?'block':'hidden'}`}>
          <FormPreview
            aboutForm={aboutForm} formId={formId} queSeq={queSeq} allQuestions={allQuestions} />
        </main>
        
        {currentState === 'Res' && <main className={`flex space-x-2 w-full`}>
          <Res formId={formId} allQuestions={allQuestions} />
        </main>}
      </div>
    </div>
  )
}



export default EditForm
