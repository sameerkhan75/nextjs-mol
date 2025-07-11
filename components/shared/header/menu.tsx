"use client";
import { ShoppingCartIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
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

        <Link href='/cart' className='header-button'>
          <ShoppingCartIcon className='h-8 w-8' />
          <span className='font-bold'>Cart</span>
        </Link>
      </nav>
    </div>
  )
}
