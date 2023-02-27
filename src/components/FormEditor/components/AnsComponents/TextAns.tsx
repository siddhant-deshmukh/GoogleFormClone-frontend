import React from 'react'
import { IQuestionForm } from '../../../../types'

function TextAns({  changeRes, queKey }: {
  queKey: string,
  queRes: string,
  changeRes: (queKey: string, response: string[] | string) => void
}) {
  return (
    <div 
      contentEditable 
      // @ts-ignore
      onInput={(event)=>{changeRes(queKey,event.currentTarget.textContent)}}
      className="outline-none w-full border-b-2 border-b-gray-400 h-fit max-h-24 bg-gray-50 p-1 font-light text-sm overflow-y-auto" 
      placeholder={'Your Answer'}
    />
  )
}

export default TextAns