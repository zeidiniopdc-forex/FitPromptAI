import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { 
  LayoutDashboard, 
  Dumbbell, 
  FolderKanban, 
  LineChart, 
  UserCircle2, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export type TabType = 'dashboard' | 'workout' | 'program' | 'progress' | 'profile' | 'prompt' | 'library';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const { settings, activeSession } = useApp();
  const lang = settings.language;
  const labels = t[lang];

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: boolean }[] = [
    { id: 'dashboard', label: labels.navDashboard, icon: LayoutDashboard },
    { id: 'workout', label: labels.navWorkout, icon: Dumbbell, badge: Boolean(activeSession) },
    { id: 'prompt', label: lang === 'fa' ? 'پرامپت AI' : 'AI Prompt', icon: Sparkles },
    { id: 'program', label: labels.navProgram, icon: FolderKanban },
    { id: 'progress', label: labels.navProgress, icon: LineChart },
    { id: 'profile', label: labels.navProfile, icon: UserCircle2 }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 dark:bg-zinc-950/95 light:bg-white/95 backdrop-blur-lg border-t border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 px-2 py-1.5 safe-area-pb transition-all">
      <div className="max-w-md mx-auto flex items-center justify-around gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[54px] ${
                isActive
                  ? 'text-emerald-500 font-semibold'
                  : 'text-zinc-400 dark:text-zinc-400 light:text-zinc-500 hover:text-zinc-200 dark:hover:text-zinc-200 light:hover:text-zinc-900'
              }`}
            >
              {/* Active Pill Indicator */}
              <div
                className={`relative px-3 py-1 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-emerald-500/15 text-emerald-400 shadow-sm' : ''
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'scale-100'}`} />
                {tab.badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950 animate-ping"></span>
                )}
                {tab.badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950"></span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight line-clamp-1 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
