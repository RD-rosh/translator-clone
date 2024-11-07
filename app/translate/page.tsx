import TranslationForm from "@/components/TranslationForm";
import { auth } from "@clerk/nextjs/server";
import React from "react";

export type TranslationLanguages = {
  translation: {
    [key: string]: {
      name: string;
      nativeName: string;
      dir: "ltr" | "rtl";
    };
  };
};

async function TranslatePage() {
  auth.protect();

  //auth().protect();

  const { userId } = await auth();
  if (!userId) throw new Error("User not logged in");

  const languagesEndpoint =
    "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0";
  const response = await fetch(languagesEndpoint, {
    next: {
      //cach results every 24 hrs and refresh
      revalidate: 60 * 60 * 24,
    },
  });

  const languages = (await response.json()) as TranslationLanguages;
  //console.log('respose',languages.translation);

  return (
    <div className="px-10 xl:px-0 mb-20">
      {/* //translateForm */}
      <TranslationForm languages={languages} />

      {/* //translareHistory */}
    </div>
  );
}

export default TranslatePage;
