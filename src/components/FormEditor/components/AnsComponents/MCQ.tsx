import React from 'react'
import { IQuestionForm } from '../../../../types'

function MCQ(
  { question, changeRes, queKey, queRes }: {
    queKey: string,
    queRes:string[] ,
    question: IQuestionForm,
    changeRes: (queKey: string, response: string[] | string) => void
  }
) {
  return (
    <div className='flex flex-col space-y-4 text-sm '>
      {
        question.optionsArray &&
        question.optionsArray.map((str, index) => {
          return (
            <div className="flex items-center space-x-2">
              {/* {
                JSON.stringify(queRes)
              } */}
              <input
                name={queKey}
                value={str}
                id={queKey + str}
                type={'radio'}
                checked={(queRes?.length > 0 && queRes[0]===str)}
                onChange={(event) => {
                  changeRes(queKey, [str])
                }}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
              <label htmlFor={queKey + index.toString()} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{str}</label>
            </div>
          )
        })
      }
    </div>
  )
}

export default MCQ