import { createContext } from "react";

export interface IFormContext {
   
}

export const FormContext = createContext<IFormContext | null>(null);

export const FormProvider = (props) => {

    return(
        <FormContext.Provider value={{}}>
            {props.children}
        </FormContext.Provider>
    )
}