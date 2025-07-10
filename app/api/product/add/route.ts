import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Product from "@/lib/db/models/product.model";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  await connectToDatabase(); // Connect to MongoDB

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, price, image } = await req.json();

  // You may want to validate these fields

  const product = await Product.create({
    title,
    description,
    price,
    image,
    userId: session.user.email, // or session.user.id if you store user IDs
  });

  return NextResponse.json({ product });
}
