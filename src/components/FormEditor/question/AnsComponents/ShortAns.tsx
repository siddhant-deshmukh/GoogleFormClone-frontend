import React from 'react'
import { IQuestionForm } from '../../../../types'


function ShortAns({ changeRes, queKey }: {
  queKey: string,
  queRes: string,
  changeRes: (queKey: string, response: string[] | string) => void
}) {
  return (
    <div
      className="outline-none w-full h-fit  p-1 "
      placeholder={'Your Answer'}
    >
      <input
        className='border-b-2 border-b-black w-80 outline-none'
        type={'text'}
        maxLength={70}
        onChange={(event) => {
          if(event.target.value.length <= 1 || event.target.value.length >= 150) return;
          changeRes(queKey, event.target.value)
        }}>
      </input>
    </div>
  )
}

export default ShortAns