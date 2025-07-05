'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function CheckoutPage() {
  const [message, setMessage] = useState('');

  const handlePurchase = async () => {
    const referral_id = localStorage.getItem('referral_id');
    const product_id = 'sample-product-id'; // Replace with dynamic ID later
    const buyer_email = 'buyer@example.com'; // Replace with real email later

    const { error } = await supabase.from('sales').insert([
      {
        product_id,
        buyer_email,
        referral_id,
      },
    ]);

    if (error) {
      console.error('Error logging sale:', error);
      setMessage('Something went wrong.');
    } else {
      setMessage('✅ Purchase recorded! Thanks for buying.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🧾 Checkout Page</h2>
      <button onClick={handlePurchase}>
        Confirm Purchase
      </button>
      <p>{message}</p>
    </div>
  );
      }
