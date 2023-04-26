import { Reducer, ReducerAction, RefObject, useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { IUser } from '../types';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import FormEditor from '../components/FormEditor/index';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setErrMsg, setSucessMsg } from '../features/msgs/msgSlice';
import FormPreview from '../components/FormPreview';
import Res from '../components/FormEditor/response/Res';


function EditForm({ userInfo }: { userInfo?: IUser }) {

  const { formId } = useParams()

  const allQuestions = useAppSelector((state)=> state.form.allQuestions)
  const selectedKey = useAppSelector((state)=> state.form.selectedKey)

  const errMsg = useAppSelector((state)=> state.msgs.errMsg)
  const sucessMsg = useAppSelector((state)=> state.msgs.sucessMsg)
  

  const [currentState, setCurrentState] = useState<'Edit' | 'Preview' | 'Res'>('Edit')  
  const selectQuestionRef = useRef<HTMLDivElement | null>(null)
  const dispatch = useAppDispatch()

  // ------------------------------------------------------------------------------------------------------------------
  // -------                           functions to add and edit questions     ----------------------------------------
  // ------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    
  }, [formId])


  useEffect(() => {
    let timeoutID: NodeJS.Timeout | null = null;
    function EventFun(event: Event) {
      // console.log("The div is scrolled",event.target.scrollTop);
      if (timeoutID) clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        let curr_pos = selectQuestionRef.current?.offsetTop    // document.documentElement.style.getPropertyValue("--side-btn-height")
        //@ts-ignore
        let window_pos = event.target.scrollTop
        //@ts-ignore
        let view_window_height = event.target.offsetHeight

        if(curr_pos){
          if(curr_pos < window_pos + 30){
            document.documentElement.style.setProperty("--side-btn-height",(window_pos + 30).toString()+"px")
            // console.log('\nset 1',     (window_pos + 30).toString()+"px",'\n')
          }else if(curr_pos > window_pos + view_window_height - 200 ){
            document.documentElement.style.setProperty("--side-btn-height",(window_pos + view_window_height - 200).toString()+"px")
            // console.log('\nset 2',    (window_pos + view_window_height - 200).toString()+"px" ,'\n')
          }else{
            document.documentElement.style.setProperty("--side-btn-height",(curr_pos).toString()+"px")
            // console.log('\nset 3',     (curr_pos).toString()+"px"  ,'\n')
          }
        } else {
          document.documentElement.style.setProperty("--side-btn-height", (window_pos + 30).toString() + "px")
        }
        // console.log('curr_pos',curr_pos, '\nwindow_pos' ,window_pos, '\nview_window_height : ',view_window_height,'\n',  document.documentElement.style.getPropertyValue("--side-btn-height"))
        
        // if(curr_pos)
      }, 100);
    }

    const scrollableDiv = document.querySelector("#scrolling-paper");
    scrollableDiv?.addEventListener("scroll", EventFun);

    return () => {
      scrollableDiv?.removeEventListener('scroll', EventFun)
    }
  },[])
  
  return (
    <div className="flex  flex-col w-screen h-screen bg-purple-100 overflow-hidden" style={{ minWidth: '352px' }}>
      <div className='fixed top-0 left-0 z-20 w-full bg-white hidden sm:block'>
        <NavBar currentState={currentState} setCurrentState={setCurrentState} userInfo={userInfo} />
      </div>

      {
         errMsg !== '' && <div className='absolute w-full block top-24 z-30'>
          <div className='px-4  top-0 w-full py-1 shadow-md border mb-4 z-30  max-w-md mx-auto flex items-center justify-between bg-red-100 dark:bg-gray-800'>
            <div className="text-sm text-red-800 rounded-lg  dark:text-red-400" role="alert">
              {errMsg}
            </div>
            <button className='p-2 ml-auto ' onClick={(event) => { event.preventDefault(); dispatch(setErrMsg('')) }}>X</button>
          </div>
        </div>
      }
      {
        sucessMsg !== '' && <div className='absolute w-full block top-24 z-30'>
          <div className='px-4  top-0 w-full py-1 shadow-md border mb-4 z-30  max-w-md mx-auto flex items-center justify-between bg-blue-100 dark:bg-gray-800'>
            <div className="text-sm text-blue-800 rounded-lg  dark:text-blue-400" role="alert">
              {sucessMsg}
            </div>
            <button className='p-2 ml-auto ' onClick={(event) => { event.preventDefault(); dispatch(setSucessMsg('')) }}>X</button>
          </div>
        </div>
      }

      <div 
        id="scrolling-paper"
        className='w-full relative pt-24 sm:pt-20 justify-center  h-full overflow-y-auto'
        >
          
        <div className='fixed top-0 left-0 z-20 w-full block bg-white sm:hidden'>
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
        {
          !allQuestions &&
          <div className="flex mx-auto w-full max-w-3xl items-center justify-center h-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <div role="status">
              <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        }
        {
          allQuestions &&
          <main
            className={` flex space-x-2  w-full  ${(currentState === 'Edit') ? 'block' : 'hidden'}`}
          >
            <FormEditor formId={formId} selectQuestionRef={selectQuestionRef}/>
          </main>
        }


        {
          currentState === 'Preview' && <main className={` flex space-x-2 w-full ${(currentState === 'Preview') ? 'block' : 'hidden'}`}>
            <FormPreview formId={formId}  />
          </main>
        }

        {currentState === 'Res' && <main className={`flex space-x-2 w-full`}>
          <Res formId={formId}  />
        </main>
        }
      </div>
    </div>
  )
}


export default EditForm
