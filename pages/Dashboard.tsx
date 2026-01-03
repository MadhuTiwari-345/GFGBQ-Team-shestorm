
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Mic,
  Zap,
  History,
  Cpu,
  Brain,
  AlertCircle,
  User,
  Shield,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RiskMeter from '../components/RiskMeter';

interface DashboardProps {
  theme: 'dark' | 'light';
}

const Dashboard: React.FC<DashboardProps> = ({ theme }) => {
  const navigate = useNavigate();
  const [riskScore, setRiskScore] = useState(12);

  const userProfile = {
    name: 'Jane Doe',
    protectionLevel: 'HIGH',
    trustedContact: {
      name: 'John Doe (Son)',
      phone: '+1 (555) 987-6543'
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRiskScore(prev => {
        const next = prev + (Math.random() > 0.5 ? 2 : -2);
        return Math.max(8, Math.min(22, next));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Scams Intercepted', val: '148', color: 'text-blue-500', icon: ShieldCheck, trend: '+12%' },
    { label: 'Detection Accuracy', val: '99.8%', color: 'text-green-500', icon: Cpu, trend: 'Optimal' },
    { label: 'Secure Hours', val: '84h', color: 'text-purple-500', icon: History, trend: 'Active' },
    { label: 'Network Health', val: 'A+', color: 'text-amber-500', icon: Activity, trend: 'Stable' },
  ];

  return (
    <div className={`max-w-7xl mx-auto p-6 sm:p-12 space-y-12 animate-in fade-in duration-700`}>
      {/* Header */}
      <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 border-b pb-12 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-500/20 shadow-xl bg-slate-800">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200" alt="Jane" className="w-full h-full object-cover" />
           </div>
           <div>
              <h1 className={`text-5xl font-black uppercase italic tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Welcome, {userProfile.name.split(' ')[0]}</h1>
              <p className="text-xs text-slate-500 font-black uppercase tracking-[0.5em] mt-3 italic">SYSTEM STATUS // NODE_01 ACTIVE</p>
           </div>
        </div>
        
        <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border ${theme === 'dark' ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Global Protection Active</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          
          {/* Main Action Call */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[3.5rem] blur opacity-20"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-[3rem] p-10 lg:p-16 text-white shadow-2xl overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-10 -rotate-12">
                  <ShieldAlert size={300} />
               </div>
               <div className="relative z-10 space-y-8 max-w-xl">
                  <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic border border-white/10">
                     <Zap size={12} className="text-yellow-300" /> MISSION CRITICAL
                  </div>
                  <h2 className="text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">
                    Launch Active <br />Call Monitor
                  </h2>
                  <p className="text-blue-100 text-lg font-bold italic opacity-80">
                    Enter the live monitoring suite to intercept and analyze real-time audio for deceptive behaviors.
                  </p>
                  <button 
                    onClick={() => navigate('/monitor')}
                    className="bg-white text-blue-700 px-12 py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 border-b-8 border-slate-300"
                  >
                    START MONITOR <ArrowRight size={24} />
                  </button>
               </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {stats.map((s, i) => (
              <div key={i} className={`p-10 rounded-[2.5rem] border shadow-xl transition-all hover:border-blue-500/30 ${theme === 'dark' ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 ${s.color}`}>
                    <s.icon size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-green-500">{s.trend}</span>
                </div>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">{s.label}</p>
                <p className={`text-4xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <RiskMeter score={riskScore} />
          
          <div className={`p-10 rounded-[3rem] border shadow-2xl overflow-hidden relative ${theme === 'dark' ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200'}`}>
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Shield size={120} />
             </div>
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4 border-b dark:border-slate-800 pb-6">
                   <User size={20} className="text-blue-500" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest italic">Security Profile</h3>
                </div>
                
                <div className="space-y-6">
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Defense Level</p>
                      <div className="flex items-center gap-2">
                         <span className="text-xl font-black text-blue-500 italic uppercase">{userProfile.protectionLevel}</span>
                         <ShieldCheck size={18} className="text-blue-500" />
                      </div>
                   </div>
                   
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Trusted Contact</p>
                      <p className={`text-lg font-black italic uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{userProfile.trustedContact.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-slate-400">
                         <Phone size={12} />
                         <span className="text-xs font-bold font-mono">{userProfile.trustedContact.phone}</span>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full mt-4 py-4 rounded-xl border-2 border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-all"
                >
                   Update Protection Profile
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
