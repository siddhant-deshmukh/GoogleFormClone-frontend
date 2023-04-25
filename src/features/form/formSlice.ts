import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IAllFormQuestions, IQuestionForm } from '../../types'

const defaultQuestion: IQuestionForm = {
  _id: "newId0",
  formId: undefined,
  title: 'Untitled Question',
  'required': false,
  ans_type: 'mcq',
  optionsArray: ['Option 1'],
  correct_ans: undefined
}

interface FormSlice {
  formId?: string,
  aboutForm: {
    title: string,
    desc: string,
  },

  queSeq: { id: string, index?: number }[],
  allQuestions: IAllFormQuestions,
  selectedKey: string | undefined,
}

export const formSlice = createSlice({
  name: 'form',
  initialState: {
    formId: undefined,
    aboutForm: {
      title: 'Untitled Form',
      desc: '',
    },
    queSeq: [{ id: "newId0" }],
    allQuestions: { "newId0": defaultQuestion },
    selectedKey: "newId0",
  } as FormSlice,
  reducers: {
    setFormId: (state, action: PayloadAction<string>) => {
      state.formId = action.payload
    },
    setAboutForm: (state, action: PayloadAction<{ title?: string, desc?: string }>) => {
      if (action.payload.title) {
        state.aboutForm.title = action.payload.title
      }
      if (action.payload.desc) {
        state.aboutForm.desc = action.payload.desc
      }
    },
    setQueSeq: (state, action: PayloadAction<{ id: string, index: number }[]>) => {
      state.queSeq = action.payload
    },
    setAllQuestions: (state, action: PayloadAction<IAllFormQuestions>) => {
      state.allQuestions = action.payload
    },
    setSelectedKey: (state, action: PayloadAction<string>) => {
      state.selectedKey = action.payload
    },

    addQuestion: (state, action: PayloadAction<{ prev_id?: string, newQue?: IQuestionForm }>) => {
      if (state.queSeq.length > 20) return;
      const uniqueId = 'newId' + (new Date()).getTime();


      //  changing all questions
      state.allQuestions = {
        ...state.allQuestions,
        [uniqueId]: {
          ...((action.payload.newQue) ? action.payload.newQue : defaultQuestion),
          _id: uniqueId,
          formId: state.formId
        }
      }

      //  changing the question sequance
      let newSeq = state.queSeq
      if (action.payload.prev_id || state.selectedKey) {
        let index_ = newSeq.findIndex((ele) => (ele.id === (action.payload.prev_id || state.selectedKey)))
        if (index_ === -1) {
          state.queSeq = newSeq.concat([{ id: uniqueId, index: state.queSeq.length }])
        } else {
          state.queSeq = newSeq.slice(0, index_ + 1).concat([{ id: uniqueId, index: state.queSeq.length }, ...newSeq.slice(index_ + 1)])
        }
      } else {
        state.queSeq = newSeq.concat([{ id: uniqueId, index: state.queSeq.length }])
      }

      // chaging selectedKey
      state.selectedKey = uniqueId
    },
    editQuestion: (state, action: PayloadAction<{ queKey: string, newQue: IQuestionForm }>) => {
      state.allQuestions = {
        ...state.allQuestions,
        [action.payload.queKey]: action.payload.newQue
      }
    },
    deleteQuestion: (state, action: PayloadAction<{ queKey: string }>) => {
      let x = state.queSeq.findIndex((ele) => ele.id === action.payload.queKey)

      if (x > 0) {
        state.queSeq = state.queSeq.slice(0, x).concat(state.queSeq.slice(x + 1))
      } else if (x == 0) {
        state.queSeq = state.queSeq.slice(1)
      } else return;

      let allQuestions_ = { ...state.allQuestions }
      delete allQuestions_[action.payload.queKey]
      state.allQuestions = allQuestions_

      let selectedKey = state.selectedKey
      if (state.queSeq.length > 0) {
        if (x === state.queSeq.length) {
          if (x === 1) {
            selectedKey = undefined
          } else {
            selectedKey = state.queSeq[x - 1].id
          }
        } else {
          selectedKey = state.queSeq[x].id
        }
      }
      state.selectedKey = selectedKey
    },
    functionForSorting: (state, action: PayloadAction<{ oldIndex: number, newIndex: number, questionId?: string }>) => {

      if (action.payload.questionId) {
        if (state.allQuestions[action.payload.questionId] && state.allQuestions[action.payload.questionId].optionsArray) {
          let optionsArray = state.allQuestions[action.payload.questionId].optionsArray
          if (optionsArray) {
            if (action.payload.oldIndex < 0 || action.payload.newIndex < 0 ||
              action.payload.newIndex > optionsArray.length - 1 || action.payload.oldIndex > optionsArray.length - 1) return;
            let value = optionsArray[action.payload.oldIndex]
            let arr_ = optionsArray.slice(0, action.payload.oldIndex).concat(optionsArray.slice(action.payload.oldIndex + 1))
            optionsArray = arr_.slice(0, action.payload.newIndex).concat([value, ...arr_.slice(action.payload.newIndex)])

            state.allQuestions[action.payload.questionId].optionsArray = optionsArray
          }
        }
      } else {
        if (action.payload.oldIndex < 0 || action.payload.newIndex < 0 ||
          action.payload.newIndex > state.queSeq.length - 1 || action.payload.oldIndex > state.queSeq.length - 1) return;
        let value = state.queSeq[action.payload.oldIndex]
        let arr_ = state.queSeq.slice(0, action.payload.oldIndex).concat(state.queSeq.slice(action.payload.oldIndex + 1))
        state.queSeq = arr_.slice(0, action.payload.newIndex).concat([value, ...arr_.slice(action.payload.newIndex)])
      }
    },
    functionForOptionEdit: (state, action: PayloadAction<{ index?: number, text?: string, queKey: string, newOpt? : true, delOpt?:true }>) => {
      // console.log(state.allQuestions[action.payload.queKey].optionsArray[action.payload.index], index)
      // console.log(action.payload.index,action.payload.text,action.payload.queKey,action.payload.newOpt)
      if(action.payload.newOpt){
        if(state.allQuestions[action.payload.queKey]){
          let optArray = state.allQuestions[action.payload.queKey].optionsArray
          if(optArray && Array.isArray(optArray) ){
            let text = action.payload.text || `Option ${optArray.length + 1}`
            state.allQuestions[action.payload.queKey].optionsArray = [...optArray, text]
          }else{
            state.allQuestions[action.payload.queKey].optionsArray = ['Option 1']
          }
        }
      }else if(action.payload.delOpt){
        let optArray = state.allQuestions[action.payload.queKey].optionsArray
        if(optArray && Array.isArray(optArray) && typeof action.payload.index === 'number'){
          if(action.payload.index === 0){
            optArray = optArray.slice(1)
          }else{
            optArray = optArray.slice(0,action.payload.index).concat(optArray.slice(action.payload.index+1))
          }
          state.allQuestions[action.payload.queKey].optionsArray = optArray
        }

      } else if(typeof action.payload.index === 'number'){
        // console.log(action.payload.queKey, state.allQuestions[action.payload.queKey],state.allQuestions[action.payload.queKey].optionsArray,action.payload.index ,(state.allQuestions[action.payload.queKey].optionsArray?.length || -1))
        if (action.payload.queKey && state.allQuestions[action.payload.queKey] &&
          state.allQuestions[action.payload.queKey].optionsArray &&
          action.payload.index < (state.allQuestions[action.payload.queKey].optionsArray?.length || -1)
        ) {
          // console.log(action.payload.index,action.payload.text,action.payload.queKey,action.payload.newOpt)
          //@ts-ignore
          state.allQuestions[action.payload.queKey].optionsArray[action.payload.index] = action.payload.text
          
        }
      }
    }
  }
})

