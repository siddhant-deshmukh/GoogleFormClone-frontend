import React from 'react'

const TitleDescFormElement = () => {
  return (
    <div className='flex flex-col space-y-3 w-full pt-2 pb-4 px-3 bg-white border-t-8 border-t-purple-800 border-l-4 rounded-lg border-blue-500'>
      <input
        className='text-2xl border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 py-1 '
        style={{ fontWeight: '500px' }}
        defaultValue={'Untitle Form'} />
      <input
        onFocus={(event) => { event.target.select() }}
        className='text-xs border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 py-1 '
        defaultValue={'Form Description'} />
    </div>
  )
}

export default TitleDescFormElement