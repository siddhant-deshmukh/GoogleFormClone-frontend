import { Types } from 'mongoose'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { IQuestionForm } from '../../../../types'
import { useAppDispatch } from '../../../../app/hooks';
import { DndItem, DndList, DndTrigger } from '../../react-sortable-hoc';
import { editQuestion, functionForOptionEdit, functionForSorting } from '../../../../features/form/formSlice';

const MultipleChoice = (
  { queKey, question, isSelected }:
    {
      queKey: string | Types.ObjectId,
      question: IQuestionForm,
      isSelected: boolean,
    }) => {

  const [correctOptions, setCorrectOptions] = useState<boolean[]>([])
  const [optionState, setOptionsState] = useState<({ _id: string, text: string })[]>([]);
  
  const dispatch = useAppDispatch()

  useMemo(() => {
    let oldCorrectOption = Array(question.optionsArray?.length).fill(false)
    let correct_ans = question.correct_ans
    if (correct_ans) {
      correct_ans.forEach((correctAns, index) => {
        let a = question.optionsArray?.findIndex((op) => op === correctAns)
        console.log("FOr ,", correctAns, a, correct_ans)
        if (a !== undefined && a !== -1) {
          oldCorrectOption[a] = true
        }
      })
    }

    setCorrectOptions(oldCorrectOption)

  }, [question.correct_ans, question.optionsArray])

  useEffect(() => {
    let new_way = (question?.optionsArray || []).map((option, index) => {
      return { _id: index.toString(), text: option }
    })
    setOptionsState(new_way)
  }, [])


  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }): void => {
    setOptionsState((prev) => {
      let value = prev[oldIndex]
      let arr_ = prev.slice(0, oldIndex).concat(prev.slice(oldIndex + 1))
      return arr_.slice(0, newIndex).concat([value, ...arr_.slice(newIndex)])
    })
    dispatch(functionForSorting({ oldIndex, newIndex, questionId: queKey.toString() }))
  }
  function handleInputChange(index: number, text: string) {
    setOptionsState((prev) => {
      let arr_ = prev.slice()
      arr_[index] = { ...arr_[index], text }
      dispatch(functionForOptionEdit({queKey : queKey.toString(),text,index}))
      return arr_
    })
  }
  return (
    <div>
      <DndList
        lockAxis="y"
        lockToContainerEdges={true}
        useDragHandle
        onSortEnd={onSortEnd}
        className="itemsContainer"
      >
        {
          optionState?.map((option, index) => {
            return (
              <DndItem index={index} >
                <div key={option._id} className='flex w-full py-2 items-center space-x-2'>

                  <DndTrigger className='w-fit'>
                    {question.ans_type === 'mcq' && <div className='w-4  h-4 hover:cursor-grabbing icon-move mr-1 rounded-full border-2 border-gray-300'></div>}
                    {question.ans_type === 'checkbox' && <div className='w-4 hover:cursor-grabbing icon-move mr-1 h-4  border-2 border-gray-300'></div>}
                    {question.ans_type === 'dropdown' && <div className='w-5 hover:cursor-grabbing icon-move text-sm h-fit'>{index + 1}.</div>}
                  </DndTrigger>

                  <input
                    onFocus={(event) => { event.target.select() }}
                    value={option.text}
                    className={`w-full outline-none border-b-2 bg-transparent ${(option.text.length > 50 || option.text.length === 0) ? 'border-b-red-700' : 'border-b-white hover:border-b-gray-300 focus:border-b-gray-300 '} `}
                    type="text"
                    onChange={(event) => {
                      event.preventDefault()
                      handleInputChange(index, event.target.value)
                    }}
                  />

                  {
                    question.correct_ans &&
                    <button
                      className={`w-fit  ${(correctOptions[index]) ? 'hover:bg-red-100' : 'hover:bg-green-100'}  rounded-full`}
                      onClick={(event) => {
                        event.preventDefault();
                        // console.log("Old correct ans :",question.correct_ans?.slice(),correctOptions[index])
                        let new_correct_ans = question.correct_ans?.slice() as string[]

                        if (question.ans_type === 'dropdown' || question.ans_type === 'mcq') {
                          if (!correctOptions[index]) {
                            new_correct_ans = [option.text];
                          } else {
                            new_correct_ans = [];
                          }
                        } else {
                          if (!correctOptions[index]) {
                            new_correct_ans.push(option.text)
                          } else {
                            const index = new_correct_ans.indexOf(option.text);
                            new_correct_ans = new_correct_ans.slice(0, index).concat(new_correct_ans.slice(index + 1));
                          }
                        }
                        dispatch(editQuestion({
                          queKey: queKey.toString(),
                          newQue: {
                            ...question,
                            correct_ans: new_correct_ans
                          }
                        }))
                        // console.log("new_correct_ans :",new_correct_ans)
                      }}
                    >
                      {
                        correctOptions[index] &&
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                      {
                        !correctOptions[index] &&
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                    </button>
                  }
                  <button
                    className='w-fit text-sm  px-0.5 py-0.5 rounded-full hover:bg-gray-100'
                    onClick={(event) => {
                      event.preventDefault();
                      const arr_ = optionState?.slice() || []
                      if (arr_.length <= 1) return;
                      const newarr_ = arr_.slice(0, index).concat(arr_.slice(index + 1, arr_.length + 1))
                      setOptionsState(newarr_)
                      dispatch(functionForOptionEdit({index : index,delOpt:true,queKey : queKey.toString()}))
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </DndItem>
            )
          })
        }
      </DndList>

      {
        isSelected && question && question.optionsArray && question.optionsArray.length < 50 && <button
          className='flex items-center space-x-4 text-gray-400'
          disabled={question.optionsArray.length >= 50}
          onClick={(event) => {
            event.preventDefault();

            // console.log(question.optionsArray)
            // const newOptions = (question.optionsArray && typeof question.optionsArray !== 'string') ? [...question.optionsArray, `Option ${question.optionsArray.length + 1}`] : ['Option 1'];
            // console.log(newOptions, question.optionsArray)
            // editQuestion(queKey, { ...question, optionsArray: newOptions })
            // setQueOptions(newOptions)
            setOptionsState((prev) => {
              let __id = "opt" + (Math.floor(Math.random() * 10000)).toString()
              return [...prev, { _id: __id, text: `Option ${prev.length + 1}` }]
            })
            dispatch(functionForOptionEdit({queKey : queKey.toString(), newOpt: true }))
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <span>Add option</span>
        </button>
      }
    </div>
  )
}

export default MultipleChoice