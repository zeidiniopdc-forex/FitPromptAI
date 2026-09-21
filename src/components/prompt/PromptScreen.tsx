import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { generateAgnosticWorkoutPrompt, PROMPT_VERSION } from '../../utils/promptGenerator';
import { BazaarSubscriptionModal } from '../subscription/BazaarSubscriptionModal';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  History, 
  RefreshCw, 
  ArrowRight,
  HelpCircle,
  FileCode,
  CheckCircle2,
  Lock,
  Crown,
  Gift
} from 'lucide-react';

interface PromptScreenProps {
  onOpenImport?: () => void;
  onOpenSubscription?: () => void;
}

export const PromptScreen: React.FC<PromptScreenProps> = ({ onOpenImport, onOpenSubscription }) => {
  const { profile, settings, promptHistory, savePromptToHistory, isVip, subscription } = useApp();
  const lang = settings.language;
  const labels = t[lang];

  const [activeTab, setActiveTab] = useState<'preview' | 'instructions' | 'history'>('preview');
  const [currentPrompt, setCurrentPrompt] = useState<string>(() => generateAgnosticWorkoutPrompt(profile, lang));
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showLocalSubscriptionModal, setShowLocalSubscriptionModal] = useState<boolean>(false);

  // Update prompt when profile or language changes
  React.useEffect(() => {
    setCurrentPrompt(generateAgnosticWorkoutPrompt(profile, lang));
  }, [profile, lang]);

  const openUpgradeModal = () => {
    if (onOpenSubscription) {
      onOpenSubscription();
    } else {
      setShowLocalSubscriptionModal(true);
    }
  };

  const handleCopy = async () => {
    if (!isVip) {
      openUpgradeModal();
      return;
    }

    try {
      await navigator.clipboard.writeText(currentPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = currentPrompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (!isVip) {
      openUpgradeModal();
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FitPrompt AI Workout Prompt',
          text: currentPrompt
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  const handleRegenerate = () => {
    if (!isVip) {
      openUpgradeModal();
      return;
    }
    const newPrompt = generateAgnosticWorkoutPrompt(profile, lang);
    setCurrentPrompt(newPrompt);
  };

  const handleSaveToHistory = () => {
    if (!isVip) {
      openUpgradeModal();
      return;
    }
    const summary = `${profile.name} - ${profile.primaryGoal} (${profile.daysPerWeek}d/wk)`;
    savePromptToHistory(currentPrompt, summary);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {labels.promptScreenTitle}
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              v{PROMPT_VERSION}
            </span>
            {isVip ? (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>مشترک طلایی بازار</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-800/80 text-amber-400/90 border border-amber-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>ویژه مشترکین طلایی</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {labels.promptScreenSubtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-copy-prompt"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 ${
              isVip
                ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-amber-500/20'
            }`}
          >
            {isVip ? (
              copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
            <span>
              {isVip 
                ? (copied ? labels.copiedToClipboard : labels.copyPrompt)
                : 'باز کردن قفل کپی پرامپت'}
            </span>
          </button>

          <button
            id="btn-share-prompt"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{labels.sharePrompt}</span>
          </button>

          <button
            id="btn-regenerate-prompt"
            onClick={handleRegenerate}
            title={labels.regeneratePrompt}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {onOpenImport && (
            <button
              onClick={onOpenImport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-500/15 border border-teal-500/30 text-teal-400 hover:bg-teal-500/25 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{labels.importJson}</span>
            </button>
          )}
        </div>
      </div>

      {/* FREEMIUM PAYWALL LOCK BANNER (Visible when not VIP) */}
      {!isVip && (
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950 border-2 border-amber-500/50 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>تولید پرامپت هوش مصنوعی ویژه مشترکین طلایی بازار است</span>
                  </h3>
                  <span className="text-[11px] font-bold text-amber-300">
                    نسخه پایه (رایگان): برنامه‌های استاندارد پیش‌فرض فعال است
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
                در نسخه رایگان فیت‌پرو، دسترسی به تمامی برنامه‌های پیش‌فرض استاندارد بدنسازی (هایپرتروفی و PPL تفکیکی)، ثبت ست‌ها، وزنه‌ها، تایمر هوشمند استراحت و نمودارهای پیشرفت به طور نامحدود برای شما باز است.
                برای تولید پرامپت اختصاصی سازگار با آناتومی، آسیب‌دیدگی‌ها و تجهیزات با هوش مصنوعی، اشتراک ویژه کافه‌بازار را تهیه کنید.
              </p>

              <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-zinc-300">
                <span className="px-2 py-0.5 rounded-lg bg-zinc-800/80 border border-zinc-700/80 flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  برنامه‌های پیش‌فرض: کاملاً رایگان
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-zinc-800/80 border border-zinc-700/80 flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ثبت ست‌ها و تایمر: رایگان
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-1 text-amber-300 font-bold">
                  <Crown className="w-3.5 h-3.5" />
                  تولید پرامپت AI: نیاز به اشتراک بازار
                </span>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <button
                id="btn-paywall-unlock"
                onClick={openUpgradeModal}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 text-zinc-950 font-black text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                <span>خرید اشتراک بازار و باز کردن قفل</span>
              </button>

              <button
                onClick={openUpgradeModal}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Gift className="w-3.5 h-3.5 text-emerald-400" />
                <span>کد هدیه یا بازیابی خرید</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 mb-4 pb-2">
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'preview'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>{labels.promptPreviewTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('instructions')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'instructions'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{labels.promptInstructionsTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'history'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>{labels.promptHistoryTab} ({promptHistory.length})</span>
        </button>
      </div>

      {/* Tab 1: Preview Prompt */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          {/* TRAINEE PERSONALIZATION SUMMARY CARD */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-950/30 via-zinc-900 to-teal-950/20 border border-emerald-500/30 p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'fa' ? 'شناسنامه و تحلیل شخصی‌سازی پرامپت شما' : 'Personalization & Scientific Audit'}</span>
              </div>
              {!isVip && (
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Lock className="w-3 h-3" />
                  پیش‌نمایش محدود
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">{lang === 'fa' ? 'مشخصات بدنی' : 'Biometrics'}</span>
                <span className="font-bold text-white mt-0.5 block">
                  {profile.weight || 75} kg | {profile.height || 178} cm
                </span>
                <span className="text-[10px] text-emerald-400">BMI ~{((profile.weight || 75) / Math.pow((profile.height || 178)/100, 2)).toFixed(1)}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">{lang === 'fa' ? 'هدف اصلی و فرعی' : 'Goals'}</span>
                <span className="font-bold text-white mt-0.5 block truncate">
                  {profile.primaryGoal}
                </span>
                <span className="text-[10px] text-teal-400 truncate block">
                  {profile.secondaryGoal ? `+ ${profile.secondaryGoal}` : (lang === 'fa' ? 'تمرکز تک‌هدفه' : 'Single Goal')}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">{lang === 'fa' ? 'عضلات اولویت‌دار' : 'Priority Muscles'}</span>
                <span className="font-bold text-white mt-0.5 block truncate">
                  {profile.priorityMuscles && profile.priorityMuscles.length > 0 ? profile.priorityMuscles.join(', ') : (lang === 'fa' ? 'توزیع متوازن' : 'Balanced')}
                </span>
                <span className="text-[10px] text-amber-400">{lang === 'fa' ? 'حرکت اول و حجم ویژه' : 'Movement #1 & MAV'}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">{lang === 'fa' ? 'روزهای اختصاصی هفته' : 'Preferred Days'}</span>
                <span className="font-bold text-white mt-0.5 block truncate">
                  {profile.preferredDays && profile.preferredDays.length > 0 ? profile.preferredDays.join(' • ') : `${profile.daysPerWeek} روز`}
                </span>
                <span className="text-[10px] text-emerald-400">{lang === 'fa' ? 'تثبیت در خروجی AI' : 'Pinned to Days'}</span>
              </div>
            </div>
          </div>

          {/* Formatted Prompt Container (Gated with blur + Lock Overlay for free users) */}
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-inner overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 text-xs text-zinc-400">
              <span className="font-mono text-[11px]">FitPrompt Engine • AI-Agnostic Contract</span>
              <button
                onClick={handleSaveToHistory}
                className="flex items-center gap-1 text-xs text-zinc-300 hover:text-emerald-400 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{savedSuccess ? (lang === 'fa' ? 'ذخیره شد' : 'Saved') : labels.saveToHistoryPrompt}</span>
              </button>
            </div>

            {/* Prompt Text or Locked Blurred Teaser */}
            <div className="relative">
              <pre className={`font-mono text-xs sm:text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto selection:bg-emerald-500/30 select-text p-2 ${
                !isVip ? 'blur-sm select-none pointer-events-none opacity-40 max-h-[260px]' : ''
              }`}>
                {currentPrompt}
              </pre>

              {/* Lock Overlay when not VIP */}
              {!isVip && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-950/70 backdrop-blur-[2px] rounded-xl border border-amber-500/30">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 shadow-lg border border-amber-500/40">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-black text-white">
                    تولید پرامپت اختصاصی قفل است
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 max-w-sm">
                    برای باز شدن متن کامل پرامپت، شخصی‌سازی نامحدود و کپی در هوش مصنوعی، اشتراک بازار را فعال نمایید.
                  </p>
                  <button
                    onClick={openUpgradeModal}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-400 text-zinc-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Crown className="w-4 h-4" />
                    <span>خرید اشتراک بازار و مشاهده کامل پرامپت</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Next Step Banner */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                {isVip ? <Copy className="w-5 h-5" /> : <Lock className="w-5 h-5 text-amber-400" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {isVip ? labels.copyInstructionsStep1 : 'گام بعدی: خرید اشتراک و کپی در AI'}
                </h4>
                <p className="text-xs text-zinc-400">
                  {isVip ? labels.copyInstructionsStep2 : 'پس از خرید اشتراک، پرامپت را در هوش مصنوعی قرار داده و فایل JSON دریافت کنید.'}
                </p>
              </div>
            </div>

            <button
              onClick={isVip ? handleCopy : openUpgradeModal}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors"
            >
              {isVip ? (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{copied ? labels.copiedToClipboard : labels.copyPrompt}</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 text-zinc-950" />
                  <span>ارتقا و کپی در هوش مصنوعی</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Instructions */}
      {activeTab === 'instructions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>{labels.howToUsePromptTitle}</span>
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {labels.howToUsePromptDescription}
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center mb-3">
                ۱
              </span>
              <h4 className="text-sm font-bold text-white mb-1">
                {lang === 'fa' ? 'کپی پرامپت اختصاصی' : 'Copy the Prompt'}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {lang === 'fa' 
                  ? 'پرامپت بالا تمام متغیرهای بیومکانیکی شما را کدگذاری کرده است. آن را کپی کنید.'
                  : 'Click the Copy button to capture the strict contract prompt.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col">
              <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 font-bold text-sm flex items-center justify-center mb-3">
                ۲
              </span>
              <h4 className="text-sm font-bold text-white mb-1">
                {lang === 'fa' ? 'ارسال به هوش مصنوعی دلخواه' : 'Send to Any LLM'}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {lang === 'fa'
                  ? 'پرامپت را در ChatGPT (GPT-4o), Claude 3.5, Gemini 1.5/2.0 یا مدل محلی خود الصاق کنید.'
                  : 'Paste into ChatGPT, Claude, Gemini, DeepSeek, or any open model.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-sm flex items-center justify-center mb-3">
                ۳
              </span>
              <h4 className="text-sm font-bold text-white mb-1">
                {lang === 'fa' ? 'انتقال JSON به FitPrompt' : 'Import JSON Contract'}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {lang === 'fa'
                  ? 'کد JSON خروجی را کپی کنید و در دکمه Import الصاق نمایید. برنامه بلافاصله اعتبارسنجی و تبدیل به ترکر می‌شود.'
                  : 'Copy the JSON response and paste into FitPrompt Importer for instant validation and active tracking.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {promptHistory.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-2xl">
              <History className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-400">
                {lang === 'fa' ? 'هنوز پرامپتی در تاریخچه ذخیره نشده است.' : 'No saved prompts in history yet.'}
              </p>
            </div>
          ) : (
            promptHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{item.userSummary}</h4>
                  <span className="text-[11px] text-zinc-500">{item.createdAt}</span>
                </div>
                <button
                  onClick={() => {
                    setCurrentPrompt(item.promptText);
                    setActiveTab('preview');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200"
                >
                  {lang === 'fa' ? 'بارگذاری در پیش‌نمایش' : 'Load to Preview'}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Embedded Bazaar Modal for direct unlock */}
      <BazaarSubscriptionModal
        isOpen={showLocalSubscriptionModal}
        onClose={() => setShowLocalSubscriptionModal(false)}
        initialMessage="برای تولید و کپی پرامپت هوش مصنوعی، اشتراک ویژه کافه‌بازار را فعال نمایید."
      />
    </div>
  );
};
