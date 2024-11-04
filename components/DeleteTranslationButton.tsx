
"use client";

import React from 'react';
import { Button } from './ui/button';
import { TrashIcon } from 'lucide-react';
import deleteTranslation from '@/actions/deleteTranslation';

function DeleteTranslationButton({ id }: { id: string }) {
    const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission

        try {
            // Call the deleteTranslation function
            const result = await deleteTranslation(id);
            console.log('Translation deleted:', result.translations);
            // Optionally, you can update the UI or trigger a revalidation here
        } catch (error) {
            console.error('Error deleting translation:', error);
        }
    };

    return (
        <form onSubmit={handleDelete}>
            <Button
                size='icon'
                className='border-red-500 text-red-500 hover:bg-red-400 hover:text-white'
                type='submit'
                variant='outline'
            >
                <TrashIcon size={16} />
            </Button>
        </form>
    );
}

export default DeleteTranslationButton;


/* "use client";

import React from 'react'
import { Button } from './ui/button';
import { TrashIcon } from 'lucide-react';
import deleteTranslation from '@/actions/deleteTranslation';

function DeleteTranslationButton({id}:{id:string}) {
    const deleteTranslationAction = deleteTranslation.bind(null, id)
  return (
    <form action={deleteTranslationAction}>
        <Button
        size='icon'
        className='border-red-500 text-red-500 hover:bg-red-400 hover:text-white'
        type ='submit'
        variant='outline'>
        
        <TrashIcon 
         size={16}
        />
        </Button>
        </form>
  );
} */