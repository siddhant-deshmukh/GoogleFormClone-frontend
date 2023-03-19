import React from 'react'
import { Link } from 'react-router-dom'
import { IFormSnippet } from '../types'

const FormCard = ({ formInfo }: { formInfo: IFormSnippet }) => {
  return (
    <div className="max-w-xs  h-52 bg-white border-2 border-gray-600   rounded-lg  dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/form/${formInfo._id}/edit`} className="w-full flex h-2/6 items-center border-b border-b-gray-500">
        <img  className="rounded-t-lg  mx-auto" src="/google-form.svg" alt="" />
      </Link>
      <div  className="h-5/6">
        <Link to={`/form/${formInfo._id}/edit`} className=" ">
          <h5 className=" h-1/3 overflow-hidden font-medium tracking-tight  w-full p-2  text-gray-700 dark:text-white">{formInfo.title}</h5>
        </Link>
        <p className=" h-2/3 p-2 text-xs overflow-hidden font-normal text-gray-700 dark:text-gray-400">{formInfo.desc}</p>
      </div>
    </div>
  )
}

export default FormCard