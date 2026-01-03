
import React, { useState } from 'react';
import { ShieldCheck, Brain, Lock, Users, Github, ArrowLeft, ToggleLeft, ToggleRight, Binary, Microscope, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Added theme prop to satisfy App.tsx routing requirements
const About: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const navigate = useNavigate();
  const [techMode, setTechMode] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-12 pb-24">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-all group"
        >
          <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Return</span>
        </button>

        {/* Tech Details Toggle */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-all duration-500 ${techMode ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-slate-100 dark:bg-slate-900 border-transparent dark:border-slate-800'}`}>
           <Microscope size={16} className={techMode ? 'text-indigo-500' : 'text-slate-500'} />
           <span className={`text-[9px] font-black uppercase tracking-widest ${techMode ? 'text-indigo-500' : 'text-slate-500'}`}>Technical View</span>
           <button onClick={() => setTechMode(!techMode)}>
             {techMode ? <ToggleRight className="text-indigo-500" size={28} /> : <ToggleLeft className="text-slate-400 dark:text-slate-600" size={28} />}
           </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-500 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-blue-500/20">
             <Shield size={12} /> Strategic Intent
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter uppercase italic">
            Defending the <br />
            <span className="text-blue-600">Human Signal.</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl font-medium">
            SHESTORM is not a simple call blocker. We are a tactical behavioral firewall designed to neutralization AI-cloned voices and complex social engineering scams in real-time.
          </p>
          
          <div className="flex gap-4">
             <button 
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
             >
                Dashboard
             </button>
             <button 
              onClick={() => window.open('https://github.com', '_blank')}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2"
             >
                <Github size={16} /> Repository
             </button>
          </div>
        </div>
        
        <div className="relative rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl group aspect-video lg:aspect-square">
          <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" alt="Cyber Security" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xl">
                <Brain size={20} />
             </div>
             <div className="text-left">
                <p className="text-white font-black text-xs uppercase italic">SHESTORM Core</p>
                <p className="text-blue-300 text-[9px] font-bold uppercase tracking-widest">Ver: 2.4.0</p>
             </div>
          </div>
        </div>
      </section>

      {/* Interactive Manifesto */}
      <section className="bg-slate-100 dark:bg-[#090b0f] rounded-[2rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 space-y-10 shadow-xl">
        <div className="text-left max-w-2xl space-y-2">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">The Tactical Edge</h2>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest italic">Decoding deception at the speed of sound.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { 
              id: 'intent',
              title: 'Intent Decryption', 
              desc: 'We analyze conversation semantics to identify high-pressure psychological coercion patterns before they succeed.',
              icon: Binary,
              tech: 'Gemini-3 Pro Reasoning Engine'
            },
            { 
              id: 'privacy',
              title: 'Privacy Fortress', 
              desc: 'Call audio is processed in volatile memory and purged immediately. No recordings, no storage, no leaks.',
              icon: Lock,
              tech: 'Local Edge Processing'
            },
            { 
              id: 'fingerprint',
              title: 'Acoustic Fingerprint', 
              desc: 'Detection of synthetic artifacts and frequency anomalies that reveal AI-cloned voices invisible to human ears.',
              icon: ShieldCheck,
              tech: 'Waveform Artifact Detection'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-black/40 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 group hover:border-blue-500/40 transition-all shadow-sm">
               <item.icon className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={28} />
               <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tighter italic">{item.title}</h3>
               <p className="text-sm text-slate-500 leading-relaxed font-medium mb-4">{item.desc}</p>
               
               {techMode && (
                 <div className="pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                    <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest italic">Stack: {item.tech}</p>
                 </div>
               )}
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-10">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Unit Contributors</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Yamini', role: 'Interface Lead', img: 'dev-1' },
            { name: 'Ishani Gupta', role: 'Backend Tactician', img: 'dev-2' },
            { name: 'Madhu Tiwari', role: 'AI Strategist', img: 'dev-3' },
            { name: 'Khushi Verma', role: 'Field Intelligence', img: 'dev-4' }
          ].map((person, i) => (
            <div key={i} className="group">
              <div className="relative rounded-[1.5rem] overflow-hidden mb-4 aspect-square bg-slate-100 dark:bg-[#090b0f] border border-slate-200 dark:border-slate-800 shadow-lg transition-all duration-500 group-hover:border-blue-500/50">
                <img src={`https://picsum.photos/seed/shestorm-${person.img}/600/600`} alt={person.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase italic leading-none">{person.name}</h4>
              <p className="text-blue-500 font-black uppercase tracking-widest text-[9px] mt-1.5">{person.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
