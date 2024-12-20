import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  return (
    <main className="flex flex-col items-center justify-center p-10">
      <h1 className="green-gradient-text text-3xl lg:text-6xl text-center pb-10 mb-5 font-light">
        Break the Language Barrier: Translate Instantly, Connect Effortlessly!
      </h1>{" "}
      <Image
        src="/images/multilingualrmv.png"
        alt="logo"
        width={700}
        height={700}
      />
      {userId ? (
        <Link
          href="/translate"
          className="bg-green-500 hover:bg-green-600 w-full mt-10 lg:w-fit p-5 rounded-md text-white text-center xursor-pointer"
        >
          Translate Now
        </Link>
      ) : (
        <SignInButton mode="modal">
          <Button className="bg-green-500 hover:bg-green-600 w-full mt-10 lg:w-fit p-5">
            Sign In to get Translating
          </Button>
        </SignInButton>
      )}
    </main>
  );
}
