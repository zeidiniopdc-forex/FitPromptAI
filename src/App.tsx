import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav, TabType } from './components/common/BottomNav';
import { DashboardScreen } from './components/dashboard/DashboardScreen';
import { ActiveWorkoutTracker } from './components/workout/ActiveWorkoutTracker';
import { PromptScreen } from './components/prompt/PromptScreen';
import { ProgramManager } from './components/programs/ProgramManager';
import { ProgressAnalytics } from './components/progress/ProgressAnalytics';
import { ProfileAssessment } from './components/profile/ProfileAssessment';
import { ExerciseLibraryScreen } from './components/exercises/ExerciseLibraryScreen';
import { RestTimerOverlay } from './components/workout/RestTimerOverlay';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { ImportModal } from './components/import/ImportModal';
import { WorkoutCompletedModal } from './components/workout/WorkoutCompletedModal';
import { AndroidArchitectureModal } from './components/android/AndroidArchitectureModal';
import { WorkoutSession } from './types';

const MainLayout: React.FC = () => {
  const { 
    onboardingCompleted, 
    startWorkoutSession, 
    activeSession 
  } = useApp();

  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showAndroidCodeModal, setShowAndroidCodeModal] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(!onboardingCompleted);
  const [completedSessionToCelebrate, setCompletedSessionToCelebrate] = useState<WorkoutSession | null>(null);

  const handleStartWorkout = (dayId: string) => {
    startWorkoutSession(dayId);
    setCurrentTab('workout');
  };

  const handleSessionFinished = (session: WorkoutSession) => {
    setCompletedSessionToCelebrate(session);
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 transition-colors duration-200">
      {/* Top Android Material 3 App Bar */}
      <Header
        onOpenAndroidCode={() => setShowAndroidCodeModal(true)}
        onOpenImport={() => setShowImportModal(true)}
      />

      {/* Main View Screen Body */}
      <main className="flex-1 w-full max-w-5xl mx-auto">
        {currentTab === 'dashboard' && (
          <DashboardScreen
            onStartWorkout={handleStartWorkout}
            onNavigateToPrompt={() => setCurrentTab('prompt')}
            onNavigateToProgram={() => setCurrentTab('program')}
            onNavigateToProgress={() => setCurrentTab('progress')}
            onOpenImport={() => setShowImportModal(true)}
          />
        )}

        {currentTab === 'workout' && (
          <ActiveWorkoutTracker
            onSessionFinished={handleSessionFinished}
            onSessionDiscarded={() => setCurrentTab('dashboard')}
            onNavigateToProgram={() => setCurrentTab('program')}
          />
        )}

        {currentTab === 'prompt' && (
          <PromptScreen
            onOpenImport={() => setShowImportModal(true)}
          />
        )}

        {currentTab === 'program' && (
          <ProgramManager
            onOpenImport={() => setShowImportModal(true)}
            onStartWorkoutDay={handleStartWorkout}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressAnalytics />
        )}

        {currentTab === 'profile' && (
          <ProfileAssessment
            onNavigateToPrompt={() => setCurrentTab('prompt')}
          />
        )}

        {currentTab === 'library' && (
          <ExerciseLibraryScreen />
        )}
      </main>

      {/* Floating Rest Timer Overlay (gym floor audio/visual cue) */}
      <RestTimerOverlay />

      {/* Material 3 Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* Onboarding Flow Modal (First Run or Settings) */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onStartProfile={() => {
          setShowOnboarding(false);
          setCurrentTab('profile');
        }}
      />

      {/* JSON Importer & Real-Time Schema Validator Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onProgramImported={(progId) => {
          setCurrentTab('program');
        }}
      />

      {/* Workout Completion Celebration & PR Fanfare Modal */}
      <WorkoutCompletedModal
        session={completedSessionToCelebrate}
        onClose={() => setCompletedSessionToCelebrate(null)}
      />

      {/* Senior Android Developer Clean Architecture Inspector */}
      <AndroidArchitectureModal
        isOpen={showAndroidCodeModal}
        onClose={() => setShowAndroidCodeModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
