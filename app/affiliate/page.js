'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function AffiliatePage() {
  const [referralId, setReferralId] = useState('');
  const [copied, setCopied] = useState(false);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchAffiliateData = async () => {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      const user = session?.user;
      const userId = user?.id;
      const userEmail = user?.email;
      setEmail(userEmail);

      if (!userId || sessionError) {
        window.location.href = '/login';
        return;
      }

      // Fetch referral ID
      const { data, error } = await supabase
        .from('users')
        .select('referral_id')
        .eq('id', userId)
        .single();

      if (!error) {
        setReferralId(data.referral_id);
      }

      // Fetch sales
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*, products(title, price)')
        .eq('affiliate_email', userEmail);

      if (!salesError) {
        setSales(salesData);
      }

      setLoading(false);
    };

    fetchAffiliateData();
  }, []);

  const referralLink = `https://growstack-marketplace.vercel.app/marketplace?ref=${referralId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalEarnings = sales.reduce((total, sale) => {
    const price = sale.products?.price || 0;
    return total + price * 0.6;
  }, 0);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h2>🎉 Welcome to Your Affiliate Dashboard</h2>

      <div style={{ marginBottom: 30 }}>
        <p>👤 Your Referral ID: <strong>{referralId}</strong></p>
        <p>🔗 Your Affiliate Link:</p>
        <input
          type="text"
          value={referralLink}
          readOnly
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />
        <button onClick={copyToClipboard}>
          {copied ? '✅ Copied!' : '📋 Copy Link'}
        </button>
      </div>

      <div style={{ borderTop: '1px solid #ccc', paddingTop: 20 }}>
        <h3>📊 Your Earnings</h3>
        {sales.length === 0 ? (
          <p>No sales yet. Share your link to start earning commissions.</p>
        ) : (
          <>
            <p><strong>Total Sales:</strong> {sales.length}</p>
            <p><strong>Total Earnings:</strong> ₦{totalEarnings.toFixed(2)}</p>
          {totalEarnings > 0 && (
 <button
  onClick={async () => {
    const { error } = await supabase.from('payout_requests').insert([
      {
        affiliate_email: email,
        amount: totalEarnings,
        status: 'pending'
      }
    ])

    if (error) {
      alert('❌ Failed to request payout. Please try again.')
      console.error(error)
    } else {
      alert(`✅ Your payout request of ₦${totalEarnings.toFixed(2)} has been sent!`)
    }
  }}
  style={{
    backgroundColor: '#4f46e5',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    marginTop: '20px',
    cursor: 'pointer'
  }}
>
  💵 Request Payout of ₦{totalEarnings.toFixed(2)}
</button>

            <ul>
  {sales.map((sale, idx) => (
    <li key={idx} style={{ marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '6px' }}>
      <p><strong>Product:</strong> {sale.products && sale.products.title}</p>
      <p><strong>Commission:</strong> ₦{sale.products && (sale.products.price * 0.6).toFixed(2)}</p>
    </li>
  ))}
</ul>
        
    </div>
  );
}
