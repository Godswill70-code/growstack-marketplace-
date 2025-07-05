'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
      } else {
        setUser(data?.user || null);
      }
    };

    fetchUser();
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Profile Page</h1>
      {user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>
      ) : (
        <p>No user is logged in.</p>
      )}
    </main>
  );
  }
