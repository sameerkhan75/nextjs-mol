import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
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
    <div style={{
      minHeight: '100vh',
      backgroundImage: "url('/images/toroto.jpeg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }} />
      <div style={{
        maxWidth: 700,
        margin: '0 auto',
        padding: '2rem',
        position: 'relative',
        zIndex: 2,
        color: '#000',
        background: 'rgba(255,255,255,0.92)',
        borderRadius: '1.2rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      }}>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 'bold', marginBottom: '1.2rem' }}>Your Products</h1>
        {products.length === 0 ? (
          <p>No products listed yet.</p>
        ) : (
          <ul style={{ fontSize: '1.1rem', paddingLeft: '1.5rem' }}>
            {products.map((product: IProduct) => (
              <li key={product._id} style={{ marginBottom: '0.7rem' }}>
                <strong>{product.name}</strong> - ${product.price}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
