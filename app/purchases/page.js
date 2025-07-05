'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userEmail = session?.user?.email;
      setEmail(userEmail);

      if (!userEmail) {
        setLoading(false);
        return;
      }

      const { data: salesData, error } = await supabase
        .from('sales')
        .select('*, products(title, description)')
        .eq('buyer_email', userEmail);

      if (error) {
        console.error('Error fetching purchases:', error);
      } else {
        setPurchases(salesData);
      }

      setLoading(false);
    };

    fetchPurchases();
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>🛒 Your Purchased Products</h1>
      {loading && <p>Loading...</p>}
      {!loading && !email && <p>Please log in to view your purchases.</p>}
      {!loading && email && purchases.length === 0 && (
        <p>You haven’t purchased any products yet.</p>
      )}
      {!loading &&
        purchases.map((purchase, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '1rem',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3>{purchase.products?.title}</h3>
            <p>{purchase.products?.description}</p>
            <p><strong>Status:</strong> Purchased ✅</p>
          </div>
        ))}

          <div style={{ marginTop: '2rem' }}>
  <h2>Want to earn too?</h2>

  <button
    onClick={async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;

      if (email) {
        await supabase
          .from('users')
          .update({ role: 'creator' })
          .eq('email', email);
        alert('✅ You are now a creator! Go to your dashboard to upload products.');
      }
    }}
    style={{
      backgroundColor: '#0ea5e9',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      marginRight: '10px',
      cursor: 'pointer'
    }}
  >
    Become a Creator
  </button>

  <button
    onClick={async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;

      if (email) {
        await supabase
          .from('users')
          .update({ role: 'affiliate' })
          .eq('email', email);
        alert('✅ You are now an affiliate! Commission dashboard coming soon.');
      }
    }}
    style={{
      backgroundColor: '#10b981',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    }}
  >
    Join Affiliate Program
  </button>
</div>
    </main>
  );
    }
