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
    </main>
  );
    }
