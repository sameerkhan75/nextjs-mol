'use client'

import { ChevronUp } from 'lucide-react'
import { Button } from '../../ui/button'
import { APP_NAME } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className='bg-[#E3E3E3] text-black underline-link'>
      <div className='w-full'>
        <Button
          variant='ghost'
          className='bg-[#b0b0b0] w-full rounded-none'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className='mr-2 h-4 w-4' />
          Back to top
        </Button>
      </div>

      <div className='p-4'>
        <div className='flex justify-center gap-3 text-sm'>
          <p>Please dispose of e-waste and plastic waste responsibly.
            For more information or e-waste pick up, please call 1800 5 7267864
          </p>

        </div>

        <div className='flex justify-center text-sm'>
          <p>© 2000-2025, {APP_NAME}, Inc. or its affiliates</p>
        </div>

        <div className='mt-8 flex justify-center text-sm text-gray-400'>
        Registered Office Address: 6th Floor, DLF Centre, Sansad Marg,
        New Delhi-110001 | 8630900119
        </div>
      </div>
    </footer>
  )
}
