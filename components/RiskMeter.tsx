
import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertCircle, ShieldCheck } from 'lucide-react';

interface RiskMeterProps {
  score: number;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const startValue = displayScore;
    const endValue = score;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Professional exponential ease out for numerical feedback
      const easedProgress = 1 - Math.pow(1 - progress, 5);
      const currentScore = Math.floor(startValue + (endValue - startValue) * easedProgress);
      
      setDisplayScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const getStatus = () => {
    if (score < 31) return { label: 'SAFE', color: 'text-emerald-500', bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/30' };
    if (score < 71) return { label: 'CAUTION', color: 'text-amber-500', bg: 'bg-amber-500', shadow: 'shadow-amber-500/30' };
    return { label: 'HIGH DANGER', color: 'text-red-600', bg: 'bg-red-600', shadow: 'shadow-red-600/70' };
  };

  const status = getStatus();

  return (
    <div className={`bg-white dark:bg-[#0d1117] rounded-[4rem] p-10 border-[10px] transition-all duration-1000 flex flex-col items-center shadow-2xl relative overflow-hidden ${
      score >= 71 ? 'ring-[20px] ring-red-600/10 border-red-600' : 'dark:border-slate-800 border-slate-100'
    }`}>
      {/* Dynamic Tactical Alert Pulse Layer */}
      {score >= 71 && (
        <div className="absolute inset-0 bg-red-600/5 animate-pulse-fast pointer-events-none" />
      )}

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className={`w-5 h-5 rounded-full ${status.bg} ${score >= 71 ? 'animate-pulse' : 'animate-ping'}`}></div>
        <h3 className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.6em] italic leading-none">SIGNAL THREAT LEVEL</h3>
      </div>
      
      <div className="relative flex flex-col items-center mb-12 z-10">
        <div className={`text-[120px] font-black italic tracking-tighter ${status.color} leading-none flex items-baseline transition-colors duration-1000 drop-shadow-2xl`}>
          <span>{displayScore}</span>
          <span className="text-4xl opacity-30 ml-2 font-black">/100</span>
        </div>
      </div>

      <div className="w-full space-y-8 relative z-10">
        <div className="h-12 bg-slate-100 dark:bg-black/80 rounded-full overflow-hidden relative border-2 border-slate-200 dark:border-slate-900 p-1.5 shadow-inner">
          <div 
            className={`h-full rounded-full transition-all duration-[2000ms] cubic-bezier(0.34, 1.56, 0.64, 1) ${status.bg} ${status.shadow} relative`}
            style={{ width: `${displayScore}%` }}
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
        
        <div className={`w-full py-7 rounded-[3rem] border-8 font-black text-2xl tracking-[0.3em] uppercase italic flex items-center justify-center gap-5 ${status.color} bg-transparent border-current transition-all duration-1000 ${score >= 71 ? 'animate-pulse scale-105 shadow-2xl bg-red-600/5' : ''}`}>
           {score >= 71 ? <ShieldAlert size={36} className="animate-bounce" /> : score > 30 ? <AlertCircle size={32} /> : <ShieldCheck size={32} />}
           <span className="animate-pulse">{status.label}</span>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
        .animate-pulse-fast {
          animation: pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default RiskMeter;
