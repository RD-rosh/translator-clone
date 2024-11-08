import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { SignInButton, UserButton } from "@clerk/nextjs";

async function Header() {
  const { userId } = await auth();
  return (
    <header className="flex items-center justify-between px-8 border-b mb-5">
      <div className="flex items-center overflow-hidden h-20">
        <Link href="/">
          <Image
            src="/images/translatorlogo.png"
            alt="logo"
            width={150}
            height={75}
            className="object-contain h-32 cursor-pointer"
          />
        </Link>
      </div>

      {userId ? (
        <div>
          <UserButton />
        </div>
      ) : (
        <SignInButton signUpFallbackRedirectUrl={"/translate"} mode="modal" />
      )}
    </header>
  );
}

export default Header;


/* "use client"; 
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { SignInButton, UserButton } from "@clerk/nextjs";

const Header = () => {
  const { userId } = useAuth();

  //Client-side dark mode state handling
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      return storedTheme === 'dark'; // Check if dark mode was saved
    }
    return false;
  });

  //Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light'); // Store theme preference
  };

  //Effect to apply the dark class to <html> element based on darkMode state
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="flex items-center justify-between px-8 border-b mb-5 bg-white dark:bg-gray-400">
      <div className="flex items-center overflow-hidden h-20">
        <Link href="/">
          <Image
            src="/images/translatorlogo-.png"
            alt="logo"
            width={150}
            height={75}
            className="object-contain h-32 cursor-pointer"
          />
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        
       /*  <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          {darkMode ? (
            <span role="img" aria-label="Light Mode">
              <Image
                src='/images/light.png'
                alt='light'
                height={30}
                width={30}
                className="object-contain cursor-pointer"
              />
            </span>
          ) : (
            <span role="img" aria-label="Dark Mode">
              <Image
                src='/images/dark.png'
                alt='dark'
                height={30}
                width={30}
                className="object-contain cursor-pointer"
              />
            </span>
          )}
        </button>

        {userId ? (
          <div>
            <UserButton />
          </div>
        ) : (
          <SignInButton signUpFallbackRedirectUrl={"/translate"} mode="modal" />
        )}
      </div>
    </header>
  );
};

export default Header; */
 