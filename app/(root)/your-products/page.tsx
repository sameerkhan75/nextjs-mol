import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Product, { IProduct } from "@/lib/db/models/product.model";
import { connectToDatabase } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import ProductListClient from "./ProductListClient";

export default async function YourProductsPage() {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return <div>Please sign in to view your products.</div>;
  }

  const products = await Product.find({ userId: session.user.email }).lean();

  // --- Remove all hook/component logic here ---
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
        maxWidth: 1200,
        margin: '0 auto',
        padding: '2rem',
        position: 'relative',
        zIndex: 2,
        color: '#000',
      }}>
        <h1 style={{
          fontSize: '2.7rem',
          fontWeight: 900,
          marginBottom: '2rem',
          textAlign: 'center',
          color: '#18181b',
          fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
          letterSpacing: '-1px',
          textShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>Your Products</h1>
        {products.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>No products listed yet.</p>
            <Link href="/product/add" style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
            }}>
              Add Your First Product
            </Link>
          </div>
        ) : (
          <ProductListClient initialProducts={products} />
        )}
      </div>
    </div>
  );
}
