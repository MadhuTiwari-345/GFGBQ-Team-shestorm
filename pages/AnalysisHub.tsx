
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Brain, 
  Search, 
  Camera, 
  FileText, 
  Zap, 
  ArrowRight,
  Globe,
  Binary,
  Upload,
  Sparkles,
  Info,
  // Fix: Added missing Activity import
  Activity
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

interface AnalysisHubProps {
  theme: 'dark' | 'light';
}

const AnalysisHub: React.FC<AnalysisHubProps> = ({ theme }) => {
  const [image, setImage] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [mode, setMode] = useState<'deep' | 'fast' | 'search'>('deep');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!query && !image) return;
    setIsThinking(true);
    setAnalysisResult(null);
    setSources([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let response;

      if (mode === 'deep') {
        // Deep Thinking Mode: Gemini 3 Pro with high thinking budget
        response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: {
            parts: [
              ...(image ? [{ inlineData: { data: image.split(',')[1], mimeType: 'image/jpeg' } }] : []),
              { text: `Analyze this fraud attempt in depth: ${query}` }
            ]
          },
          config: {
            thinkingConfig: { thinkingBudget: 32768 }
          }
        });
      } else if (mode === 'search') {
        // Search Grounding Mode: Gemini 3 Flash with Search
        response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: query || 'Analyze current scam trends related to this input.',
          config: {
            tools: [{ googleSearch: {} }]
          }
        });
        setSources(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
      } else {
        // Fast Mode: Gemini flash lite
        // Fix: Updated model name to 'gemini-flash-lite-latest' per SDK guidelines
        response = await ai.models.generateContent({
          model: 'gemini-flash-lite-latest',
          contents: query
        });
      }

      setAnalysisResult(response.text || 'No result found.');
    } catch (err) {
      setAnalysisResult(`Analysis Error: ${err}`);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-10 space-y-12 pb-32">
      <div className="space-y-4">
        <h1 className={`text-6xl font-black italic uppercase tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Intelligence Hub</h1>
        <p className="text-sm text-slate-500 font-black uppercase tracking-[0.4em] italic">Advanced Forensic Analysis & Search Grounding</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <div className={`p-8 rounded-[3rem] border shadow-2xl ${theme === 'dark' ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8 italic">Choose Analysis Mode</h3>
            <div className="space-y-4">
              {[
                { id: 'deep', label: 'Deep Thinking', icon: Brain, desc: 'High-logic reasoning (Gemini 3 Pro)' },
                { id: 'search', label: 'Search Grounding', icon: Globe, desc: 'Live web data (Gemini 3 Flash)' },
                { id: 'fast', label: 'Fast Response', icon: Zap, desc: 'Low-latency (Flash Lite)' }
              ].map((m) => (
                <button 
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center gap-5 text-left ${
                    mode === m.id ? 'border-blue-500 bg-blue-500/5' : 'border-transparent hover:bg-slate-800/20'
                  }`}
                >
                  <m.icon className={mode === m.id ? 'text-blue-500' : 'text-slate-600'} size={24} />
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest ${mode === m.id ? 'text-white' : 'text-slate-400'}`}>{m.label}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={`p-8 rounded-[3rem] border shadow-2xl relative overflow-hidden group ${theme === 'dark' ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200'}`}>
            <input type="file" id="img-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
            <label htmlFor="img-upload" className="cursor-pointer block text-center space-y-4">
              {image ? (
                <img src={image} className="w-full h-48 object-cover rounded-2xl shadow-xl" alt="Preview" />
              ) : (
                <div className="h-48 rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 hover:text-blue-500 hover:border-blue-500 transition-all">
                  <Camera size={40} className="mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Upload suspicious evidence</span>
                </div>
              )}
              <p className="text-[9px] font-black uppercase text-blue-500 italic">Gemini 3 Pro Vision Ready</p>
            </label>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className={`p-10 rounded-[4rem] border-4 shadow-2xl relative ${theme === 'dark' ? 'bg-[#1c2331] border-slate-800' : 'bg-white border-slate-200'}`}>
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste suspicious text or ask a forensic question..."
              className="w-full h-40 bg-transparent border-none outline-none text-xl font-bold italic text-white placeholder-slate-700 resize-none"
            />
            <div className="flex justify-between items-center mt-6">
               <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 italic">
                  <Binary size={14} /> Neural Analysis Active
               </div>
               <button 
                onClick={runAnalysis}
                disabled={isThinking}
                className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-3 border-b-8 border-blue-900"
               >
                 {isThinking ? <Activity className="animate-spin" /> : <Sparkles size={18} />}
                 {isThinking ? 'THINKING...' : 'Start Intelligence Scan'}
               </button>
            </div>
          </div>

          {analysisResult && (
            <div className={`p-12 rounded-[4rem] border-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700 ${theme === 'dark' ? 'bg-[#0d1117] border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center gap-4 mb-8">
                <Brain size={24} className="text-blue-500" />
                <h3 className="text-xs font-black uppercase tracking-widest italic text-blue-500">Analysis Result (v3 Pro Logic)</h3>
              </div>
              <div className="text-lg font-bold italic leading-relaxed text-slate-300 whitespace-pre-wrap">
                {analysisResult}
              </div>
              
              {sources.length > 0 && (
                <div className="mt-12 pt-10 border-t border-slate-800">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center gap-2">
                    <Globe size={14} /> Grounding Evidence
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {sources.map((src, i) => src.web && (
                      <a key={i} href={src.web.uri} target="_blank" className="bg-slate-800/50 hover:bg-blue-600/20 px-4 py-2 rounded-xl text-[10px] font-black text-blue-400 border border-blue-500/10 transition-all flex items-center gap-2">
                        {src.web.title} <ArrowRight size={12} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisHub;
