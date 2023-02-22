import React from 'react'
import { Link } from 'react-router-dom'
import { IFormSnippet } from '../types'

const FormCard = ({ formInfo }: { formInfo: IFormSnippet }) => {
  return (
    <div className="max-w-xs flex flex-col h-52 bg-white border  hover:border-purple-400 rounded-lg  dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/form/${formInfo._id}`} className="h-full">
        <img  className="rounded-t-lg w-full h-full" src="/docs/images/blog/image-1.jpg" alt="" />
      </Link>
      <div className="p-2 h-fit">
        <Link to={`/form/${formInfo._id}`}>
          <h5 className="mb-2  font-medium tracking-tight text-gray-700 dark:text-white">{formInfo.title}</h5>
        </Link>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{formInfo.desc}</p>
      </div>
    </div>
  )
}

export default FormCard