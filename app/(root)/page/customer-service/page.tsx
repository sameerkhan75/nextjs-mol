import React from 'react';
import Link from 'next/link';
//update this file
export default function CustomerServicePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffe5e5 0%, #f8e8ff 50%, #ffe5f0 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 30% 20%, rgba(255, 182, 193, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(221, 160, 221, 0.1) 0%, transparent 50%)',
        zIndex: 1,
      }} />
      <div style={{
        maxWidth: 500,
        margin: '0 auto',
        padding: '2rem',
        borderRadius: '1.5rem',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(255, 182, 193, 0.15)',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        zIndex: 2,
        border: '1px solid rgba(255, 182, 193, 0.2)',
      }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 700,
          color: '#d63384',
          marginBottom: '1.2rem',
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(214, 51, 132, 0.1)',
        }}>
          Moltres support
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#8b5a96', marginBottom: '1.5rem', textAlign: 'center' }}>
          We are here to help you with any issues or questions about your orders, products, or sellers.
        </p>
        <div style={{
          background: 'linear-gradient(135deg, #fff5f7 0%, #fef7ff 100%)',
          borderRadius: '1rem',
          padding: '1.2rem',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 16px rgba(214, 51, 132, 0.08)',
          border: '1px solid rgba(214, 51, 132, 0.1)',
        }}>
          <h2 style={{ color: '#e91e63', fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>
            ⚠️ Report a Scam or Wrong Product
          </h2>
          <p style={{ color: '#8b5a96', marginBottom: 8 }}>
            If someone has scammed you or sent you the wrong product, please contact us immediately:
          </p>
          <ul style={{ color: '#6b46c1', fontSize: '1rem', marginLeft: 20, marginBottom: 8 }}>
            <li>Email: <Link href="mailto:sameer754811@gmail.com" style={{ color: '#d63384', textDecoration: 'underline', fontWeight: 500 }}>sameer754811@gmail.com</Link></li>
            <li>Phone: <Link href="tel:8630900119" style={{ color: '#d63384', textDecoration: 'underline', fontWeight: 500 }}>8630900119</Link></li>
          </ul>
          <p style={{ color: '#9c7c38', fontSize: '0.98rem' }}>
            Our team will investigate and take action as soon as possible. Please provide all relevant details and evidence.
          </p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%)',
          borderRadius: '1rem',
          padding: '1rem',
          textAlign: 'center',
          color: '#8b5a96',
          fontSize: '1rem',
          border: '1px solid rgba(214, 51, 132, 0.1)',
        }}>
          <strong>Need help with something else?</strong>
          <br />
          Reach out to us for any support regarding your orders, returns, or account.
        </div>
      </div>
    </div>
  );
} 