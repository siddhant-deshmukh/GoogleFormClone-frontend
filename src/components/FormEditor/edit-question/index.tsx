import React, { useState } from 'react'
import { IQuestionForm } from '../../../types'
import { Types } from 'mongoose'
import { useAppDispatch } from '../../../app/hooks'
import { setSelectedKey } from '../../../features/form/formSlice'
import { DndTrigger } from '../react-sortable-hoc'
import NotInFocusQuestion from './NotInFocusQuestion'
import InFocusQuestion from './InFocusQuestion'

//: { [quetype : 'short_ans' | 'long_ans' | 'mcq' | 'checkbox' | 'dropdown' ] : {text:string, svg:JSX.Element} } 


const QuestionFormElement = ({ queKey, question, isSelected, selectQuestionRef }: {
  queKey: string | Types.ObjectId,
  question: IQuestionForm,
  isSelected: string,
  selectQuestionRef: React.MutableRefObject<HTMLDivElement | null>
}) => {


  // const aboutForm = useAppSelector((state) => state.form.aboutForm)
  const dispatch = useAppDispatch()

  // console.log("Key!!!", queKey)

  const [queErrors, setErrors] = useState<{ titleLen: boolean, optionsLen: boolean, optionsNum: boolean, numUploads: boolean }>({
    titleLen: false,
    optionsLen: false,
    optionsNum: false,
    numUploads: false,
  })

  function handleQuesClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();

    if (isSelected === 'true') return;
    dispatch(setSelectedKey(queKey.toString()))
    // console.log(event)

    const height = (document.getElementById(`que_${queKey.toString()}`)?.offsetTop || 100)
    document.documentElement.style.setProperty("--side-btn-height", `${height}px`);
    // console.log("\n\nHeight ", document.getElementById(`que_${queKey.toString()}`)?.getBoundingClientRect().top, height)
    // console.log("The property ", document.documentElement.style.getPropertyValue("--side-btn-height"))
  }

  return (
    <div
      id={`que_${queKey.toString()}`}
      onClick={handleQuesClick}
      className={`w-full container draggable pb-4 px-3 bg-white rounded-lg duration-100 ease-linear  ${(isSelected === 'true') ? 'border-blue-500 border-l-4 selected-question' : ' hover:cursor-pointer'} `}
      ref={(isSelected === 'true') ? selectQuestionRef : null}
    >

      {/* ------------------------------ Handle to sort questions --------------------------------------*/}

      <DndTrigger
        className='w-full dnd-trigger  hover:cursor-move flex  items-center'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3 h-6 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      </DndTrigger>


      {/* ------------------------------ Shows errors  --------------------------------------*/}
      <div className=''>
        {
          queErrors &&
          Object.keys(queErrors).map((key, index) => {
            //@ts-ignore
            if (!queErrors[key]) return <div className='hidden' key={index}></div>
            return <div className='flex text-xs text-red-800 items-center pt-1' key={index}>
              <svg aria-hidden="true" className="flex-shrink-0 inline w-3  h-3 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
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
        (isSelected && isSelected === 'true') &&
        <InFocusQuestion isSelected={isSelected} queKey={queKey} setErrors={setErrors} question={question} />
      }
      {
        (!isSelected || isSelected === 'false') &&
        <NotInFocusQuestion isSelected={isSelected} queKey={queKey} setErrors={setErrors} question={question} />
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