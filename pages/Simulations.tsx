
import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Upload, 
  Sparkles, 
  Info, 
  ShieldAlert,
  Download,
  Activity,
  ArrowLeft,
  Camera,
  Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';

// Assume window.aistudio is provided by the environment.
// Using type casting at call sites to avoid global declaration conflicts.

const Simulations: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const navigate = useNavigate();
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Animate this scene to show a sophisticated digital impersonation attempt with glitching holographic effects.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  // Check for API Key selection on mount as required for Veo models
  useEffect(() => {
    const checkKey = async () => {
      // Cast window to any to access aistudio methods without conflicting with pre-existing global declarations.
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        const selected = await aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    // Cast window to any to access aistudio methods without conflicting with pre-existing global declarations.
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      await aistudio.openSelectKey();
      // Assume success after triggering selector to avoid race conditions per guidelines
      setHasApiKey(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateSim = async () => {
    if (!image) return;
    setIsGenerating(true);
    setVideoUrl(null);

    try {
      // Create a new GoogleGenAI instance right before making an API call 
      // to ensure it always uses the most up-to-date API key from the dialog.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
          imageBytes: image.split(',')[1],
          mimeType: 'image/jpeg'
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
      setVideoUrl(`${downloadLink}&key=${process.env.API_KEY}`);
    } catch (err: any) {
      // If the request fails with an error message containing "Requested entity was not found.", 
      // reset key selection state and prompt user to select a key again via openSelectKey()
      if (err?.message?.includes("Requested entity was not found.")) {
        setHasApiKey(false);
      }
      alert(`Simulation Error: ${err?.message || err}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // If no API key is selected, show the mandatory selection interface
  if (hasApiKey === false) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] p-20 text-center space-y-10">
        <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
          <Key size={48} />
        </div>
        <div className="space-y-4 max-w-md">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Billing Required</h2>
          <p className="text-slate-500 font-bold italic leading-relaxed">
            Veo video generation requires a paid API key from a Google Cloud project with billing enabled.
          </p>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 text-xs font-black uppercase tracking-widest hover:underline block"
          >
            Learn about billing
          </a>
        </div>
        <button 
          onClick={handleOpenKeySelector}
          className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95 border-b-8 border-blue-900"
        >
          Select Paid API Key
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-10 pb-32 space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">Simulation Lab</h1>
          <p className="text-sm text-slate-500 font-black uppercase tracking-[0.4em] italic">Visualizing Threat Scenarios // Powered by VEO</p>
        </div>
        <button onClick={() => navigate(-1)} className="p-4 rounded-2xl bg-slate-800 text-white hover:bg-blue-600 transition-all">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
           <div className={`p-10 rounded-[3rem] border-4 shadow-2xl ${theme === 'dark' ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-3 italic">
                <Camera size={18} /> Scene Input
              </h3>
              
              <div className="relative group">
                <input type="file" id="veo-img" className="hidden" accept="image/*" onChange={handleImageUpload} />
                <label htmlFor="veo-img" className="cursor-pointer block">
                  {image ? (
                    <img src={image} className="w-full h-72 object-cover rounded-[2rem] shadow-2xl transition-transform group-hover:scale-[1.02]" alt="Target" />
                  ) : (
                    <div className="h-72 rounded-[2rem] border-4 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 hover:text-blue-500 hover:border-blue-500 transition-all">
                      <Upload size={50} className="mb-6" />
                      <span className="text-xs font-black uppercase tracking-widest">Load Threat Profile Image</span>
                    </div>
                  )}
                </label>
              </div>

              <div className="mt-10 space-y-6">
                <div className="flex gap-4">
                  <button onClick={() => setAspectRatio('16:9')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${aspectRatio === '16:9' ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-500 border-slate-800'}`}>16:9 Cinema</button>
                  <button onClick={() => setAspectRatio('9:16')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${aspectRatio === '9:16' ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-500 border-slate-800'}`}>9:16 Portrait</button>
                </div>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-2xl p-6 text-sm font-bold italic text-slate-300 outline-none focus:border-blue-500 resize-none h-32"
                />
                <button 
                  onClick={generateSim}
                  disabled={isGenerating || !image}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-6 rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 border-b-8 border-blue-900"
                >
                  {isGenerating ? <Activity className="animate-spin" /> : <Sparkles />}
                  {isGenerating ? 'GENERATING VEO MOTION...' : 'Launch Simulation'}
                </button>
              </div>
           </div>
        </div>

        <div className="flex flex-col justify-center">
          {videoUrl ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-700">
               <div className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-4 border-blue-500/20">
                  <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
               </div>
               <div className="flex justify-between items-center px-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">VEO-3.1 Generated Asset</p>
                  <a href={videoUrl} download="simulation.mp4" className="text-blue-500 hover:text-white transition-colors flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
                     <Download size={14} /> Download HQ
                  </a>
               </div>
            </div>
          ) : (
            <div className="p-20 border-4 border-slate-800/20 rounded-[4rem] text-center space-y-8 opacity-20 italic">
               <ShieldAlert size={120} className="mx-auto text-slate-700" />
               <h2 className="text-4xl font-black uppercase tracking-tighter">Render Queue Empty</h2>
               <p className="text-sm font-bold uppercase tracking-[0.3em]">Load image and prompt to begin visual threat modeling.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulations;
