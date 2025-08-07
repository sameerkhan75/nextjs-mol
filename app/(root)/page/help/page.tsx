import React from 'react';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: "url('/images/noice.jpeg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: 540,
        width: '100%',
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px rgba(55,48,163,0.10)',
        padding: '2.5rem 2rem',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <img 
            src="/icons/Adobe Express - file.png" 
            alt="Adobe Express Logo"
            style={{
              width: '4rem',
              height: '4rem',
              marginBottom: '0.5rem',
              objectFit: 'contain',
            }}
          />
          <h1 style={{
            fontSize: '2.3rem',
            fontWeight: 900,
            color: '#3730a3',
            letterSpacing: '-1px',
            margin: 0,
            textAlign: 'center',
          }}>
            Help & FAQs
          </h1>
        </div>
        <p style={{ fontSize: '1.15rem', color: '#334155', marginBottom: '2rem', textAlign: 'center', lineHeight: 1.7 }}>
          Find answers to common questions or reach out for support.
        </p>
        <div style={{
          background: 'linear-gradient(90deg, #f1f5f9 60%, #e0e7ff 100%)',
          borderRadius: '1rem',
          padding: '1.3rem 1rem',
          marginBottom: '2.2rem',
          boxShadow: '0 2px 8px rgba(99,102,241,0.07)',
        }}>
          <h2 style={{ color: '#3730a3', fontWeight: 700, fontSize: '1.18rem', marginBottom: 14 }}>
            Frequently Asked Questions
          </h2>
          <ul style={{ color: '#1e293b', fontSize: '1.07rem', marginLeft: 20, marginBottom: 8, lineHeight: 1.8 }}>
            <li><strong>How do I add a product?</strong><br />Go to <Link href="/product/add" style={{ color: '#2563eb', textDecoration: 'underline', transition: 'color 0.2s' }}>Add Product</Link> and fill out the form.</li>
            <li><strong>How can I see my listed products?</strong><br />Visit <Link href="/your-products" style={{ color: '#2563eb', textDecoration: 'underline', transition: 'color 0.2s' }}>Your Products</Link> to view your listings.</li>
            <li><strong>What if I receive a wrong or fake product?</strong><br />Contact <Link href="mailto:sameer754811@gmail.com" style={{ color: '#2563eb', textDecoration: 'underline', transition: 'color 0.2s' }}>Customer Service</Link> immediately with details and evidence.</li>
            <li><strong>How do I reset my password?</strong><br />Use the password reset link on the sign-in page or contact support.</li>
            <li><strong>How long does it take to get a response?</strong><br />We respond to all queries within 24 hours.</li>
          </ul>
        </div>
        <div style={{
          background: 'linear-gradient(90deg, #e0e7ff 60%, #f1f5f9 100%)',
          borderRadius: '1rem',
          padding: '1.3rem 1rem',
          textAlign: 'center',
          color: '#334155',
          fontSize: '1.09rem',
          boxShadow: '0 1px 4px rgba(99,102,241,0.07)',
        }}>
          <strong style={{ color: '#3730a3', fontSize: '1.13rem' }}>Still need help?</strong>
          <br />
          <div style={{ margin: '1.1rem 0 0.7rem 0', display: 'flex', flexDirection: 'column', gap: '0.7rem', alignItems: 'center' }}>
            <Link href="mailto:sameer754811@gmail.com" style={{
              background: '#6366f1',
              color: '#fff',
              padding: '0.55rem 1.3rem',
              borderRadius: '0.7rem',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.05rem',
              boxShadow: '0 2px 8px rgba(99,102,241,0.10)',
              transition: 'background 0.2s',
              display: 'inline-block',
            }}>Email Support</Link>
            <Link href="tel:8630900119" style={{
              background: '#2563eb',
              color: '#fff',
              padding: '0.55rem 1.3rem',
              borderRadius: '0.7rem',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.05rem',
              boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
              transition: 'background 0.2s',
              display: 'inline-block',
            }}>Call Support</Link>
          </div>
          <div style={{ marginTop: '1.1rem', color: '#64748b', fontSize: '0.98rem' }}>
            We&apos;re here to support you!
          </div>
        </div>
      </div>
    </div>
  );
} 