import { NextRequest, NextResponse } from "next/server";
import { AzureOpenAI } from "openai";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("audio") as File;
  console.log("Uploaded file:", file);

  //Check for missing credentials
  if (
    !process.env.AZURE_API_KEY ||
    !process.env.AZURE_ENDPOINT ||
    !process.env.AZURE_DEPLOYMENT_NAME
  ) {
    console.error("Azure credentials are not set.");
    return NextResponse.json({
      error: "Azure credentials are not set.",
    });
  }

  //Check if the file is empty
  if (file.size === 0) {
    return NextResponse.json({
      error: "No audio file uploaded",
    });
  }

  //Initialize client with API key and endpoint directly
  const client = new AzureOpenAI({
    endpoint: process.env.AZURE_ENDPOINT,
    apiKey: process.env.AZURE_API_KEY,
    apiVersion: "2024-08-01-preview",
  });

  //Call the transcription endpoint with the uploaded file
  const result = await client.audio.transcriptions.create({
    model: process.env.AZURE_DEPLOYMENT_NAME,
    file, 
  });

  //Output the transcription
  console.log(`Transcription: ${result.text}`);
  return NextResponse.json({ text: result.text });
}
