'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setError(error.message);
    } else {
      alert('Signup successful! Check your email for confirmation.');
      router.push('/login');
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Create an Account</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />
      <button onClick={handleSignup} disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
    }
