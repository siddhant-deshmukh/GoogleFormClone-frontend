import React from 'react'
import { IQuestionForm } from '../../../../types'


function Checkbox(
  { question, changeRes, queKey, queRes }: {
    queKey: string,
    queRes: string[],
    question: IQuestionForm,
    changeRes: (queKey: string, response: string[] | string) => void
  }
) {
  return (
    <ul className='flex flex-col space-y-2 text-sm '>
      {
        question.optionsArray &&
        question.optionsArray.map((str,index) => {
          return (
            <li>
              <div className="flex items-center space-x-2">
                {/* {
                  JSON.stringify(queRes)
                } */}
                <input 
                  id={queKey+str} 
                  type="checkbox" 
                  value={`str`}
                  checked={queRes?.includes(str)}
                  onChange={(event)=>{
                    
                    if(queRes?.includes(str)){
                      let x = queRes.indexOf(str)
                      changeRes(queKey,queRes.slice(0,x).concat(queRes.slice(x+1)))
                    }else{
                      changeRes(queKey,[...queRes,str])
                    }
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded   dark:bg-gray-600 dark:border-gray-500" />
                <label htmlFor={queKey+index.toString()} className="ml-2 text-sm font-medium text-gray-900 ">{str}</label>
              </div>
            </li>
          )
        })
      }
    </ul>
  )
}

export default Checkbox