'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminPayoutPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email;

      // ✅ Replace this with YOUR admin email
      const adminEmail = 'growstack1@gmail.com';

      if (!userEmail || userEmail !== adminEmail) {
        alert('⛔ Unauthorized: Admins only');
        router.push('/');
        return;
      }

      setSession(session);
      fetchRequests();
    };

    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (!error) setRequests(data);
      setLoading(false);
    };

    init();
  }, []);

  // The rest of your component continues here…

export default function AdminPayoutPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (!error) {
        setRequests(data);
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('payout_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      alert(`✅ Status updated to "${newStatus}"`);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
    } else {
      alert('❌ Failed to update status.');
    }
  };

  if (loading) return <p>Loading payout requests...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>💼 Admin Payout Dashboard</h2>
      {requests.length === 0 ? (
        <p>No payout requests yet.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req.id} style={{ marginBottom: 20, borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
              <p><strong>Affiliate Email:</strong> {req.affiliate_email}</p>
              <p><strong>Amount:</strong> ₦{req.amount}</p>
              <p><strong>Status:</strong> {req.status}</p>
              <p><strong>Requested:</strong> {new Date(req.requested_at).toLocaleString()}</p>
              <button onClick={() => updateStatus(req.id, 'approved')} style={{ marginRight: 10, backgroundColor: '#16a34a', color: 'white', padding: '5px 10px' }}>
                ✅ Approve
              </button>
              <button onClick={() => updateStatus(req.id, 'declined')} style={{ backgroundColor: '#dc2626', color: 'white', padding: '5px 10px' }}>
                ❌ Decline
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
