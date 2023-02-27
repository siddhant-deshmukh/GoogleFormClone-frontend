import React, { useState } from 'react'
import { IQuestionForm } from '../../../../types'

function DropDown({ question, changeRes, queKey, queRes }: {
  queKey: string,
  queRes: string[],
  question: IQuestionForm,
  changeRes: (queKey: string, response: string[] | string) => void
}) {
  const [toggle, setToggle] = useState<boolean>(false)
  return (
    <div className='relative w-fit h-fit'>
      {/* {
        JSON.stringify(queRes)
      } */}
      <button
        className={`${(queRes?.length > 0) ? 'text-gray-700' : 'text-gray-500'} bg-gray-50 border-0 outline-none shadow-0 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:bg-gray-100 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center`}
        onClick={(event) => { event.preventDefault(); setToggle(prev => !prev) }}
      >
        {(!queRes || queRes?.length === 0) ? 'Choose Option' : queRes[0]}
        <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
          </path>
        </svg>
      </button>

      <div id="dropdown" className={`z-10 ${(toggle) ? '' : 'hidden'} absolute  top-12 left-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
        <ul
          style={{ maxHeight: '500px' }}
          className="py-2 w-full text-sm text-gray-700 h-auto overflow-y-auto dark:text-gray-200" aria-labelledby="dropdownDefaultButton" >
          {
            question.optionsArray &&
            question.optionsArray.map((str) => {
              return (
                <li className='w-full'>
                  <button
                    onClick={(event) => { event.preventDefault(); changeRes(queKey, [str]); setToggle(false) }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{str}</button>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default DropDown