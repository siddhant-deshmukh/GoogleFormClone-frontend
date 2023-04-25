import { Types } from 'mongoose';
import React from 'react'
import { IQuestionForm } from '../../../types';
import MultipleChoice from './QueAnsComponents/MultipleChoice';

const NotInFocusQuestion = ({ queKey, question, isSelected, setErrors }: {
  queKey: string | Types.ObjectId,
  question: IQuestionForm,
  isSelected: string,
  setErrors: React.Dispatch<React.SetStateAction<{
    titleLen: boolean;
    optionsLen: boolean;
    optionsNum: boolean;
    numUploads: boolean;
  }>>
}) => {


  return (
    <>
      <div className=''>
        {question.title}
        {
          question._id?.slice(0, 3) === 'new' &&
          <span style={{ fontSize: '12px' }} className="bg-blue-100 text-blue-800 text-xs ml-2 font-medium  px-1  rounded dark:bg-blue-900 dark:text-blue-300">new</span>
        }
        {
          question._id?.slice(0, 3) !== 'new' && question.savedChanges &&
          <span style={{ fontSize: '12px' }} className="bg-gray-100 text-gray-800 text-xs ml-2 font-medium  px-1  rounded dark:bg-blue-900 dark:text-blue-300">saved</span>
        }
        {
          question._id?.slice(0, 3) !== 'new' && (question.savedChanges === false) &&
          <span style={{ fontSize: '12px' }} className="bg-red-100 text-red-800 text-xs ml-2 font-medium  px-1  rounded dark:bg-blue-900 dark:text-blue-300">unsaved</span>
        }
      </div>


      {/*------------------------------------ Ans as per type -------------------------------------------------------- */}
      <div className='w-full flex flex-col space-y-2'>
        {
          (question.ans_type === 'mcq' || question.ans_type === 'checkbox' || question.ans_type === 'dropdown') &&
          <MultipleChoice queKey={queKey} question={question} isSelected={(isSelected === 'true')} />
        }
        {
          (question.ans_type === 'short_ans' || question.ans_type === 'long_ans') &&
          <div className=' w-80 mt-2 mb-3  px-4'>
            <input
              disabled
              onFocus={(event) => { event.target.select() }}
              className='text-xs bg-white  w-full border-b-2  border-b-gray-200 text-gray-700  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 py-1 '
              defaultValue={(question.ans_type === 'short_ans') ? '  Short Answer' : '  Long Answer'} />
          </div>
        }
      </div>
    </>
  )
}

export default NotInFocusQuestion