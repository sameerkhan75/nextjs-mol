"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function AddProductPage() {
  const { data: session } = useSession();
  const [discordId, setDiscordId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const userId = discordId || session?.user?.email;
    if (!userId) {
      setError("You must be logged in or provide a Discord ID to add a product.");
      return;
    }
    const res = await fetch("/api/product/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: parseFloat(price),
        listPrice: parseFloat(listPrice) || parseFloat(price),
        images: [image],
        userId,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        category: category || "Other",
        brand: brand || "Unknown",
        description: description || name,
        isPublished: true,
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
        {!session?.user?.email && (
          <input
            placeholder="Discord ID"
            value={discordId}
            onChange={e => setDiscordId(e.target.value)}
            required
          />
        )}
        <input
          placeholder="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <input
          placeholder="Brand"
          value={brand}
          onChange={e => setBrand(e.target.value)}
        />
        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
        <input
          placeholder="List Price"
          type="number"
          value={listPrice}
          onChange={e => setListPrice(e.target.value)}
        />
        <input
          placeholder="Image URL"
          value={image}
          onChange={e => setImage(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit">Add Product</button>
      </form>
      {success && <p style={{ color: "green" }}>Product added!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
} 