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
    <div style={{
      minHeight: '100vh',
      background: `url('/images/toroto.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px rgba(55,48,163,0.10)',
        padding: '2.5rem 2rem 2rem 2rem',
        fontFamily: 'Inter, sans-serif',
      }}>
        <h2 style={{
          textAlign: 'center',
          fontWeight: 800,
          fontSize: '2rem',
          color: '#4D4D4D', 
          marginBottom: '2rem',
          letterSpacing: '-1px',
        }}>Add Product</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {!session?.user?.email && (
            <input
              placeholder="Discord ID"
              value={discordId}
              onChange={e => setDiscordId(e.target.value)}
              required
              style={inputStyle}
            />
          )}
          <input
            placeholder="Product Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            placeholder="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Brand"
            value={brand}
            onChange={e => setBrand(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            placeholder="List Price"
            type="number"
            value={listPrice}
            onChange={e => setListPrice(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Image URL"
            value={image}
            onChange={e => setImage(e.target.value)}
            required
            style={inputStyle}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
          />
          <button type="submit" style={buttonStyle}>Add Product</button>
        </form>
        {success && <p style={{ color: "green", textAlign: 'center', marginTop: 16 }}>Product added!</p>}
        {error && <p style={{ color: "red", textAlign: 'center', marginTop: 16 }}>{error}</p>}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  borderRadius: '0.7rem',
  border: '1px solid #c7d2fe',
  fontSize: '1.05rem',
  marginBottom: 0,
  outline: 'none',
  background: '#f1f5f9',
  color: '#1e293b',
  transition: 'border 0.2s, box-shadow 0.2s',
  boxShadow: '0 1px 4px rgba(99,102,241,0.04)',
};

const buttonStyle: React.CSSProperties = {
  marginTop: 8,
  padding: '0.8rem 1rem',
  borderRadius: '0.7rem',
  border: 'none',
  background: '#C4C4C4',
  color: '#4D4D4D',
  fontWeight: 700,
  fontSize: '1.1rem',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(99,102,241,0.10)',
  transition: 'background 0.2s, box-shadow 0.2s',
}; 