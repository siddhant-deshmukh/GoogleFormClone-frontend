import { Types } from 'mongoose'
import  { useCallback,  useMemo, useState } from 'react'
import { IAllFormQuestions, IQueResList } from '../types'
import QuestionElement from './FormEditor/question/QuestionElement'
import TitleDescFormElement from './FormEditor/FormTitleDesc'
import { useAppSelector } from '../app/hooks'

const defalutQueResList = new Map()

function FormPreview(
  {  formId }: {
    formId: string | undefined,
  }
) {
  const [quesReses, setQueReses] = useState<IQueResList>(defalutQueResList)
  const [submitError, setSubmitError] = useState<string>('')
  const [submitMsg, setSubmitMsg] = useState<string>('')


  const allQuestions = useAppSelector((state)=> state.form.allQuestions)
  const queSeq = useAppSelector((state)=> state.form.queSeq)
  const aboutForm = useAppSelector((state)=> state.form.aboutForm)


  const changeRes = (queKey: string, response: string[] | string) => {

    setQueReses(prev => {
      const new_ = new Map(prev)
      new_.set(queKey, response)
      // console.log(new_)
      return new_
    })
  }
  useMemo(() => {
    let new_queResList: IQueResList = new Map()
    if (!allQuestions) return
    Object.keys(allQuestions).forEach((qId) => {
      const { ans_type } = allQuestions[qId.toString()]

      new_queResList.set(
        qId as string,
        (ans_type === "dropdown" || ans_type === "checkbox" || ans_type === "mcq") ? [] : ""
      )
    })
    // console.log({new_queResList})
    setQueReses(new_queResList)
  }, [allQuestions])

  const getReadyToSubmitForm = useCallback(() => {
    if (!allQuestions) return;
    const questions: any[] = []

    try {
      queSeq.forEach((qId, index) => {
        let _id = qId.toString()
        let { ans_type: qType, required } = allQuestions[_id]
        let res = quesReses.get(_id)
        if (qType === 'checkbox' || qType === 'mcq' || qType === 'dropdown') {
          if (required && (res?.length === 0 || res === undefined)) {
            throw 'check answer of question no ' + index.toString()
          }else if(res?.length === 0 || res === undefined){
            questions.push({
              _id,
              ans_type: allQuestions[_id].ans_type,
              res_array: res,
            })
          }
        }
        if (qType === 'short_ans' || qType === 'long_ans') {
          if (required && (res?.length === 0 || res === undefined || res?.length >= 400)) {
            throw 'check answer of question no ' + index.toString()
          }else if(res?.length === 0 || res === undefined || res?.length >= 400){
            questions.push({
              _id,
              ans_type: allQuestions[_id].ans_type,
              res_text: res,
            })
          }
        }
      })
    } catch (err) {
      setSubmitError(err as string)
      return
    }
    setSubmitError('')
    setSubmitMsg('Can be uploaded! Answers satisfy conditions!')
    console.log(questions)
  }, [queSeq, allQuestions, quesReses])
  // useEffect(()=>{
  //   const queRes_ = new Map()
  //   if(!allQuestions) return;
  //   queSeq.forEach((queKey)=>{
  //     let type_ = allQuestions[queKey.toString()].ans_type 
  //     if(type_ ==='long_ans' || type_==='short_ans'){

  //     }else{

  //     }
  //   })
  // },[queSeq, allQuestions])
  return (
    <div className='relative px-2 my-2 flex  space-x-2 pr-3 w-full max-w-3xl  mx-auto  '>
      <div className='w-full h-full '>
        <TitleDescFormElement readOnly={true}/>
        <div
          id='sortable'
          className='flex flex-col  my-3 space-y-2 w-full '
        >
          {
            allQuestions && queSeq &&
            queSeq.map((ele) => {
              let queKey = ele.id
              let question = allQuestions[queKey.toString()]
              let queRes = quesReses.get(queKey.toString())
              if (!queKey) return;
              return (

                <QuestionElement key={queKey.toString()} queKey={queKey.toString()}
                  question={question} queRes={queRes} changeRes={changeRes} />

              )
            })
          }
          {submitError !== '' &&
            <div className="flex items-center px-4 py-1 w-full mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
              <div className='w-full'>
                {submitError}
              </div>
              <button
                className='px-2 py-0.5 w-fit hover:bg-red-200 rounded-full'
                onClick={(event) => { event.preventDefault(); setSubmitError('') }}
              >
                X
              </button>
            </div>
          }
          {
            submitMsg !== '' &&
            <div className="flex items-center px-4 py-1 w-full mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
              <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
              <div className='w-full'>
                {submitMsg}
              </div>
              <button
                className='px-2 py-0.5 w-fit hover:bg-blue-200 rounded-full'
                onClick={(event) => { event.preventDefault(); setSubmitMsg('') }}
              >
                X
              </button>
            </div>
          }
          <button
            type={'submit'}
            className='px-3 py-1 bg-purple-200'
            onClick={(event) => {
              event.preventDefault();
              console.log(quesReses)
              getReadyToSubmitForm()
            }}
          >
            Submit
          </button>
        </div>

      </div>

    </div>
  )
}

export default FormPreview