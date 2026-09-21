import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { generateAgnosticWorkoutPrompt, PROMPT_VERSION } from '../../utils/promptGenerator';
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
  ExternalLink
} from 'lucide-react';

interface PromptScreenProps {
  onOpenImport?: () => void;
}

export const PromptScreen: React.FC<PromptScreenProps> = ({ onOpenImport }) => {
  const { profile, settings, promptHistory, savePromptToHistory } = useApp();
  const lang = settings.language;
  const labels = t[lang];

  const [activeTab, setActiveTab] = useState<'preview' | 'instructions' | 'history'>('preview');
  const [currentPrompt, setCurrentPrompt] = useState<string>(() => generateAgnosticWorkoutPrompt(profile, lang));
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Update prompt when profile or language changes
  React.useEffect(() => {
    setCurrentPrompt(generateAgnosticWorkoutPrompt(profile, lang));
  }, [profile, lang]);

  const handleCopy = async () => {
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
    const newPrompt = generateAgnosticWorkoutPrompt(profile, lang);
    setCurrentPrompt(newPrompt);
  };

  const handleSaveToHistory = () => {
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {labels.promptScreenTitle}
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              v{PROMPT_VERSION}
            </span>
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? labels.copiedToClipboard : labels.copyPrompt}</span>
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
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'fa' ? 'شناسنامه و تحلیل شخصی‌سازی پرامپت شما' : 'Personalization & Scientific Audit'}</span>
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

          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-inner">
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

            {/* Formatted prompt container */}
            <pre className="font-mono text-xs sm:text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto selection:bg-emerald-500/30 select-text p-2">
              {currentPrompt}
            </pre>
          </div>

          {/* Next Step Banner */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Copy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {lang === 'fa' ? 'پرامپت را کپی کردید؟ حالا چه باید کرد؟' : 'Prompt Copied? What is the Next Step?'}
                </h4>
                <p className="text-xs text-zinc-300">
                  {lang === 'fa'
                    ? 'پرامپت را در ChatGPT، Claude یا Gemini الصاق کنید. کد JSON خروجی را کپی و در بخش Import قرار دهید.'
                    : 'Paste into ChatGPT, Claude, or Gemini. Copy the raw JSON response and import it back into FitPrompt.'}
                </p>
              </div>
            </div>

            {onOpenImport && (
              <button
                id="btn-go-to-import"
                onClick={onOpenImport}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold shadow-md flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>{lang === 'fa' ? 'ورود به صفحه Import JSON' : 'Open JSON Importer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Instructions */}
      {activeTab === 'instructions' && (
        <div className="space-y-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-2">
            {lang === 'fa' ? 'چگونه برنامه تمرینی با هوش مصنوعی بسازیم؟' : 'How to Generate Your Program with Any AI'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center mb-3">
                ۱
              </span>
              <h4 className="text-sm font-bold text-white mb-1">
                {lang === 'fa' ? 'کپی پرامپت استاندارد' : 'Copy Standard Prompt'}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {lang === 'fa'
                  ? 'دکمه «کپی متن پرامپت» را بزنید. پرامپت حاوی تمامی بیومکانیک‌ها، محدودیت‌ها و قرارداد Schema است.'
                  : 'Click Copy Prompt. It embeds your complete training profile and schema constraints.'}
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
    </div>
  );
};
