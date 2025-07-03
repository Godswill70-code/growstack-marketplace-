'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push('/login');
      }
    };

    getUser();
  }, [router]);

  const handleUpload = async () => {
    if (!file || !title || !price || !description) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from('products')
      .upload(fileName, file);

    if (storageError) {
      alert('Error uploading file');
      setUploading(false);
      return;
    }

    const { error: insertError } = await supabase.from('products').insert([
      {
        title,
        description,
        price,
        file_url: storageData.path,
        user_id: user?.id,
      },
    ]);

    if (insertError) {
      alert('Failed to save product');
    } else {
      alert('Product uploaded successfully!');
      router.push('/dashboard');
    }

    setUploading(false);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Upload a New Product</h2>
      <input
        placeholder="Product Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      /><br /><br />
      <textarea
        placeholder="Product Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      /><br /><br />
      <input
        placeholder="Price (in NGN)"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      /><br /><br />
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} /><br /><br />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Product'}
      </button>
    </div>
  );
    }
