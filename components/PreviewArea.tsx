import React, { useRef, useState } from 'react';
import { ImageState } from '../types';

interface PreviewAreaProps {
  imageState: ImageState;
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({
  imageState,
  onImageUpload,
  isProcessing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // Basic validation for image type
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    }
  };

  const hasImage = !!imageState.current;

  // Render Empty State
  if (!hasImage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-8 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
        
        <div 
          onClick={triggerUpload}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative z-10 w-full max-w-xl h-96 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-200 group animate-reveal 
            ${isDragging 
              ? 'border-yellow-500 bg-zinc-900/80 scale-105 shadow-2xl shadow-yellow-500/10' 
              : 'border-zinc-800 hover:border-yellow-500/50 hover:bg-zinc-900/50'
            }`}
        >
          <div className={`w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 transition-all duration-300 shadow-xl shadow-black/50 pointer-events-none ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
            <svg className={`w-8 h-8 transition-colors ${isDragging ? 'text-yellow-400' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className={`text-xl font-medium mb-2 font-serif transition-colors pointer-events-none ${isDragging ? 'text-yellow-400' : 'text-white'}`}>
             {isDragging ? 'أفلت الصورة هنا' : 'رفع صورة المنتج'}
          </h3>
          <p className={`text-zinc-500 text-center max-w-xs pointer-events-none transition-colors ${isDragging ? 'text-zinc-400' : ''}`}>
            أفلت صورتك هنا أو انقر للتصفح. الصيغ المدعومة: JPG, PNG, WEBP.
          </p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>
    );
  }

  // Render Image Preview
  return (
    <div className="flex-1 bg-zinc-950 relative flex items-center justify-center p-4 lg:p-12 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-5" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="relative max-w-full max-h-full shadow-2xl shadow-black rounded-lg overflow-hidden ring-1 ring-white/10">
        <img 
          key={imageState.current} // Triggers animation when image content updates
          src={isComparing && imageState.original ? imageState.original : imageState.current!} 
          alt="Studio content" 
          className={`max-w-full max-h-[85vh] object-contain transition-all duration-300 ${
            isProcessing 
              ? 'opacity-50 blur-sm scale-[0.98]' 
              : 'opacity-100 animate-reveal'
          }`}
        />
        
        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="relative w-24 h-24">
               <div className="absolute inset-0 border-4 border-zinc-700 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-yellow-500 font-medium tracking-widest uppercase text-sm animate-pulse">جاري المعالجة</p>
          </div>
        )}

        {/* Compare Button Badge - Left in RTL */}
        {!isProcessing && imageState.original && imageState.current !== imageState.original && (
          <div className="absolute bottom-6 left-6 z-10">
            <button
              onMouseDown={() => setIsComparing(true)}
              onMouseUp={() => setIsComparing(false)}
              onMouseLeave={() => setIsComparing(false)}
              onTouchStart={() => setIsComparing(true)}
              onTouchEnd={() => setIsComparing(false)}
              className="bg-black/70 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full border border-white/10 hover:bg-black/90 transition-colors select-none"
            >
              اضغط للمقارنة
            </button>
          </div>
        )}
      </div>

      {/* Info Tag - Right in RTL */}
      {!isProcessing && (
        <div className="absolute top-6 right-6 pointer-events-none">
             <div className="bg-zinc-900/80 backdrop-blur border border-zinc-700 px-3 py-1 rounded text-xs text-zinc-400 font-mono">
                {isComparing ? 'الأصلية' : 'المعدلة'}
             </div>
        </div>
      )}
    </div>
  );
};