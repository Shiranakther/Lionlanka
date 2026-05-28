import React, { useState, useEffect } from 'react';

const WikiImage = ({ title }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
        if (!response.ok) throw new Error('Not found');
        const data = await response.json();
        
        if (data.originalimage && data.originalimage.source) {
          setImageUrl(data.originalimage.source);
        } else if (data.thumbnail && data.thumbnail.source) {
          setImageUrl(data.thumbnail.source);
        } else {
          setImageUrl(null);
        }
      } catch (err) {
        console.error('Failed to fetch Wiki image:', err);
        setImageUrl(null);
      } finally {
        setLoading(false);
      }
    };

    if (title) {
      fetchImage();
    }
  }, [title]);

  if (loading) {
    return (
      <div className="w-full h-48 bg-white/5 animate-pulse rounded-xl my-3 flex items-center justify-center border border-white/10">
        <span className="text-white/40 text-sm">Loading historical image...</span>
      </div>
    );
  }

  if (!imageUrl) return null;

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-white/10 shadow-lg relative group w-full max-w-2xl mx-auto bg-black/20">
      <img src={imageUrl} alt={title} className="w-full h-auto object-contain max-h-[60vh] rounded-xl" loading="lazy" />
      <div className="absolute bottom-0 left-0 right-0 bg-deep/80 backdrop-blur-sm p-2 text-xs text-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
        {title} (Source: Wikimedia Commons)
      </div>
    </div>
  );
};

export default WikiImage;
