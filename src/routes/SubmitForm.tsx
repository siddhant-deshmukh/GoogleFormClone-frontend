import axios from 'axios'
import { Types } from 'mongoose'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import QuestionElement from '../components/FormEditor/question/QuestionElement'
import TitleDescFormElement from '../components/FormEditor/FormTitleDesc'
import { IAllFormQuestions, IForm, IQueResList, IQuestionForm } from '../types'

const defalutQueResList = new Map()

function SubmitForm() {
  const { formId } = useParams()

  const [quesReses, setQueReses] = useState<IQueResList>(defalutQueResList)
  const [aboutForm, setAboutForm] = useState<{ title: string, desc?: string }>({ title: '', desc: '' })
  const [queSeq, setQueSeq] = useState<(Types.ObjectId | string)[]>([])
  const [allQuestions, setAllQues] = useState<IAllFormQuestions | null>(null)

  const changeRes = (queKey: string, response: string[] | string) => {

    setQueReses(prev => {
      const new_ = new Map(prev)
      new_.set(queKey, response)
      // console.log(new_)
      return new_
    })
  }
  const submitForm = (quesReses: IQueResList, allQuestions: IAllFormQuestions | null) => {
    if (!allQuestions) return;
    const questions_: { _id: string, ans_type: IQuestionForm['ans_type'], res_array: string[] | string }[] = []
    console.log(quesReses)
    quesReses.forEach((res, qId) => {
      console.log(qId, res)
      questions_.push({
        _id: qId,
        ans_type: allQuestions[qId].ans_type,
        res_array: res
      })
    })
    console.log("Questions before sending! :", questions_)
    axios.post(`${import.meta.env.VITE_API_URL}/res`, {
      formId,
      questions: questions_
    }, { withCredentials: true })
      .then(res => {
        console.log("Sucesfully sended!", res)
      })
      .catch(err => {
        console.log("Failed", err)
      })
  }

  useEffect(() => {
    let new_queResList: IQueResList = new Map()
    if (!allQuestions) return

    console.log("URL : ", `${import.meta.env.VITE_API_URL}/res/f/${formId}`)
    axios.get(`${import.meta.env.VITE_API_URL}/res/f/${formId}`, { withCredentials: true })
      .then(res => {
        console.log('previos response', res)
        const { data } = res
        if (data.oldRes) {
          Object.keys(allQuestions).forEach((qId) => {
            const { ans_type } = allQuestions[qId.toString()]
            let res = (ans_type === "dropdown" || ans_type === "checkbox" || ans_type === "mcq") ? data.oldRes.mcq_res[qId.toString()] : data.oldRes.text_res[qId.toString()]
            new_queResList.set(
              qId as string,
              res
            )
          })
          console.log({ new_queResList })
          setQueReses(new_queResList)
        } else {
          throw 'no response found'
        }
      })
      .catch((err) => {
        console.log(err)
        Object.keys(allQuestions).forEach((qId) => {
          const { ans_type } = allQuestions[qId.toString()]

          new_queResList.set(
            qId as string,
            (ans_type === "dropdown" || ans_type === "checkbox" || ans_type === "mcq") ? [] : ""
          )
        })
        // console.log({new_queResList})
        setQueReses(new_queResList)
      })

  }, [allQuestions])

  useEffect(() => {
    if (!formId) {
      return
    }
    axios.get(`${import.meta.env.VITE_API_URL}/f/${formId}?withQuestions=true`, { withCredentials: true })
      .then((res) => {
        const { data } = res
        if (data) {
          const formInfo: IForm = data.form
          const allQ: IAllFormQuestions = data.questions
          console.log("Form data", formId, data)
          setQueSeq(formInfo.questions)
          for (let ques in allQ) {
            allQ[ques].savedChanges = true
          }
          setAllQues(allQ)
          setAboutForm({ title: formInfo.title, desc: formInfo.desc })
        }
      })
  }, [])

  return (
    <div className="flex flex-col w-screen h-screen bg-purple-100" style={{ minWidth: '352px' }}>
      <div className='relative px-2 my-2 flex  space-x-2 pr-3 w-full max-w-3xl  mx-auto  '>
        <div className='w-full h-full '>
          <TitleDescFormElement />
          <div
            id='sortable'
            className='flex flex-col  my-3 space-y-2 w-full '
          >
            {allQuestions !== null && queSeq !== null && quesReses &&
              queSeq.map((queKey) => {
                let question = allQuestions[queKey.toString()]
                let queRes = quesReses.get(queKey.toString())
                if (!queKey || queRes === null || queRes === undefined) return;
                return (
                  <QuestionElement key={queKey.toString()} queKey={queKey.toString()}
                    question={question} queRes={queRes} changeRes={changeRes} />
                )
              })
            }

            <button
              type={'submit'}
              className='px-3 py-1 bg-purple-200'
              onClick={(event) => { event.preventDefault(); console.log({ quesReses }); submitForm(quesReses, allQuestions) }}
            >
              Submit
            </button>
          </div>

          <div>
            {
              JSON.stringify({ aboutForm, queSeq })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmitForm