import React from 'react';
import { useMedia } from '../hooks/useMedia';

const MediaTest = () => {
  const { media, loading, error, refreshMedia } = useMedia();

  console.log('🔍 MediaTest state:', { 
    mediaCount: media.length, 
    loading, 
    error 
  });

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-blue-50">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-center mt-2 text-blue-600">Loading media...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50">
        <p className="text-red-600">❌ Error: {error}</p>
        <button 
          onClick={refreshMedia}
          className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-green-50">
      <h3 className="text-green-800 font-bold">✅ Media API Test Success!</h3>
      <p className="text-green-600">Found {media.length} media items</p>
      <div className="mt-2 space-y-1">
        {media.slice(0, 3).map(item => (
          <div key={item.id} className="text-sm text-gray-600">
            • {item.name} ({item.type})
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaTest;