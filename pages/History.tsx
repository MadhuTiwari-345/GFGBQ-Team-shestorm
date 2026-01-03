
import React from 'react';
import { 
  History, 
  AlertCircle, 
  Check, 
  ArrowLeft,
  Filter,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Added theme prop to satisfy App.tsx routing requirements
const HistoryPage: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const navigate = useNavigate();

  const activities = [
    { id: 1, type: 'scam', title: 'IRS Impersonation Neutralized', time: '2 hours ago', color: 'text-red-500', bg: 'bg-red-500/10', detail: 'Advanced Audio Clone Detected' },
    { id: 2, type: 'safe', title: 'Trusted Contact Verified', time: 'Yesterday', color: 'text-green-500', bg: 'bg-green-500/10', detail: 'Encrypted Identity Pass' },
    { id: 3, type: 'safe', title: 'Medical Alert Call Secure', time: 'Nov 12', color: 'text-green-500', bg: 'bg-green-500/10', detail: 'Provider Identity Confirmed' },
    { id: 4, type: 'scam', title: 'Grandchild Impersonation Blocked', time: 'Nov 10', color: 'text-red-500', bg: 'bg-red-500/10', detail: 'Deepfake Voice Signature Rejected' },
    { id: 5, type: 'scam', title: 'Urgent Tech Support Alert', time: 'Nov 08', color: 'text-red-500', bg: 'bg-red-500/10', detail: 'Social Engineering Pattern Detected' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-10 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-all group px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/40 shadow-md"
        >
          <ArrowLeft size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return</span>
        </button>

        <div className="flex gap-4">
           <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-blue-500 shadow-sm transition-all">
             <Filter size={18} />
           </button>
           <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-blue-500 shadow-sm transition-all">
             <Download size={18} />
           </button>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">Security History</h1>
        <p className="text-sm text-slate-500 font-black uppercase tracking-[0.3em] italic">Comprehensive Activity Log // Encrypted Stream</p>
      </div>

      <div className="bg-white dark:bg-[#090b0f] rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        {activities.map((act) => (
          <div key={act.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 rounded-3xl bg-slate-50 dark:bg-black border border-slate-100 dark:border-slate-900 hover:border-blue-500/30 transition-all group cursor-pointer shadow-sm">
             <div className={`w-14 h-14 ${act.bg} ${act.color} rounded-2xl flex items-center justify-center shrink-0 border border-current opacity-70 group-hover:opacity-100 transition-opacity`}>
                {act.type === 'scam' ? <AlertCircle size={24} /> : <Check size={24} />}
             </div>
             <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white truncate leading-none uppercase italic">{act.title}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">{act.time}</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-widest mt-3">{act.detail}</p>
             </div>
          </div>
        ))}

        <div className="pt-8 text-center">
           <button className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-blue-500 transition-all">
             Load More Encrypted Records
           </button>
        </div>
      </div>

      <div className="bg-blue-600/5 dark:bg-blue-900/5 rounded-[2.5rem] p-8 border border-blue-500/10 text-center">
         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
            Data Integrity Notice: All history records are processed locally. To ensure your privacy, call transcripts are never stored; only high-level threat event data is kept for your review.
         </p>
      </div>
    </div>
  );
};

export default HistoryPage;
