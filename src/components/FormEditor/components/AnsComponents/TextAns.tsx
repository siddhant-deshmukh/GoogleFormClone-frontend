import React, { useState } from 'react'
import { IQuestionForm } from '../../../../types'

function TextAns({ changeRes, queKey }: {
  queKey: string,
  queRes: string,
  changeRes: (queKey: string, response: string[] | string) => void
}) {
  const [lengthErr, setLenErr] = useState<boolean>(false)
  return (
    <>
      {
        lengthErr && <div className='flex text-xs text-red-800 items-center pt-1'>
          <svg aria-hidden="true" className="flex-shrink-0 inline w-3  h-3 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
          <div>
            text length should be between 1 to 400
          </div>
        </div>
      }
      <div
        contentEditable
        onInput={(event) => {
          // @ts-ignore
          changeRes(queKey, event.currentTarget.textContent?.slice(0,399))
          if (event.currentTarget.textContent && event.currentTarget.textContent?.length >= 400) {
            setLenErr(true)
          } else if (lengthErr) setLenErr(false)
        }}
        className="outline-none w-full border-b-2 border-b-gray-600 h-fit max-h-24  p-1   overflow-y-auto"
        placeholder={'Your Answer'}
      />
    </>
  )
}

export default TextAns