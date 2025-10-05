import React, { useState, useEffect } from 'react';
import { mediaService } from '@/services/mediaService';

const MediaAPITest = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const response = await mediaService.getAllMedia({ limit: 10 });
        console.log('🎯 API Response:', response);
        setMedia(response.data || []);
      } catch (err) {
        console.error('❌ API Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Media API Test ({media.length} items)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map(item => (
          <div key={item.id} className="border rounded-lg p-4 bg-white shadow">
            <div className="mb-3">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-500">ID: {item.id} | Type: {item.type}</p>
            </div>
            
            {/* Image Display */}
            <div className="mb-3 h-32 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              {item.cover_image_url ? (
                <img 
                  src={item.cover_image_url} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onLoad={() => console.log('✅ Image loaded:', item.name)}
                  onError={(e) => {
                    console.log('❌ Image error:', item.name, item.cover_image_url);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <p>No Image</p>
                  <p className="text-xs">cover_image_url: null</p>
                </div>
              )}
            </div>
            
            {/* Details */}
            <div className="text-xs space-y-1">
              <p><strong>Event:</strong> {item.event}</p>
              <p><strong>Date:</strong> {item.date}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <p><strong>Keywords:</strong> {Array.isArray(item.keywords) ? item.keywords.join(', ') : 'None'}</p>
              {item.cover_image_url && (
                <p><strong>Image URL:</strong> 
                  <a href={item.cover_image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                    View
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaAPITest;