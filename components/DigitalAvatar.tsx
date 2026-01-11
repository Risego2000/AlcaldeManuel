
import React from 'react';
import { AgentStatus } from '../types';

interface DigitalAvatarProps {
  status: AgentStatus;
}

const DigitalAvatar: React.FC<DigitalAvatarProps> = ({ status }) => {
  const isSpeaking = status === AgentStatus.SPEAKING;
  const isListening = status === AgentStatus.LISTENING;
  const isConnecting = status === AgentStatus.CONNECTING;
  const isError = status === AgentStatus.ERROR;

  // Ruta de la imagen cargada por el usuario
  const avatarUrl = `${import.meta.env.BASE_URL}Manuel.png`;

  return (
    <div className="relative w-[450px] h-[450px] flex items-center justify-center">

      {/* Halo Digital Perimetral */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full transition-all duration-[1000ms] ${isSpeaking ? 'bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,1)]' :
              isListening ? 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,1)]' : 'bg-white/5'
              }`}
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 9}deg) translateY(${isSpeaking ? '-215px' : '-205px'})`,
              opacity: isSpeaking || isListening ? 1 : 0.1,
              animation: isSpeaking
                ? `neuralOrbit ${6}s linear infinite`
                : isListening ? `neuralPulse 4s ease-in-out infinite` : 'none',
              animationDelay: `${i * 0.15}s`
            }}
          />
        ))}
      </div>

      {/* Contenedor Circular Premium */}
      <div className={`relative w-[340px] h-[340px] rounded-full overflow-hidden border-[1px] border-white/20 shadow-[0_0_120px_rgba(0,0,0,0.8)] z-10 transition-all duration-1000 ${isSpeaking ? 'scale-105 shadow-blue-500/20 border-blue-400/30' : 'scale-100'
        } animate-breathing bg-black`}>

        {/* Imagen del Alcalde (Upload) */}
        <img
          src={avatarUrl}
          alt="Manuel Jurado Marrufo"
          className={`w-full h-full object-cover object-center transition-all duration-[3000ms] ${isConnecting ? 'grayscale blur-xl opacity-30' :
            isSpeaking ? 'contrast-[1.1] brightness-[1.1] scale-105' : 'grayscale-[0.1]'
            }`}
          onError={(e) => {
            // Fallback en caso de que la ruta local no esté disponible en el servidor estático
            (e.target as HTMLImageElement).src = "https://pbs.twimg.com/media/Gkjr-I4X0AAV763.jpg";
          }}
        />

        {/* Animación de boca hablando - Mouth Movement */}
        {isSpeaking && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Área de la boca con animación de apertura/cierre */}
            <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[100px] h-[50px]">
              <div
                className="w-full h-full rounded-[50%] animate-mouthTalk"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                  filter: 'blur(8px)'
                }}
              ></div>
            </div>
            {/* Pulsos de voz alrededor de la cara - más visibles */}
            <div className="absolute inset-0 rounded-full border-[3px] border-blue-400/50 animate-voicePulse"></div>
            <div className="absolute inset-0 rounded-full border-[3px] border-blue-300/40 animate-voicePulse" style={{ animationDelay: '0.15s' }}></div>
            <div className="absolute inset-0 rounded-full border-[2px] border-indigo-400/30 animate-voicePulse" style={{ animationDelay: '0.3s' }}></div>
          </div>
        )}

        {/* Capas de atmósfera cinematográfica */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/5 pointer-events-none"></div>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isSpeaking ? 'opacity-20' : 'opacity-0'} bg-blue-500/20 mix-blend-overlay`}></div>

        {/* Escaneo horizontal de actividad */}
        {(isConnecting || isListening || isSpeaking) && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-[1px] bg-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.5)] absolute animate-scanLine"></div>
          </div>
        )}

        {/* Indicador de Error */}
        {isError && (
          <div className="absolute inset-0 bg-red-950/90 backdrop-blur-xl flex flex-col items-center justify-center text-white text-center p-8 animate-fadeIn">
            <i className="fa-solid fa-triangle-exclamation text-5xl mb-4 text-red-500"></i>
            <h4 className="text-sm font-black uppercase tracking-[0.3em]">Enlace Perdido</h4>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/20">Reintentar</button>
          </div>
        )}
      </div>

      {/* Badge de Identidad Flotante */}
      <div className="absolute -bottom-4 z-20 flex flex-col items-center">
        <div className={`px-12 py-3 rounded-full text-[9px] font-black tracking-[0.5em] transition-all duration-700 shadow-2xl border ${isSpeaking ? 'bg-blue-600 border-blue-400 text-white translate-y-[-10px] scale-110' :
          isListening ? 'bg-amber-500 border-amber-400 text-slate-950 animate-pulse' :
            'bg-white/5 border-white/10 text-white/30 backdrop-blur-md'
          }`}>
          {isSpeaking ? 'TRANSMITIENDO' : isListening ? 'ESCUCHANDO' : isConnecting ? 'SINCRONIZANDO' : 'VIRTUAL ID'}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes neuralOrbit {
          from { transform: rotate(0deg) translateY(-215px) rotate(0deg); }
          to { transform: rotate(360deg) translateY(-215px) rotate(-360deg); }
        }
        @keyframes neuralPulse {
          0%, 100% { transform: rotate(var(--rot)) scale(1); opacity: 0.3; }
          50% { transform: rotate(var(--rot)) scale(2); opacity: 1; }
        }
        @keyframes breathing {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.02) translateY(-10px); }
        }
        @keyframes scanLine {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes mouthTalk {
          0% { transform: scaleY(0.4) scaleX(1); opacity: 0.8; }
          15% { transform: scaleY(1.5) scaleX(1.2); opacity: 1; }
          30% { transform: scaleY(0.6) scaleX(0.95); opacity: 0.85; }
          45% { transform: scaleY(1.8) scaleX(1.25); opacity: 1; }
          60% { transform: scaleY(0.5) scaleX(1); opacity: 0.8; }
          75% { transform: scaleY(1.6) scaleX(1.15); opacity: 0.95; }
          100% { transform: scaleY(0.4) scaleX(1); opacity: 0.8; }
        }
        @keyframes voicePulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.12); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        .animate-breathing { animation: breathing 8s ease-in-out infinite; }
        .animate-scanLine { animation: scanLine 4s linear infinite; }
        .animate-mouthTalk { animation: mouthTalk 0.25s ease-in-out infinite; }
        .animate-voicePulse { animation: voicePulse 1s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default DigitalAvatar;
