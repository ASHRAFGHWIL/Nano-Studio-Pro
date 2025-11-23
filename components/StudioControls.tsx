import React, { useState } from 'react';
import { Button } from './Button';
import { Preset } from '../types';
import { downloadImage } from '../utils/imageUtils';

interface StudioControlsProps {
  onGenerate: (prompt: string) => void;
  onReset: () => void;
  isProcessing: boolean;
  hasImage: boolean;
  currentImage: string | null;
}

const PRESETS: Preset[] = [
  { id: 'cinematic', name: 'إضاءة سينمائية', prompt: 'Add cinematic studio lighting, dramatic contrast, professional product photography style', icon: '🎬' },
  { id: 'softbox', name: 'سوفت بوكس ناعم', prompt: 'Place on a clean white background with softbox lighting, highly detailed, commercial look', icon: '💡' },
  { id: 'cyberpunk', name: 'نيون/سايبر بانك', prompt: 'Add neon lights, cyberpunk aesthetic, pink and blue rim lighting', icon: '🌃' },
  { id: 'nature', name: 'مشهد طبيعي', prompt: 'Place the object on a mossy rock in a forest, dappled sunlight, bokeh background', icon: '🌿' },
  { id: 'luxury', name: 'فخامة ذهبية', prompt: 'Add gold accents, luxurious marble background, warm ambient lighting', icon: '✨' },
];

export const StudioControls: React.FC<StudioControlsProps> = ({ 
  onGenerate, 
  onReset, 
  isProcessing,
  hasImage,
  currentImage
}) => {
  const [prompt, setPrompt] = useState('');
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');
  const [exportScale, setExportScale] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  const handlePresetClick = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };

  const handleDownload = () => {
    if (currentImage) {
      const filename = `nano-studio-${new Date().toISOString().slice(0,10)}`;
      downloadImage(currentImage, filename, exportFormat, exportScale);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800 w-full lg:w-96 p-6 overflow-y-auto">
      <div className="mb-8">
        <h2 className="serif text-2xl font-bold text-white mb-1">نانو ستوديو</h2>
        <p className="text-zinc-500 text-sm">مدعوم بواسطة Gemini 2.5</p>
      </div>

      <div className="space-y-6 flex-1">
        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-zinc-300 mb-2">
            المخرج الذكي
          </label>
          <textarea
            id="prompt"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 min-h-[120px] resize-none text-sm leading-relaxed"
            placeholder="صِف رؤيتك... مثال: 'أضف فلتر ريترو' أو 'ضع المنتج على طاولة خشبية'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={!hasImage || isProcessing}
            dir="rtl"
          />
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleSubmit} 
          disabled={!hasImage || !prompt.trim() || isProcessing}
          isLoading={isProcessing}
          className="w-full h-12 text-lg"
        >
          {isProcessing ? 'جاري المعالجة...' : 'إنشاء اللقطة'}
        </Button>

        {/* Presets */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">
            إعدادات جاهزة
          </label>
          <div className="grid grid-cols-1 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset.prompt)}
                disabled={!hasImage || isProcessing}
                className="flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border border-zinc-800/50 hover:border-zinc-700 transition-all text-right group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{preset.icon}</span>
                <div>
                  <div className="text-zinc-300 font-medium text-sm group-hover:text-white">{preset.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Export Controls */}
      {hasImage && (
        <div className="mt-8 pt-6 border-t border-zinc-800">
           <label className="block text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">
            تصدير ومشاركة
          </label>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Format Selection */}
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
               <button 
                 onClick={() => setExportFormat('png')}
                 className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${exportFormat === 'png' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                 PNG
               </button>
               <button 
                 onClick={() => setExportFormat('jpeg')}
                 className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${exportFormat === 'jpeg' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                 JPG
               </button>
            </div>

            {/* Scale Selection */}
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
               <button 
                 onClick={() => setExportScale(1)}
                 className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${exportScale === 1 ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                 أصلية
               </button>
               <button 
                 onClick={() => setExportScale(0.5)}
                 className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${exportScale === 0.5 ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                 50%
               </button>
            </div>
          </div>

          <Button 
            variant="secondary" 
            onClick={handleDownload} 
            className="w-full text-sm h-10 border-zinc-700 hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            حفظ الصورة
          </Button>
        </div>
      )}

      {/* Footer Controls */}
      <div className="mt-4 pt-4 border-t border-zinc-800">
        <Button 
          variant="ghost" 
          onClick={onReset} 
          disabled={!hasImage || isProcessing}
          className="w-full text-sm hover:text-red-400"
        >
          بدء جلسة جديدة
        </Button>
      </div>
    </div>
  );
};
