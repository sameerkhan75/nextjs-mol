import React from 'react';

export default function HelpPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)',
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
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}>
          <span style={{
            fontSize: '2.5rem',
            marginRight: '0.5rem',
            color: '#6366f1',
          }}>❓</span>
          <h1 style={{
            fontSize: '2.1rem',
            fontWeight: 800,
            color: '#3730a3',
            letterSpacing: '-1px',
            margin: 0,
          }}>
            Help & FAQs
          </h1>
        </div>
        <p style={{ fontSize: '1.13rem', color: '#334155', marginBottom: '1.7rem', textAlign: 'center', lineHeight: 1.6 }}>
          Find answers to common questions or reach out for support.
        </p>
        <div style={{
          background: 'linear-gradient(90deg, #f1f5f9 60%, #e0e7ff 100%)',
          borderRadius: '1rem',
          padding: '1.3rem 1rem',
          marginBottom: '1.7rem',
          boxShadow: '0 2px 8px rgba(99,102,241,0.07)',
        }}>
          <h2 style={{ color: '#3730a3', fontWeight: 700, fontSize: '1.13rem', marginBottom: 12 }}>
            Frequently Asked Questions
          </h2>
          <ul style={{ color: '#1e293b', fontSize: '1.04rem', marginLeft: 20, marginBottom: 8, lineHeight: 1.7 }}>
            <li><strong>How do I add a product?</strong><br />Go to <a href="/product/add" style={{ color: '#2563eb', textDecoration: 'underline' }}>Add Product</a> and fill out the form.</li>
            <li><strong>How can I see my listed products?</strong><br />Visit <a href="/your-products" style={{ color: '#2563eb', textDecoration: 'underline' }}>Your Products</a> to view your listings.</li>
            <li><strong>What if I receive a wrong or fake product?</strong><br />Contact <a href="mailto:sameer754811@gmail.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>Customer Service</a> immediately with details and evidence.</li>
            <li><strong>How do I reset my password?</strong><br />Use the password reset link on the sign-in page or contact support.</li>
            <li><strong>How long does it take to get a response?</strong><br />We respond to all queries within 24 hours.</li>
          </ul>
        </div>
        <div style={{
          background: 'linear-gradient(90deg, #e0e7ff 60%, #f1f5f9 100%)',
          borderRadius: '1rem',
          padding: '1.1rem 1rem',
          textAlign: 'center',
          color: '#334155',
          fontSize: '1.07rem',
          boxShadow: '0 1px 4px rgba(99,102,241,0.07)',
        }}>
          <strong style={{ color: '#3730a3' }}>Still need help?</strong>
          <br />
          Email us at <a href="mailto:sameer754811@gmail.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>sameer754811@gmail.com</a> or call <a href="tel:8630900119" style={{ color: '#2563eb', textDecoration: 'underline' }}>8630900119</a>.<br />
          We're here to support you!
        </div>
      </div>
    </div>
  );
} 