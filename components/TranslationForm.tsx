'use client';

import { TranslationLanguages } from '@/app/translate/page';
import React, { useEffect, useRef, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Textarea } from './ui/textarea';
import e from 'express';
import { useFormState } from 'react-dom';
import translate from '@/actions/translate';
import Image from 'next/image';
import SubmitButton from './ui/SubmitButton';
import { Button } from './ui/button';
import { Ghost, Volume2Icon } from 'lucide-react';

const initialState={
  inputLanguage : 'auto',
  input : "",
  outputLanguage : 'en',
  output : "",
}

export type State = typeof initialState;

function TranslationForm({languages}:{languages:TranslationLanguages}) {

    const [input,setInput] =useState("");//for input
    const [output,setOutput] =useState("");//for output
    const [state,formAction] = useFormState(translate, initialState);
    const submitButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(()=>{
      if(!input.trim())
        return;
      //autom submit setup after 300ms
      const delayDebounceFn = setTimeout(()=>{
        //submit the form
        submitButtonRef.current?.click();
      },300)
      return () => clearTimeout(delayDebounceFn);
    },[input])

    console.log(state)

    useEffect(() => {
      if(state.output) {
        setOutput(state.output);
      }
    },[state]);

    const playAudio = async () => {
      const synth = window.speechSynthesis;
      if (!output || !synth) return;
  
      // Create a new SpeechSynthesisUtterance instance
      const wordsToSay = new SpeechSynthesisUtterance(output);
  
      // Get the available voices
      const voices = synth.getVoices();
      const selectedVoice = voices.find(voice => voice.name === 'Samantha'); 
      if (selectedVoice) {
          wordsToSay.voice = selectedVoice;
      }
  
      synth.speak(wordsToSay);
  };
  
  return (
    <div>
      <div className='flex space-x-2'>
        <div className='flex items-center group cursor-pointer border rounded-md w-fit mb-5 px-3 py-2 bg-[#e7f0fe]'>
          <p className='text-sm font-medium text-blue-500 group-hover:underline ml-2 mt-1'>
          <Image 
                src='/images/translate-logo.png'
                alt='logo'
                width={30}
                height={30}
            />
            Text
            </p>
            </div>

          <div className='flex items-center group cursor-pointer border rounded-md w-fit mb-5 px-3 py-2 bg-[#e7f0fe]'>
          <p className='text-sm font-medium text-blue-500 group-hover:underline ml-2 mt-1'>
          <Image 
                src='/images/translate-logo.png'
                alt='logo'
                width={30}
                height={30}
            />
            Text
            </p>
            </div>

      </div>
        <form action={formAction}>
        <div className='flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg-space-x-2'>
        <div className='flex-1 space-y-2 ' >
        
        <Select name='inputLanguage' defaultValue='auto'>
      <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold" >
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Want us to figure it out?</SelectLabel>
          <SelectItem key = "auto" value="auto">Auto-Detection</SelectItem>
          
        </SelectGroup>
        <div>
    
        <SelectGroup>
            <SelectLabel>Languages</SelectLabel>
            {Object.entries(languages.translation).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                    {value.name}
                </SelectItem>
            ))}
        </SelectGroup>
    
    </div>

        
      </SelectContent>
    </Select>
    
        <Textarea
        placeholder='Type your message here.'
        className='min-h-32 text-xl'
        name='input'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        />
    
    </div>   

     <div className='flex-1 space-y-2'>
      <div className='flex items-center justify-between'>
        
        
        <Select name='outputLanguage' defaultValue='en'>
      <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold" >
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Want us to figure it out?</SelectLabel>
          <SelectItem key = "auto" value="auto">Auto-Detection</SelectItem>
          
        </SelectGroup>
        <div>
    
        <SelectGroup>
            <SelectLabel>Languages</SelectLabel>
            {Object.entries(languages.translation).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                    {value.name}
                </SelectItem>
            ))}
        </SelectGroup>
    
    </div>

        
      </SelectContent>
    </Select>

    <Button
    variant='ghost'
    type='button'
    onClick={playAudio}
    disabled={!output}>

  <Volume2Icon
    size={24}
    className='text-blue-500 cursor-pointer disabled:cursor-not-allowed'/>

    </Button>
    
    </div>
        <Textarea
        placeholder='Type your message here.'
        className='min-h-32 text-xl'
        name='output'
        value={output}
        onChange={(e) => setOutput(e.target.value)}
        />
    
    </div> 
    </div>
    <div className=' mt-5 flex justify-end'>
      <SubmitButton disabled = {!input}/>
        <button 
        type='submit'
        ref = {submitButtonRef}
        hidden
        />
         
    </div>
        </form>
        
        
    
    </div>

    
  )
}

export default TranslationForm