import { Types } from 'mongoose'
import { ItemType } from './components/FormEditor'
export type IAnsTypes = 'short_ans' | 'long_ans' | 'mcq' | 'checkbox' | 'dropdown' | 'mcq_grid' | 'checkboc_grid' | 'range' | 'date'

export type IMultipleChoicesAns = string[]
export type ITextAns = string
export interface IGridAns {
    row: string[],
    col: string[]
}
export interface IQuestionForm {
    _id?: string,
    formId?: string,
    required: boolean,
    title: string,
    desc?: string,
    ans_type: 'short_ans' | 'long_ans' | 'mcq' | 'checkbox' | 'dropdown', // | 'mcq_grid' | 'checkboc_grid' | 'range' | 'date' | 'time',
    optionsArray?: string[],
    correct_ans?: string[],
    point?: number,
    savedChanges?: boolean,
}
export interface IAllFormQuestions {
    [id: string]: IQuestionForm
}


export interface IUserSnippet {
    name: string,
    bio?: string,
}
export interface IUser extends IUserSnippet {
    _id: Types.ObjectId,
    forms: Types.ObjectId[],
    auth_type: string[],
    email?: string,
}
export interface IUserStored extends IUser {
    email: string,
    password?: string,
}
export interface IForm {
    author: Types.ObjectId,
    title: string,
    desc?: string,
    starttime?: Date,
    endtime?: Date,
    questions: Types.ObjectId[]
}

export interface IFormSnippet {
    _id: Types.ObjectId,
    title: string,
    desc?: string,
    starttime?: Date,
    endtime?: Date,
}

export interface IRes_b {
    userId: Types.ObjectId,
    formId: Types.ObjectId,
    mcq_res?: Map<string, string[]>,
    text_res?: Map<string, string>,
    result?: number
}
export interface IEditFormState {
    formId: string | undefined,
    selectedKey: string | null,
    aboutForm: { title: string, desc?: string },

    queSeq: (Types.ObjectId | string)[],
    allQuestions: IAllFormQuestions | null,
    queListState: ItemType[],

    errMsg: string,
    warnMsg: string,
    successMsg: string,
}
type IEditQuestion = {
    type: 'editQuestion',
    payload: {
        queKey: string | Types.ObjectId,
        newQuestion: IQuestionForm
    }
}
type IAddQuestion = {
    type: 'addQuestion',
    payload: {
        // queSeq
        after?: string | Types.ObjectId | null,
        newQuestion?: IQuestionForm
    }
}
type IDeleteQuestion = {
    type: 'deleteQuestion',
    payload: {
        // queListState
        delKey: string | Types.ObjectId | null
    }
}
type IChangeQueState = {
    type: 'changeQueState',
    payload: {
        queKey: string,
        newQuestion: IQuestionForm
    }
}
type ISaveForm = {
    type: 'saveForm',
    payload: {
        queSeq: (string | Types.ObjectId)[],
        allQuestions: IAllFormQuestions | null,
        aboutForm: { title: string, desc?: string | undefined }
    }
}
type IEditFormInfo = {
    type: 'editFormInfo',
    payload: {
        title: string,
        desc?: string
    }
}
type IEditMsg = {
    type: 'editMsg',
    payload: {
        type: 'error' | 'sucess' | 'warn',
        msg: string,
    }
}
type ISetAllQues = {
    type: 'setAllQues',
    payload: {
        allQuestions: IAllFormQuestions
    }
}
type ISetQuesSeq = {
    type: 'setQuesSeq',
    payload: {
        queSeq: (Types.ObjectId | string)[],
    }
}
type ISetQuesList = {
    type: 'setQuesList',
    payload: {
        queListState: ItemType[],
    }
}
export type EdtiFormAction = IEditFormInfo | IAddQuestion | IDeleteQuestion | IChangeQueState | ISaveForm | IEditFormInfo | IEditQuestion | IEditMsg | ISetAllQues | ISetQuesSeq | ISetQuesList;


export type IQueResList = Map<string, string[] | string>