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
  { id: 'industrial', name: 'صناعي خام', prompt: 'Place object on raw concrete surface, brutalist architecture, industrial lighting, sharp shadows', icon: '🏗️' },
  { id: 'pastel', name: 'ألوان باستيل', prompt: 'Change the background to a soft pastel color palette with minimal geometric shapes, in a pop art style', icon: '🎨' },
  { id: 'golden', name: 'غروب دافئ', prompt: 'Golden hour sunlight, warm glow, long soft shadows, outdoor natural atmosphere, lens flare', icon: '🌅' },
  { id: 'monochrome', name: 'أبيض وأسود', prompt: 'High contrast black and white photography, dramatic noir lighting, sharp details, artistic composition', icon: '🎱' },
  { id: 'kitchen', name: 'مطبخ عصري', prompt: 'Place on a clean marble kitchen counter, bright morning light, blurred modern kitchen background, lifestyle', icon: '🍳' },
  { id: 'minimalist', name: 'مينيمالي نظيف', prompt: 'Place on a white pedestal, minimalist geometric background, high key lighting, soft shadows, architectural style', icon: '🏛️' },
  { id: 'vintage', name: 'ريترو كلاسيك', prompt: 'Add 70s retro film look, warm faded colors, vintage furniture background, nostalgic atmosphere, grain texture', icon: '🎞️' },
  { id: 'tech', name: 'تقني حديث', prompt: 'Place on a clean white glossy surface, cool white laboratory lighting, high-tech environment, sleek modern look', icon: '🧪' },
  { id: 'summer', name: 'أجواء صيفية', prompt: 'Place on sand, bright sunlight, blue sky background, beach atmosphere, refreshing look, hard shadows', icon: '🏖️' },
  { id: 'darkmode', name: 'دارك مود', prompt: 'Place on a matte black surface, dark grey background, sleek dim lighting, modern tech aesthetic', icon: '🌑' },
];

const CAMERA_MOVES = [
  { id: 'dolly_in', name: 'تقريب (Dolly In)', prompt: 'Zoom in slightly on the subject, maintaining high detail and lighting', icon: '🔍+' },
  { id: 'dolly_out', name: 'تبعيد (Dolly Out)', prompt: 'Zoom out slightly to reveal more surroundings, maintaining consistency', icon: '🔍-' },
  { id: 'low_angle', name: 'زاوية منخفضة', prompt: 'Change to a low camera angle looking up at the subject, dramatic view', icon: '📐' },
  { id: 'high_angle', name: 'زاوية مرتفعة', prompt: 'Change to a high camera angle looking down at the subject, overview', icon: '📏' },
  { id: 'dutch', name: 'إمالة (Dutch)', prompt: 'Add a dutch angle tilt for a dynamic, energetic look', icon: '🔄' },
];

const SOLID_COLORS = [
  { name: 'White', hex: '#FFFFFF', prompt: 'Change background to pure white' },
  { name: 'Black', hex: '#000000', prompt: 'Change background to pure black' },
  { name: 'Gray', hex: '#808080', prompt: 'Change background to neutral gray' },
  { name: 'Red', hex: '#EF4444', prompt: 'Change background to vibrant red' },
  { name: 'Blue', hex: '#3B82F6', prompt: 'Change background to professional blue' },
  { name: 'Green', hex: '#10B981', prompt: 'Change background to green screen style' },
];

const GRADIENTS = [
  { name: 'Warm', class: 'from-orange-400 to-red-500', prompt: 'Change background to a warm orange to red gradient' },
  { name: 'Cool', class: 'from-blue-400 to-cyan-500', prompt: 'Change background to a cool blue to cyan gradient' },
  { name: 'Luxury', class: 'from-slate-900 to-slate-700', prompt: 'Change background to a luxury dark gradient' },
];

const SCENES = [
  { id: 'studio', name: 'ستوديو أبيض', prompt: 'Place object on a white infinity curve studio background with soft shadows' },
  { id: 'desk', name: 'مكتب خشبي', prompt: 'Place object on a clean wooden desk with a blurred office background' },
  { id: 'marble', name: 'رخام فاخر', prompt: 'Place object on a luxury white marble surface with reflections' },
  { id: 'nature', name: 'طبيعة ضبابية', prompt: 'Place object in a misty forest floor with shallow depth of field' },
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

  const handlePromptSet = (newPrompt: string) => {
    setPrompt(newPrompt);
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

      <div className="space-y-8 flex-1">
        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-zinc-300 mb-2">
            المخرج الذكي
          </label>
          <textarea
            id="prompt"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 min-h-[100px] resize-none text-sm leading-relaxed"
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

        {/* Camera Moves Section */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">
            حركة الكاميرا
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CAMERA_MOVES.map((move) => (
              <button
                key={move.id}
                onClick={() => handlePromptSet(move.prompt)}
                disabled={!hasImage || isProcessing}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800/30 hover:bg-zinc-800 rounded-lg border border-zinc-800/50 hover:border-zinc-700 transition-all text-right group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">{move.icon}</span>
                <span className="text-zinc-300 font-medium text-xs group-hover:text-white">{move.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">
            أنماط جاهزة
          </label>
          <div className="grid grid-cols-1 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePromptSet(preset.prompt)}
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

        {/* Backgrounds Section */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">
            تغيير الخلفية
          </label>
          
          {/* Colors & Gradients */}
          <div className="flex flex-wrap gap-2 mb-3 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
            {SOLID_COLORS.map(c => (
              <button 
                key={c.name}
                onClick={() => handlePromptSet(c.prompt)}
                disabled={!hasImage || isProcessing}
                className="w-6 h-6 rounded-full border border-zinc-700 hover:scale-125 transition-transform focus:ring-2 ring-yellow-500/50 disabled:opacity-50"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <div className="w-px h-6 bg-zinc-700 mx-1"></div>
            {GRADIENTS.map(g => (
              <button 
                key={g.name}
                onClick={() => handlePromptSet(g.prompt)}
                disabled={!hasImage || isProcessing}
                className={`w-6 h-6 rounded-full border border-zinc-700 bg-gradient-to-br ${g.class} hover:scale-125 transition-transform focus:ring-2 ring-yellow-500/50 disabled:opacity-50`}
                title={g.name}
              />
            ))}
          </div>

          {/* Scenes */}
          <div className="grid grid-cols-2 gap-2">
            {SCENES.map(scene => (
              <button
                key={scene.id}
                onClick={() => handlePromptSet(scene.prompt)}
                disabled={!hasImage || isProcessing}
                className="px-3 py-2 bg-zinc-800/30 border border-zinc-800 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-center disabled:opacity-50"
              >
                {scene.name}
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
