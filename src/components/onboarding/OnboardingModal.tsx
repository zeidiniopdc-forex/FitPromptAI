import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { 
  Dumbbell, 
  Sparkles, 
  FileCode2, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  X
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartProfile: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartProfile
}) => {
  const { settings, setOnboardingCompleted } = useApp();
  const [step, setStep] = useState(0);
  const lang = settings.language;
  const labels = t[lang];

  if (!isOpen) return null;

  const slides = [
    {
      title: labels.onboardingTitle1,
      desc: labels.onboardingDesc1,
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-400',
      tag: lang === 'fa' ? 'استقلال از AI' : 'AI Agnostic'
    },
    {
      title: labels.onboardingTitle2,
      desc: labels.onboardingDesc2,
      icon: Dumbbell,
      color: 'from-cyan-500 to-blue-500',
      tag: lang === 'fa' ? 'ارزیابی علمی' : 'Biomechanics'
    },
    {
      title: labels.onboardingTitle3,
      desc: labels.onboardingDesc3,
      icon: FileCode2,
      color: 'from-amber-500 to-orange-500',
      tag: lang === 'fa' ? 'اعتبارسنجی JSON' : 'Strict Schema 1.0'
    },
    {
      title: labels.onboardingTitle4,
      desc: labels.onboardingDesc4,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-green-500',
      tag: lang === 'fa' ? 'ثبت تمرین در باشگاه' : 'Gym Floor Friendly'
    },
    {
      title: labels.onboardingTitle5,
      desc: labels.onboardingDesc5,
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-500',
      tag: lang === 'fa' ? 'آنالیز پیشرفت' : 'Progress & PRs'
    },
    {
      title: labels.onboardingTitle6,
      desc: labels.onboardingDesc6,
      icon: ShieldCheck,
      color: 'from-teal-500 to-emerald-600',
      tag: lang === 'fa' ? 'حفظ حریم خصوصی' : '100% Local-First'
    }
  ];

  const currentSlide = slides[step];
  const Icon = currentSlide.icon;

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      setOnboardingCompleted(true);
      onStartProfile();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSkip = () => {
    setOnboardingCompleted(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col justify-between min-h-[480px]">
        {/* Decorative ambient background glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar: Skip & Step Indicator */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === step
                    ? 'w-7 bg-emerald-400'
                    : idx < step
                    ? 'w-2 bg-emerald-700/60'
                    : 'w-2 bg-zinc-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleSkip}
            className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            {labels.skipOnboarding}
          </button>
        </div>

        {/* Slide Content */}
        <div className="my-auto py-6 flex flex-col items-center text-center z-10">
          {/* Animated Icon badge */}
          <div className="relative mb-6">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${currentSlide.color} flex items-center justify-center shadow-xl shadow-emerald-500/10 text-zinc-950 font-extrabold transform transition-transform hover:scale-105 duration-200`}>
              <Icon className="w-10 h-10" />
            </div>
            <span className="absolute -bottom-2.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-zinc-950 border border-zinc-700 text-zinc-300 shadow-md">
              {currentSlide.tag}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-3">
            {currentSlide.title}
          </h2>

          <p className="text-sm text-zinc-300/90 leading-relaxed max-w-sm">
            {currentSlide.desc}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-zinc-800/80 z-10">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className={`flex items-center gap-1 text-xs font-semibold px-4 py-2.5 rounded-xl border border-zinc-700/60 transition-colors ${
              step === 0
                ? 'opacity-0 pointer-events-none'
                : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            {lang === 'fa' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{labels.back}</span>
          </button>

          <button
            id="btn-onboarding-next"
            onClick={handleNext}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs sm:text-sm font-bold px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
          >
            <span>
              {step === slides.length - 1 ? labels.startProfileSetup : labels.next}
            </span>
            {step === slides.length - 1 ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : lang === 'fa' ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
