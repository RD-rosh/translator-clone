import { auth } from '@clerk/nextjs/server'
import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import { SignInButton, UserButton } from '@clerk/nextjs';

async function Header() {
    const {userId} = await auth();
  return (
    <header className='flex items-center justify-between px-8 border-b mb-5'>
        <div className='flex items-center overflow-hidden h-20'>
            <Link href = '/'>
            <Image 
                src='/images/translate-logo.png'
                alt='logo'
                width={150}
                height={75}
                className='object-contain h-32 cursor-pointer'
            />
            </Link>
            </div>

            {userId ? (
                <div>
                    <UserButton/>
                </div>
            ):
            (
                <SignInButton signUpFallbackRedirectUrl={'/translate'} mode='modal'/>
            )}
            </header>
  )
}

export default Header