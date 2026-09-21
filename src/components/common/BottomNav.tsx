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
  const { settings, activeSession, isVip } = useApp();
  const lang = settings.language;
  const labels = t[lang];

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: boolean; vipOnly?: boolean }[] = [
    { id: 'dashboard', label: labels.navDashboard, icon: LayoutDashboard },
    { id: 'workout', label: labels.navWorkout, icon: Dumbbell, badge: Boolean(activeSession) },
    { id: 'prompt', label: lang === 'fa' ? 'پرامپت AI' : 'AI Prompt', icon: Sparkles, vipOnly: true },
    { id: 'program', label: labels.navProgram, icon: FolderKanban },
    { id: 'progress', label: labels.navProgress, icon: LineChart },
    { id: 'profile', label: labels.navProfile, icon: UserCircle2 }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-1.5 safe-area-pb transition-all">
      <div className="max-w-md mx-auto flex items-center justify-around gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => {
                onSelectTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[54px] ${
                isActive
                  ? 'text-emerald-500 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
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
                {tab.vipOnly && !isVip && (
                  <span className="absolute -top-1 -left-1 px-1 py-0.2 rounded bg-amber-500 text-zinc-950 text-[8px] font-black tracking-tighter shadow">
                    VIP
                  </span>
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
