import React, { useCallback, useEffect, useState } from 'react'
import { IAnsTypes, IQuestionForm } from '../types'

const ansTypesStates = {
  short_ans : {
    text : 'Short Answer',
    svg : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
    </svg>
  },
  long_ans : {
    text : 'Description',
    svg : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  
  },
  mcq : {
    text : 'Multiple Choice',
    svg : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
    </svg>
  
  },
  checkbox : {
    text : 'Check box',
    svg : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>    
  },
  dropdown : {
    text : 'Dropdown',
    svg : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
    </svg>    
  },
} 

const SelectFromAnsTypes = ({ansType,changeAnsType}:{ansType: IAnsTypes,changeAnsType: (prevType: IAnsTypes, selectedType: IAnsTypes) => void}) => {
  
  const typesArr  = ['short_ans','long_ans','mcq','checkbox','dropdown']
  return (
    <div className={`absolute w-52 z-30 flex flex-col bg-white border border-gray-300`}>
      {
        typesArr.map((type)=>{
          return (
            <button 
              onClick={(event)=>{event.preventDefault(); changeAnsType(ansType,type as IAnsTypes)}}
              className={`w-full items-center ${(type!==ansType)?'bg-white':'bg-cyan-50'} flex  p-2 py-3 space-x-4`}>
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

const QuestionFormElement = ({queKey,question,editQuestion}:{queKey:number,question:IQuestionForm,editQuestion: (queKey: number, newQuestion: IQuestionForm) => void}) => {

  const [chooseAnsTypeToggle,setChooseAnsTypeToggle]=useState<boolean>(false)
  
  const changeAnsType = (prevType : IAnsTypes,selectedType : IAnsTypes) =>{
    setChooseAnsTypeToggle(false)
    if(prevType === selectedType) return;
    if(selectedType  === 'checkbox' || selectedType === 'mcq' || selectedType === 'dropdown'){
      if(!(prevType === 'checkbox' || prevType === 'mcq' || prevType === 'dropdown')){
        editQuestion(queKey,{...question,type:selectedType,ansOption:['Option 1']})
      }else{
        editQuestion(queKey,{...question,type:selectedType})
      }
    }else if(selectedType === 'short_ans' || selectedType === 'long_ans'){
      editQuestion(queKey,{...question,type:selectedType,ansOption:(selectedType==='short_ans')?'Short Ans':'Description'})
    }else{
      
    }
  }
  
  return (
    <div className='w-full pt-2 pb-4 px-3 bg-white border-l-4 rounded-lg border-blue-500'>
      <div className='w-full h-fit flex  items-center'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-3 h-fit mx-auto">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      </div>
      <div className='flex flex-col space-y-3 w-full '>
        <div className='flex w-full  items-center justify-between space-x-4'>
          <input
            className='py-3 pl-3 font-normal text-sm w-full bg-gray-100 border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 '
            placeholder={'Question'} 
            value={question.title}
            onChange={(event)=>{event.preventDefault(); editQuestion(queKey,{...question,title:event.target.value})}}
            />
          <div className='relative w-56'>
            {
              !chooseAnsTypeToggle &&
            <button 
              onClick={(event)=>{event.preventDefault(); setChooseAnsTypeToggle(true)}}
              className='w-full items-center flex border border-gray-300 p-2  justify-between'>
              {/* @ts-ignore */}
              {ansTypesStates[question.type].svg}
              {/* @ts-ignore */}
              <span className='w-full text-xs text-left pl-2'>{ansTypesStates[question.type].text}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            }{
              chooseAnsTypeToggle && 
              <SelectFromAnsTypes ansType={question.type} changeAnsType={changeAnsType}/>
            }
          </div>

        </div>
        {
          question.desc && 
          <input
            onFocus={(event) => { event.target.select() }}
            className='text-xs border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 py-1 '
            placeholder={'Description'}
            value={question.desc}
            onChange={(event)=>{event.preventDefault(); editQuestion(queKey,{...question,desc:event.target.value})}} />
        }
      </div>

      <div className='w-full flex flex-col space-y-2'>
        {
          (question.type === 'mcq' || question.type === 'checkbox' || question.type === 'dropdown') &&
          <div>

            { //@ts-ignore
            question.ansOption?.map((option,index)=>{
              return (
                <div className='flex w-full py-2 items-center space-x-4'>
                  {question.type === 'mcq' && <div className='w-4 h-4 rounded-full border-2 border-gray-300'></div>}
                  {question.type === 'checkbox' && <div className='w-4 h-4  border-2 border-gray-300'></div>}
                  {question.type === 'dropdown' && <div className='w-4  text-sm h-fit'>{index}.</div>}
                  <div className='w-full'>
                    <input 
                      value = {option}
                      onChange = { (event)=>{
                        const arr_ = [...question.ansOption]
                        arr_[index] = event.target.value
                        editQuestion(queKey,{...question,ansOption:arr_})
                      }}
                    />
                  </div>
                  <button 
                    className='w-fit text-sm  px-2 py-1 rounded-full hover:bg-gray-100'
                    onClick={(event)=>{
                      event.preventDefault();
                      const arr_ =  [...question.ansOption]
                      const newarr_ = [...arr_.slice(0,index) , ...arr_.slice(index+1,arr_.length+1)]
                      editQuestion(queKey,{...question,ansOption:newarr_})
                    }}>
                      X
                  </button>
                </div>
                )
            })}
            <button
              onClick={(event)=>{
                event.preventDefault(); 
                //@ts-ignore
                console.log(question.ansOption)
                const newOptions = (question.ansOption && typeof question.ansOption !=='string')?[...question.ansOption,`Option ${question.ansOption.length + 1}`]:['Option 1'];
                console.log(newOptions , question.ansOption)
                editQuestion(queKey,{...question,ansOption:newOptions})}}
            >Add option</button>
          </div>
        }
        {
          (question.type === 'short_ans' || question.type === 'long_ans') && 
          <div>

          </div>
        }
      </div>
    </div>
  )
}

export default React.memo(QuestionFormElement)