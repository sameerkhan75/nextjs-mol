'use client'
import { cn } from '@/lib/utils'

const formatCurrency = (value: number) =>
  value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const ProductPrice = ({
  price,
  className,
  listPrice = 0,
  isDeal = false,
  plain = false,
}: {
  price: number
  isDeal?: boolean
  listPrice?: number
  className?: string
  plain?: boolean
}) => {
  const discountPercent = Math.round(100 - (price / listPrice) * 100)

  return plain ? (
    formatCurrency(price)
  ) : listPrice == 0 ? (
    <div className={cn('text-3xl md:text-4xl font-bold text-gray-900', className)}>
      {formatCurrency(price)}
    </div>
  ) : isDeal ? (
    <div className='space-y-4'>
      <div className='flex items-center gap-3 flex-wrap'>
        <span className='bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
          {discountPercent}% OFF
        </span>
        <span className='text-red-600 text-sm font-medium'>
          Limited time offer
        </span>
      </div>
      <div className='space-y-2'>
        <div className={cn('text-3xl md:text-4xl font-bold text-gray-900', className)}>
          {formatCurrency(price)}
        </div>
        <div className='text-gray-500 text-sm'>
          <span className='line-through'>{formatCurrency(listPrice)}</span>
          <span className='ml-2 text-gray-400'>was the price</span>
        </div>
      </div>
    </div>
  ) : (
    <div className='space-y-4'>
      <div className='flex items-center gap-3 flex-wrap'>
        <div className='bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
          -{discountPercent}%
        </div>
        <div className={cn('text-3xl md:text-4xl font-bold text-gray-900', className)}>
          {formatCurrency(price)}
        </div>
      </div>
      <div className='text-gray-500 text-sm'>
        <span className='line-through'>{formatCurrency(listPrice)}</span>
        <span className='ml-2 text-gray-400'>original price</span>
      </div>
    </div>
  )
}

export default ProductPrice