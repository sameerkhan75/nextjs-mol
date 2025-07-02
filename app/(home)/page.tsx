import { HomeCard } from '@/components/shared/home/home-card'
import { HomeCarousel } from '@/components/shared/home/home-carousel'
import data from '@/lib/data'

export default function Page() {
  // Use the first 4 products from data.ts for the categories to explore
  const cards = [
    {
      title: 'Explore diverse gaming ecosystems',
      link: {
        text: 'See More',
        href: '/search',
      },
      items: data.products.slice(0, 4).map((product) => ({
        name: product.name,
        image: product.images[0],
        href: `/product/${product.slug}`,
      })),
    },
  ]

  return (
    <>
      <HomeCarousel items={data.carousels} />
      <div className='md:p-4 md:space-y-4 bg-border'>
        <HomeCard cards={cards} />
      </div>
    </>
  )
}
