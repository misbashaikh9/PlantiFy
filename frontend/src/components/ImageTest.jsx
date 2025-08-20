import React, { useState } from 'react';

const ImageTest = () => {
  const [imageStatus, setImageStatus] = useState({});

  const testImages = [
    'http://localhost:8000/media/Indoor Plants/MonsteraDeliciosa.jpeg',
    'http://localhost:8000/media/Indoor Plants/SnakePlant.jpeg',
    'http://localhost:8000/media/Indoor Plants/PeaceLily.jpeg',
    'http://localhost:8000/media/Indoor Plants/default-plant.jpg'
  ];

  const handleImageLoad = (url) => {
    setImageStatus(prev => ({ ...prev, [url]: '✅ Loaded' }));
  };

  const handleImageError = (url) => {
    setImageStatus(prev => ({ ...prev, [url]: '❌ Failed' }));
    console.error('Image failed to load:', url);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🖼️ Image Loading Test</h1>
      <p>Testing if images can be loaded from Django backend...</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {testImages.map((url, index) => (
          <div key={index} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
            <h3>Test Image {index + 1}</h3>
            <img 
              src={url}
              alt={`Test ${index + 1}`}
              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
              onLoad={() => handleImageLoad(url)}
              onError={() => handleImageError(url)}
            />
            <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
              {imageStatus[url] || '⏳ Loading...'}
            </p>
            <p style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
              {url}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>🔍 Debug Information:</h3>
        <ul>
          <li><strong>Backend URL:</strong> http://localhost:8000</li>
          <li><strong>Media Path:</strong> /media/</li>
          <li><strong>Total Images:</strong> {testImages.length}</li>
          <li><strong>Loaded:</strong> {Object.values(imageStatus).filter(status => status === '✅ Loaded').length}</li>
          <li><strong>Failed:</strong> {Object.values(imageStatus).filter(status => status === '❌ Failed').length}</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageTest;



