import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { 
  Play, 
  Pause, 
  Plus, 
  Minus, 
  X, 
  Timer, 
  Check,
  Volume2
} from 'lucide-react';

export const RestTimerOverlay: React.FC = () => {
  const { 
    restTimerSecondsRemaining, 
    restTimerTotal, 
    isRestTimerActive, 
    pauseRestTimer, 
    resumeRestTimer, 
    adjustRestTimer, 
    skipRestTimer,
    settings
  } = useApp();

  const lang = settings.language;
  const labels = t[lang];

  if (restTimerSecondsRemaining === null) return null;

  const progress = restTimerTotal > 0 
    ? Math.max(0, Math.min(100, ((restTimerTotal - restTimerSecondsRemaining) / restTimerTotal) * 100))
    : 100;

  const minutes = Math.floor(restTimerSecondsRemaining / 60);
  const seconds = restTimerSecondsRemaining % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-40 animate-in slide-in-from-bottom-4 duration-200">
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-4 shadow-2xl shadow-emerald-950/40 flex items-center justify-between gap-3">
        {/* Circular Progress & Timer Display */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-zinc-800"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * progress) / 100}
                strokeLinecap="round"
                className="text-emerald-400 transition-all duration-300"
              />
            </svg>
            <span className="absolute font-mono text-xs font-black text-white tracking-tight">
              {formattedTime}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Timer className="w-3.5 h-3.5" />
              <span>{labels.restTimerTitle}</span>
            </div>
            <span className="text-[11px] text-zinc-400">
              {isRestTimerActive 
                ? (lang === 'fa' ? 'در حال استراحت بین ست‌ها...' : 'Resting between sets...') 
                : (lang === 'fa' ? 'متوقف شده' : 'Paused')}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* -15s */}
          <button
            onClick={() => adjustRestTimer(-15)}
            title="-15 seconds"
            className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center text-xs font-bold transition-colors"
          >
            -15
          </button>

          {/* +15s */}
          <button
            onClick={() => adjustRestTimer(15)}
            title="+15 seconds"
            className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center text-xs font-bold transition-colors"
          >
            +15
          </button>

          {/* Pause / Resume */}
          <button
            onClick={isRestTimerActive ? pauseRestTimer : resumeRestTimer}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-zinc-950 font-bold shadow-md transition-all active:scale-95 ${
              isRestTimerActive ? 'bg-amber-400 hover:bg-amber-300' : 'bg-emerald-400 hover:bg-emerald-300'
            }`}
          >
            {isRestTimerActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          {/* Skip / Close */}
          <button
            onClick={skipRestTimer}
            title={labels.skipRest}
            className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
