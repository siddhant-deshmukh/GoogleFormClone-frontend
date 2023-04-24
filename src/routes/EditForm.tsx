import { Reducer, ReducerAction, RefObject, useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { IAllFormQuestions, IForm, IUser, IQuestionForm, IEditFormState, EdtiFormAction } from '../types';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Types } from 'mongoose'
import NavBar from '../components/NavBar';
import FormEditor, { ItemType } from '../components/FormEditor';
import FormPreview from '../components/FormPreview';
import Res from '../components/FormEditor/Res';

const defaultAllQuestions: IAllFormQuestions = { "0": { _id: "newId0", formId: undefined, title: 'Untitled Question', 'required': false, ans_type: 'mcq', optionsArray: ['Option 1'], correct_ans: undefined } }

const initialState : IEditFormState = {
  formId: undefined,
  selectedKey: null,
  aboutForm: {title: 'Untitled Form',desc: ''},

  queSeq : [],
  allQuestions : null,
  queListState : [],

  errMsg: '',
  warnMsg:'',
  successMsg:'',
}

function EditForm({ userInfo }: { userInfo?: IUser }) {

  const { formId } = useParams()
<<<<<<< HEAD
=======
  const [aboutForm, setAboutForm] = useState<{ title: string, desc?: string }>({ title: 'Untitled Form', desc: '' })
  const [queSeq, setQueSeq] = useState<(Types.ObjectId | string)[]>([])
  const [allQuestions, setAllQues] = useState<IAllFormQuestions | null>(null)
  const [queListState, setQueListState] = useState<ItemType[]>([]);

  const [currentState, setCurrentState] = useState<'Edit' | 'Preview' | 'Res'>('Edit')

  const [errMsg, setErrMsg] = useState<string>('')
  const [warnMsg, setWarnMsg] = useState<string>('')
  const [successMsg, setSuccessMsg] = useState<string>('')

>>>>>>> 1d6fc18 (okay os it is not functional but i think next their will)
  const selectQuestionRef = useRef<HTMLDivElement | null>(null)
  
  const [editFormState, dispatch] = useReducer(reducer_editform, {...initialState, formId})
  const [currentState, setCurrentState] = useState<'Edit' | 'Preview' | 'Res'>('Edit')

  // ------------------------------------------------------------------------------------------------------------------
  // -------                           functions to add and edit questions     ----------------------------------------
  // ------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    // console.log("formId", formId)
    if (!formId) {
      // setAllQues(defaultAllQuestions)
      // setQueListState([{ id: "0" }])
      // dispatch({type:'addQuestion',payload:{
      //   newQuestion : 
      // }})
      dispatch({type : 'setAllQues',payload:{allQuestions : defaultAllQuestions}})
      dispatch({type : 'setQuesList',payload:{queListState : [{id:"0"}]}})

      return
    }
    axios.get(`${import.meta.env.VITE_API_URL}/f/${formId}?withQuestions=true`, { withCredentials: true })
      .then((res) => {
        const { data } = res
        if (data) {
          const formInfo: IForm = data.form
          const allQ: IAllFormQuestions = data.questions
          // console.log("Form data", formId, data)

          const allQueList_ = formInfo.questions.map((queKey) => { return { id: queKey.toString() } })
          
          dispatch({type : 'setQuesList',payload:{queListState : allQueList_}})
          
          for (let ques in allQ) {
            allQ[ques].savedChanges = true
          }
          dispatch({type : 'setAllQues',payload:{allQuestions : allQ}})
          dispatch({type : 'editFormInfo',payload:{ title: formInfo.title, desc: formInfo.desc}})
        }
      }).catch((err) => {
        //@ts-ignore
        let { msg } = err.response?.data
        // console.log(msg)
        dispatch({type : 'editMsg',payload:{ type :'error',msg : msg || "Some error occured while getting questions and form!" }})
      })
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

        if (curr_pos) {
          if (curr_pos < window_pos + 30) {
            document.documentElement.style.setProperty("--side-btn-height", (window_pos + 30).toString() + "px")
            // console.log('\nset 1',     (window_pos + 30).toString()+"px",'\n')
          } else if (curr_pos > window_pos + view_window_height - 200) {
            document.documentElement.style.setProperty("--side-btn-height", (window_pos + view_window_height - 200).toString() + "px")
            // console.log('\nset 2',    (window_pos + view_window_height - 200).toString()+"px" ,'\n')
          } else {
            document.documentElement.style.setProperty("--side-btn-height", (curr_pos).toString() + "px")
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
<<<<<<< HEAD
  }, [])

=======
  },[])
  
