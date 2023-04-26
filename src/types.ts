import { Types } from 'mongoose'


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
    queListState: {_id:string , index? : number}[],

    errMsg: string,
    warnMsg: string,
    successMsg: string,
}


export type IQueResList = Map<string, string[] | string>