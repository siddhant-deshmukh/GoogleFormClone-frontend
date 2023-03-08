import axios from 'axios'
import { Types } from 'mongoose'
import React, { useState } from 'react'
import { IAllFormQuestions, IQuestionForm } from '../../types'
import QuestionFormElement from './components/QuestionFormElement'
import TitleDescFormElement from './components/TitleDescFormElement'

const defaultAllQuestions: IAllFormQuestions = { "0": { _id: "newId0", formId: undefined, title: 'Untitled Question', 'required': false, ans_type: 'mcq', optionsArray: ['Option 1'], correct_ans: undefined } }

function FormEditor(
  { aboutForm,setAboutForm, formId, queSeq, allQuestions,  setQueSeq, setAllQues }: {
    aboutForm: { title: string, desc?: string | undefined },
    formId: string | undefined,
    queSeq: (string | Types.ObjectId)[],
    allQuestions: IAllFormQuestions | null,
    setQueSeq: React.Dispatch<React.SetStateAction<(string | Types.ObjectId)[]>>,
    setAllQues: React.Dispatch<React.SetStateAction<IAllFormQuestions | null>>,
    setAboutForm: React.Dispatch<React.SetStateAction<{ title: string, desc?: string | undefined }>>
  }
) {

  const [selectedKey, setSelectedKey] = useState<string | null>(null)

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
  const saveForm = async (queSeq: (string | Types.ObjectId)[], allQuestions: IAllFormQuestions | null, aboutForm: { title: string, desc?: string | undefined }) => {
    if (!allQuestions || queSeq.length === 0) {
      console.log("No queSeq or questions to submit")
      return
    };
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
        questions.push(qId.toString());
        if (!currQ.savedChanges) {
          areUnsavedChanges = true;
        };
      }
    })
    if (areUnsavedChanges) {
      console.log("Their are some unsaved questions!")
      return
    }
    // console.log("questions : ", questions)
    // console.log("New Questions : ", new_questions)

    await axios.put(`${import.meta.env.VITE_API_URL}/f/${formId}`, {
      title: aboutForm.title,
      desc:aboutForm.desc,
      questions,
      new_questions,
      delete_questions: []
    }, { withCredentials: true })
      .then((value) => {
        console.log("Updaing Form", value)
        const { data } = value
        const { questions: new_questions } = data

        let newQuestions_ = { ...allQuestions }
        queSeq.forEach((qId, index) => {
          if (qId.toString().slice(0, 3) === "new") {
            newQuestions_[new_questions[index]] = { ...newQuestions_[qId.toString()], savedChanges: true }
            delete newQuestions_[qId.toString()]
          }
        })
        setQueSeq(new_questions)
        setAllQues(newQuestions_)
      })
      .catch((err) => {
        console.error("Updaing Form", err)
      })
  }
  const editFormInfo = (title : string,desc : string) => {
    setAboutForm(prev=>{return {...prev,title,desc}})
  }
  return (
    <div className='relative px-2 my-2 flex  space-x-2 pr-3 w-full max-w-3xl  mx-auto  '>
      <div className='w-full h-full '>
        <TitleDescFormElement editFormInfo={editFormInfo} aboutForm={aboutForm}/>
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
            onClick={(event) => { event.preventDefault(); saveForm(queSeq, allQuestions, aboutForm) }}>
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
  )
}

export default React.memo(FormEditor)