"use client";
import { UserIcon } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Menu() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <div className='flex justify-end'>
      <nav className='flex gap-3 w-full'>
        {loading ? null : session ? (
          <button onClick={() => signOut()} className='header-button flex items-center gap-2'>
            <UserIcon className='h-8 w-8' />
            <span className='font-bold'>Sign out</span>
          </button>
        ) : (
          <button onClick={() => signIn('google')} className='header-button flex items-center gap-2'>
            <UserIcon className='h-8 w-8' />
            <span className='font-bold'>Sign in with Google</span>
          </button>
        )}


      </nav>
    </div>
  )
}
