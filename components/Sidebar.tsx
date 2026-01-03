
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  History, 
  Settings, 
  HelpCircle, 
  UserCircle,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Search,
  BrainCircuit,
  Film
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  theme: 'dark' | 'light';
  onCollapseToggle: () => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isCollapsed, theme, onCollapseToggle, onClose }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Monitor', path: '/monitor', icon: ShieldAlert },
    { name: 'Intelligence Hub', path: '/analysis', icon: BrainCircuit },
    { name: 'Simulation Lab', path: '/simulations', icon: Film },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] md:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full border-r flex flex-col z-[70] transition-all duration-300 ease-in-out md:translate-x-0 shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isCollapsed ? 'w-20' : 'w-72'} ${
        theme === 'dark' ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Logo Section */}
        <div className={`p-5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b ${theme === 'dark' ? 'border-slate-800/50' : 'border-slate-100'} shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20 shrink-0">
              <ShieldAlert className="text-white" size={24} />
            </div>
            {!isCollapsed && <span className={`text-xl font-black tracking-tight uppercase italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>SHESTORM</span>}
          </div>
          <button 
            onClick={onClose} 
            className="md:hidden p-2 text-slate-500 hover:text-blue-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} space-y-2 mt-6 overflow-y-auto pb-6`}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => onClose()}
                title={isCollapsed ? item.name : ''}
                className={`flex items-center rounded-xl transition-all duration-200 group relative ${
                  isCollapsed ? 'justify-center w-full h-12' : 'gap-3 px-4 py-3.5'
                } ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' 
                    : theme === 'dark' ? 'text-slate-500 hover:bg-slate-800/40 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600'
                }`}
              >
                <item.icon size={isCollapsed ? 22 : 20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'} />
                {!isCollapsed && <span className="font-bold text-sm tracking-tight">{item.name}</span>}
                {!isCollapsed && isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Controls */}
        <div className={`mt-auto flex flex-col border-t shrink-0 ${theme === 'dark' ? 'border-slate-800 bg-[#0d1117]' : 'border-slate-100 bg-slate-50/30'}`}>
          <button 
            onClick={onCollapseToggle}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} py-5 text-slate-500 hover:text-blue-600 transition-all uppercase text-[10px] font-black tracking-widest`}
          >
            {isCollapsed ? <PanelLeft size={20} /> : (
              <>
                <PanelLeftClose size={20} className="mr-3" />
                COLLAPSE SIDEBAR
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
