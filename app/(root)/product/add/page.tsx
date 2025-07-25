// app/(root)/product/add/page.tsx
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function AddProductPage() {
  const { data: session } = useSession();
  const [discordId, setDiscordId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
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

    let imageUrl = "";
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        console.error("Image upload failed:", uploadRes.status, text);
        setError(`Image upload failed: ${text}`);
        return;
      }

      const data = await uploadRes.json();
      imageUrl = data.url;
    } else {
      setError("Please select an image.");
      return;
    }

    const res = await fetch("/api/product/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: parseFloat(price),
        listPrice: parseFloat(listPrice) || parseFloat(price),
        images: [imageUrl],
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

    if (res.ok) {
      setSuccess(true);
      setName("");
      setPrice("");
      setListPrice("");
      setBrand("");
      setCategory("");
      setDescription("");
      setImageFile(null);
      setImagePreview("");
    } else {
      console.error("Product creation failed:", res.status);
      setError("Failed to add product.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `url('/images/toroto.jpeg') center/cover no-repeat`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.97)",
          borderRadius: "1.5rem",
          boxShadow: "0 8px 32px rgba(55,48,163,0.10)",
          padding: "2.5rem 2rem 2rem",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: "2rem",
            color: "#4D4D4D",
            marginBottom: "2rem",
            letterSpacing: "-1px",
          }}
        >
          Add Product
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          {!session?.user?.email && (
            <input
              placeholder="Discord ID"
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              required
              style={inputStyle}
            />
          )}
          <input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            placeholder="List Price"
            type="number"
            value={listPrice}
            onChange={(e) => setListPrice(e.target.value)}
            style={inputStyle}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImageFile(file);
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) =>
                  setImagePreview(ev.target?.result as string);
                reader.readAsDataURL(file);
              } else {
                setImagePreview("");
              }
            }}
            required
            style={inputStyle}
          />
          {imagePreview && (
            <div style={{ alignSelf: "center", margin: "1rem 0" }}>
              <Image
                src={imagePreview}
                alt="Preview"
                width={360}
                height={180}
                style={{ borderRadius: 8, objectFit: "cover" }}
                unoptimized
              />
            </div>
          )}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
          />
          <button type="submit" style={buttonStyle}>
            Add Product
          </button>
        </form>

        {success && (
          <p style={{ color: "green", textAlign: "center", marginTop: 16 }}>
            Product added!
          </p>
        )}
        {error && (
          <p style={{ color: "red", textAlign: "center", marginTop: 16 }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  borderRadius: "0.7rem",
  border: "1px solid #c7d2fe",
  fontSize: "1.05rem",
  background: "#f1f5f9",
  outline: "none",
  transition: "border 0.2s, box-shadow 0.2s",
  boxShadow: "0 1px 4px rgba(99,102,241,0.04)",
};

const buttonStyle: React.CSSProperties = {
  marginTop: 8,
  padding: "0.8rem 1rem",
  borderRadius: "0.7rem",
  border: "none",
  background: "#C4C4C4",
  color: "#4D4D4D",
  fontWeight: 700,
  fontSize: "1.1rem",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
  transition: "background 0.2s, box-shadow 0.2s",
};
