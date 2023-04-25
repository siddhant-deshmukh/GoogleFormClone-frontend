import { Types } from 'mongoose'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../app/hooks'
import { addQuestion, deleteQuestion, editQuestion } from '../../../features/form/formSlice'
import { IQuestionForm } from '../../../types'

function QuestionFooter(
  { queKey, question }: {
    queKey: string | Types.ObjectId,
    question: IQuestionForm,
  }
) {
  const dispatch = useAppDispatch()
  const [saveChangesLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (saveChangesLoading) {
      // saveQuestion(queKey.toString(), question)
    }
  }, [saveChangesLoading])
  // const saveChangesLoading = useRef<boolean>(false)
  return (
    <div className='px-4 mt-4'>
      <div className='w-full py-1  border-t border-t-gray-300 mt-2 flex  h-fit items-center space-x-6'>
        <div className='w-full flex justify-between'>
          <div className='w-fit'>
            {
              (question.ans_type === 'mcq' || question.ans_type === 'checkbox' || question.ans_type === 'dropdown') &&
              <>
                {
                  (question.correct_ans === undefined) &&
                  <button
                    className='flex space-x-2 text-green-700 font-medium text-sm items-center'
                    onClick={(event) => {
                      event.preventDefault();
                      dispatch(editQuestion({
                        queKey: queKey.toString(),
                        newQue: {
                          ...question,
                          correct_ans: []
                        }
                      }))
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                    </svg>
                    <span>Add Answers</span>
                  </button>
                }
                {
                  !(question.correct_ans === undefined) &&
                  <button
                    className='flex space-x-2 text-blue-500 font-medium text-sm items-center'
                    onClick={(event) => {
                      event.preventDefault();
                      dispatch(editQuestion({
                        queKey: queKey.toString(),
                        newQue: {
                          ...question,
                          correct_ans: undefined
                        }
                      }))
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                    </svg>
                    <span>Remove Answer</span>
                  </button>
                }
              </>
            }
          </div>
          <div className='flex space-x-2 items-center'>
            {/* copy */}
            <button
              className='h-fit'
              onClick={(event) => {
                event.preventDefault();
                dispatch(addQuestion({
                  prev_id: queKey.toString(),
                  newQue: { ...question }
                }))
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
              </svg>
            </button>
            {/* delete */}
            <button
              onClick={(event) => {
                // event.preventDefault();
                console.log("Meow hrere")
                // dispatch(setSelectedKey("newId1682343837795"))

                // dispatch(beforeDelete())
                dispatch(deleteQuestion({ queKey: queKey.toString() }))
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
            {/* required */}
            <div className='font-light text-gray-400'>
              |
            </div>
            <div className='flex items-center space-x-2 h-fit'>
              <span className=" text-xs font-medium text-gray-800 dark:text-gray-300">Required</span>
              <label
                className="relative inline-flex items-center  cursor-pointer"
                onClick={(event) => {
                  event.preventDefault();
                  dispatch(editQuestion({
                    queKey: queKey.toString(),
                    newQue: {
                      ...question,
                      required: !question.required
                    }
                  }))

                }}
              >
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={question.required}
                  // defaultChecked={question.required}
                  onChange={(e) => {
                    e.preventDefault()
                  }}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>
        {/* save changes */}
        <button
          disabled={(question._id?.slice(0, 3) === 'new') || (saveChangesLoading)}
          className={`w-28  hidden sm:block ${((question._id?.slice(0, 3) === 'new') || (question.savedChanges)) ? "bg-blue-100 text-gray-600" : "bg-blue-500 text-white"} rounded-md p-2 text-xs `}
          onClick={(event) => {
            event.preventDefault();
            setLoading(true)
          }}
        >
          Save Changes
        </button>
      </div>
      {/*  This will only show up in sm mode to save changes */}
      <button
        disabled={(question._id?.slice(0, 3) === 'new') || (question.savedChanges)}
        className={`w-fit ml-auto mt-3 block sm:hidden ${((question._id?.slice(0, 3) === 'new') || (question.savedChanges)) ? "bg-blue-100 text-gray-600" : "bg-blue-500 text-white"} rounded-md p-2 text-xs `}
        onClick={(event) => {
          event.preventDefault();
          setLoading(true)
          // saveChangesLoading.current = true
          // saveQuestion(queKey.toString(), question)
          //   .finally(() => { saveChangesLoading.current=false });
        }}
      >
        {saveChangesLoading && <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
        </svg>}
        Save Changes
      </button>
    </div>
  )
}


export default QuestionFooter