
import React from 'react';
import { Bell, HelpCircle, LogOut, Menu, Sun, Moon, PanelLeftOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, theme, onThemeToggle }) => {
  const navigate = useNavigate();

  return (
    <header className={`h-20 border-b flex items-center justify-between px-6 sticky top-0 z-40 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#05070a]/80 border-slate-800' 
        : 'bg-white/80 border-slate-200'
    } backdrop-blur-md`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="p-2 text-slate-500 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
        >
          <PanelLeftOpen size={24} />
        </button>
        <div className="hidden md:block">
          <h1 className={`text-lg font-black tracking-widest italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>SHESTORM</h1>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">AI Behavioral Defense</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={onThemeToggle}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-2 text-slate-500 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-500/10"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button 
          onClick={() => alert("Notification center coming soon.")}
          className="p-2 text-slate-500 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-500/10"
        >
          <Bell size={20} />
        </button>
        <button 
          onClick={() => navigate('/about')}
          className="p-2 text-slate-500 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-500/10"
        >
          <HelpCircle size={20} />
        </button>
        <div className={`w-px h-6 mx-1 sm:mx-2 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-slate-800 dark:bg-slate-700 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-xl transition-all text-xs font-black uppercase tracking-widest shadow-lg"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