>>>>>>> 1d6fc18 (okay os it is not functional but i think next their will)
  return (
    <div className="flex  flex-col w-screen h-screen bg-purple-100 overflow-hidden" style={{ minWidth: '352px' }}>
      <div className='fixed top-0 left-0 z-20 w-full bg-white hidden sm:block'>
        <NavBar currentState={currentState} setCurrentState={setCurrentState} userInfo={userInfo} />
      </div>

      {
        editFormState.errMsg !== '' && <div className='absolute w-full block top-24 z-30'>
          <div className='px-4  top-0 w-full py-1 shadow-md border mb-4 z-30  max-w-md mx-auto flex items-center justify-between bg-red-100 dark:bg-gray-800'>
            <div className="text-sm text-red-800 rounded-lg  dark:text-red-400" role="alert">
              {editFormState.errMsg}
            </div>
            <button 
              className='p-2 ml-auto ' 
              onClick={(event) => { 
                event.preventDefault(); 
                dispatch({type:'editMsg',payload:{type : 'error',msg:''}}) 
              }}>X</button>
          </div>
        </div>
      }
      {
        editFormState.successMsg !== '' && <div className='absolute w-full block top-24 z-30'>
          <div className='px-4  top-0 w-full py-1 shadow-md border mb-4 z-30  max-w-md mx-auto flex items-center justify-between bg-blue-100 dark:bg-gray-800'>
            <div className="text-sm text-blue-800 rounded-lg  dark:text-blue-400" role="alert">
              {editFormState.successMsg}
            </div>
            <button 
              className='p-2 ml-auto ' 
              onClick={(event) => { 
                event.preventDefault(); 
                dispatch({type:'editMsg',payload:{type : 'sucess',msg:''}}) 
                }}>
              X
            </button>
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
          !editFormState.allQuestions &&
          <div className="flex mx-auto w-full max-w-3xl items-center justify-center h-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <div role="status">
              <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        }
        {
          editFormState.allQuestions &&
          <main
            className={` flex space-x-2  w-full  ${(currentState === 'Edit') ? 'block' : 'hidden'}`}
          >
            <FormEditor formId={formId} editFormState={editFormState} dispatch={dispatch} selectQuestionRef={selectQuestionRef} />
          </main>
        }


        {
          currentState === 'Preview' && <main className={` flex space-x-2 w-full ${(currentState === 'Preview') ? 'block' : 'hidden'}`}>
            <FormPreview
              aboutForm={editFormState.aboutForm} formId={formId} queSeq={editFormState.queSeq} allQuestions={editFormState.allQuestions} />
          </main>
        }

        {currentState === 'Res' && <main className={`flex space-x-2 w-full`}>
          <Res formId={formId} allQuestions={editFormState.allQuestions} />
        </main>}
      </div>
    </div>
  )
}



function reducer_editform(state: IEditFormState, action: EdtiFormAction) {
  switch (action.type) {
    case ('saveForm'): {
      const { queSeq, aboutForm, allQuestions } = action.payload
      return state
    }
    case ('editFormInfo'): {
      const { title, desc } = action.payload
      if (title === "" || !title || title.length < 3) {
        throw 'Improper title'
      }
      return { ...state, aboutForm: { title, desc } }
    }
    case ('addQuestion'): {
      const { after, newQuestion } = action.payload

      if (state.queSeq && state.queSeq.length >= 20) {
        throw 'Question number should not exceed 20'
      }
      const uniqueId = 'newId' + (new Date()).getTime();

      // console.log(uniqueId)

      let allQuestions_ = {}
      if (newQuestion) {
        allQuestions_ = {
          ...state.allQuestions,
          [uniqueId]: {
            ...newQuestion,
            _id: uniqueId
          }
        }
      } else {
        allQuestions_ = {
          ...state.allQuestions,
          [uniqueId]: {
            ...defaultAllQuestions["0"],
            _id: uniqueId
          }
        }
      }

      let queListState_ = state.queListState
      if (after) {
        let x = queListState_.findIndex((key) => (key.id === after))
        if (x !== -1) {
          queListState_ = queListState_.slice(0, x + 1).concat([{ id: uniqueId }, ...queListState_.slice(x + 1)])
        }
      }
      queListState_ = state.queListState.slice().concat([{ id: uniqueId }])

      return { ...state, selectedKey: uniqueId, queListState: queListState_, allQuestions: allQuestions_ }
    }
    case ('changeQueState'): {
      const { queKey, newQuestion } = action.payload

      return state
    }
    case ('deleteQuestion'): {
      const { delKey } = action.payload
      if (!delKey) {
        throw 'nothing to delete'
      }

      let x: number | null = state.queListState.findIndex((key) => (key.id === delKey))
      if ((state.queListState[x - 1] && state.queListState[x - 1].id)) {
        x = x - 1
      } else if (state.queListState[x + 1] && state.queListState[x + 1].id) {
        x = x + 1
      } else {
        x = null
      }
      // console.log('After delteing',queListState[x].id.toString())
      let selectedKey_ = state.selectedKey
      if (selectedKey_ === delKey.toString()) {
        selectedKey_ = (x) ? state.queListState[x].id.toString() : null
      }

      let allQuestions_ = state.allQuestions
      if (allQuestions_) {
        delete allQuestions_[delKey.toString()]
      }

      let queListState_ = state.queListState
      x = queListState_.findIndex((key) => (key.id === delKey))
      queListState_ = queListState_.slice(0, x).concat(queListState_.slice(x + 1))

      return { ...state, selectedKey: selectedKey_, queListState: queListState_, allQuestions: allQuestions_ }
    }
    case ('editQuestion'): {
      const { queKey, newQuestion } = action.payload
      let ques_: IQuestionForm = { ...newQuestion, savedChanges: undefined }
      if (newQuestion.correct_ans && newQuestion.optionsArray) {
        let correct_ans = newQuestion.correct_ans?.filter(value => newQuestion.optionsArray?.includes(value));
        correct_ans = correct_ans.filter(function (item, i, ar) { return ar.indexOf(item) === i; });
        ques_ = { ...ques_, correct_ans }
      }else{
        throw 'Imroper new_question format'
      }

      const allQuestions = {
        ...state.allQuestions,
        [queKey.toString()]: ques_
      }
      return {...state, allQuestions}
    }
    case('editMsg'): {
      const { type, msg } = action.payload
      if(!msg){
        throw 'Unable to edit msg'
      }
      if(type === 'sucess'){
        return {...state, successMsg : state.successMsg}
      }else if(type === 'error'){
        return {...state, errMsg : state.errMsg}
      }else if(type === 'warn'){
        return {...state, warnMsg : state.warnMsg}
      }else{
        throw 'Unable to edit msg'
      }
    }
    case('setAllQues') : {
      const {allQuestions} = action.payload
      return {...state,allQuestions}
    }
    case('setQuesSeq') : {
      const {queSeq} = action.payload
      return {...state,queSeq}
    }
    case('setQuesList') : {
      const { queListState } = action.payload
      return {...state,queListState}
    }
    default: {
      return state
    }
  }
}

