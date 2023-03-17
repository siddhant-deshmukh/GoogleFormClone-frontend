import React, { useCallback, useEffect, useState } from 'react'
import { IAnsTypes, IQuestionForm } from '../../../types'
import { Types } from 'mongoose'
import MultipleChoice from './QueAnsComponents/MultipleChoice'

//: { [quetype : 'short_ans' | 'long_ans' | 'mcq' | 'checkbox' | 'dropdown' ] : {text:string, svg:JSX.Element} } 

const QuestionFormElement = ({
  queKey, question, editQuestion, isSelected, setSelectedKey, deleteQuestion, addQuestion, saveQuestion
}
  : {
    queKey: string | Types.ObjectId,
    question: IQuestionForm,
    isSelected: boolean,
    setSelectedKey: React.Dispatch<React.SetStateAction<string | null>>,
    editQuestion: (queKey: string | Types.ObjectId, newQuestion: IQuestionForm) => void,
    deleteQuestion: (delKey: string | Types.ObjectId) => void,
    addQuestion: (after?: string | Types.ObjectId, newQuestion?: IQuestionForm) => void,
    saveQuestion: (queKey: string, newQuestion: IQuestionForm) => Promise<void>
  }) => {

  const [chooseAnsTypeToggle, setChooseAnsTypeToggle] = useState<boolean>(false)
  const [queErrors, setErrors] = useState<{ titleLen: boolean, optionsLen: boolean, optionsNum: false }>({
    titleLen: false,
    optionsLen: false,
    optionsNum: false,
  })
  const changeAnsType = (prevType: IAnsTypes, selectedType: IAnsTypes) => {
    setChooseAnsTypeToggle(false)
    if (prevType === selectedType) return;
    if (selectedType === 'checkbox' || selectedType === 'mcq' || selectedType === 'dropdown') {
      if (!(prevType === 'checkbox' || prevType === 'mcq' || prevType === 'dropdown')) {
        editQuestion(queKey, { ...question, ans_type: selectedType, optionsArray: ['Option 1'], correct_ans: undefined })
      } else {
        editQuestion(queKey, { ...question, ans_type: selectedType })
      }
    } else if (selectedType === 'short_ans' || selectedType === 'long_ans') {
      editQuestion(queKey, { ...question, ans_type: selectedType, optionsArray: undefined, correct_ans: undefined })
    } else {

    }
  }

  return (
    <div
      onClick={(event) => { event.preventDefault(); setSelectedKey(queKey.toString()) }}
      className={`w-full pt-2 pb-4 px-3 bg-white rounded-lg  ${(isSelected) ? 'border-blue-500 border-l-4' : ' hover:cursor-pointer'} `}
    >
      {/* ------------------------------ Later will be used to sort list  --------------------------------------*/}
      <div className='question-sort-handle w-full h-fit hover:cursor-grabbing flex relative items-center'>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3 h-fit mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      </div>

      {/* ------------------------------ Shows errors  --------------------------------------*/}
      <div className=''>
        {
          queErrors &&
          Object.keys(queErrors).map((key, index) => {
            //@ts-ignore
            if (!queErrors[key]) return <div className='hidden' key={index}></div>
            return <div className='flex text-xs text-red-800 items-center pt-1' key={index}>
              <svg aria-hidden="true" className="flex-shrink-0 inline w-3  h-3 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
              <div>
                {/** @ts-ignore */}
                {errors[key]}
              </div>
            </div>
          })
        }
      </div>

      {/* ------------------------------ first row question title and question type  --------------------------------------*/}
      {
        isSelected &&
        <div className='flex flex-col space-y-3 w-full '>
          <>
            <div className='flex w-full  items-center justify-between space-x-4'>
              <input
                onFocus={(event) => { event.target.select() }}
                className='py-3 pl-3 font-normal text-sm w-full bg-gray-100 border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 '
                placeholder={'Question'}
                value={question.title}
                onChange={(event) => {
                  event.preventDefault();
                  editQuestion(queKey, { ...question, title: event.target.value });
                  if (event.target.value.length > 50 || event.target.value.length < 3) {
                    setErrors((prev) => {
                      return { ...prev, titleLen: true }
                    })
                  } else {
                    setErrors((prev) => {
                      return { ...prev, titleLen: false }
                    })
                  }
                }}
              />
              {/* after sm mode this will be visible */}
              {/* Select ans type */}
              <div className='relative w-48 hidden sm:block'>
                {
                  !chooseAnsTypeToggle &&
                  <button
                    onClick={(event) => { event.preventDefault(); setChooseAnsTypeToggle(true) }}
                    className='w-full items-center flex border border-gray-300 p-2  justify-between'>

                    {ansTypesStates[question.ans_type].svg}

                    <span className='w-full text-xs text-left pl-2'>{ansTypesStates[question.ans_type].text}</span>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                }
                {
                  chooseAnsTypeToggle &&
                  <SelectFromAnsTypes ansType={question.ans_type} changeAnsType={changeAnsType} />
                }
              </div>
            </div>
            {/* in sm mode this will be visible */}
            {/* Select ans type */}
            <div className='relative w-40 text-xs block sm:hidden'>
              {
                !chooseAnsTypeToggle &&
                <button
                  onClick={(event) => { event.preventDefault(); setChooseAnsTypeToggle(true) }}
                  className='w-full items-center flex border border-gray-300 p-2  justify-between'>

                  {ansTypesStates[question.ans_type].svg}

                  <span className='w-full text-xs text-left pl-2'>{ansTypesStates[question.ans_type].text}</span>

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              }
              {
                chooseAnsTypeToggle &&
                <SelectFromAnsTypes ansType={question.ans_type} changeAnsType={changeAnsType} />
              }
            </div>
          </>
          {
            question.desc &&
            <input
              onFocus={(event) => { event.target.select() }}
              className='text-xs border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 py-1 '
              placeholder={'Description'}
              value={question.desc}
              onChange={(event) => { event.preventDefault(); editQuestion(queKey, { ...question, desc: event.target.value }) }} />
          }
        </div>
      }
      {
        !isSelected &&
        <div className=''>
          {question.title}
          {/*------------------------------------ Tag indeicating question state   
            e.g new means question is new i.e just created
                saved means questions is old and saved and unsaved means question is yet to be saved
          */}
          {
            question._id?.slice(0, 3) === 'new' &&
            <span style={{ fontSize: '12px' }} className="bg-blue-100 text-blue-800 text-xs ml-2 font-medium  px-1  rounded dark:bg-blue-900 dark:text-blue-300">new</span>
          }
          {
            question._id?.slice(0, 3) !== 'new' && question.savedChanges &&
            <span style={{ fontSize: '12px' }} className="bg-gray-100 text-gray-800 text-xs ml-2 font-medium  px-1  rounded dark:bg-blue-900 dark:text-blue-300">saved</span>
          }
          {
            question._id?.slice(0, 3) !== 'new' && (!question.savedChanges) &&
            <span style={{ fontSize: '12px' }} className="bg-red-100 text-red-800 text-xs ml-2 font-medium  px-1  rounded dark:bg-blue-900 dark:text-blue-300">unsaved</span>
          }
        </div>
      }


      {/*------------------------------------ Ans as per type -------------------------------------------------------- */}
      <div className='w-full flex flex-col space-y-2'>
        {
          (question.ans_type === 'mcq' || question.ans_type === 'checkbox' || question.ans_type === 'dropdown') &&
          <MultipleChoice queKey={queKey} setErrors={setErrors} question={question} editQuestion={editQuestion} isSelected={isSelected} />
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

      {
        isSelected &&
        <QuestionFooter
          queKey={queKey}
          question={question}
          editQuestion={editQuestion}
          deleteQuestion={deleteQuestion}
          addQuestion={addQuestion}
          saveQuestion={saveQuestion}
        />
      }
    </div>
  )
}

function QuestionFooter(
  { queKey, question, editQuestion, deleteQuestion, addQuestion, saveQuestion }: {
    queKey: string | Types.ObjectId,
    question: IQuestionForm,
    editQuestion: (queKey: string | Types.ObjectId, newQuestion: IQuestionForm) => void,
    deleteQuestion: (delKey: string | Types.ObjectId) => void,
    addQuestion: (after?: string | Types.ObjectId, newQuestion?: IQuestionForm) => void,
    saveQuestion: (queKey: string, newQuestion: IQuestionForm) => Promise<void>
  }
) {
  const [saveChangesLoading, setLoading] = useState<boolean>(false)

  return (
    <div className='px-4 mt-4'>
      <div className='w-full py-1  border-t border-t-gray-300 mt-2 flex  h-fit items-center space-x-6'>
        <div className='w-full flex justify-between'>
          <div className='w-fit'>
            {
              (question.ans_type === 'mcq' || question.ans_type === 'checkbox' || question.ans_type === 'dropdown') &&
              <>
                {
                  (question.correct_ans === undefined) &&
                  <button
                    className='flex space-x-2 text-green-700 font-medium text-sm items-center'
                    onClick={(event) => { event.preventDefault(); editQuestion(queKey, { ...question, correct_ans: [] }) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                    </svg>
                    <span>Add Answers</span>
                  </button>
                }
                {
                  !(question.correct_ans === undefined) &&
                  <button
                    className='flex space-x-2 text-blue-500 font-medium text-sm items-center'
                    onClick={(event) => { event.preventDefault(); editQuestion(queKey, { ...question, correct_ans: undefined }) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                    </svg>
                    <span>Remove Answer</span>
                  </button>
                }
              </>
            }
          </div>
          <div className='flex space-x-2 items-center'>
            {/* copy */}
            <button
              className='h-fit'
              onClick={(event) => { event.preventDefault(); addQuestion(queKey, question) }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
              </svg>
            </button>
            {/* delete */}
            <button
              onClick={(event) => { event.preventDefault(); deleteQuestion(queKey) }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
            {/* required */}
            <div className='font-light text-gray-400'>
              |
            </div>
            <div className='flex items-center space-x-2 h-fit'>
              <span className=" text-xs font-medium text-gray-800 dark:text-gray-300">Required</span>
              <label
                className="relative inline-flex items-center  cursor-pointer"
                onClick={(event) => { event.preventDefault(); editQuestion(queKey, { ...question, required: !question.required }) }}
              >
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={question.required}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>
        {/* save changes */}
        <button
          disabled={(question._id?.slice(0, 3) === 'new') || (question.savedChanges)}
          className={`w-28  hidden sm:block ${((question._id?.slice(0, 3) === 'new') || (question.savedChanges)) ? "bg-blue-100 text-gray-600" : "bg-blue-500 text-white"} rounded-md p-2 text-xs `}
          onClick={(event) => {
            event.preventDefault();
            setLoading(true);
            saveQuestion(queKey.toString(), question)
              .finally(() => { setLoading(false) });
          }}
        >
          Save Changes
        </button>
      </div>
      {/*  This will only show up in sm mode to save changes */}
      <button
        disabled={(question._id?.slice(0, 3) === 'new') || (question.savedChanges)}
        className={`w-fit ml-auto mt-3 block sm:hidden ${((question._id?.slice(0, 3) === 'new') || (question.savedChanges)) ? "bg-blue-100 text-gray-600" : "bg-blue-500 text-white"} rounded-md p-2 text-xs `}
        onClick={(event) => { event.preventDefault(); setLoading(true); saveQuestion(queKey.toString(), question) }}
      >
        {saveChangesLoading && <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
        </svg>}
        Save Changes
      </button>
    </div>
  )
}
const ansTypesStates = {
  short_ans: {
    text: 'Short Answer',
    svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
    </svg>
  },
  long_ans: {
    text: 'Description',
    svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>

  },
  mcq: {
    text: 'Multiple Choice',
    svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
    </svg>

  },
  checkbox: {
    text: 'Check box',
    svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  },
  dropdown: {
    text: 'Dropdown',
    svg: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
    </svg>
  },
}
const SelectFromAnsTypes = ({ ansType, changeAnsType }: { ansType: IAnsTypes, changeAnsType: (prevType: IAnsTypes, selectedType: IAnsTypes) => void }) => {

  const typesArr = ['short_ans', 'long_ans', 'mcq', 'checkbox', 'dropdown']
  return (
    <div className={`absolute w-44 z-30 flex flex-col bg-white border border-gray-300`}>
      {
        typesArr.map((type) => {
          return (
            <button
              key={type}
              onClick={(event) => { event.preventDefault(); changeAnsType(ansType, type as IAnsTypes) }}
              className={`w-full items-center ${(type !== ansType) ? 'bg-white' : 'bg-cyan-50'} flex  p-2 py-3 space-x-4`}>
              {/* @ts-ignore */}
              {ansTypesStates[type].svg}
              {/* @ts-ignore */}
              <span className='w-full text-sm text-left pl-2'>{ansTypesStates[type].text}</span>
            </button>
          )
        })
      }
    </div>
  )
}
const errors: { titleLen: string, optionsLen: string, optionsNum: string } = {
  titleLen: 'title length should be between 3 to 50',
  optionsLen: 'option length should be between 1 to 20',
  optionsNum: 'their can be 50 options atmost'
}

export default React.memo(QuestionFormElement)