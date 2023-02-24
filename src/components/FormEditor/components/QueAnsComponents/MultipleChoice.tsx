import { Types } from 'mongoose'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IQuestionForm } from '../../../../types'

const MultipleChoice = (
  { queKey, question, editQuestion, isSelected }:
    {
      queKey: string | Types.ObjectId,
      question: IQuestionForm,
      editQuestion: (queKey: string | Types.ObjectId, newQuestion: IQuestionForm) => void
      isSelected: boolean,

    }) => {

  const [correctOptions, setCorrectOptions] = useState<boolean[]>([])
  useMemo(() => {
    // console.log("In use meoo")
    let oldCorrectOption = Array(question.optionsArray?.length).fill(false)
    let correct_ans = question.correct_ans
    if (correct_ans) {
      correct_ans.forEach((correctAns, index) => {
        let a = question.optionsArray?.findIndex((op) => op === correctAns)
        console.log("FOr ,", correctAns, a, correct_ans)
        if (a !== undefined && a !== -1) {
          oldCorrectOption[a] = true
        }
      })
    }

    setCorrectOptions(oldCorrectOption)

  }, [question.correct_ans, question.optionsArray])

  return (
    <>
      <div>

        {
          question.optionsArray?.map((option, index) => {
            return (
              <div className='flex w-full py-2 items-center space-x-4'>
                {question.ans_type === 'mcq' && <div className='w-4 h-4 rounded-full border-2 border-gray-300'></div>}
                {question.ans_type === 'checkbox' && <div className='w-4 h-4  border-2 border-gray-300'></div>}
                {question.ans_type === 'dropdown' && <div className='w-4  text-sm h-fit'>{index}.</div>}
                <div className='w-full'>
                  <input
                    value={option}
                    onChange={(event) => {
                      const arr_ = question.optionsArray?.slice() || []
                      arr_[index] = event.target.value
                      editQuestion(queKey, { ...question, optionsArray: arr_ })
                    }}
                  />
                </div>
                {
                  question.correct_ans &&
                  <button
                    className={`w-fit  ${(correctOptions[index]) ? 'hover:bg-red-100' : 'hover:bg-green-100'}  rounded-full`}
                    onClick={(event) => {
                      event.preventDefault();
                      // console.log("Old correct ans :",question.correct_ans?.slice(),correctOptions[index])
                      let new_correct_ans = question.correct_ans?.slice() as string[]

                      if (!correctOptions[index]) {
                        new_correct_ans.push(option)
                      } else {
                        const index = new_correct_ans.indexOf(option);
                        new_correct_ans = new_correct_ans.slice(0, index).concat(new_correct_ans.slice(index + 1));
                      }
                      editQuestion(queKey, {
                        ...question,
                        correct_ans: new_correct_ans
                      })
                      // console.log("new_correct_ans :",new_correct_ans)
                    }}
                  >
                    {
                      correctOptions[index] &&
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    {
                      !correctOptions[index] &&
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  </button>
                }
                <button
                  className='w-fit text-sm  px-0.5 py-0.5 rounded-full hover:bg-gray-100'
                  onClick={(event) => {
                    event.preventDefault();

                    const arr_ = question.optionsArray?.slice() || []

                    const newarr_ = arr_.slice(0, index).concat(arr_.slice(index + 1, arr_.length + 1))
                    editQuestion(queKey, { ...question, optionsArray: newarr_ })

                  }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>

                </button>
              </div>
            )
          })}
        {isSelected && <button
          className='flex items-center space-x-4 text-gray-400'
          onClick={(event) => {
            event.preventDefault();

            // console.log(question.optionsArray)
            const newOptions = (question.optionsArray && typeof question.optionsArray !== 'string') ? [...question.optionsArray, `Option ${question.optionsArray.length + 1}`] : ['Option 1'];
            // console.log(newOptions, question.optionsArray)
            editQuestion(queKey, { ...question, optionsArray: newOptions })
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <span>Add option</span></button>}
      </div>
    </>
  )
}

export default MultipleChoice