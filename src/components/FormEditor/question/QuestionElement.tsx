import React from 'react'
import { IQuestionForm } from '../../../types'
import Checkbox from './AnsComponents/Checkbox'
import DropDown from './AnsComponents/DropDown'
import MCQ from './AnsComponents/MCQ'
import ShortAns from './AnsComponents/ShortAns'
import TextAns from './AnsComponents/TextAns'

function QuestionElement(
  { question, changeRes, queKey, queRes }: {
    queKey: string,
    queRes: string | string[] | undefined,
    question: IQuestionForm,
    changeRes: (queKey: string, response: string[] | string) => void
  }
) {
  if (question) {
    return (
      <div
        className={`w-full pt-2 pb-4 px-3 bg-white rounded-lg `}
      >
        <h3
          className=''
        >
          {question.title}
          {question.required && <span className='font-medium text-red-500'>*</span>}
        </h3>
        <div className='py-2 px-2'>
          {
            question.ans_type === 'dropdown' &&
            <DropDown queKey={queKey.toString()}
              question={question} queRes={queRes as string[]} changeRes={changeRes} />
          }
          {
            question.ans_type === 'checkbox' &&
            <Checkbox queKey={queKey.toString()}
              question={question} queRes={queRes as string[]} changeRes={changeRes} />
          }
          {
            question.ans_type === 'mcq' &&
            <MCQ queKey={queKey.toString()}
              question={question} queRes={queRes as string[]} changeRes={changeRes} />
          }
          {
            (question.ans_type === 'long_ans') &&
            <TextAns queKey={queKey.toString()}
              queRes={queRes as string} changeRes={changeRes} />
          }
          {
            (question.ans_type === 'short_ans') &&
            <ShortAns queKey={queKey.toString()}
              queRes={queRes as string} changeRes={changeRes} />
          }
        </div>
      </div>
    )
  }else{
    return (
      <div></div>
    )
  }
}

export default React.memo(QuestionElement)