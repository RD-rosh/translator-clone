'use server'

import { State } from "@/components/TranslationForm";
import { addOrUpdateUser } from "@/mongodb/models/User";
import { auth } from '@clerk/nextjs/server';
import { revalidateTag } from "next/cache";
import {v4} from 'uuid';

const key = process.env.AZURE_TEXT_TRANSLATION_KEY;
const endpoint = process.env.AZURE_TEXT_TRANSLATION;
const location = process.env.AZURE_TEXT_LOCATION;


async function translate(previousState: State, formData:FormData) {
    auth.protect();

    const {userId} = await auth();
    if (!userId) throw new Error('User not found!');

    const rawFormData = {
        input :formData.get('input') as string,
        inputLanguage :formData.get('inputLanguage') as string,
        output :formData.get('output') as string,
        outputLanguage :formData.get('outputLanguage') as string,
    };

    //request Az AI translator to translate input ttext
    const fromLanguage = rawFormData.inputLanguage === 'auto' ? null : rawFormData.inputLanguage;

    const response = await fetch(`${endpoint}/translate?api-version=3.0&from=${fromLanguage}&to=${rawFormData.outputLanguage}`, {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': key!,
            'Ocp-Apim-Subscription-Region': location!,
            'Content-Type': 'application/json',
            'X-ClientTraceId': v4().toString(),
        },
        body: JSON.stringify([{
            text: rawFormData.input,
        }]),
    });

       // Check if the response is okay and parse the JSON
       if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    /* const response = await axios({
        baseURL : endpoint,
        url : 'translate',
        method : 'POST',
        headers :{
            'Ocp-Apim-Subscription-Key' : key!  ,
            'Ocp-Apim-Subscription-Region' : location!,
            'Content-type' : 'application/json',
            'X-ClientTraceId' : v4().toString(),
        },
        params : {
            'api-version' : 3.0,
            //if auto detection is not given, no value - api gives a language
            from : rawFormData.inputLanguage === 'auto'  ? null : rawFormData.inputLanguage,
            to : rawFormData.outputLanguage,
        },
        data: {
            text : rawFormData.input,
        },
    }) */

    //push to mongoDB

    if (rawFormData.inputLanguage == 'auto'){
        //if inputLang is detected as auto, set AzureTraslate to detect language before pushing to db
        rawFormData.inputLanguage = data[0].detectLanguage.language;
    }
    try{
        const translation = {
            to : rawFormData.outputLanguage,
            from : rawFormData.inputLanguage,
            fromText : rawFormData.input,
            toText : data[0].translations[0].text,
        };

        addOrUpdateUser(userId,translation);
    }
    catch(error){
        console.error("Failed to add translation to user : ",error);
    }

    revalidateTag('translationHistory');

    return{
        ...previousState,
        output : data[0].translations[0].text,
    };

}

export default translate;