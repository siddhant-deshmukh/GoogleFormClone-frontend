import axios from 'axios'
import  { useEffect, useState } from 'react'

const ResSummery = ({ formId }: { formId: string }) => {
  const [smry,setSmry] = useState(null)

  useEffect(() => {
    if(smry) return
    axios.get(`${import.meta.env.VITE_API_URL}/res/summery/f/${formId}`, { withCredentials: true })
      .then((res)=>{
        const {data} = res
        if(data){
          setSmry(data)
        }
      })
      .catch((err)=>{
        //@ts-ignore
        setSmry(undefined)
      })
  }, [])

  return (
    <div>
      {
        JSON.stringify(smry)
      }
    </div>
  )
}

export default ResSummery