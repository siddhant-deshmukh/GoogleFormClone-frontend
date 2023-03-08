import { Types } from 'mongoose'
import React, { useEffect, useState } from 'react'
import { IAllFormQuestions, IQueResList, IQuestionForm } from '../../types'
import QuestionElement from './components/QuestionElement'
import TitleDescFormElement from './components/TitleDescFormElement'

const defalutQueResList = new Map()

function FormPreview(
  { aboutForm, formId, queSeq, allQuestions }: {
    aboutForm: { title: string, desc?: string | undefined },
    formId: string | undefined,
    queSeq: (string | Types.ObjectId)[],
    allQuestions: IAllFormQuestions | null,
  }
) {
  const [quesReses, setQueReses] = useState<IQueResList>(defalutQueResList)
  const changeRes = (queKey: string, response: string[] | string) => {
    
    setQueReses(prev => {
      const new_ = new Map(prev)
      new_.set(queKey, response)
      // console.log(new_)
      return new_
    })
  }
  useEffect(() => {
    let new_queResList: IQueResList = new Map()
    if (!allQuestions) return
    queSeq.forEach((qId) => {
      const { ans_type } = allQuestions[qId.toString()]

      new_queResList.set(
        qId as string,
        (ans_type === "dropdown" || ans_type === "checkbox" || ans_type === "mcq") ? [] : ""
      )
    })
    // console.log({new_queResList})
    setQueReses(new_queResList)
  }, [queSeq,allQuestions])

  return (
    <div className='relative px-2 my-2 flex  space-x-2 pr-3 w-full max-w-3xl  mx-auto  '>
      <div className='w-full h-full '>
        <TitleDescFormElement aboutForm={aboutForm} />
        <div 
          id='sortable' 
          className='flex flex-col  my-3 space-y-2 w-full '
          >
          {allQuestions && queSeq &&
            queSeq.map((queKey) => {
              let question = allQuestions[queKey.toString()]
              let queRes = quesReses.get(queKey.toString())
              if (!queKey || queRes === null || queRes === undefined) return;
              return (
                <>
                  <QuestionElement key={queKey.toString()} queKey={queKey.toString()}
                    question={question} queRes={queRes} changeRes={changeRes} />
                </>
              )
            })
          }

          <button
            type={'submit'}
            className='px-3 py-1 bg-purple-200'
            onClick={(event)=>{event.preventDefault(); console.log(quesReses)}}
            >
            Submit
          </button>
        </div>
        
      </div>

    </div>
  )
}

export default FormPreview