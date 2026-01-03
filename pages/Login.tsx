
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('signup');

  const getStrength = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length > 8) s += 25;
    if (/[A-Z]/.test(p)) s += 25;
    if (/[0-9]/.test(p)) s += 25;
    if (/[^A-Za-z0-9]/.test(p)) s += 25;
    return s;
  };

  const strength = getStrength(password);
  const strengthText = strength <= 25 ? 'Weak' : strength <= 50 ? 'Medium' : strength <= 75 ? 'Strong' : 'Excellent';
  const strengthColor = strength <= 25 ? 'bg-red-500' : strength <= 50 ? 'bg-amber-500' : strength <= 75 ? 'bg-blue-500' : 'bg-green-500';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-10 left-10 flex items-center gap-2 text-slate-500 hover:text-white transition-colors group z-20"
      >
        <div className="p-2 rounded-xl bg-slate-800/50 group-hover:bg-blue-600 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="text-xs font-black uppercase tracking-widest">Back to Home</span>
      </button>

      <div className="max-w-xl w-full relative z-10">
        <div className="text-center mb-10 space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-2xl">
                <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">
                {mode === 'signup' ? 'Secure Node Creation' : 'Defense Access'}
            </h1>
            <p className="text-slate-500 text-lg">Real-time protection for your peace of mind.</p>
        </div>

        <div className="bg-[#0F1219] border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="flex p-1.5 bg-black/40 rounded-2xl mb-10">
                <button 
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'signup' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Sign Up
                </button>
                <button 
                  onClick={() => setMode('login')}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Log In
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Email Terminal</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@node.net"
                            className="w-full bg-black/40 border-2 border-slate-900 focus:border-blue-500 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-white font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2 text-left">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Access Key</label>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full bg-black/40 border-2 border-slate-900 focus:border-blue-500 rounded-2xl py-4 pl-12 pr-12 outline-none transition-all text-white font-medium"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {mode === 'signup' && (
                        <div className="mt-4 px-1">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Strength</span>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${strengthText === 'Excellent' ? 'text-green-500' : 'text-slate-500'}`}>
                                    {strengthText}
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[25, 50, 75, 100].map((step) => (
                                    <div key={step} className={`h-1.5 rounded-full transition-all duration-500 ${strength >= step ? strengthColor : 'bg-slate-800'}`}></div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 group active:scale-95"
                >
                    {mode === 'signup' ? 'Verify & Create' : 'Enter Portal'}
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </form>

            <div className="mt-10 text-center">
                <p className="text-sm text-slate-500 font-medium">
                    {mode === 'signup' ? 'Already protected?' : "New node?"} {' '}
                    <button 
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        className="text-blue-500 font-bold hover:underline"
                    >
                        {mode === 'signup' ? 'Login here' : 'Register now'}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
