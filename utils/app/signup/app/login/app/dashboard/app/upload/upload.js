// pages/upload.js

import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')

  const handleUpload = async () => {
    if (!file || !title || !price) {
      setMessage('Please fill all required fields.')
      return
    }

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`
    const { data: fileData, error: fileError } = await supabase.storage
      .from('marketplace-products')
      .upload(fileName, file)

    if (fileError) {
      setMessage('File upload failed.')
      return
    }

    const fileUrl = `https:iuxiqcmccznopjgxiush.supabase.co/storage/v1/object/public/products/${fileName}`

    // Insert product into database
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          title,
          description,
          price: parseFloat(price),
          file_url: fileUrl,
        }
      ])

    if (error) {
      setMessage('Error saving product.')
    } else {
      setMessage('Product uploaded successfully!')
      setTitle('')
      setDescription('')
      setPrice('')
      setFile(null)
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>
      <h2>Upload Product</h2>
      <input
        type="text"
        placeholder="Product Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      /><br /><br />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      /><br /><br />

      <input
        type="number"
        placeholder="Price in Naira"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      /><br /><br />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      /><br /><br />

      <button onClick={handleUpload}>Upload</button>

      {message && <p>{message}</p>}
    </div>
  )
}
