import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { APP_NAME } from '@/lib/constants'
import { getAllCategories } from '@/lib/actions/product.actions'

export default async function Search() {
  const categories = await getAllCategories()

  return (
    <form action='/search' method='GET' className='flex items-stretch h-10'>
      <Select name='category'>
        <SelectTrigger className='w-auto h-full dark:border-gray-200 bg-gray-100 text-black border-r rounded-l-md rounded-r-none'>
          <SelectValue placeholder='All Categories' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectItem value='all'>All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className='flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black text-base h-full border-x-0'
        placeholder={`Search ${APP_NAME}`}
        name='q'
        type='search'
      />
      <button
        type='submit'
        className='bg-yellow-400 hover:bg-yellow-500 text-black rounded-l-none rounded-r-md h-full px-4 flex items-center justify-center transition-colors'
      >
        <SearchIcon className='w-5 h-5' />
      </button>
    </form>
  )
}
