import { Suspense } from 'react'
import { searchProducts, getAllCategories } from '@/lib/actions/product.actions'
import ProductCard from '@/components/shared/product/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchIcon } from 'lucide-react'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    page?: string
  }>
}

async function SearchResults({ 
  query, 
  category, 
  page 
}: { 
  query: string
  category: string
  page: number
}) {
  const { products, pagination } = await searchProducts({
    query,
    category,
    page,
    limit: 12
  })

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search terms or browse all categories
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {pagination.hasPrevPage && (
            <Button
              variant="outline"
              asChild
            >
              <a href={`/search?q=${query}&category=${category}&page=${pagination.currentPage - 1}`}>
                Previous
              </a>
            </Button>
          )}
          
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          {pagination.hasNextPage && (
            <Button
              variant="outline"
              asChild
            >
              <a href={`/search?q=${query}&category=${category}&page=${pagination.currentPage + 1}`}>
                Next
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const category = params.category || 'all'
  const page = parseInt(params.page || '1')
  
  const categories = await getAllCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Search Results
        </h1>
        
        {/* Search Form */}
        <div className="mb-8">
          <form action="/search" method="GET" className="flex items-stretch h-12 max-w-2xl">
            <Select name="category" defaultValue={category}>
              <SelectTrigger className="w-auto h-full dark:border-gray-200 bg-gray-100 text-black border-r rounded-r-none rounded-l-md">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              className="flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black text-base h-full"
              placeholder="Search products..."
              name="q"
              type="search"
              defaultValue={query}
            />
            
            <Button
              type="submit"
              className="bg-primary text-primary-foreground text-black rounded-s-none rounded-e-md h-full px-4"
            >
              <SearchIcon className="w-5 h-5" />
            </Button>
          </form>
        </div>

        {/* Search Results */}
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Searching...</p>
          </div>
        }>
          <SearchResults 
            query={query} 
            category={category} 
            page={page} 
          />
        </Suspense>
      </div>
    </div>
  )
} 