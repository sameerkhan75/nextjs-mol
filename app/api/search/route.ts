import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/db/models/product.model'

connectToDatabase().catch(err => {
  console.error("❌ DB connection error:", err);
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Build search conditions
    const conditions: any = { isPublished: true }
    
    // Add category filter if not 'all'
    if (category && category !== 'all') {
      conditions.category = category
    }
    
    // Add text search if query exists
    if (query.trim()) {
      conditions.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    }

    // Execute search
    const products = await Product.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const totalCount = await Product.countDocuments(conditions)
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
} 