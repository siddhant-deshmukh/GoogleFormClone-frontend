
export type IAnsTypes = 'short_ans' | 'long_ans' | 'mcq' | 'checkbox' | 'dropdown' | 'mcq_grid' | 'checkboc_grid' | 'range' | 'date'

export type IMultipleChoicesAns = string[]
export type ITextAns = string
export interface IGridAns {
    row : string[],
    col : string[]
}

export interface IQuestionForm {
    title : string,
    desc? : string,
    required : boolean,
    type : IAnsTypes,
    ansOption? : ITextAns | IMultipleChoicesAns | IGridAns
}
export interface IAllFormQuestions {
    [id : number] : IQuestionForm
}