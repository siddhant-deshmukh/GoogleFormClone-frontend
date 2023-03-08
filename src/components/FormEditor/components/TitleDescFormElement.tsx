import React from 'react'

const TitleDescFormElement = (
  {aboutForm, editFormInfo} : {
    aboutForm: { title: string, desc?: string | undefined },
    editFormInfo?: (title: string, desc: string) => void,
  }
) => {
  return (
    <div className='flex flex-col space-y-3 w-full pt-2 pb-4 px-3 bg-white border-t-8 border-t-purple-800 border-l-4 rounded-lg border-blue-500'>
      <input
        className='text-2xl border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 py-1 '
        style={{ fontWeight: '500px' }}
        value={aboutForm?.title || ''}
        placeholder='Untitle Form'
        disabled={editFormInfo===undefined}
        onChange={(event)=>{event.preventDefault(); if(editFormInfo)editFormInfo(event.target.value,aboutForm?.desc || '') ;}}
        />
      <input
        onFocus={(event) => { event.target.select() }}
        value={aboutForm?.desc || ''}
        placeholder='Form Description'
        className='text-xs border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 py-1 '
        disabled={editFormInfo===undefined}
        onChange={(event)=>{event.preventDefault(); if(editFormInfo)editFormInfo(aboutForm?.title,event.target.value)}}
        />
    </div>
  )
}

export default TitleDescFormElement