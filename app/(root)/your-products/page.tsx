import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Product, { IProduct } from "@/lib/db/models/product.model";
import { connectToDatabase } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

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
        maxWidth: 1200,
        margin: '0 auto',
        padding: '2rem',
        position: 'relative',
        zIndex: 2,
        color: '#000',
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          textAlign: 'center',
          color: '#fff',
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            {products.map((product: IProduct) => (
              <div key={product._id} style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}>
                <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    <Image
                      src={product.images[0] || '/images/xbox.jpeg'}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold', 
                      marginBottom: '0.5rem',
                      color: '#1f2937'
                    }}>
                      {product.name}
                    </h3>
                    <p style={{ 
                      color: '#6b7280', 
                      marginBottom: '1rem',
                      fontSize: '0.9rem'
                    }}>
                      {product.brand} • {product.category}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: 'bold', 
                          color: '#dc2626'
                        }}>
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.listPrice > product.price && (
                          <span style={{ 
                            textDecoration: 'line-through', 
                            color: '#6b7280',
                            marginLeft: '0.5rem'
                          }}>
                            ₹{product.listPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div style={{ 
                        backgroundColor: '#10b981', 
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        Active
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
