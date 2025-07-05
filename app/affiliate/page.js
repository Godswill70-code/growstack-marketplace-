'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { useSession } from 'next-auth/react'

export default function AffiliatePage() {
  const { data: session } = useSession()
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSales = async () => {
      if (!session?.user?.email) return

      const { data, error } = await supabase
        .from('sales')
        .select('*, products(title, price)')
        .eq('referral_email', session.user.email)

      if (error) {
        console.error('Error fetching sales:', error)
      } else {
        setSales(data)
      }
      setLoading(false)
    }

    fetchSales()
  }, [session])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Affiliate Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : sales.length === 0 ? (
        <p>No sales yet.</p>
      ) : (
        <ul style={{ marginTop: '2rem' }}>
          {sales.map((sale, idx) => (
            <li
              key={idx}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '6px',
                marginBottom: '1rem',
              }}
            >
              <p><strong>Product:</strong> {sale.products?.title}</p>
              <p><strong>Commission:</strong> ₦{(sale.products?.price * 0.6).toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
    }
