import { Card, CardContent } from '@/components/ui/card'
import {
  getProductBySlug,
} from '@/lib/actions/product.actions'

import SelectVariant from '@/components/shared/product/select-variant'
import ProductPrice from '@/components/shared/product/product-price'
import ProductGallery from '@/components/shared/product/product-gallary'
import { Separator } from '@/components/ui/separator'
import Rating from '@/components/shared/product/rating'
import DiscordContact from "./DiscordContact";
import { mockPlayers } from "@/lib/mockPlayers";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const product = await getProductBySlug(params.slug)
  if (!product) {
    return { title: 'Product not found' }
  }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetails(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string; color: string; size: string }>
}) {
  const searchParams = await props.searchParams

  const { color, size } = searchParams

  const params = await props.params

  const { slug } = params

  const product = await getProductBySlug(slug)

  if (!product) {
    return <div>Product not found</div>;
  }

  const player = mockPlayers.find(p => p.userId === product.userId);
  const distance = player ? player.distance : null;

  return (
    <div>
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5  '>
          <div className='col-span-2'>
            {product.images && product.images.length > 0 && (
              <ProductGallery images={product.images} />
            )}
          </div>

          <div className='flex w-full flex-col gap-2 md:p-5 col-span-2'>
            <div className='flex flex-col gap-3'>
              <p className='p-medium-16 rounded-full bg-grey-500/10   text-grey-500'>
                Brand {product.brand} {product.category}
              </p>
              <h1 className='font-bold text-lg lg:text-xl'>
                {product.name}
              </h1>
              <div className='flex items-center gap-2'>
                <span>{product.avgRating.toFixed(1)}</span>
                <Rating rating={product.avgRating} />
                <span>{product.numReviews} ratings</span>
              </div>
              <Separator />
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <div className='flex gap-3'>
                  <ProductPrice
                    price={product.price}
                    listPrice={product.listPrice}
                    isDeal={product.tags.includes('todays-deal')}
                    forListing={false}
                  />
                </div>
              </div>
            </div>
            <div>


              
              <SelectVariant
                product={product}
                size={size || product.sizes[0]}
                color={color || product.colors[0]}
              />
            </div>
            <Separator className='my-2' />
            <div className='flex flex-col gap-2'>
              <p className='p-bold-20 text-grey-600'>Description:</p>
              <p className='p-medium-16 lg:p-regular-18'>
                {product.description}
              </p>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className='p-4 flex flex-col  gap-4'>
                <ProductPrice price={product.price} />

                <div className="flex items-center space-x-2 mt-2">
                  <DiscordContact discordId={`${product.userId}#0000`} />
                </div>
                {distance && (
                  <div className="text-right font-bold text-gray-700">
                    {distance}km away
                  </div>
                )}
                {product.countInStock > 0 && product.countInStock <= 3 && (
                  <div className='text-destructive font-bold'>
                    {`Only ${product.countInStock} left in stock - order soon`}
                  </div>
                )}
                {product.countInStock !== 0 ? (
                  <div className='text-green-700 text-xl'>Available for pickup</div>
                ) : (
                  <div className='text-destructive text-xl'>
                    Sold out
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}