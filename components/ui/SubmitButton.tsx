"use client";

import React from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from './button';

function SubmitButton({disabled} : {disabled :boolean}) {
    const {pending} = useFormStatus();

  return (
    <Button
        type = 'submit'
        disabled = {disabled || pending}
        className=' bg-green-500 hover:bg-green-600 w-full lg:w-fit'
        >
            {pending? "Translating... " : "Translate"}
    </Button>
  )
}

export default SubmitButton