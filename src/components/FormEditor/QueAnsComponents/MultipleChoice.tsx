import { Types } from 'mongoose'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IQuestionForm } from '../../../types'
import { ReactSortable } from 'react-sortablejs'
import { useAppDispatch } from '../../../app/hooks';
import { editQuestion } from '../../../features/form/formSlice';

interface ItemType {
  id: number;
  text: string;
}

const MultipleChoice = (
  { queKey, question, isSelected, setErrors }:
    {
      queKey: string | Types.ObjectId,
      question: IQuestionForm,
      isSelected: boolean,
      setErrors: React.Dispatch<React.SetStateAction<{ titleLen: boolean; optionsLen: boolean; optionsNum: boolean; numUploads:boolean}>>
    }) => {

  const [correctOptions, setCorrectOptions] = useState<boolean[]>([])
  const [optionState, setOptionsState] = useState<ItemType[]>([]);
  // const [queOptions, setQueOptions] = useState<string[]>(question.optionsArray || []);
  const sortableOptions = useRef(null);
    
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

  // useEffect(() => {
  //   console.log("New question!", { ...question, optionsArray: queOptions })
  //   editQuestion(queKey, { ...question, optionsArray: queOptions })
  // }, [queOptions])
  useEffect(() => {
    let queOptions = optionState.map((ele)=>{return ele.text})

    // console.log("New question!", { ...question, optionsArray: queOptions })
    dispatch(editQuestion({
      queKey: queKey.toString(),
      newQue: {
        ...question,
        optionsArray: queOptions
      }
    }))
    
  }, [optionState])
  useEffect(()=>{
    let new_way = (question?.optionsArray || []).map((option,index)=>{
      return {id:index,text:option}
    }) 
    setOptionsState(new_way)
  },[])
  return (
    <ol
      className='sortable-options'
      ref={sortableOptions}
    >

      <ReactSortable
        list={optionState}
        setList={setOptionsState}
        handle='.icon-move'
      >
        {
          optionState.map((option, index) => {
            return (
              <div key={option.id} className='flex w-full py-2 items-center space-x-2'>
                {question.ans_type === 'mcq' && <div className='w-4  h-4 hover:cursor-grabbing icon-move mr-1 rounded-full border-2 border-gray-300'></div>}
                {question.ans_type === 'checkbox' && <div className='w-4 hover:cursor-grabbing icon-move mr-1 h-4  border-2 border-gray-300'></div>}
                {question.ans_type === 'dropdown' && <div className='w-5 hover:cursor-grabbing icon-move text-sm h-fit'>{index + 1}.</div>}

                <div className={`  w-full`} >
                  <input
                    onFocus={(event) => { event.target.select() }}
                    value={option.text}
                    className={`w-full outline-none border-b-2 bg-transparent ${(option.text.length > 50 || option.text.length === 0) ? 'border-b-red-700' : 'border-b-white hover:border-b-gray-300 focus:border-b-gray-300 '} `}

                    onChange={(event) => {
                      const arr_ = optionState?.slice() || []
                      if (event.target.value.length > 50 || event.target.value.length == 0) {
                        setErrors((prev) => {
                          return { ...prev, optionsLen: true }
                        })
                      } else {
                        setErrors((prev) => {
                          return { ...prev, optionsLen: false }
                        })
                      }
                      arr_[index].text = event.target.value
                      setOptionsState(arr_)
                      // editQuestion(queKey, { ...question, optionsArray: arr_ })
                    }}
                  />
                </div>

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
                  }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>

                </button>
              </div>
            )
          })
        }
      </ReactSortable>

      {/* <ReactSortable
        list={queOptions}
        setList={setQueOptions}
        handle= '.icon-move'
      >
        {
          queOptions.map((option, index) => {
            return (
              <div key={option} className='flex w-full py-2 items-center space-x-2'>
                {question.ans_type === 'mcq' && <div className='w-4  h-4 hover:cursor-grabbing icon-move mr-1 rounded-full border-2 border-gray-300'></div>}
                {question.ans_type === 'checkbox' && <div className='w-4 hover:cursor-grabbing icon-move mr-1 h-4  border-2 border-gray-300'></div>}
                {question.ans_type === 'dropdown' && <div className='w-5 hover:cursor-grabbing icon-move text-sm h-fit'>{index + 1}.</div>}

                <div className={`  w-full`} >
                  <input
                    onFocus={(event) => { event.target.select() }}
                    value={option}
                    disabled
                    className={`w-full outline-none border-b-2 bg-transparent ${(option.length > 50 || option.length === 0) ? 'border-b-red-700' : 'border-b-white hover:border-b-gray-300 focus:border-b-gray-300 '} `}

                    onChange={(event) => {
                      const arr_ = question.optionsArray?.slice() || []
                      if (event.target.value.length > 50 || event.target.value.length == 0) {
                        setErrors((prev) => {
                          return { ...prev, optionsLen: true }
                        })
                      } else {
                        setErrors((prev) => {
                          return { ...prev, optionsLen: false }
                        })
                      }
                      arr_[index] = event.target.value

                      editQuestion(queKey, { ...question, optionsArray: arr_ })
                    }}
                  />
                </div>

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
                          new_correct_ans = [option];
                        } else {
                          new_correct_ans = [];
                        }
                      } else {
                        if (!correctOptions[index]) {
                          new_correct_ans.push(option)
                        } else {
                          const index = new_correct_ans.indexOf(option);
                          new_correct_ans = new_correct_ans.slice(0, index).concat(new_correct_ans.slice(index + 1));
                        }
                      }
                      editQuestion(queKey, {
                        ...question,
                        correct_ans: new_correct_ans
                      })
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
                    const arr_ = question.optionsArray?.slice() || []
                    if (arr_.length <= 1) return;
                    const newarr_ = arr_.slice(0, index).concat(arr_.slice(index + 1, arr_.length + 1))
                    editQuestion(queKey, { ...question, optionsArray: newarr_ })
                  }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>

                </button>
              </div>
            )
          })
        }
      </ReactSortable> */}
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
            setOptionsState((prev)=>{return [...prev,{id: prev.length +1, text:`Option ${prev.length +1}`}]})
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <span>Add option</span>
        </button>
      }
    </ol>
  )
}

export default MultipleChoice