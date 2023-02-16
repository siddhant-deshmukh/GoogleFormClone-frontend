import { useCallback, useEffect, useState } from 'react'
import $ from 'jquery';
import TitleDescFormElement from '../components/TitleDescFormElement';
import QuestionFormElement from '../components/QuestionFormElement';
import { IAllFormQuestions,  IQuestionForm } from '../types';

const defaultAllQuestions : IAllFormQuestions = { 0: { title: 'Untitled Question', 'required': false, type: 'mcq', ansOption: ['Option 1'] } }

function EditForm() {

  const [queSeq, setQueSeq] = useState<number[]>([0])
  const [allQuestions, setAllQues] = useState<IAllFormQuestions>(defaultAllQuestions)
  const editQuestion = useCallback((queKey:number,newQuestion:IQuestionForm)=>{
    setAllQues((prev)=>{
      const new_ = {...prev}
      new_[queKey] = newQuestion
      return new_
    })
  },[allQuestions])

  return (
    <div className="w-screen h-screen bg-purple-100">
      <div className='w-full h-full overflow-y-auto overflow-x-auto'>
        <div className='flex flex-col px-2 my-2 space-y-2 mx-auto w-full max-w-3xl '>
          <TitleDescFormElement />
          <div id='sortable' className='flex flex-col  space-y-2 mx-auto w-full'>
            {
              queSeq.map((ele)=>{
                return (
                  <QuestionFormElement queKey={ele} question={allQuestions[ele]} editQuestion={editQuestion}/>
                )
              })
            }
          </div>
        </div>
        {
          JSON.stringify(allQuestions)
        }
      </div>
    </div>
  )
}



export default EditForm
