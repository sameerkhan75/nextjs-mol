"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/lib/db/models/product.model";

export default function ProductListClient({ initialProducts }: { initialProducts: IProduct[] }) {
  const [productList, setProductList] = useState<IProduct[]>(initialProducts);
  const [isPending, startTransition] = useTransition();

  async function handleRemove(id: string) {
    if (!confirm("Are you sure you want to remove this product?")) return;
    startTransition(async () => {
      const res = await fetch(`/api/product/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProductList((prev: IProduct[]) => prev.filter((p: IProduct) => p._id !== id));
      } else {
        alert("Failed to delete product");
      }
    });
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem',
    }}>
      {productList.map((product: IProduct) => (
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
                src={product.images[0]}
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
              <button
                onClick={(e) => { e.preventDefault(); handleRemove(product._id as string); }}
                disabled={isPending}
                style={{
                  marginTop: '1rem',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                {isPending ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
} 