export const {
  setFormId,
  setAboutForm,
  setQueSeq,
  setSelectedKey,
  setAllQuestions,

  addQuestion,
  deleteQuestion,
  editQuestion,
  functionForSorting,
  functionForOptionEdit,
} = formSlice.actions

export const selectedKey = (state: FormSlice) => state.selectedKey
export const queSeq = (state: FormSlice) => state.queSeq
export const allQuestions = (state: FormSlice) => state.allQuestions

export default formSlice.reducer






/**
 

get for

axios.get(`${import.meta.env.VITE_API_URL}/f/${formId}?withQuestions=true`, { withCredentials: true })
      .then((res) => {
        const { data } = res
        if (data) {
          const formInfo: IForm = data.form
          const allQ: IAllFormQuestions = data.questions
          // console.log("Form data", formId, data)

          const allQueList_ = formInfo.questions.map((queKey) => { return { id: queKey.toString() } })
          setQueListState(allQueList_)
          for (let ques in allQ) {
            allQ[ques].savedChanges = true
          }
          setAllQues(allQ)
          setAboutForm({ title: formInfo.title, desc: formInfo.desc })
        }
      }).catch((err) => {
        //@ts-ignore
        let { msg } = err.response?.data
        // console.log(msg)
        setErrMsg(msg || "Some error occured while getting questions and form!")
      })




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
 */