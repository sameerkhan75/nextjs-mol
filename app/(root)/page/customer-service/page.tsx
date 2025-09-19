"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProfileCard from './ProfileCard';

export default function CustomerServicePage() {
  return (
    <>
      <style jsx>{`
        .customer-service-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .profile-section {
          position: sticky;
          top: 2rem;
        }
        
        .content-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .hero-section {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .logo-container {
          position: relative;
          display: inline-block;
          margin-bottom: 1.5rem;
        }
        
        .logo-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 140px;
          height: 140px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          filter: blur(20px);
          opacity: 0.3;
          z-index: -1;
        }
        
        .support-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .support-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        
        .urgent-alert {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border-left: 4px solid #dc2626;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .contact-methods {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin: 1rem 0;
        }
        
        .contact-method {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: white;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
          text-decoration: none;
          color: inherit;
        }
        
        .contact-method:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
          transform: translateY(-1px);
        }
        
        .contact-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        
        .email-icon {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }
        
        .phone-icon {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }
        
        .help-section {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin: 2rem 0;
        }
        
        .stat-item {
          text-align: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
        }
        
        @media (max-width: 1024px) {
          .customer-service-container {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 1.5rem;
          }
          
          .profile-section {
            position: static;
            order: 2;
          }
          
          .content-section {
            order: 1;
          }
        }
        
        @media (max-width: 768px) {
          .customer-service-container {
            padding: 1rem;
            gap: 1.5rem;
          }
          
          .contact-methods {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          
          .support-card {
            padding: 1.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .customer-service-container {
            padding: 0.75rem;
          }
          
          .support-card {
            padding: 1rem;
            border-radius: 1rem;
          }
        }
      `}</style>
      
      <div style={{
        minHeight: '100vh',
        backgroundImage: "url('/images/noo.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        position: 'relative',
        padding: '2rem 0',
      }}>
        {/* Background Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
          zIndex: 1,
        }} />
        
        <div className="customer-service-container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Content Section */}
          <div className="content-section">
            {/* Hero Section */}
            <div className="hero-section">
              <div className="logo-container">
                <div className="logo-glow" />
                <Image
                  src="/icons/Adobe Express - file.png"
                  alt="Moltres Logo"
                  width={120}
                  height={120}
                  style={{
                    borderRadius: '50%',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    border: '3px solid rgba(255,255,255,0.3)',
                  }}
                />
              </div>
              <h1 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '1rem',
                letterSpacing: '-0.02em',
              }}>
                Moltres Support
              </h1>
              <p style={{ 
                fontSize: '1.125rem', 
                color: '#475569', 
                marginBottom: '2rem',
                maxWidth: '600px',
                margin: '0 auto 2rem auto',
                lineHeight: 1.6,
              }}>
                We're here to help you with any issues or questions about your orders, products, or sellers. 
                Our dedicated support team is available 24/7 to assist you.
              </p>
            </div>

            {/* Stats Section */}
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support Available</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">&lt;2h</div>
                <div className="stat-label">Response Time</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>

            {/* Urgent Alert */}
            <div className="urgent-alert">
              <h2 style={{ 
                color: '#dc2626', 
                fontWeight: 700, 
                fontSize: '1.25rem', 
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                🚨 Report a Scam or Wrong Product
              </h2>
              <p style={{ 
                color: '#7f1d1d', 
                marginBottom: '1rem',
                fontSize: '1rem',
                lineHeight: 1.5,
              }}>
                If someone has scammed you or sent you the wrong product, please contact us immediately. 
                We take these reports very seriously and will investigate promptly.
              </p>
              
              <div className="contact-methods">
                <Link href="mailto:sameer754811@gmail.com" className="contact-method">
                  <div className="contact-icon email-icon">✉️</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>Email Support</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>sameer754811@gmail.com</div>
                  </div>
                </Link>
                <Link href="tel:8630900119" className="contact-method">
                  <div className="contact-icon phone-icon">📞</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>Phone Support</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>8630900119</div>
                  </div>
                </Link>
              </div>
              
              <p style={{ 
                color: '#991b1b', 
                fontSize: '0.875rem',
                marginTop: '1rem',
                fontStyle: 'italic',
              }}>
                Please provide all relevant details and evidence when reporting. Our team will investigate and take action as soon as possible.
              </p>
            </div>

            {/* General Help Section */}
            <div className="help-section">
              <h3 style={{ 
                color: '#1e293b', 
                fontWeight: 600, 
                fontSize: '1.125rem', 
                marginBottom: '0.75rem' 
              }}>
                Need help with something else?
              </h3>
              <p style={{ 
                color: '#475569', 
                fontSize: '1rem',
                lineHeight: 1.5,
                marginBottom: '1rem',
              }}>
                Reach out to us for any support regarding your orders, returns, account issues, or general inquiries. 
                We're here to make your experience smooth and enjoyable.
              </p>
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#1d4ed8',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}>
                  Order Issues
                </span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#059669',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}>
                  Returns & Refunds
                </span>
                <span style={{
                  background: 'rgba(147, 51, 234, 0.1)',
                  color: '#7c3aed',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}>
                  Account Support
                </span>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="profile-section">
            <ProfileCard
              name="Sameer"
              title="Developer & Support Lead"
              handle="sameer754811"
              status="Online"
              contactText="Contact Me"
              avatarUrl="/images/profile-pic.jpg"
              miniAvatarUrl="/images/profile-pic.jpg"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              behindGradient={undefined}
              innerGradient={undefined}
              onContactClick={() => window.location.href = 'mailto:sameer754811@gmail.com'}
            />
          </div>
        </div>
      </div>
    </>
  );
} 