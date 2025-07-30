import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/db/models/product.model";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function DELETE(request: NextRequest) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Extract id from the URL
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }
  const product = await Product.findById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  if (product.userId !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ message: "Product deleted" }, { status: 200 });
} 