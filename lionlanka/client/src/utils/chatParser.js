export const parseChatTags = (text) => {
  let cleanText = text || '';
  let image = null;
  let map = null;
  let maps = [];
  let followUps = [];

  // Parse IMAGE
  // e.g. [IMAGE: Sigiriya]
  const imageMatch = cleanText.match(/\[IMAGE:\s*([^\]]+)\]/);
  if (imageMatch) {
    image = imageMatch[1].trim();
    cleanText = cleanText.replace(imageMatch[0], '');
  }

  // Parse MAPS
  // e.g. [MAPS: 7.95,80.76,Sigiriya | 8.34,80.39,Anuradhapura]
  const mapsMatch = cleanText.match(/\[MAPS:\s*([^\]]+)\]/);
  if (mapsMatch) {
    const parts = mapsMatch[1].split('|');
    maps = parts.map(p => {
      const [lat, lng, label] = p.split(',');
      return { 
        lat: parseFloat(lat), 
        lng: parseFloat(lng), 
        label: label ? label.trim() : '' 
      };
    });
    cleanText = cleanText.replace(mapsMatch[0], '');
  }

  // Parse MAP (single)
  // e.g. [MAP: 7.957, 80.7603, Sigiriya]
  const mapMatch = cleanText.match(/\[MAP:\s*([^,]+),\s*([^,]+),\s*([^\]]+)\]/);
  if (mapMatch && maps.length === 0) { // Only use single map if no maps array
    map = { 
      lat: parseFloat(mapMatch[1]), 
      lng: parseFloat(mapMatch[2]), 
      label: mapMatch[3].trim() 
    };
    cleanText = cleanText.replace(mapMatch[0], '');
  }

  // Parse FOLLOW
  // e.g. [FOLLOW: Question 1? | Question 2?]
  const followMatch = cleanText.match(/\[FOLLOW:\s*([^\]]+)\]/);
  if (followMatch) {
    followUps = followMatch[1].split('|').map(q => q.trim());
    cleanText = cleanText.replace(followMatch[0], '');
  }

  return { 
    cleanText: cleanText.trim(), 
    image, 
    map, 
    maps, 
    followUps 
  };
};
