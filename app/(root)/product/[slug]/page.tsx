import { Card, CardContent } from '@/components/ui/card'
import {
  getProductBySlug,
} from '@/lib/actions/product.actions'
import ProductPrice from '@/components/shared/product/product-price'
import ProductGallery from '@/components/shared/product/product-gallary'
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
  const params = await props.params

  const { slug } = params

  const product = await getProductBySlug(slug)

  if (!product) {
    return <div>Product not found</div>;
  }

  const player = mockPlayers.find(p => p.userId === product.userId);
  const distance = player ? player.distance : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-10">
            {/* Product Images - Left Side */}
            <div className="lg:col-span-7">
              {product.images && product.images.length > 0 && (
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4">
                  <ProductGallery images={product.images} />
                </div>
              )}
            </div>

            {/* Product Info - Center */}
            <div className="lg:col-span-3 space-y-6">
              {/* Brand & Category */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                {product.brand} • {product.category}
              </div>

              {/* Product Title */}
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Pricing Section */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <ProductPrice
                  price={product.price}
                  listPrice={product.listPrice}
                  isDeal={product.tags.includes('todays-deal')}
                  className="break-words"
                />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  About this item
                </h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  {product.description}
                </p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">✓</div>
                  <div className="text-sm text-gray-600 mt-1">Verified</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">🚚</div>
                  <div className="text-sm text-gray-600 mt-1">Local Pickup</div>
                </div>
              </div>
            </div>

            {/* Seller Info - Right Side */}
            <div className="lg:col-span-2 h-full flex flex-col">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 h-full flex flex-col">
                <CardContent className="p-6 space-y-6 flex flex-col h-full justify-between">
                  {/* Price Display */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </div>
                    {product.listPrice > product.price && (
                      <div className="text-sm text-gray-500 line-through">
                        ₹{product.listPrice.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Discord Contact */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700 text-center">
                      Contact seller on Discord
                    </div>
                    <div className="flex justify-center">
                      <DiscordContact discordId={`${product.userId}#0000`} />
                    </div>
                  </div>

                  {/* Distance */}
                  {distance && (
                    <div className="text-center p-3 bg-blue-100 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">
                        📍 {distance}km away
                      </div>
                    </div>
                  )}

                  {/* Stock Status */}
                  {product.countInStock > 0 && product.countInStock <= 3 && (
                    <div className="text-center p-3 bg-orange-100 rounded-lg">
                      <div className="text-sm font-medium text-orange-800">
                        ⚠️ Only {product.countInStock} left
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  <div className="text-center">
                    {product.countInStock !== 0 ? (
                      <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Available for pickup
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Sold out
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}