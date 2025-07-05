'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/login';
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role')
        .eq('id', session.user.id)
        .single();

      if (data) {
        setUser(data);
        setFullName(data.full_name || '');
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  const updateProfile = async () => {
    const { error } = await supabase
      .from('users')
      .update({ full_name: fullName })
      .eq('id', user.id);

    if (!error) {
      setMessage('✅ Profile updated successfully!');
    } else {
      setMessage('❌ Failed to update profile.');
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>👤 Your Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role || 'buyer'}</p>

      <div style={{ marginTop: '1rem' }}>
        <label>Full Name:</label><br />
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ padding: '0.5rem', width: '100%' }}
        />
      </div>

      <button
        onClick={updateProfile}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#22c55e',
          color: '#fff',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Update Profile
      </button>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
