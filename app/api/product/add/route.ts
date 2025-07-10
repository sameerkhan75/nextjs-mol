import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/db/models/product.model";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const data = await req.json();

  if (!data.userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 401 });
  }

  try {
    const product = await Product.create(data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("Add product error:", err);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
