"use client"

import { useState } from "react"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { APP_NAME } from "@/lib/constants"

const categories = ["consoles", "PC Builds", "accessories"]

export default function Search() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setResults([])

    const res = await fetch(`/api/search?q=${query}&category=${category}`)
    const data = await res.json()

    if (data.success && data.products.length > 0) {
      setResults(data.products)
    } else {
      setError("Product not found")
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex items-stretch h-9">
        <Select value={category} onValueChange={setCategory} name="category">
          <SelectTrigger className="w-auto h-full dark:border-gray-200 bg-gray-100 text-black border-r rounded-r-none rounded-l-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">All</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          className="flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black text-base h-full"
          placeholder={`Search Site ${APP_NAME}`}
          name="q"
          type="search"
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

      {error && <p className="text-red-600 font-medium">{error}</p>}
      {results.length > 0 && (
        <ul className="bg-white rounded-lg shadow p-3">
          {results.map((product) => (
            <li key={product.id} className="border-b last:border-none py-2">
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
