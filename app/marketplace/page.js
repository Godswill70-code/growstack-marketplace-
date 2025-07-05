'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function Marketplace() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      localStorage.setItem('referral_id', ref);
    }
  }, []);
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (error) console.log('Error fetching products:', error)
      else {
  setProducts(data)
  setFilteredProducts(data)
    
    }

    fetchProducts()
  }, [])

    useEffect(() => {
  const results = products.filter(product =>
    product.title.toLowerCase().includes(search.toLowerCase())
  )
  setFilteredProducts(results)
}, [search, products])
    
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Marketplace</h1>
            <input
  type="text"
  placeholder="Search for a product..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '20px'
  }}
/>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredProducts.map(product => (
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
  onClick={() => {
    window.location.href = `/checkout?id=${product.id}`;
  }}
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
    </main>
  )
}
