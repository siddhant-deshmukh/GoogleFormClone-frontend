import { useEffect, useState } from 'react'
import $ from 'jquery';
import TitleDescFormElement from './components/TitleDescFormElement';
import QuestionFormElement from './components/QuestionFormElement';
import { FormProvider } from './context/FormContext';
import EditForm from './routes/EditForm';


function App() {

  return (
    <>
     <FormProvider>
        <EditForm />
      </FormProvider> 
    </>
  )
}



export default App
