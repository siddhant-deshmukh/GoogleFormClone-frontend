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
        className={`${(queRes?.length > 0) ? 'text-gray-700' : 'text-gray-500'} bg-gray-50 border outline-none shadow-0 hover:bg-gray-200  focus:outline-none  focus:bg-gray-100 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center border-gray-300`}
        onClick={(event) => { event.preventDefault(); setToggle(prev => !prev) }}
      >
        {(!queRes || queRes?.length === 0) ? 'Choose Option' : queRes[0]}
        <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7">
          </path>
        </svg>
      </button>

      <div id="dropdown" className={`z-10 ${(toggle) ? '' : 'hidden'} absolute  top-12 -left-7  md:left-0 bg-gray-100 divide-y divide-gray-100 rounded-lg shadow   max-w-sm md:max-w-xl overflow-y-auto overflow-x-auto`}
        style={{minWidth:'150px'}}
      >
        <ul
          style={{ maxHeight: '500px' }}
          className="py-2 w-full text-sm text-gray-700 h-auto overflow-y-auto " aria-labelledby="dropdownDefaultButton" >
          <li className='w-full'>
            <button
              onClick={(event) => { event.preventDefault(); changeRes(queKey, []); setToggle(false) }}
              className="block w-full px-4 py-2 hover:bg-gray-200 text-center ">-Clear-</button>
          </li>
          {
            question.optionsArray &&
            question.optionsArray.map((str,index) => {
              return (
                <li className='w-full' key={index}>
                  <button
                    onClick={(event) => { event.preventDefault(); changeRes(queKey, [str]); setToggle(false) }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200 ">{str}</button>
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