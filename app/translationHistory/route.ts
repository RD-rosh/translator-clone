import { getTranslations } from "@/mongodb/models/User";
import { response } from "express";
import { NextRequest } from "next/server";

export async function GET(request : NextRequest){
    const searchParmas = request.nextUrl.searchParams;
    const userId = searchParmas.get('userId');

    const translations = await getTranslations(userId!);
    return response.json({translations});
}