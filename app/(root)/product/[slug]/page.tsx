// app/(root)/product/[slug]/page.tsx
"use client";

import React from "react";
import Image from "next/image";                         // ← import Image
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product.actions";
import SelectVariant from "@/components/shared/product/select-variant";
import ProductPrice from "@/components/shared/product/product-price";
import ProductGallery from "@/components/shared/product/product-gallary";
import { Separator } from "@/components/ui/separator";
import Rating from "@/components/shared/product/rating";
import DiscordContact from "./DiscordContact";
import { mockPlayers } from "@/lib/mockPlayers";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetails(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page: string; color: string; size: string }>;
}) {
  const [searchParams, params] = await Promise.all([
    props.searchParams,
    props.params,
  ]);
  const { color, size } = searchParams;
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return <div>Product not found</div>;
  }

  const player = mockPlayers.find((p) => p.userId === product.userId);
  const distance = player?.distance;

  return (
    <div>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="col-span-2">
            {product.images && product.images.length > 0 ? (
              // If you still want a full gallery:
              <ProductGallery images={product.images} />
            ) : (
              // Fallback: just show the first image via <Image>
              <Image
                src="/images/placeholder.png"
                alt="No image available"
                width={600}
                height={600}
                className="object-cover rounded"
              />
            )}
          </div>

          <div className="flex w-full flex-col gap-2 md:p-5 col-span-2">
            <p className="p-medium-16 rounded-full bg-grey-500/10 text-grey-500">
              Brand {product.brand} &nbsp;|&nbsp; {product.category}
            </p>
            <h1 className="font-bold text-2xl">{product.name}</h1>

            <div className="flex items-center gap-2">
              <span>{product.avgRating.toFixed(1)}</span>
              <Rating rating={product.avgRating} />
              <span>({product.numReviews} reviews)</span>
            </div>

            <Separator className="my-2" />

            <ProductPrice
              price={product.price}
              listPrice={product.listPrice}
              isDeal={product.tags.includes("todays-deal")}
              forListing={false}
            />

            <Separator className="my-4" />

            <SelectVariant
              product={product}
              size={size || product.sizes[0]}
              color={color || product.colors[0]}
            />

            <Separator className="my-4" />

            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
          </div>

          <div className="col-span-1">
            <Card>
              <CardContent className="p-4 flex flex-col gap-4">
                {/* Thumbnail in the card */}
                {product.images?.[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="rounded"
                    unoptimized
                  />
                )}

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
                  <div className="text-red-600 font-bold">
                    Only {product.countInStock} left – order soon
                  </div>
                )}

                {product.countInStock ? (
                  <div className="text-green-700 text-xl">
                    Available for pickup
                  </div>
                ) : (
                  <div className="text-red-600 text-xl">Sold out</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
