import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MsgSlice {
    errMsg : string,
    warnMsg : string,
    sucessMsg : string
}

export const msgSlice = createSlice({
    name : 'msgs',
    initialState : {
        errMsg : '',
        warnMsg : '',
        sucessMsg : ''
    },
    reducers : {
        setWarnMsg : (state,  action: PayloadAction<string>) => {
            state.warnMsg = action.payload
            state.errMsg = ''
            state.sucessMsg = ''
        },
        setErrMsg : (state,  action: PayloadAction<string>) => {
            state.errMsg = action.payload
            state.warnMsg = ''
            state.sucessMsg = ''
        },
        setSucessMsg : (state,  action: PayloadAction<string>) => {
            state.sucessMsg = action.payload
            state.errMsg = ''
            state.warnMsg = ''
        },
    }
})

export const { setErrMsg, setWarnMsg, setSucessMsg } = msgSlice.actions
export const selectSucessMsgs = (state : MsgSlice) => state.sucessMsg
export const selectWarnMsgs = (state : MsgSlice) => state.warnMsg
export const selectErrMsgs = (state : MsgSlice) => state.errMsg

export default msgSlice.reducer