'use server';

import { removeTranslation } from "@/mongodb/models/User";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

async function  deleteTranslation(id:string) {

    const {userId} = await auth.protect();
    const user = await removeTranslation(userId!, id);

    revalidateTag('translationHistory');

    return {
        //translations : user.translations,
        translations : JSON.stringify(user.translations),
    };
}

export default deleteTranslation;

