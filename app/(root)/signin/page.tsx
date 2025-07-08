"use client";

import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Sign In</h1>
      <button
        onClick={() => signIn('google')}
        style={{ padding: '0.75rem 2rem', fontSize: '1rem', borderRadius: '0.5rem', background: '#4285F4', color: '#fff', border: 'none', cursor: 'pointer' }}
      >
        Sign in with Google
      </button>
    </div>
  );
} 