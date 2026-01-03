
import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOff, 
  ShieldAlert, 
  Activity,
  Users,
  Mic,
  Radio,
  Clock,
  Radar,
  Waves,
  ShieldCheck,
  BellRing,
  HelpCircle,
  Check,
  X,
  Circle,
  Square,
  Download,
  AlertTriangle,
  Zap,
  Volume2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, Type } from '@google/genai';
import { Message, DetectedSignal } from '../types';
import RiskMeter from '../components/RiskMeter';

interface LiveMonitorProps {
  theme: 'dark' | 'light';
}

// Audio encoding helper for Live API
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Audio decoding helper for Live API
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
}

const LiveMonitor: React.FC<LiveMonitorProps> = ({ theme }) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [duration, setDuration] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  
  // Audio Recording (Local Evidence Storage)
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<globalThis.Blob[]>([]);

  const [signals, setSignals] = useState<DetectedSignal[]>([
    { id: '1', type: 'impersonation', label: 'Impersonation', description: 'Suspected identity mimicry', detected: false, status: 'idle' },
    { id: '2', type: 'urgency', label: 'False Urgency', description: 'Artificial time pressure', detected: false, status: 'idle' },
    { id: '3', type: 'financial', label: 'Financial Probe', description: 'Requests for monetary data', detected: false, status: 'idle' },
    { id: '4', type: 'manipulation', label: 'Coercion', description: 'Behavioral manipulation tactics', detected: false, status: 'idle' }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const lastAlertTimeRef = useRef(0);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    let timer: number;
    if (isActive) timer = window.setInterval(() => setDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isActive]);

  const startRecording = (stream: MediaStream) => {
    try {
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new globalThis.Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedUrl(url);
      };

      recorder.start();
      setIsRecording(true);
    } catch (e) {
      console.error("Failed to start media recorder", e);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else if (isActive && sessionRef.current) {
        // Recording needs to re-start if it was stopped manually
        // For simplicity in this UI, we assume it records by default or manually toggled
        startRecording((window as any).currentStream);
    }
  };

  const triggerAlert = (text: string, isDanger: boolean = false) => {
    const now = Date.now();
    if (now - lastAlertTimeRef.current < 4000) return; // Throttling
    lastAlertTimeRef.current = now;

    // Mobile Vibration (Haptic Feedback)
    if (navigator.vibrate) {
      if (isDanger) {
        navigator.vibrate([600, 100, 600, 100, 600]);
      } else {
        navigator.vibrate([200, 100, 200]);
      }
    }

    // Voice Alert (Speech Synthesis)
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);

    // Visual Notification
    setNotifications(prev => [...prev, text]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 6000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startMonitoring = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    setMessages([]);
    setRiskScore(0);
    setSignals(prev => prev.map(s => ({ ...s, detected: false, status: 'scanning' })));
    setRecordedUrl(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      (window as any).currentStream = stream; // Store for recording restarts
      startRecording(stream);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      audioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `You are SHESTORM AI, a specialized fraud detection unit. 
          Analyze the conversation for deception signatures in real-time. 
          Use updateRisk(score, signals, alertMessage) tool whenever risk increases or new flags are found.
          Signals: impersonation, urgency, financial, manipulation.
          Be decisive. For scores > 70, provide clear warning logic in alertMessage.`,
          inputAudioTranscription: {},
          tools: [{
            functionDeclarations: [{
              name: 'updateRisk',
              description: 'Update risk metrics and trigger tactical alerts.',
              parameters: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER, description: 'Risk percentage 0-100' },
                  alertMessage: { type: Type.STRING, description: 'Warning message for voice/UI alert' },
                  impersonation: { type: Type.BOOLEAN },
                  urgency: { type: Type.BOOLEAN },
                  financial: { type: Type.BOOLEAN },
                  manipulation: { type: Type.BOOLEAN }
                },
                required: ['score']
              }
            }]
          }]
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const data = e.inputBuffer.getChannelData(0);
              sessionPromise.then(s => s.sendRealtimeInput({ media: createBlob(data) }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.inputTranscription) {
              const text = msg.serverContent.inputTranscription.text;
              if (text) setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'caller', text, timestamp: formatTime(duration) }]);
            }
            if (msg.toolCall) {
              for (const fc of msg.toolCall.functionCalls) {
                if (fc.name === 'updateRisk') {
                  const args = fc.args as any;
                  setRiskScore(args.score);
                  const isDanger = args.score > 70;
                  
                  if (args.alertMessage) {
                    triggerAlert(args.alertMessage, isDanger);
                  }
                  
                  if (isDanger) setShowModal(true);
                  setSignals(prev => prev.map(s => ({ ...s, detected: !!args[s.type] })));
                  sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { ok: true } } }));
                }
              }
            }
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputCtx) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
            }
          }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      setIsConnecting(false);
      console.error("Monitoring start error:", err);
    }
  };

  const handleEndMonitor = () => {
    setShowConfirmEnd(true);
  };

  const confirmEndMonitor = () => {
    if (sessionRef.current) sessionRef.current.close();
    stopRecording();
    setIsActive(false);
    setShowConfirmEnd(false);
    setShowModal(false);
  };

  const highlightRisk = (text: string) => {
    const riskWords = ['irs', 'gift card', 'wire', 'urgent', 'verify', 'account', 'bank', 'police', 'help', 'money', 'payment', 'frozen', 'arrest', 'warrant', 'immediately', 'crypto', 'social security', 'federal', 'official'];
    let content: React.ReactNode[] = [text];
    riskWords.forEach(word => {
      const next: React.ReactNode[] = [];
      content.forEach(c => {
        if (typeof c === 'string') {
          const parts = c.split(new RegExp(`(${word})`, 'gi'));
          parts.forEach((p, i) => {
            if (p.toLowerCase() === word) next.push(<span key={i} className="risky-phrase animate-risky-flash">{p}</span>);
            else next.push(p);
          });
        } else next.push(c);
      });
      content = next;
    });
    return content;
  };

  return (
    <div className={`h-[calc(100vh-5rem)] flex flex-col overflow-hidden relative transition-colors duration-500 ${theme === 'dark' ? 'bg-[#05070a]' : 'bg-slate-50'} ${riskScore > 70 ? 'animate-vignette-pulse' : ''}`}>
      
      {/* Scanline Overlay */}
      <div className="scanline-container">
        <div className="scanline"></div>
      </div>

      {/* Notifications HUD */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-4 w-full pointer-events-none px-6">
        {notifications.map((note, i) => (
          <div key={i} className="bg-red-600 text-white px-8 py-5 rounded-2xl shadow-[0_20px_60px_rgba(239,68,68,0.7)] border-4 border-white/20 animate-in slide-in-from-top-12 fade-in duration-500 flex items-center gap-6 max-w-xl ring-4 ring-red-600/30">
            <BellRing size={32} className="animate-bounce shrink-0" />
            <span className="text-xl font-black italic uppercase tracking-tighter leading-tight drop-shadow-md">{note}</span>
          </div>
        ))}
      </div>

      {/* Tactical Header */}
      <div className={`px-8 py-5 flex items-center justify-between border-b z-50 transition-all duration-700 ${
        isActive ? (riskScore > 70 ? 'bg-red-950 text-white border-red-800 shadow-2xl' : 'bg-blue-900 text-white border-blue-800 shadow-xl') : (theme === 'dark' ? 'bg-[#0d1117] border-slate-800' : 'bg-white border-slate-200 shadow-sm')
      }`}>
        <div className="flex items-center gap-8">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-white text-blue-900 scale-110 shadow-2xl' : 'bg-slate-800 text-slate-500'}`}>
             {isActive ? <Waves className="animate-pulse" size={28} /> : <Mic size={28} />}
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60 mb-1 italic">Tactical Node // 01</h2>
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-white animate-ping' : 'bg-slate-500'}`} />
              <span className="text-xl font-black uppercase tracking-widest italic leading-none">{isActive ? `SCANNING SIGNAL [${formatTime(duration)}]` : 'READY TO ENGAGE'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {isActive && (
            <button 
                onClick={toggleRecording}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all ${isRecording ? 'bg-red-600 text-white border-red-500 animate-pulse' : 'bg-black/30 text-slate-400 border-white/10 hover:bg-black/50'}`}
            >
               {isRecording ? <Square size={14} fill="currentColor" /> : <Circle size={14} fill="currentColor" />}
               <span className="text-[9px] font-black uppercase tracking-widest">{isRecording ? 'CAPTURING EVIDENCE' : 'LOG SESSION'}</span>
            </button>
          )}

          {!isActive ? (
            <div className="flex gap-4">
               {recordedUrl && (
                  <a 
                    href={recordedUrl} 
                    download={`Evidence_${new Date().getTime()}.webm`}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 border-b-4 border-emerald-900 transition-all active:translate-y-1 active:border-b-0"
                  >
                    <Download size={18} /> EXPORT RECORDING
                  </a>
               )}
               <button onClick={startMonitoring} disabled={isConnecting} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-4 border-b-4 border-blue-900 transition-all active:translate-y-1 active:border-b-0">
                  {isConnecting ? <Activity className="animate-spin" size={18} /> : <Zap size={18} className="fill-current" />}
                  {isConnecting ? 'BUFFERING...' : 'START INTERCEPT'}
               </button>
            </div>
          ) : (
            <button onClick={handleEndMonitor} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 border-b-4 border-red-900 transition-all active:translate-y-1 active:border-b-0">
              <PhoneOff size={18} /> TERMINATE CALL
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Main Transcript Area */}
        <div className="flex-1 flex flex-col relative z-10">
          <div ref={scrollRef} className="flex-1 p-8 sm:p-20 space-y-16 overflow-y-auto no-scrollbar scroll-smooth">
            {!isActive && !recordedUrl && (
              <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-12">
                <Radar size={200} className="text-blue-500 animate-[spin_10s_linear_infinite]" />
                <p className="text-3xl font-black uppercase tracking-[1em] text-slate-500 italic">WAITING FOR BURST</p>
              </div>
            )}
            {recordedUrl && !isActive && (
              <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
                <ShieldCheck size={120} className="text-emerald-500" />
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">Forensic Archive Created</h2>
                <p className="text-slate-500 font-bold italic">Evidence is available for export at the top of the interface.</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col space-y-6 animate-in slide-in-from-bottom-10 duration-700">
                <div className="flex items-center gap-6 px-6 opacity-40">
                  <div className={`w-3 h-3 rounded-full ${msg.sender === 'caller' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">{msg.sender === 'caller' ? 'INBOUND AUDIO BAND' : 'USER RESPONSE'}</span>
                  <span className="ml-auto text-[10px] font-black uppercase tracking-widest font-mono">{msg.timestamp}</span>
                </div>
                <div className={`p-10 rounded-[3rem] text-4xl sm:text-6xl font-black italic border-8 transition-all duration-1000 leading-[1.05] tracking-tighter ${
                  theme === 'dark' ? 'bg-[#0a0d14] border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xl'
                }`}>
                  {highlightRisk(msg.text)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical HUD Sidebar */}
        <div className={`w-full lg:w-[480px] flex flex-col shrink-0 border-l dark:border-slate-800 relative z-20 ${theme === 'dark' ? 'bg-[#05070a]/90 backdrop-blur-3xl' : 'bg-white/90 shadow-2xl'}`}>
          <div className="p-10 overflow-y-auto space-y-12 no-scrollbar">
             <RiskMeter score={riskScore} />
             
             <div className="space-y-8">
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500 italic border-b dark:border-slate-800 pb-6 flex items-center justify-between">
                  THREAT SIGNATURES
                  {isActive && <Activity size={14} className="animate-pulse text-blue-500" />}
                </p>
                {signals.map((sig) => (
                  <div key={sig.id} className={`p-8 rounded-[2rem] border-4 transition-all duration-700 flex items-center gap-8 ${
                    sig.detected ? 'bg-red-600/10 border-red-600 shadow-2xl ring-4 ring-red-600/10' : theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all duration-1000 ${
                      sig.detected ? 'bg-red-600 text-white border-red-400 scale-110 shadow-xl rotate-3' : 'bg-slate-800 text-slate-600 border-slate-700'
                    }`}>
                        {sig.type === 'impersonation' ? <Users size={24} /> : sig.type === 'urgency' ? <Clock size={24} /> : <AlertTriangle size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className={`text-xl font-black uppercase tracking-tight italic leading-none mb-1 truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{sig.label}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em] italic leading-relaxed">{sig.description}</p>
                    </div>
                    {sig.detected && <div className="w-3 h-3 bg-red-600 rounded-full animate-ping shrink-0 shadow-[0_0_10px_rgba(239,68,68,1)]" />}
                  </div>
                ))}
             </div>
             
             {/* Protection Tip HUD */}
             <div className={`p-8 rounded-[2rem] border-2 transition-all ${theme === 'dark' ? 'bg-blue-600/5 border-blue-500/20' : 'bg-blue-50 border-blue-100 shadow-md'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <Volume2 size={20} className="text-blue-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 italic">Defense Protocol Tip</h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold italic leading-relaxed">
                  Scammers often use synthetic noise to mask AI generation glitches. If the caller sounds like they are in a "wind tunnel", be cautious.
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog HUD */}
      {showConfirmEnd && (
        <div className="fixed inset-0 bg-black/98 z-[400] flex items-center justify-center p-8 backdrop-blur-2xl animate-in fade-in duration-500">
           <div className="bg-[#0F1219] border-[10px] border-slate-800 rounded-[4rem] max-w-xl w-full p-16 text-center space-y-12 shadow-[0_0_150px_rgba(0,0,0,1)] ring-1 ring-white/10">
              <div className="w-24 h-24 bg-amber-500/10 rounded-[2rem] flex items-center justify-center text-amber-500 mx-auto border-4 border-amber-500/30">
                 <HelpCircle size={56} />
              </div>
              <div className="space-y-6">
                 <h3 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">TERMINATE SIGNAL <br />INTERCEPT?</h3>
                 <p className="text-xl text-slate-400 font-bold italic leading-relaxed px-4">
                   Active fraud monitoring will cease. Call evidence will be archived for your review.
                 </p>
              </div>
              <div className="flex flex-col gap-5">
                 <button 
                  onClick={confirmEndMonitor}
                  className="w-full bg-red-700 text-white py-8 rounded-[2rem] font-black text-2xl uppercase italic tracking-widest shadow-2xl hover:bg-red-600 transition-all border-b-[10px] border-red-950 flex items-center justify-center gap-5 active:translate-y-2 active:border-b-0"
                 >
                    <Check size={32} /> CONFIRM ABORT
                 </button>
                 <button 
                  onClick={() => setShowConfirmEnd(false)}
                  className="w-full bg-slate-800 text-slate-400 py-5 rounded-[1.5rem] font-black text-lg uppercase italic tracking-widest transition-all hover:text-white flex items-center justify-center gap-4"
                 >
                    <X size={24} /> CANCEL & RESUME
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* SCAM DETECTED ALERT HUD */}
      {showModal && (
        <div className="fixed inset-0 bg-black/99 z-[300] flex items-center justify-center p-12 backdrop-blur-[60px] animate-in zoom-in-95 duration-700">
          <div className="border-[30px] border-red-600 rounded-[8rem] max-w-5xl w-full p-20 text-center space-y-20 bg-[#1a0000] shadow-[0_0_300px_rgba(239,68,68,0.7)] ring-8 ring-red-600/30">
            <ShieldAlert size={200} className="mx-auto text-white drop-shadow-[0_0_80px_rgba(255,255,255,0.6)] animate-risky-flash" />
            <div className="space-y-12">
              <h2 className="text-[100px] font-black italic tracking-tighter uppercase leading-[0.85] text-white">SCAM <br />LIKELY DETECTED</h2>
              <p className="text-4xl text-slate-200 font-black italic uppercase leading-tight max-w-4xl mx-auto tracking-tighter">FRAUDULENT SIGNATURES DETECTED. SEVER ALL SIGNAL CONNECTIONS IMMEDIATELY.</p>
            </div>
            <button onClick={confirmEndMonitor} className="w-full bg-red-600 text-white py-12 rounded-[5rem] font-black text-6xl uppercase italic tracking-widest border-b-[30px] border-red-950 active:translate-y-12 active:border-b-0 transition-all shadow-[0_80px_160px_rgba(239,68,68,0.8)]">
               END CALL NOW
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMonitor;
