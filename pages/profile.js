'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    avatar_url: '',
    role: '',
  });
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        window.location.href = '/login';
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('full_name, bio, avatar_url, role')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error.message);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { error } = await supabase
      .from('users')
      .update(profile)
      .eq('id', session.user.id);

    if (error) {
      alert('Failed to update profile.');
    } else {
      alert('Profile updated successfully!');
    }

    setLoading(false);
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>👤 Edit Your Profile</h2>

      <label>Full Name</label>
      <input
        type="text"
        value={profile.full_name}
        onChange={e => setProfile({ ...profile, full_name: e.target.value })}
        style={{ display: 'block', marginBottom: 10, padding: 10, width: '100%' }}
      />

      <label>Bio</label>
      <textarea
        value={profile.bio}
        onChange={e => setProfile({ ...profile, bio: e.target.value })}
        style={{ display: 'block', marginBottom: 10, padding: 10, width: '100%' }}
      />

      <label>Avatar URL (Image Link)</label>
      <input
        type="text"
        value={profile.avatar_url}
        onChange={e => setProfile({ ...profile, avatar_url: e.target.value })}
        style={{ display: 'block', marginBottom: 10, padding: 10, width: '100%' }}
      />

      <label>Role</label>
      <select
        value={profile.role}
        onChange={e => setProfile({ ...profile, role: e.target.value })}
        style={{ display: 'block', marginBottom: 20, padding: 10, width: '100%' }}
      >
        <option value="">Select role</option>
        <option value="buyer">Buyer</option>
        <option value="creator">Creator</option>
        <option value="affiliate">Affiliate</option>
      </select>

      <button onClick={handleUpdate} style={{ padding: 10, backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: 5 }}>
        Update Profile
      </button>
    </div>
  );
         }
