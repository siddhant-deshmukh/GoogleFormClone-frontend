import React from 'react'
import { IAllFormQuestions } from '../../../types'
import ResSummery from './ResSummery'

const Res = (
  {formId,allQuestions}:{formId: string | undefined, allQuestions: IAllFormQuestions | null}
) => {
  if(!formId){
    return(
      <div> Form not uploaded or saved </div>
    )
  }
  return (
    <div>
      <ResSummery formId={formId} />
    </div>
  )
}

export default Res