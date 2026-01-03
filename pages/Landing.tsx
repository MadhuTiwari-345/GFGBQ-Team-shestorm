
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Waves, 
  Zap,
  ShieldAlert,
  Shield,
  Activity,
  Lock,
  Radar,
  Clock,
  ArrowRight,
  TrendingUp,
  Globe,
  Binary,
  Volume2,
  ChevronDown,
  Cpu,
  Target,
  Github,
  Linkedin
} from 'lucide-react';
import * as THREE from 'three';

const NeuralCore: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(2, 4);
    const material = new THREE.MeshPhongMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.15,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const innerGeo = new THREE.IcosahedronGeometry(1.2, 4);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.04,
      wireframe: true
    });
    const core = new THREE.Mesh(innerGeo, innerMat);
    scene.add(core);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x3b82f6, 1, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    camera.position.z = 4.5;

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.0008;
      sphere.rotation.x += 0.0004;
      core.rotation.y -= 0.0015;

      sphere.position.x += (mouseX * 0.15 - sphere.position.x) * 0.05;
      sphere.position.y += (-mouseY * 0.15 - sphere.position.y) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
      geometry.dispose(); material.dispose(); innerGeo.dispose(); innerMat.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full absolute inset-0 z-0 opacity-80" />;
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
  };

  const team = [
    { name: 'Yamini', role: 'Interface Lead', tag: 'UI/UX ENGINEER' },
    { name: 'Ishani Gupta', role: 'Backend Tactician', tag: 'CLOUD ARCHITECT' },
    { name: 'Madhu Tiwari', role: 'AI Strategist', tag: 'NEURAL SPECIALIST' },
    { name: 'Khushi Verma', role: 'Field Intelligence', tag: 'CYBER SECURITY' }
  ];

  return (
    <div className="bg-[#020408] text-white min-h-screen font-sans selection:bg-blue-600 overflow-x-hidden relative">
      {/* Precision Structural Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            transform: `perspective(1000px) rotateX(60deg) translateY(${scrollY * 0.03}px)`,
            transformOrigin: 'top center',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020408] via-transparent to-[#020408] z-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[400px] bg-blue-600/5 blur-[150px] rounded-full"></div>
      </div>

      {/* Balanced Navigation */}
      <nav className="relative z-[100] max-w-6xl mx-auto px-6 py-6 flex items-center justify-between backdrop-blur-2xl border-b border-white/5 sticky top-0 mt-6 rounded-3xl bg-[#020408]/40 shadow-2xl">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter uppercase italic leading-none group-hover:text-blue-400 transition-colors">SHESTORM</span>
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-blue-500/80">TACTICAL_UNIT</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-12">
          {['Workflow', 'Intelligence', 'Strategic Team'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollTo(item.toLowerCase().replace(' ', '-'))} 
              className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 hover:text-white transition-all italic relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
          ))}
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 border-b-4 border-blue-900"
          >
            INITIALIZE <Zap size={12} className="inline ml-2" />
          </button>
        </div>
      </nav>

      {/* Hero Section: Centered & Balanced */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 pt-24 pb-48 grid lg:grid-cols-2 gap-20 items-center min-h-[85vh]">
        <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex items-center gap-3 bg-blue-600/10 backdrop-blur-xl px-5 py-2.5 rounded-full border border-blue-500/20 text-[9px] font-black uppercase tracking-[0.5em] text-blue-400 italic">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]" /> 
            ACTIVE NEURAL INTERCEPTION
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black leading-[0.85] tracking-[-0.05em] text-white uppercase italic drop-shadow-2xl">
              SAFE <br /> CALLS,
            </h1>
            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black leading-[0.85] tracking-[-0.05em] uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-500 to-indigo-600">
              PEACE OF <br /> MIND
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-400 font-bold italic opacity-90 tracking-tight leading-relaxed max-w-xl">
            Real-time behavior interception for the age of AI cloning. Protect your assets with enterprise-grade neural monitoring.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 pt-4">
            <button 
              onClick={() => scrollTo('workflow')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-6 rounded-[2rem] font-black text-lg uppercase italic tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 border-b-[8px] border-blue-950 flex items-center justify-center gap-4"
            >
              DEPLOY UNIT <Waves className="animate-pulse" size={24} />
            </button>
            <button 
              onClick={() => navigate('/monitor')}
              className="bg-white/5 hover:bg-white/10 text-white px-10 py-6 rounded-[2rem] font-black text-lg uppercase italic tracking-widest transition-all border-2 border-slate-800 flex items-center justify-center gap-4 hover:border-blue-500/40 backdrop-blur-xl"
            >
              LIVE DEMO
            </button>
          </div>
          
          <div className="flex items-center gap-12 pt-10 border-t border-white/5">
             <div className="flex -space-x-4">
               {[1,2,3,4,5].map(i => (
                 <img 
                    key={i}
                    src={`https://images.unsplash.com/photo-${1500000000000 + (i * 1234567)}?auto=format&fit=crop&q=80&w=100&h=100`} 
                    className="w-12 h-12 rounded-full border-2 border-[#020408] shadow-lg object-cover ring-1 ring-white/10" 
                    alt="user" 
                 />
               ))}
             </div>
             <div className="h-10 w-px bg-slate-800"></div>
             <div className="space-y-1">
                <p className="text-[10px] font-black text-white uppercase tracking-widest italic">
                  OPERATIONAL IN <span className="text-blue-500">24K+ NODES</span>
                </p>
                <div className="flex gap-1.5 mt-1">
                   {[1,2,3,4].map(i => <div key={i} className="w-4 h-1 bg-blue-500/30 rounded-full" />)}
                </div>
             </div>
          </div>
        </div>

        {/* Hero Visual: Stabilized & Integrated */}
        <div className="flex justify-center items-center animate-in fade-in zoom-in-95 duration-1000 delay-300">
           <div className="relative rounded-[4rem] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.7)] aspect-[5/6] w-full max-w-sm bg-[#080b11] border-[10px] border-white/5 group ring-1 ring-white/5 flex items-center justify-center">
              <NeuralCore />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-[#020408]/60"></div>
              
              <div className="absolute top-10 left-10 p-6 bg-blue-600/10 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] space-y-4 max-w-[160px] animate-in slide-in-from-left-4 duration-1000">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="text-blue-400" size={24} />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">NODE_01</span>
                 </div>
                 <div className="h-1 w-full bg-slate-800/80 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[96%] animate-pulse" />
                 </div>
              </div>

              <div className="absolute bottom-16 right-10 text-right space-y-6">
                 <div className="bg-emerald-600/80 backdrop-blur-xl text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-3 animate-pulse italic border border-white/10">
                   <Radar size={16} /> MONITORING
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-5xl font-black italic text-white uppercase tracking-tighter leading-none">DEFENSE</h3>
                    <p className="text-blue-400 font-bold uppercase tracking-[0.4em] text-[8px] italic">NEURAL ENGINE CORE</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-24 border-y border-white/5 bg-[#05080c]/80 relative z-20">
        <div className="max-w-6xl mx-auto px-12 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { label: 'THREATS NEUTRALIZED', val: '2.4M+', color: 'text-blue-500' },
            { label: 'DETECTION FIDELITY', val: '99.98%', color: 'text-emerald-500' },
            { label: 'AVERAGE LATENCY', val: '240ms', color: 'text-indigo-500' },
            { label: 'GLOBAL NODES', val: '24K+', color: 'text-amber-500' },
          ].map((stat, i) => (
            <div key={i} className="space-y-3 group hover:-translate-y-2 transition-transform duration-500">
               <p className={`${stat.color} text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none`}>{stat.val}</p>
               <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500 italic">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-48 px-6 max-w-6xl mx-auto relative z-20">
        <div className="mb-32 text-center max-w-4xl mx-auto space-y-10">
          <div className="inline-flex items-center gap-4 text-blue-500 font-black uppercase text-[12px] tracking-[0.7em] italic">
            <Zap size={22} className="fill-current" /> DEFENSE_PHASES
          </div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">BATTLE-TESTED <br />INTELLIGENCE</h2>
          <p className="text-xl md:text-2xl text-slate-400 font-bold italic opacity-90 uppercase tracking-widest max-w-3xl mx-auto leading-relaxed">
            Interrogating call intent using forensic neural analysis and web grounding.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            { icon: ShieldAlert, title: "SIGNATURE SCAN", desc: "Recognizes deception artifacts and social engineering triggers in real-time vocal streams." },
            { icon: Clock, title: "URGENCY SHIELD", desc: "Detects psychological time-pressure designed to override logical reasoning and trigger panic." },
            { icon: Lock, title: "DATA FORTRESS", desc: "Instantly neutralizes suspicious requests for credentials, bank data, or identities." }
          ].map((item, i) => (
            <div key={i} className="group relative bg-[#0a0e14] p-12 rounded-[3.5rem] border border-white/5 hover:border-blue-500/30 transition-all duration-700 shadow-2xl overflow-hidden hover:-translate-y-3">
                <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 text-blue-500 transition-transform border border-blue-500/10">
                    <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-6 uppercase italic tracking-tighter text-white leading-none">{item.title}</h3>
                <p className="text-lg text-slate-400 leading-relaxed font-bold italic group-hover:text-slate-100 transition-colors">
                    {item.desc}
                </p>
                <div className="mt-10 flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-blue-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                    READ_PROTOCOL <ArrowRight size={14} />
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strategic Unit Section (TEAM) */}
      <section id="strategic-team" className="py-48 px-6 max-w-6xl mx-auto relative z-20">
         <div className="mb-32 text-center max-w-4xl mx-auto space-y-10">
            <div className="inline-flex items-center gap-4 text-blue-500 font-black uppercase text-[12px] tracking-[0.7em] italic">
               <Activity size={22} className="fill-current" /> UNIT_CONTRIBUTORS
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">THE STRATEGIC <br />DEFENSE UNIT</h2>
            <p className="text-xl md:text-2xl text-slate-400 font-bold italic opacity-90 uppercase tracking-widest max-w-3xl mx-auto leading-relaxed">
               A world-class engineering unit focused on human-centric security.
            </p>
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member, i) => (
               <div key={i} className="group flex flex-col items-center text-center p-10 rounded-[3rem] bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all hover:-translate-y-2 shadow-xl">
                  <div className="relative mb-8">
                     <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-slate-800 group-hover:border-blue-600 transition-colors shadow-2xl">
                        <img 
                          src={`https://picsum.photos/seed/shestorm-team-${i}/400/400`} 
                          alt={member.name} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                     </div>
                     <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl border-4 border-[#0a0e14] shadow-xl group-hover:rotate-12 transition-transform">
                        <Target size={16} className="text-white" />
                     </div>
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none mb-2">{member.name}</h3>
                  <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-[10px] mb-6 italic">{member.tag}</p>
                  <p className="text-sm text-slate-500 font-bold italic leading-relaxed mb-8">{member.role}</p>
                  <div className="flex gap-4">
                     <button className="p-2 text-slate-600 hover:text-white transition-colors"><Linkedin size={18} /></button>
                     <button className="p-2 text-slate-600 hover:text-white transition-colors"><Github size={18} /></button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Footer */}
      <footer className="py-40 px-6 border-t border-white/5 bg-[#010204] relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-20">
          <div className="flex items-center gap-6 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl transition-all group-hover:rotate-6">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white text-3xl uppercase italic tracking-tighter leading-none">SHESTORM</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.6em] text-slate-600 mt-2 italic">DEFENSE_UNIT_2.5_PRO</span>
            </div>
          </div>
          
          <div className="flex gap-12">
             {['Protocols', 'Laboratory', 'Command', 'Privacy'].map((item) => (
                <button key={item} className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 hover:text-white transition-all italic">{item}</button>
             ))}
          </div>

          <div className="font-black text-slate-800 text-[10px] uppercase tracking-[0.3em] italic text-center md:text-right">
            © 2026 TEAM SHESTORM STRATEGIC DEFENSE // SIGNAL ENCRYPTED // END-TO-END VERIFIED
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .scanline {
          width: 100%;
          height: 10px;
          background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.4), transparent);
          position: absolute;
          animation: scan 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;
