'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [session, setSession] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)

      if (!session) {
        router.push('/login') // 🔐 Redirect if not logged in
      }
    }

    getSession()
  }, [])

  if (!session) {
    return <p>Loading...</p> // Optional loading message
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    // Upload file to Supabase storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`

    const { data: fileData, error: fileError } = await supabase.storage
      .from('products')
      .upload(fileName, file)

    if (fileError) {
      alert('File upload error:', fileError.message)
      return
    }

    const fileUrl = supabase.storage
      .from('products')
      .getPublicUrl(fileName).data.publicUrl

    // Insert product into Supabase table
    const { error: insertError } = await supabase
      .from('products')
      .insert([{ title, description, price, file_url: fileUrl }])

    if (insertError) {
      alert('Product upload failed!')
      return
    }

    alert('Product uploaded successfully!')
    router.push('/marketplace')
  }

  return (
    <form onSubmit={handleUpload} style={{ padding: '2rem', maxWidth: '500px' }}>
      <h2>Upload Your Product</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        style={{ display: 'block', marginBottom: '10px', width: '100%' }}
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        required
        style={{ display: 'block', marginBottom: '20px' }}
      />
      <button type="submit" style={{
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px'
      }}>
        Upload Product
      </button>
    </form>
  )
}
