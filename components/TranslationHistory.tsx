import { auth } from "@clerk/nextjs/server";
import { ITranslation } from "@/mongodb/models/User";
import { url } from "inspector";
import React from "react";
import TimeAgoText from "./TimeAgoText";
import DeleteTranslationButton from "./DeleteTranslationButton";

const getLanguage = (code: string) => {
  const lang = new Intl.DisplayNames(["si"], { type: "language" });
  return lang.of(code);
};

async function TranslationHistory() {
  const userId = await auth();

  //if process..env.node is developemnt, it will be localhost:3000, otherwise it will be VERCEL URL
  //then for TranslationHistory, append userID query
  const url = `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.VERCEL_URL
  }/translationHistory?userId = ${userId}`;

  //from a server action revalidate tag, wherever fetch is used and have the tag, refetch date
  const response = await fetch(url, {
    next: {
      tags: ["translationHistory"],
    },
  });

  const { translations }: { translations: Array<ITranslation> } =
    await response.json();

  console.log(translations);

  return (
    <div>
      <h1 className="text-3xl my-5">History</h1>

      {translations.length === 0 && (
        <p className="mb-5 text-gray-400">No translations yet</p>
      )}

      <ul className="divide-y border rounded-md">
        {translations.map((translation) => (
          <li
            key={translation._id as string}
            className="flex justify-between items-center p-5 hover:bg-gray-50 relative"
          >
            <div>
              <p className="text-sm mb-5 text-gray-500">
                {getLanguage(translation.from)}
                {"->"}
                {getLanguage(translation.to)}
              </p>

              <div className="space-y-2 pr-5">
                <p>{translation.fromText}</p>
                <p className="text-gray-400">{translation.toText}</p>

                <DeleteTranslationButton id={translation._id as string} />
              </div>
            </div>

            <p className="absolute top-2 right-2 text-gray-300 text-sm">
              <TimeAgoText
                date={new Date(translation.timestamp).toISOString()}
              />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TranslationHistory;
