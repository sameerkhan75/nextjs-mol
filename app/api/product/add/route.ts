// app/api/product/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/db/models/product.model";
import { connectToDatabase } from "@/lib/db";
//THIS ERROR TO BE RESOLVED
// Connect once at module load
connectToDatabase().catch(err => {
  console.error("❌ DB connection error:", err);
});

export async function POST(req: NextRequest) {
  try {
    // 1) Ensure JSON content
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Expected application/json" },
        { status: 415 }
      );
    }

    // 2) Parse body
    const data = await req.json();

    // 3) Basic validation
    const requiredFields = ["name", "price", "images", "userId"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // 4) Create
    const product = await Product.create(data);

    // 5) Return with 201
    return NextResponse.json({ product }, { status: 201 });
  } catch (err: unknown) {
    console.error("Add product error:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to add product";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
