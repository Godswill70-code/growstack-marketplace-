'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function Marketplace() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (error) console.log('Error fetching products:', error)
      else setProducts(data)
    }

    fetchProducts()
  }, [])

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Marketplace</h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {products.map(product => (
          <div
            key={product.id}
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}
          >
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <button
              onClick={() => alert('Payment integration coming soon!')}
              style={{
                backgroundColor: '#22c55e',
                padding: '10px 20px',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                borderRadius: '5px',
                marginTop: '10px'
              }}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
