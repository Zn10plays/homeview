'use client';

import React, { useState } from 'react';
import { useEdgeStore } from '@/lib/edgestore';

const UploadComponent = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { edgestore } = useEdgeStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          console.log(progress);
        },
      });
      setUploadedUrl(res.url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">File Upload to Edge Store</h1>
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 p-2 border rounded"
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {uploadedUrl && (
        <div className="mt-4">
          <p>File uploaded successfully!</p>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            View uploaded file
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;