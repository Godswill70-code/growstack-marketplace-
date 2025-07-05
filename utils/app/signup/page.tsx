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

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    setError(error.message);
    setLoading(false);
    return;
  }

  const user = data.user;

  // Generate a unique referral ID
  const referral_id = 'user_' + Math.random().toString(36).substring(2, 8);

  // Save to users table
  const { error: insertError } = await supabase.from('users').insert([
    {
      id: user?.id,
      referral_id,
      role: 'affiliate',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  if (insertError) {
    console.error('Error saving referral ID:', insertError.message);
  }

  alert('Signup successful! Check your email for confirmation.');
  router.push('/login');
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
