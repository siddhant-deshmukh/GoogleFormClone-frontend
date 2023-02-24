import { Types } from 'mongoose'
import React, { useEffect, useState } from 'react'
import { IAllFormQuestions, IQueResList } from '../../types'
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
  const [quesResList,setQueResList] = useState<IQueResList>(defalutQueResList)
  useEffect(()=>{ 
    let new_queResList : IQueResList = new Map()
    if(!queSeq || !allQuestions) return 
    queSeq.forEach((qId)=>{
      const {ans_type} = allQuestions[qId.toString()]

      new_queResList.set(qId as string,{
        ans_type,
        response : (ans_type === "dropdown" || ans_type === "checkbox" || ans_type === "mcq")?[]:""
      })
    })
  },[])

  return (
    <div className='relative px-2 my-2 flex  space-x-2 pr-3 w-full max-w-3xl  mx-auto  '>
      <div className='w-full h-full '>
        <TitleDescFormElement />
        <div id='sortable' className='flex flex-col  my-3 space-y-2 w-full '>
          {allQuestions && queSeq &&
            queSeq.map((ele) => {
              let question=allQuestions[ele.toString()]
              return (
                // <QuestionElement
                //   key={ele.toString()}
                //   queKey={ele}
                //   question={allQuestions[ele.toString()]}
                // />
                <div
                  key={ele.toString()}
                  className={`w-full pt-2 pb-4 px-3 bg-white rounded-lg `}
                >
                  <h3
                    className='py-3 pl-3 font-normal text-sm w-full bg-gray-100 border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 '
                  >
                    {question.title}
                  </h3>

                </div>
              )
            })
          }

          <button
            className='px-3 py-1 bg-purple-200'
            onClick={(event) => { event.preventDefault();  }}>
            Submit
          </button>
        </div>
        {
          JSON.stringify(allQuestions)
        }
      </div>

    </div>
  )
}

export default FormPreview