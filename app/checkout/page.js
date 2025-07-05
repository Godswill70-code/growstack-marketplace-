'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

export default function CheckoutPage() {
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const logPurchase = async () => {
      const { data: { session } } = await supabase.auth.getSession();
setSession(session);

const product_id = searchParams.get('id');
const referral_id = localStorage.getItem('referral_id') || null;
const buyer_email = session?.user?.email || 'guest@example.com';
      const referral_id = localStorage.getItem('referral_id') || null;

      if (!product_id) {
        setMessage('❌ Product ID not found.');
        return;
      }

      const { error } = await supabase.from('sales').insert([
        {
          product_id,
          buyer_email, // Replace later with real email from login
          referral_id,
        },
      ]);

      if (error) {
        console.error('Error logging sale:', error);
        setMessage('❌ Something went wrong.');
      } else {
        setMessage('✅ Purchase recorded successfully!');
      }
    };

    logPurchase();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Checkout Page</h1>
      <p>{message}</p>
    </div>
  );
}
