
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
  const [isLive, setIsLive] = useState(false);

  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const hasStartedRef = useRef(false);

  // Auto-iniciar la llamada al cargar la página
  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      startCall();
    }
  }, []);


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



        {/* El Avatar */}
        <div className="relative z-10 transition-all duration-1000">
          <DigitalAvatar status={status} />
        </div>

        {/* Información del Alcalde */}
        <div className="mt-16 z-20 flex flex-col items-center gap-6">
          <div className="text-center animate-fadeIn">
            <h2 className="text-xl font-bold text-white/90">Manuel Jurado Marrufo</h2>
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.5em] mt-1">Alcalde de Daganzo</p>
          </div>
        </div>
      </main>





      <style dangerouslySetInnerHTML={{
        __html: `
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
