'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)

      if (!session) {
        router.push('/login')
      } else {
        fetchProducts(session.user.id)
      }
    }

    const fetchProducts = async (userId) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('creator_id', userId)

      if (!error) {
        setProducts(data)
      }
      setLoading(false)
    }

    getSession()
  }, [])

  if (!session || loading) {
    return <p>Loading dashboard...</p>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📦 Your Uploaded Products</h2>
      {products.length === 0 ? (
        <p>You haven’t uploaded any products yet.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <strong>{product.title}</strong> - ₦{product.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
    }
