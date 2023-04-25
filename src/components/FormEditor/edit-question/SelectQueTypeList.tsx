import { IAnsTypes } from "../../../types"

export const ansTypesStates = {
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
  const SelectQueTypeList = ({ ansType, changeAnsType }: { ansType: IAnsTypes, changeAnsType: (prevType: IAnsTypes, selectedType: IAnsTypes) => void }) => {
  
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

  export default SelectQueTypeList