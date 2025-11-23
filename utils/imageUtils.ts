export const downloadImage = (
  base64Data: string,
  filename: string,
  format: 'png' | 'jpeg',
  scale: number
) => {
  const img = new Image();
  img.src = base64Data;
  img.crossOrigin = "anonymous"; 
  
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(img.naturalWidth * scale);
    canvas.height = Math.floor(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Use high quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // For JPEG, fill background with white (handling transparency)
    if (format === 'jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const quality = format === 'jpeg' ? 0.92 : 1.0;
    
    const dataURI = canvas.toDataURL(mimeType, quality);
    
    const a = document.createElement('a');
    a.href = dataURI;
    a.download = `${filename}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
};
