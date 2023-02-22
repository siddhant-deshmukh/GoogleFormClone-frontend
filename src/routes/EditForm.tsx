import { useCallback, useEffect, useState } from 'react'
import $ from 'jquery';
import TitleDescFormElement from '../components/TitleDescFormElement';
import QuestionFormElement from '../components/QuestionFormElement';
import { IAllFormQuestions, IForm, IFormSnippet, IQuestionForm } from '../types';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Types } from 'mongoose'
import NavBar from '../components/NavBar';

const defaultAllQuestions: IAllFormQuestions = { "0": { _id: "newId0", formId: undefined, title: 'Untitled Question', 'required': false, ans_type: 'mcq', optionsArray: ['Option 1'], correct_ans: undefined } }

function EditForm() {

  const [queSeq, setQueSeq] = useState<(Types.ObjectId | string)[]>([])
  const { formId } = useParams()
  const [allQuestions, setAllQues] = useState<IAllFormQuestions | null>(null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  // ------------------------------------------------------------------------------------------------------------------
  // -------                           functions to add and edit questions     ----------------------------------------
  // ------------------------------------------------------------------------------------------------------------------
  const editQuestion = (queKey: string | Types.ObjectId, newQuestion: IQuestionForm) => {
    setAllQues((prev) => {
      let ques_: IQuestionForm = { ...newQuestion, savedChanges: false }
      if (newQuestion.correct_ans && newQuestion.optionsArray) {
        let correct_ans = newQuestion.correct_ans?.filter(value => newQuestion.optionsArray?.includes(value));
        correct_ans = correct_ans.filter(function (item, i, ar) { return ar.indexOf(item) === i; });
        ques_ = { ...ques_, correct_ans }
      }

      return {
        ...prev,
        [queKey.toString()]: ques_
      }
    })
  }
  const addQuestion = (after?: string | Types.ObjectId, newQuestion?: IQuestionForm) => {
    const uniqueId = 'newId' + (new Date()).getTime();
    setAllQues(prev => {
      if (newQuestion) {
        return {
          ...prev,
          [uniqueId]: {
            ...newQuestion,
            _id: uniqueId
          }
        }
      }
      return {
        ...prev,
        [uniqueId]: {
          ...defaultAllQuestions["0"],
          _id: uniqueId
        }
      }
    })
    setQueSeq(prev => {
      if (after) {
        let x = prev.findIndex((key) => (key === after))
        if (x !== -1) {
          let new_ = prev.slice(0, x + 1).concat([uniqueId, ...prev.slice(x + 1)])
          return new_
        }
      }
      return prev.slice().concat([uniqueId])
    })

  }
  const deleteQuestion = (delKey: string | Types.ObjectId) => {
    setQueSeq(prev => {
      let x = prev.findIndex((key) => (key === delKey))
      let new_ = prev.slice(0, x).concat(prev.slice(x + 1))
      return new_
    })
    setAllQues(prev => {
      let new_ = { ...prev }
      delete new_[delKey.toString()]
      return new_
    })
    setSelectedKey(prev => {
      if (prev === delKey.toString()) return null
      else return prev
    })
  }
  const saveQuestion = async (queKey: string, newQuestion: IQuestionForm) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/f/${formId}/q/${queKey}`, {
      ...newQuestion
    }, { withCredentials: true })
      .then((value) => {
        console.log("Updaing Question", value)
      })
    setAllQues((prev) => {
      if (!prev) return null
      const que = prev[queKey.toString()]
      return {
        ...prev,
        [queKey.toString()]: { ...que, savedChanges: true },
      }
    })
  }
  const saveForm = async (queSeq: (string | Types.ObjectId)[], allQuestions: IAllFormQuestions | null) => {
    if (!allQuestions || queSeq.length === 0) return;
    let questions: (string | null)[] = []
    let new_questions: IQuestionForm[] = []

    let areUnsavedChanges: boolean = false
    queSeq.forEach((qId, index) => {
      let currQ = allQuestions[qId.toString()]
      delete currQ['_id']
      if (qId.toString().slice(0, 3) === "new") {
        if (currQ) {
          questions.push(null);
          new_questions.push(currQ);
        }
      } else {
        if (!currQ.savedChanges) {
          areUnsavedChanges = true;
        };
      }
    })
    if (areUnsavedChanges) {
      return
    }
    console.log("questions : ", questions)
    console.log("New Questions : ", new_questions)

    await axios.put(`${import.meta.env.VITE_API_URL}/f/${formId}`, {
      questions,
      new_questions,
      delete_questions: []
    }, { withCredentials: true })
      .then((value) => {
        console.log("Updaing Form", value)
      })
      .catch((err) => {
        console.error("Updaing Form", err)
      })
  }

  useEffect(() => {
    console.log("formId", formId)
    if (!formId) {
      setAllQues(defaultAllQuestions)
      setQueSeq(["0"])
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
          setAllQues(allQ)
        }
      })
  }, [formId])

  return (
    <div className="flex flex-col w-screen h-screen bg-purple-100" style={{ minWidth: '352px' }}>
      <div className='w-full hidden sm:block'>
        <NavBar />
      </div>
      <div className='w-full relative  justify-center  h-full overflow-y-auto'>
        <div className='w-full block sm:hidden'>
          <NavBar />
        </div>
        <main className='flex space-x-2 w-full'>
          <div className='relative px-2 my-2 flex  space-x-2 pr-3 w-full max-w-3xl  mx-auto  '>
            <div className='w-full h-full '>
              <TitleDescFormElement />
              <div id='sortable' className='flex flex-col  my-3 space-y-2 w-full '>
                {allQuestions && queSeq &&
                  queSeq.map((ele) => {
                    let isSelected = (selectedKey === ele.toString()) ? true : false
                    return (
                      <QuestionFormElement
                        key={ele.toString()}
                        queKey={ele}
                        question={allQuestions[ele.toString()]}
                        editQuestion={editQuestion}
                        deleteQuestion={deleteQuestion}
                        isSelected={isSelected}
                        setSelectedKey={setSelectedKey}
                        addQuestion={addQuestion}
                        saveQuestion={saveQuestion}
                      />
                    )
                  })
                }

                <button
                  className='px-3 py-1 bg-purple-200'
                  onClick={(event)=>{event.preventDefault(); saveForm(queSeq,allQuestions)}}>
                  Submit
                </button>
              </div>
              {
                JSON.stringify(allQuestions)
              }
            </div>
            <div className='sticky  hidden sm:flex sm:flex-col  w-fit py-2 px-1 rounded-lg h-20 bg-white top-10 border border-gray-200'>
              <button
                className='w-fit mx-auto rounded-full p-0.5  hover:bg-gray-100'
                onClick={(event) => { event.preventDefault(); addQuestion() }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              </button>
            </div>
            <button
              className='w-fit sm:hidden fixed bottom-5 right-4 mx-auto rounded-full p-2 bg-purple-600 text-white hover:bg-purple-500'
              onClick={(event) => { event.preventDefault(); addQuestion() }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            </button>

          </div>
        </main>

      </div>
    </div>
  )
}



export default EditForm
