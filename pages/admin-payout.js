'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function AdminPayoutPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayoutRequests = async () => {
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching payout requests:', error)
      } else {
        setRequests(data)
      }
      setLoading(false)
    }

    fetchPayoutRequests()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Payout Requests</h1>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No payout requests found.</p>
      ) : (
        <ul style={{ marginTop: '2rem' }}>
          {requests.map((request, idx) => (
            <li
              key={idx}
              style={{
                border: '1px solid #ddd',
                padding: '1rem',
                borderRadius: '6px',
                marginBottom: '1rem'
              }}
            >
              <p><strong>User:</strong> {request.email}</p>
              <p><strong>Amount:</strong> ₦{request.amount}</p>
              <p><strong>Status:</strong> {request.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
    }
