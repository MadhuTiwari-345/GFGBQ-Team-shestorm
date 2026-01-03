
import React, { useState } from 'react';
import { 
  Shield, 
  Settings as SettingsIcon, 
  Monitor, 
  Lock, 
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
  Activity,
  HeartPulse,
  Wifi,
  Database,
  EyeOff,
  User,
  BellRing,
  Smartphone,
  Brain,
  Moon,
  Sun
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TacticalToggle = ({ enabled, onToggle, label, sub, theme }: { enabled: boolean; onToggle: () => void; label: string; sub?: string; theme: 'dark' | 'light' }) => (
  <div className={`p-8 rounded-[2rem] border flex items-center justify-between shadow-sm transition-all duration-300 ${
    theme === 'dark' ? 'bg-[#0F1219] border-slate-800 hover:border-blue-500/20' : 'bg-white border-slate-200 hover:border-blue-600/20 shadow-lg'
  }`}>
    <div className="flex items-center gap-6">
      <div className={`p-4 rounded-2xl transition-colors ${enabled ? (theme === 'dark' ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-600 text-white') : (theme === 'dark' ? 'bg-slate-900 text-slate-600' : 'bg-slate-100 text-slate-400')}`}>
         <div className="w-5 h-5 rounded-full border-2 border-current shadow-inner" />
      </div>
      <div className="text-left space-y-1">
        <h4 className={`text-sm font-black uppercase tracking-[0.2em] italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{label}</h4>
        {sub && <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">{sub}</p>}
      </div>
    </div>
    <button 
      onClick={(e) => { e.preventDefault(); onToggle(); }}
      className="focus:outline-none transition-transform active:scale-90"
    >
      {enabled ? <ToggleRight className="text-blue-500" size={48} /> : <ToggleLeft className="text-slate-300 dark:text-slate-700" size={48} />}
    </button>
  </div>
);

const Settings: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const navigate = useNavigate();
  const [micEnabled, setMicEnabled] = useState(true);
  const [shareData, setShareData] = useState(false);
  const [healthMonitor, setHealthMonitor] = useState(true);
  const [proxyEnc, setProxyEnc] = useState(true);
  const [notifyTrusted, setNotifyTrusted] = useState(true);

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10 pb-24 space-y-12 bg-transparent animate-in fade-in duration-500">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <button 
          onClick={() => navigate(-1)}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all group shadow-xl ${
            theme === 'dark' ? 'bg-[#1c2331] border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">Back to Hub</span>
        </button>

        <div className={`flex items-center gap-5 px-8 py-3 rounded-3xl border transition-all duration-700 ${healthMonitor ? 'bg-green-600/10 border-green-500/30' : 'bg-slate-100 dark:bg-slate-900 border-transparent dark:border-slate-800'}`}>
           <HeartPulse size={20} className={healthMonitor ? 'text-green-500 animate-pulse' : 'text-slate-500'} />
           <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${healthMonitor ? 'text-green-500' : 'text-slate-500'}`}>System Integrity: {healthMonitor ? 'SECURE' : 'IDLE'}</span>
           <button onClick={() => setHealthMonitor(!healthMonitor)} className="ml-2">
             {healthMonitor ? <ToggleRight className="text-green-500" size={36} /> : <ToggleLeft className="text-slate-300 dark:text-slate-700" size={36} />}
           </button>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className={`text-6xl font-black tracking-tighter uppercase italic leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Defense Settings</h1>
        <p className="text-sm text-slate-500 font-black uppercase tracking-[0.4em] italic">Tactical Protocols & Data Integrity Controls</p>
      </div>

      <div className="space-y-16">
        {/* Core Matrix */}
        <section className="space-y-10">
           <div className="flex items-center gap-5 border-b border-slate-200 dark:border-slate-800 pb-6">
              <Shield className="text-blue-500" size={24} />
              <h2 className={`text-xl font-black uppercase tracking-tighter italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Privacy & Inception Protocols</h2>
           </div>
           
           <div className="grid md:grid-cols-2 gap-8">
              <TacticalToggle theme={theme} label="Acoustic Sensor Access" sub="Critical for live fraud detection" enabled={micEnabled} onToggle={() => setMicEnabled(!micEnabled)} />
              <TacticalToggle theme={theme} label="Anonymous Telemetry" sub="Improve network fraud signatures" enabled={shareData} onToggle={() => setShareData(!shareData)} />
              <TacticalToggle theme={theme} label="Origin Obfuscation" sub="Mask IP and line geolocation" enabled={proxyEnc} onToggle={() => setProxyEnc(!proxyEnc)} />
              <TacticalToggle theme={theme} label="Trusted Node Alerts" sub="Auto-notify emergency contact" enabled={notifyTrusted} onToggle={() => setNotifyTrusted(!notifyTrusted)} />
           </div>
        </section>

        {/* Tactical UI Section */}
        <section className="space-y-10">
           <div className="flex items-center gap-5 border-b border-slate-200 dark:border-slate-800 pb-6">
              <Monitor className="text-blue-500" size={24} />
              <h2 className={`text-xl font-black uppercase tracking-tighter italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>UI Execution Protocols</h2>
           </div>
           <div className="grid md:grid-cols-3 gap-8">
              <div className={`p-8 rounded-[2rem] border text-center transition-all ${theme === 'dark' ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}>
                 <Moon size={32} className={`mx-auto mb-6 ${theme === 'dark' ? 'text-blue-400' : 'text-slate-300'}`} />
                 <h4 className={`text-xs font-black uppercase tracking-widest mb-2 italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Interface Theme</h4>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic mb-6">Current: {theme === 'dark' ? 'Dark Matrix' : 'High Contrast Light'}</p>
                 <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest border border-blue-500/30 px-6 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all">Switch Globally</button>
              </div>
              <div className={`p-8 rounded-[2rem] border text-center transition-all opacity-40 ${theme === 'dark' ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200'}`}>
                 <Activity size={32} className="mx-auto mb-6 text-slate-400" />
                 <h4 className={`text-xs font-black uppercase tracking-widest mb-2 italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Haptic Pulses</h4>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic mb-6">Device Restricted</p>
                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Locked</div>
              </div>
              <div className={`p-8 rounded-[2rem] border text-center transition-all ${theme === 'dark' ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}>
                 <Brain size={32} className={`mx-auto mb-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                 <h4 className={`text-xs font-black uppercase tracking-widest mb-2 italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Reasoning Logs</h4>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic mb-6">View AI Thought Traces</p>
                 <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest border border-blue-500/30 px-6 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all">Access Vault</button>
              </div>
           </div>
        </section>
      </div>

      <div className="pt-20 text-center border-t border-slate-200 dark:border-slate-800">
        <p className={`text-[11px] font-black uppercase tracking-[0.5em] mb-8 italic ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>SHESTORM DEFENSE UNIT // PROTOCOL REVISION 2.5.0</p>
        <div className="flex flex-wrap justify-center gap-10">
           <button className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] hover:scale-105 transition-transform italic">Support Node</button>
           <button className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em] hover:scale-105 transition-transform italic underline decoration-2 underline-offset-8">Wipe Local Intercept History</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
