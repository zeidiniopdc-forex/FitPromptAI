import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { 
  Dumbbell, 
  Globe, 
  Volume2, 
  VolumeX, 
  Bell, 
  Code2, 
  CheckCircle2,
  Share2
} from 'lucide-react';

interface HeaderProps {
  onOpenAndroidCode?: () => void;
  onOpenImport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAndroidCode, onOpenImport }) => {
  const { settings, updateSettings, activeSession } = useApp();
  const lang = settings.language;
  const labels = t[lang];
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const toggleLanguage = () => {
    const nextLang = settings.language === 'fa' ? 'en' : 'fa';
    updateSettings({ language: nextLang });
  };

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const simulateNotification = () => {
    const message = lang === 'fa' 
      ? '🔔 یادآور تمرین: زمان اجرای برنامه امروز فرا رسیده است!' 
      : '🔔 Workout Reminder: Time for today\'s scheduled training!';
    setNotificationToast(message);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 transition-colors">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Left / Start: Logo and Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-zinc-950 font-bold">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1">
                {labels.appName}
              </h1>
              {activeSession && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {lang === 'fa' ? 'تمرین زنده' : 'Active'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              {labels.appTagline}
            </p>
          </div>
        </div>

        {/* Right / End: Quick Actions & Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Notification Simulator */}
          <button
            id="btn-header-notification"
            onClick={simulateNotification}
            title={lang === 'fa' ? 'تست نوتیفیکیشن یادآوری تمرین' : 'Test Reminder Notification'}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-header-sound"
            onClick={toggleSound}
            title={settings.soundEnabled ? 'Disable Sound' : 'Enable Sound'}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {/* Language Switcher */}
          <button
            id="btn-header-language"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-700/60 hover:bg-zinc-800 text-zinc-200 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>{settings.language === 'fa' ? 'English' : 'فارسی'}</span>
          </button>

          {/* Android Native Architecture Code Viewer */}
          {onOpenAndroidCode && (
            <button
              id="btn-header-android-code"
              onClick={onOpenAndroidCode}
              title={lang === 'fa' ? 'معماری و کدهای Android Jetpack Compose' : 'Android Compose Clean Architecture'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Android Native</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulated Notification Banner */}
      {notificationToast && (
        <div className="fixed top-16 left-4 right-4 max-w-md mx-auto z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-zinc-900 text-zinc-100 p-3.5 rounded-xl border border-emerald-500/40 shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-zinc-200 flex-1">
              {notificationToast}
            </p>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
        </div>
      )}
    </header>
  );
};
