
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LiveMonitor from './pages/LiveMonitor';
import Login from './pages/Login';
import About from './pages/About';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import HistoryPage from './pages/History';
import AnalysisHub from './pages/AnalysisHub';
import Simulations from './pages/Simulations';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const App: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('shestorm-theme') as 'dark' | 'light') || 'dark';
  });
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/';
  const showSidebar = !isAuthPage;

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('shestorm-theme', newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ease-in-out ${
      theme === 'dark' ? 'bg-[#05070a] text-slate-200' : 'bg-slate-50 text-slate-900'
    } antialiased font-sans`}>
      {showSidebar && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          isCollapsed={isSidebarCollapsed}
          theme={theme}
          onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onClose={() => setIsSidebarOpen(false)} 
        />
      )}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        showSidebar 
          ? (isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72') 
          : ''
      }`}>
        {!isAuthPage && (
          <Header 
            onMenuToggle={() => setIsSidebarOpen(true)} 
            theme={theme}
            onThemeToggle={toggleTheme}
          />
        )}
        <main className="flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard theme={theme} />} />
            <Route path="/monitor" element={<LiveMonitor theme={theme} />} />
            <Route path="/analysis" element={<AnalysisHub theme={theme} />} />
            <Route path="/simulations" element={<Simulations theme={theme} />} />
            <Route path="/about" element={<About theme={theme} />} />
            <Route path="/settings" element={<Settings theme={theme} />} />
            <Route path="/profile" element={<Profile theme={theme} />} />
            <Route path="/history" element={<HistoryPage theme={theme} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
