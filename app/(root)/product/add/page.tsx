"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function AddProductPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!session?.user?.email) {
      setError("You must be logged in to add a product.");
      return;
    }
    const res = await fetch("/api/product/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: parseFloat(price),
        images: [image],
        userId: session.user.email,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        category: "Other",
        brand: "Unknown",
        description: name,
        isPublished: true,
        listPrice: parseFloat(price),
        countInStock: 1,
        tags: [],
        sizes: [],
        colors: [],
        avgRating: 0,
        numReviews: 0,
        ratingDistribution: [],
        reviews: [],
        numSales: 0,
      }),
    });
    if (res.ok) setSuccess(true);
    else setError("Failed to add product.");
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          placeholder="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
        <input
          placeholder="Image URL"
          value={image}
          onChange={e => setImage(e.target.value)}
          required
        />
        <button type="submit">Add Product</button>
      </form>
      {success && <p style={{ color: "green" }}>Product added!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
} 