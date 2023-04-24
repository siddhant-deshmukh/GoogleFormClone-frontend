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

  queSeq: { id: string, index: number }[],
  allQuestions: IAllFormQuestions,
  selectedKey: string | undefined,
}

export const formSlice = createSlice({
  name: 'form',
  initialState: {
    formId: undefined,
    aboutForm: {
      title: '',
      desc: '',
    },
    queSeq: [],
    allQuestions: {},
    selectedKey: undefined,
  } as FormSlice,
  reducers: {
    setFormId: (state, action: PayloadAction<string>) => {
      state.formId = action.payload
    },
    setAboutForm: (state, action: PayloadAction<{ title: string, desc: string }>) => {
      state.aboutForm = action.payload
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

    addQuestion: (state, action: PayloadAction<{ prev_id?: string, }>) => {
      if (state.queSeq.length > 20) return;
      const uniqueId = 'newId' + (new Date()).getTime();

      //  changing all questions
      state.allQuestions = {
        ...state.allQuestions,
        [uniqueId]: {
          ...defaultQuestion,
          _id: uniqueId,
          formId: state.formId
        }
      }

      //  changing the question sequance
      let newSeq = state.queSeq
      if (action.payload) {
        let index_ = newSeq.findIndex((ele) => (ele.id === action.payload))
        if (index_ === -1) {
          state.queSeq = newSeq.concat([{ id: uniqueId, index: state.queSeq.length }])
        } else {
          state.queSeq = newSeq.slice(0, index_).concat([{ id: uniqueId, index: state.queSeq.length }, ...newSeq.slice(index_)])
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

      if (action.payload.queKey === state.selectedKey) {
        if (x === state.queSeq.length + 1) {
          if (x === 1) {
            state.selectedKey = undefined
          } else {
            state.selectedKey = state.queSeq[x - 1].id
          }
        } else {
          state.selectedKey = state.queSeq[x].id
        }
      }
    },
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
} = formSlice.actions

export const selectedKey = (state: FormSlice) => state.selectedKey
export const queSeq = (state: FormSlice) => state.queSeq
export const allQuestions = (state: FormSlice) => state.allQuestions

export default formSlice.reducer