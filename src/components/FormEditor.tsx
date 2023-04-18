import axios, { AxiosError } from 'axios'
import { Types } from 'mongoose'
import React, { useCallback, useEffect, useState } from 'react'
import { IAllFormQuestions, IQuestionForm } from '../types'
import QuestionFormElement from './FormEditor/QuestionFormElement'
import TitleDescFormElement from './FormEditor/TitleDescFormElement'
import { ReactSortable, Sortable } from 'react-sortablejs'

const defaultAllQuestions: IAllFormQuestions = { "0": { _id: "newId0", formId: undefined, title: 'Untitled Question', 'required': false, ans_type: 'mcq', optionsArray: ['Option 1'], correct_ans: undefined } }
export interface ItemType {
  id: string
}

// Sortable.create(element, {
//   group: " groupName",
//   animation: 200,
//   delayOnTouchStart: true,
//   delay: 2,
// });

function FormEditor(
  { aboutForm, setAboutForm, formId, queSeq, allQuestions, queListState, setQueSeq, setAllQues, setErrMsg, setQueListState, setSuccessMsg, selectQuestionRef }: {
    aboutForm: { title: string, desc?: string | undefined },
    setErrMsg: React.Dispatch<React.SetStateAction<string>>,
    formId: string | undefined,
    queSeq: (string | Types.ObjectId)[],
    queListState: ItemType[],
    allQuestions: IAllFormQuestions | null,
    setSuccessMsg: React.Dispatch<React.SetStateAction<string>>,
    setQueListState: React.Dispatch<React.SetStateAction<ItemType[]>>,
    setQueSeq: React.Dispatch<React.SetStateAction<(string | Types.ObjectId)[]>>,
    setAllQues: React.Dispatch<React.SetStateAction<IAllFormQuestions | null>>,
    setAboutForm: React.Dispatch<React.SetStateAction<{ title: string, desc?: string | undefined }>>,
    selectQuestionRef: React.MutableRefObject<HTMLDivElement | null>
  }
) {

  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [savingChanges, setSaving] = useState<boolean>(false)
  const [copyPaperLink, setCopyLink] = useState<boolean>(false)


  const editQuestion = (queKey: string | Types.ObjectId, newQuestion: IQuestionForm) => {
    setAllQues((prev) => {
      let ques_: IQuestionForm = { ...newQuestion, savedChanges: undefined }
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
  const addQuestion = useCallback((after?: string | Types.ObjectId | null, newQuestion?: IQuestionForm) => {
    if (queSeq && queSeq.length >= 20) {
      setErrMsg('Question number should not exceed 20')
      return
    }
    const uniqueId = 'newId' + (new Date()).getTime();
    setSelectedKey(uniqueId)

    console.log(uniqueId)

    setAllQues(prev => {
      if (newQuestion) {
        return {
          ...prev,
          [uniqueId]: {
            ...newQuestion,
            meow: 'meow',
            _id: uniqueId
          }
        }
      } else {
        return {
          ...prev,
          [uniqueId]: {
            ...defaultAllQuestions["0"],
            _id: uniqueId
          }
        }
      }
    })
    // setQueSeq(prev => {
    //   if (after) {
    //     let x = prev.findIndex((key) => (key === after))
    //     if (x !== -1) {
    //       let new_ = prev.slice(0, x + 1).concat([uniqueId, ...prev.slice(x + 1)])
    //       return new_
    //     }
    //   }
    //   return prev.slice().concat([uniqueId])
    // })
    setQueListState(prev => {
      if (after) {
        let x = prev.findIndex((key) => (key.id === after))
        if (x !== -1) {
          let new_ = prev.slice(0, x + 1).concat([{ id: uniqueId }, ...prev.slice(x + 1)])
          return new_
        }
      }
      return prev.slice().concat([{ id: uniqueId }])
    })
  }, [queSeq])
  const deleteQuestion = useCallback((delKey: string | Types.ObjectId | null) => {
    if (!delKey) return
    let x: number | null = queListState.findIndex((key) => (key.id === delKey))
    if ((queListState[x - 1] && queListState[x - 1].id)) {
      x = x - 1
    } else if (queListState[x + 1] && queListState[x + 1].id) {
      x = x + 1
    } else {
      x = null
    }
    // console.log('After delteing',queListState[x].id.toString())
    setSelectedKey(prev => {
      if (prev === delKey.toString()) return (x) ? queListState[x].id.toString() : null
      else return prev
    })

    setAllQues(prev => {
      let new_ = { ...prev }
      delete new_[delKey.toString()]
      return new_
    })

    setQueListState(prev => {
      let x = prev.findIndex((key) => (key.id === delKey))
      let new_ = prev.slice(0, x).concat(prev.slice(x + 1))
      return new_
    })

  }, [queListState])
  const saveQuestion = async (queKey: string, newQuestion: IQuestionForm) => {
    await axios.put(`${import.meta.env.VITE_API_URL}/f/${formId}/q/${queKey}`, {
      ...newQuestion
    }, { withCredentials: true })
      .then((value) => {
        // console.log("Updaing Question", value)
        setAllQues((prev) => {
          if (!prev) return null
          const que = prev[queKey.toString()]
          return {
            ...prev,
            [queKey.toString()]: { ...que, savedChanges: true },
          }
        })
      })
      .catch((err: AxiosError) => {
        //@ts-ignore
        let { msg } = err.response?.data
        // console.log(msg)
        setErrMsg(msg || "Some error occured while saving question!")
      })
  }
  const saveForm = async (queSeq: (string | Types.ObjectId)[], allQuestions: IAllFormQuestions | null, aboutForm: { title: string, desc?: string | undefined }) => {
    if (!allQuestions || queSeq.length === 0) {
      // console.log("No queSeq or questions to submit")
      return
    };
    let questions: (string | null)[] = []
    let new_questions: IQuestionForm[] = []

    let areUnsavedChanges: boolean | undefined = false
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
          areUnsavedChanges = undefined;
        };
      }
    })
    if (areUnsavedChanges) {
      setErrMsg("Please save all the questions!")
      // console.log("Their are some unsaved questions first!")
      return

    }
    // console.log("questions : ", questions)
    // console.log("New Questions : ", new_questions)

    await axios.put(`${import.meta.env.VITE_API_URL}/f/${formId}`, {
      title: aboutForm.title,
      desc: aboutForm.desc,
      questions,
      new_questions,
      delete_questions: []
    }, { withCredentials: true })
      .then((value) => {
        // console.log("Updaing Form", value)
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
        setSuccessMsg("Sucesfully saved the changes!")
      })
      .catch((err: AxiosError) => {
        //@ts-ignore
        let { msg } = err.response?.data
        // console.log(msg)
        setErrMsg(msg || "Some error occured while saving form!")
      })
  }
  const editFormInfo = (title: string, desc: string) => {
    setAboutForm(prev => { return { ...prev, title, desc } })
  }

  useEffect(() => {
    if (queListState.length === 0) return;
    const queSeq_ = queListState.map((ele) => { return ele.id })
    // setSelectedKey(queSeq_[0])
    setQueSeq(queSeq_)
  }, [queListState])
  useEffect(() => {

  }, [])
  // console.log(allQuestions)
  // useEffect(()=>{
  //   console.log(queSeq)
  //   const queList_ = queSeq.map((key)=>{return {id:key.toString()}})
  //   setQueListState(queList_)
  // },[])

  return (
    <div className='relative  my-2 flex px-0.5 space-x-2   w-full  max-w-[600px]  slg:max-w-[700px]  mx-auto '>
      <div className='w-full h-full  '>
        <TitleDescFormElement editFormInfo={editFormInfo} aboutForm={aboutForm} />

        <ReactSortable
          animation={200}
          delayOnTouchOnly={true}
          delay={2}
          ghostClass={'opacity-40'}
          list={queListState} setList={setQueListState}
          handle=".question-sort-handle"
          id='sortable' className='flex flex-col  my-3 space-y-2 w-full '>
          {
            allQuestions && queSeq &&
            queListState.map((ele) => {
              let isSelected = (selectedKey === ele.id.toString()) ? 'true' : 'false'
              if (!allQuestions[ele.id.toString()]) return <></>
              return (
                <QuestionFormElement
                  key={ele.id.toString()}
                  queKey={ele.id}
                  question={allQuestions[ele.id.toString()]}
                  editQuestion={editQuestion}
                  deleteQuestion={deleteQuestion}
                  isSelected={(selectedKey === ele.id.toString()) ? 'true' : 'false'}
                  setSelectedKey={setSelectedKey}
                  addQuestion={addQuestion}
                  saveQuestion={saveQuestion}
                  selectQuestionRef={selectQuestionRef}
                />
              )
            })
          }

        </ReactSortable>

        <button
          className='px-3 py-1 bg-purple-200 '
          disabled={savingChanges}
          onClick={(event) => {
            event.preventDefault();
            setSaving(true)
            saveForm(queSeq, allQuestions, aboutForm)
              .finally(() => {
                setSaving(false)
              })
          }}>
          Submit
        </button>
        {/* {
          JSON.stringify(queSeq)
        } */}
      </div>

      {/* Side Button to add new question */}
      <div className='side-button absolute  hidden sm:flex flex-col space-y-2  w-fit py-2 px-1 rounded-lg h-20 bg-white  border border-gray-200'>
        <button
          className='w-fit mx-auto rounded-full p-0.5  hover:bg-gray-100'
          onClick={(event) => { event.preventDefault(); addQuestion(selectedKey) }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 rounded-full border-2 border-gray-500 ">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        </button>
        <button
          className='relative w-fit mx-auto rounded-full p-0.5  hover:bg-gray-100'
          onClick={(event) => {
            event.preventDefault();
            navigator.clipboard.writeText(window.location.href)
            setCopyLink(true)
            setTimeout(()=>{
              setCopyLink(false)
            },1000)
          }}>
          {
            !copyPaperLink &&
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 p-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          }
          {
            copyPaperLink &&
            <svg xmlns="http://www.w3.org/2000/svg" fill="#30912f" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          {
            copyPaperLink &&
            <div className='absolute w-fit inline-flex -bottom-10 -left-5 p-1 bg-gray-600 text-white text-xs'>
              Link&nbsp;Copied!
            </div>
          }
        </button>
      </div>
      {/* Side Button to add new question in sm mode*/}
      <button
        className='w-fit sm:hidden fixed bottom-5 right-4 mx-auto rounded-full p-2 bg-purple-600 text-white hover:bg-purple-500'
        onClick={(event) => { event.preventDefault(); addQuestion(selectedKey) }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
        <div className='opacity-40 '></div>
      </button>
      <button
        className='w-fit sm:hidden fixed bottom-20 right-4 mx-auto rounded-full p-2 bg-purple-600 text-white hover:bg-purple-500'
        onClick={(event) => {
          event.preventDefault();
          navigator.clipboard.writeText(window.location.href)
        }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
        <div className='opacity-40 '></div>
      </button>

    </div>
  )
}

export default React.memo(FormEditor)