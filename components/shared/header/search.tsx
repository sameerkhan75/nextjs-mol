"use client"
import { useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const categories = ['consoles', 'PC Builds', 'accessories']

export default function Search() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [results, setResults] = useState([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/search?q=${query}&category=${category}`)
    const data = await res.json()
    if (data.length === 0) alert('Product not found!')
    setResults(data)
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex items-stretch h-9">
        <Select onValueChange={setCategory}>
          <SelectTrigger className="w-auto h-full dark:border-gray-200 bg-gray-100 text-black border-r rounded-r-none rounded-l-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">All</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className="flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black text-base h-full"
          placeholder="Search Products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground text-black rounded-s-none rounded-e-md h-full px-3 py-2"
        >
          <SearchIcon className="w-6 h-6" />
        </button>
      </form>

      {results.length > 0 && (
        <ul className="mt-4">
          {results.map((item: any) => (
            <li key={item.id} className="p-2 border-b">
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
