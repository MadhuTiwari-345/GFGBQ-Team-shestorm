
import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Edit3,
  CheckCircle2,
  Save,
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
  Smartphone,
  Shield,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TacticalToggle = ({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) => (
  <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-500 ${enabled ? 'bg-blue-600/10 border-blue-500/40' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
     <span className={`text-[9px] font-black uppercase tracking-widest ${enabled ? 'text-blue-500' : 'text-slate-500'}`}>{label}</span>
     <button 
      onClick={(e) => { e.preventDefault(); onToggle(); }}
      className="focus:outline-none transition-transform active:scale-90"
     >
       {enabled ? <ToggleRight className="text-blue-500" size={28} /> : <ToggleLeft className="text-slate-400 dark:text-slate-700" size={28} />}
     </button>
  </div>
);

const Profile: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [stealthMode, setStealthMode] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    trustedName: 'John Doe (Son)',
    trustedPhone: '+1 (555) 987-6543'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-10 pb-24 bg-transparent">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-all group"
        >
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <TacticalToggle label="Privacy Vault" enabled={privacyMode} onToggle={() => setPrivacyMode(!privacyMode)} />
          <TacticalToggle label="Stealth Mode" enabled={stealthMode} onToggle={() => setStealthMode(!stealthMode)} />
        </div>
      </div>

      {showToast && (
        <div className="fixed top-24 right-8 bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[100] animate-in slide-in-from-top-6 border border-blue-400/20 backdrop-blur-xl">
           <div className="p-1.5 bg-white/20 rounded-full"><CheckCircle2 size={16} /></div>
           <span className="font-black uppercase text-[10px] tracking-[0.2em]">Profile Synchronized</span>
        </div>
      )}

      <div className="space-y-3">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">User Profile</h1>
        <p className="text-sm text-slate-500 font-black uppercase tracking-[0.3em] italic">Account Management // Protection Level: ACTIVE</p>
      </div>

      <div className="space-y-8">
           {/* Profile Identity Card */}
           <div className="bg-white dark:bg-[#090b0f] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group transition-all hover:border-blue-500/20">
             <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                <ShieldCheck size={200} className="text-blue-500" />
             </div>
             
             <div className="relative shrink-0">
               <div className="w-44 h-44 rounded-[2rem] border-4 border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl transition-all duration-700 hover:rotate-2 bg-slate-800">
                 <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=500&h=500" alt="Profile" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
               </div>
               <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white border-4 border-white dark:border-[#090b0f] shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                  <Edit3 size={20} />
               </div>
             </div>

             <div className="space-y-6 text-center md:text-left flex-1 relative z-10">
                <div>
                   <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-tight">{profile.name}</h2>
                   <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mt-2 italic">SHESTORM DEFENSE USER</p>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                   <div className="bg-green-600/10 text-green-600 dark:text-green-400 px-5 py-2.5 rounded-xl text-[10px] font-black border border-green-500/20 flex items-center gap-2 uppercase tracking-widest">
                      <ShieldCheck size={14} /> ACCOUNT SECURED
                   </div>
                   <div className="bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-5 py-2.5 rounded-xl text-[10px] font-black border border-slate-200 dark:border-slate-800 flex items-center gap-2 uppercase tracking-widest">
                      <Smartphone size={14} /> MOBILE LINK ACTIVE
                   </div>
                </div>
             </div>
           </div>

           <div className="bg-white dark:bg-[#090b0f] rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 space-y-12 shadow-2xl">
              <div className="space-y-8">
                <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                   <User className="text-blue-500" size={16} /> Identity Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-1">Full Name</label>
                      <div className="relative group">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700" size={18} />
                         <input 
                            type="text" 
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none text-slate-900 dark:text-white text-base font-bold focus:border-blue-500 transition-all shadow-sm"
                         />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-1">Secure Email</label>
                      <div className="relative group">
                         <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700" size={18} />
                         <input 
                            type="email" 
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-6 outline-none text-slate-900 dark:text-white text-base font-bold focus:border-blue-500 transition-all shadow-sm"
                         />
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                 <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 transition-all flex items-center gap-3 active:scale-95 border border-white/10"
                 >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Save size={18} />
                    )}
                    <span>{isSaving ? 'Updating...' : 'Save Profile Changes'}</span>
                 </button>
              </div>
           </div>
        </div>
    </div>
  );
};

export default Profile;
