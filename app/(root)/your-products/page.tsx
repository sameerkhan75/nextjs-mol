import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Product, { IProduct } from "@/lib/db/models/product.model";
import { connectToDatabase } from "@/lib/db";

export default async function YourProductsPage() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return <div>Please sign in to view your products.</div>;
  }

  const products = await Product.find({ userId: session.user.email }).lean();

  return (
    <div>
      <h1>Your Products</h1>
      {products.length === 0 ? (
        <p>No products listed yet.</p>
      ) : (
        <ul>
          {products.map((product: IProduct) => (
            <li key={product._id}>
              <strong>{product.name}</strong> - ${product.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
