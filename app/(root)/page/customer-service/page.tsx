import React from 'react';
import Link from 'next/link';

export default function CustomerServicePage() {
  return (
    <div style={{
      maxWidth: 500,
      margin: '3rem auto',
      padding: '2rem',
      borderRadius: '1rem',
      background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      fontFamily: 'Inter, sans-serif',
    }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: 700,
        color: '#3730a3',
        marginBottom: '1.2rem',
        textAlign: 'center',
      }}>
        Moltres support
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '1.5rem', textAlign: 'center' }}>
        We are here to help you with any issues or questions about your orders, products, or sellers.
      </p>
      <div style={{
        background: '#fff',
        borderRadius: '0.75rem',
        padding: '1.2rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 8px rgba(55,48,163,0.07)',
      }}>
        <h2 style={{ color: '#dc2626', fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>
          ⚠️ Report a Scam or Wrong Product
        </h2>
        <p style={{ color: '#475569', marginBottom: 8 }}>
          If someone has scammed you or sent you the wrong product, please contact us immediately:
        </p>
        <ul style={{ color: '#1e293b', fontSize: '1rem', marginLeft: 20, marginBottom: 8 }}>
          <li>Email: <Link href="mailto:sameer754811@gmail.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>sameer754811@gmail.com</Link></li>
          <li>Phone: <Link href="tel:8630900119" style={{ color: '#2563eb', textDecoration: 'underline' }}>8630900119</Link></li>
        </ul>
        <p style={{ color: '#64748b', fontSize: '0.98rem' }}>
          Our team will investigate and take action as soon as possible. Please provide all relevant details and evidence.
        </p>
      </div>
      <div style={{
        background: '#f1f5f9',
        borderRadius: '0.75rem',
        padding: '1rem',
        textAlign: 'center',
        color: '#334155',
        fontSize: '1rem',
      }}>
        <strong>Need help with something else?</strong>
        <br />
        Reach out to us for any support regarding your orders, returns, or account.
      </div>
    </div>
  );
} 