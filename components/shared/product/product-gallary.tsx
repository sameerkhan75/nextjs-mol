'use client'

import { useState } from 'react'
import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export default function ProductGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(0)
  
  return (
    <div className='flex gap-6'>
      {/* Thumbnail Sidebar */}
      <div className='flex flex-col gap-3'>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            onMouseOver={() => setSelectedImage(index)}
            className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
              selectedImage === index
                ? 'ring-2 ring-blue-500 ring-offset-2 scale-105'
                : 'ring-1 ring-gray-200 hover:ring-blue-300 hover:scale-105'
            }`}
          >
            <Image
              src={image}
              alt={`Product image ${index + 1}`}
              width={80}
              height={80}
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {selectedImage === index && (
              <div className="absolute inset-0 bg-blue-500/20 rounded-xl" />
            )}
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className='flex-1'>
        <Zoom>
          <div className='relative h-[600px] bg-white rounded-2xl overflow-hidden shadow-lg'>
            <Image
              src={images[selectedImage]}
              alt={`Product image ${selectedImage + 1}`}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='object-contain p-4'
              priority
            />
            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </Zoom>
      </div>
    </div>
  )
}