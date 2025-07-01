import { Data, IProductInput } from '@/types'
import { toSlug } from './utils'

const products: IProductInput[] = [
    {
      name: 'Xbox Series X',
      slug: toSlug('Xbox Series X'),
      category: 'consoles',
      images: ['/images/xbox.jpeg'],
      tags: ['new-arrival'],
      isPublished: true,
      price: 499,
      listPrice: 549,
      brand: 'Microsoft',
      avgRating: 4.8,
      numReviews: 120,
      ratingDistribution: [
        { rating: 1, count: 2 },
        { rating: 2, count: 5 },
        { rating: 3, count: 8 },
        { rating: 4, count: 30 },
        { rating: 5, count: 75 },
      ],
      numSales: 250,
      countInStock: 15,
      description: 'Experience true 4K gaming with the Xbox Series X, featuring a 1TB SSD, 12 teraflops of graphical power, and lightning-fast load times.',
      sizes: [],
      colors: ['Black'],
      reviews: [],
    },
    {
      name: 'Custom Gaming PC - Intel i9 RTX 4080',
      slug: toSlug('Custom Gaming PC - Intel i9 RTX 4080'),
      category: 'PC Builds',
      images: ['/images/cpu2.jpg'],
      tags: ['featured'],
      isPublished: true,
      price: 1899,
      listPrice: 2200,
      brand: 'Custom Build',
      avgRating: 4.9,
      numReviews: 85,
      ratingDistribution: [
        { rating: 1, count: 1 },
        { rating: 2, count: 2 },
        { rating: 3, count: 3 },
        { rating: 4, count: 20 },
        { rating: 5, count: 59 },
      ],
      numSales: 110,
      countInStock: 5,
      description: 'High-end gaming PC with Intel Core i9, RTX 4080, 32GB RAM, and 1TB NVMe SSD. Built for ultra settings and 4K gaming.',
      sizes: [],
      colors: ['Black', 'RGB'],
      reviews: [],
    },
    {
      name: 'Nintendo Switch (Neon Red/Blue)',
      slug: toSlug('Nintendo Switch Neon Red Blue'),
      category: 'consoles',
      images: ['/images/nintendo.jpg'],
      tags: ['best-seller'],
      isPublished: true,
      price: 299,
      listPrice: 349,
      brand: 'Nintendo',
      avgRating: 4.7,
      numReviews: 250,
      ratingDistribution: [
        { rating: 1, count: 5 },
        { rating: 2, count: 10 },
        { rating: 3, count: 15 },
        { rating: 4, count: 50 },
        { rating: 5, count: 170 },
      ],
      numSales: 500,
      countInStock: 25,
      description: 'Play at home or on the go with the versatile Nintendo Switch. Features Neon Red and Blue Joy-Cons and access to a wide variety of games.',
      sizes: [],
      colors: ['Red', 'Blue', 'Black'],
      reviews: [],
    },
    {
      name: 'Sony PlayStation 5',
      slug: toSlug('Sony PlayStation 5'),
      category: 'consoles',
      images: ['/images/ps5.jpeg'],
      tags: ['featured', 'new-arrival'],
      isPublished: true,
      price: 499,
      listPrice: 550,
      brand: 'Sony',
      avgRating: 4.9,
      numReviews: 300,
      ratingDistribution: [
        { rating: 1, count: 3 },
        { rating: 2, count: 4 },
        { rating: 3, count: 8 },
        { rating: 4, count: 60 },
        { rating: 5, count: 225 },
      ],
      numSales: 600,
      countInStock: 12,
      description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
      sizes: [],
      colors: ['White', 'Black'],
      reviews: [],
    }
  ]
  
const data: Data = {
  headerMenus: [
    {
      name: "Today's Deal",
      href: '/search?tag=todays-deal',
    },
    {
      name: 'New Arrivals',
      href: '/search?tag=new-arrival',
    },
    {
      name: 'Featured Products',
      href: '/search?tag=featured',
    },
    {
      name: 'Best Sellers',
      href: '/search?tag=best-seller',
    },
    {
      name: 'Browsing History',
      href: '/#browsing-history',
    },
    {
      name: 'Customer Service',
      href: '/page/customer-service',
    },
    {
      name: 'About Us',
      href: '/page/about-us',
    },
    {
      name: 'Help',
      href: '/page/help',
    },
  ],
  carousels: [
   {
    title: 'Find Players Nearby You',
    buttonCaption: 'Find now',
    image: '/images/Untitled design (3).png',
    url: '/search?category=Search player',
    isPublished: true,
  },
  
  {
    title: 'Console Titles near you',
    buttonCaption: 'See Now',
    image: '/images/wp1.jpg',
    url: '/search?category=Titles',
    isPublished: true,
  },  
  {
    title: 'Best Selling Console',
    buttonCaption: 'Shop Now',
    image: '/images/Untitled design (4).png',
    url: '/search?category=PS',
    isPublished: true,
  },

  {
    title: 'Best accessories ',
    buttonCaption: 'See More',
    image: '/images/wp2.png',
    url: '/search?category=accessories',
    isPublished: true,
  },
],
products
}

export default data