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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
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
          className="relative z-10 w-full max-w-xl h-96 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-yellow-500/50 hover:bg-zinc-900/50 transition-all group"
        >
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-black/50">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-white mb-2 font-serif">رفع صورة المنتج</h3>
          <p className="text-zinc-500 text-center max-w-xs">أفلت صورتك هنا أو انقر للتصفح. الصيغ المدعومة: JPG, PNG, WEBP.</p>
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
          src={isComparing && imageState.original ? imageState.original : imageState.current!} 
          alt="Studio content" 
          className={`max-w-full max-h-[85vh] object-contain transition-opacity duration-300 ${isProcessing ? 'opacity-50 blur-sm' : 'opacity-100'}`}
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