export default EditForm

// const editQuestion = (queKey: string | Types.ObjectId, newQuestion: IQuestionForm) => {
//   setAllQues((prev) => {
//     let ques_: IQuestionForm = { ...newQuestion, savedChanges: undefined }
//     if (newQuestion.correct_ans && newQuestion.optionsArray) {
//       let correct_ans = newQuestion.correct_ans?.filter(value => newQuestion.optionsArray?.includes(value));
//       correct_ans = correct_ans.filter(function (item, i, ar) { return ar.indexOf(item) === i; });
//       ques_ = { ...ques_, correct_ans }
//     }

//     return {
//       ...prev,
//       [queKey.toString()]: ques_
//     }
//   })
// }

// const addQuestion = useCallback((after?: string | Types.ObjectId | null, newQuestion?: IQuestionForm) => {
//   if (queSeq && queSeq.length >= 20) {
//     setErrMsg('Question number should not exceed 20')
//     return
//   }
//   const uniqueId = 'newId' + (new Date()).getTime();
//   setSelectedKey(uniqueId)

//   console.log(uniqueId)

//   setAllQues(prev => {
//     if (newQuestion) {
//       return {
//         ...prev,
//         [uniqueId]: {
//           ...newQuestion,
//           meow: 'meow',
//           _id: uniqueId
//         }
//       }
//     } else {
//       return {
//         ...prev,
//         [uniqueId]: {
//           ...defaultAllQuestions["0"],
//           _id: uniqueId
//         }
//       }
//     }
//   })

//   setQueListState(prev => {
//     if (after) {
//       let x = prev.findIndex((key) => (key.id === after))
//       if (x !== -1) {
//         let new_ = prev.slice(0, x + 1).concat([{ id: uniqueId }, ...prev.slice(x + 1)])
//         return new_
//       }
//     }
//     return prev.slice().concat([{ id: uniqueId }])
//   })
// }, [queSeq])
// const deleteQuestion = useCallback((delKey: string | Types.ObjectId | null) => {
//   if (!delKey) return
//   let x: number | null = queListState.findIndex((key) => (key.id === delKey))
//   if ((queListState[x - 1] && queListState[x - 1].id)) {
//     x = x - 1
//   } else if (queListState[x + 1] && queListState[x + 1].id) {
//     x = x + 1
//   } else {
//     x = null
//   }
//   // console.log('After delteing',queListState[x].id.toString())
//   setSelectedKey(prev => {
//     if (prev === delKey.toString()) return (x) ? queListState[x].id.toString() : null
//     else return prev
//   })

//   setAllQues(prev => {
//     let new_ = { ...prev }
//     delete new_[delKey.toString()]
//     return new_
//   })

//   setQueListState(prev => {
//     let x = prev.findIndex((key) => (key.id === delKey))
//     let new_ = prev.slice(0, x).concat(prev.slice(x + 1))
//     return new_
//   })

// }, [queListState])

// const editFormInfo = (title: string, desc: string) => {
//   setAboutForm(prev => { return { ...prev, title, desc } })
// }