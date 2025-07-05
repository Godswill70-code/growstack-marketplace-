'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function AffiliatePage() {
  const [referralId, setReferralId] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferralId = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = '/login';
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('referral_id')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching referral ID:', error.message);
      } else {
        setReferralId(data.referral_id);
      }

      setLoading(false);
    };

    fetchReferralId();
  }, []);

  const referralLink = `https://growstack-marketplace.vercel.app/marketplace?ref=${referralId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h2>🎉 Welcome to Your Affiliate Dashboard</h2>
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
  );
}
