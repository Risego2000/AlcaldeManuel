
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { SYSTEM_INSTRUCTION } from './constants';
import { AgentStatus, TranscriptionEntry } from './types';
import StatusIndicator from './components/StatusIndicator';
import TelephonyPanel from './components/TelephonyPanel';
import DigitalAvatar from './components/DigitalAvatar';
import { decodeBase64, decodeAudioData, createPcmBlob } from './utils/audioUtils';

const App: React.FC = () => {
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [transcriptions, setTranscriptions] = useState<TranscriptionEntry[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const transcriptionBufferRef = useRef({ user: '', assistant: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptions]);

  const addTranscription = (role: 'user' | 'assistant', text: string) => {
    setTranscriptions(prev => [...prev, { role, text, timestamp: Date.now() }]);
  };

  const startCall = async () => {
    try {
      setStatus(AgentStatus.CONNECTING);
      setIsLive(true);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setStatus(AgentStatus.LISTENING);
            const source = audioContextInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmData = createPcmBlob(inputData);
              sessionPromiseRef.current?.then(session => {
                session.sendRealtimeInput({ media: { data: pcmData, mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextOutRef.current) {
              setStatus(AgentStatus.SPEAKING);
              const ctx = audioContextOutRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.onended = () => {
                activeSourcesRef.current.delete(source);
                if (activeSourcesRef.current.size === 0) setStatus(AgentStatus.LISTENING);
              };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              activeSourcesRef.current.add(source);
            }

            if (message.serverContent?.inputTranscription) transcriptionBufferRef.current.user += message.serverContent.inputTranscription.text;
            if (message.serverContent?.outputTranscription) transcriptionBufferRef.current.assistant += message.serverContent.outputTranscription.text;

            if (message.serverContent?.turnComplete) {
              if (transcriptionBufferRef.current.user) {
                addTranscription('user', transcriptionBufferRef.current.user);
                transcriptionBufferRef.current.user = '';
              }
              if (transcriptionBufferRef.current.assistant) {
                addTranscription('assistant', transcriptionBufferRef.current.assistant);
                transcriptionBufferRef.current.assistant = '';
              }
            }

            if (message.serverContent?.interrupted) {
              activeSourcesRef.current.forEach(s => s.stop());
              activeSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus(AgentStatus.LISTENING);
            }
          },
          onerror: () => setStatus(AgentStatus.ERROR),
          onclose: () => handleStop()
        }
      });

      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus(AgentStatus.ERROR);
      setIsLive(false);
    }
  };

  const handleStop = () => {
    setIsLive(false);
    setStatus(AgentStatus.IDLE);
    audioContextInRef.current?.close();
    audioContextOutRef.current?.close();
    activeSourcesRef.current.forEach(s => s.stop());
    activeSourcesRef.current.clear();
    sessionPromiseRef.current = null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-950 text-white overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Area Central: EL ALCALDE (Sin Header) */}
      <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center relative px-4">
        
        {/* Fondo decorativo de ondas de red neural */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className={`w-[700px] h-[700px] rounded-full border border-blue-500/10 transition-all duration-1000 ${isLive ? 'animate-ping-slow scale-150' : 'scale-100'}`} />
          <div className={`absolute w-[500px] h-[500px] rounded-full border border-indigo-500/10 transition-all duration-700 ${isLive ? 'animate-ping-slow-delayed scale-125' : 'scale-100'}`} />
        </div>

        {/* Botón de configuración flotante discreto */}
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 z-50 group"
        >
          <i className="fa-solid fa-gear text-white/30 group-hover:text-white group-hover:rotate-90 transition-all"></i>
        </button>

        {/* El Avatar */}
        <div className="relative z-10 transition-all duration-1000">
           <DigitalAvatar status={status} />
        </div>

        {/* Controles de Acción */}
        <div className="mt-16 z-20 flex flex-col items-center gap-6">
          {!isLive ? (
            <div className="flex flex-col items-center gap-8 animate-fadeIn">
              <button 
                onClick={startCall}
                className="px-14 py-6 bg-white text-slate-950 font-black rounded-full shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:shadow-[0_0_70px_rgba(255,255,255,0.25)] transition-all hover:scale-105 active:scale-95 flex items-center gap-4 group text-2xl uppercase tracking-tighter"
              >
                <i className="fa-solid fa-phone-flip group-hover:rotate-12 transition-transform"></i>
                Iniciar Atención
              </button>
              <div className="text-center">
                <h2 className="text-xl font-bold text-white/90">Manuel Jurado Marrufo</h2>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.5em] mt-1">Alcalde de Daganzo</p>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleStop}
              className="px-10 py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-black rounded-full border border-red-600/30 transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest text-[10px] animate-fadeIn"
            >
              <i className="fa-solid fa-phone-slash"></i>
              Cerrar Conexión
            </button>
          )}
        </div>
      </main>

      {/* Consola de Transcripción (Sutil e integrada) */}
      <aside className={`w-full bg-slate-900/40 backdrop-blur-md border-t border-white/5 transition-all duration-1000 ${isLive ? 'h-56' : 'h-0 opacity-0 overflow-hidden'}`}>
        <div className="max-w-4xl mx-auto h-full p-8 flex flex-col">
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
            {transcriptions.length === 0 && (
              <div className="h-full flex items-center justify-center opacity-30">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Sincronizando audio en tiempo real...</p>
              </div>
            )}
            {transcriptions.map((t, i) => (
              <div key={i} className={`flex flex-col ${t.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-[8px] font-black opacity-30 uppercase mb-1 px-2 tracking-widest">
                  {t.role === 'user' ? 'Ciudadano' : 'Alcalde'}
                </span>
                <div className={`max-w-[70%] px-5 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all animate-fadeIn ${
                  t.role === 'user' 
                    ? 'bg-white/10 text-white rounded-tr-none border border-white/5' 
                    : 'bg-blue-600/20 text-blue-100 border border-blue-400/20 rounded-tl-none font-medium'
                }`}>
                  {t.text}
                </div>
              </div>
            ))}
            {status === AgentStatus.SPEAKING && transcriptionBufferRef.current.assistant && (
              <div className="flex flex-col items-start animate-pulse">
                <span className="text-[8px] font-black text-blue-400 uppercase mb-1 px-2 tracking-widest">Transmitiendo...</span>
                <div className="max-w-[70%] px-5 py-3 rounded-2xl rounded-tl-none text-[13px] bg-blue-600/10 text-blue-300 italic border border-blue-500/10">
                  {transcriptionBufferRef.current.assistant}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="max-w-2xl w-full">
            <TelephonyPanel />
            <button 
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full py-5 bg-white/5 text-white/50 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all border border-white/10"
            >
              Cerrar Panel Técnico
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes ping-slow-delayed {
          0% { transform: scale(0.9); opacity: 0.1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-ping-slow { animation: ping-slow 5s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-ping-slow-delayed { animation: ping-slow-delayed 5s cubic-bezier(0, 0, 0.2, 1) infinite; animation-delay: 2.5s; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default App;
