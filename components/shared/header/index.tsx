// components/shared/header/index.tsx

import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import Menu from './menu'
import {Button} from '@/components/ui/button'
import { MenuIcon} from 'lucide-react'
import data from '@/lib/data'
import Search from './search'

export default function Header() {
  return (
    <header className='bg-[#5E5E5E] text-white'>
      <div className='px-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <Link
              href='/'
              className='flex items-center header-button font-extrabold text-2xl m-1'
            >
              <Image
                src='/icons/Adobe Express - file.png'
                width={40}
                height={40}
                alt={`${APP_NAME} logo`}
              />
              {APP_NAME}
            </Link>

            <div className='hidden md:block flex-1 max-w-xl'>
              <Search />
            </div>

            <Menu />
          </div>

          <div className='md:hidden block py-2'>
            <Search />
          </div>

          <div className='flex items-center px-3 mb-[1px] bg-[#878787]'>
            <Button
              variant='ghost'
              className='header-button flex items-center gap-1 text-base [&_svg]:size-6'
            >
              <MenuIcon />
              All
            </Button>

            <div className='flex items-center flex-wrap gap-3 overflow-hidden max-h-[42px]'>
              {data.headerMenus.map((menu) => (
                <Link
                  href={menu.href}
                  key={menu.href}
                  className='header-button !p-2'
                >
                  {menu.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
