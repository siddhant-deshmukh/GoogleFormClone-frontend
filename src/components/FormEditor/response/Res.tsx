import React from 'react'
import { IAllFormQuestions } from '../../../types'
import ResSummery from './ResSummery'

const Res = (
  {formId,allQuestions}:{formId: string | undefined, allQuestions: IAllFormQuestions | null}
) => {
  if(!formId){
    return(
      <div className='relative  my-2 flex space-x-2  w-full max-w-3xl  mx-auto bg-white   py-10 px-5'>
          <div className='h-52 flex items-center  w-full'>
            <div className='mx-auto w-full bg-red-50 p-3'>
              Form not uploaded or no response given
            </div>
          </div>
      </div>
    )
  }
  return (
    <div>
      <ResSummery formId={formId} />
    </div>
  )
}

export default Res