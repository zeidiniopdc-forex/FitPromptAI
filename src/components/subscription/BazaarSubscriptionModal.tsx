import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriptionPlanId } from '../../types';
import { 
  Crown, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Gift, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  Lock,
  RotateCcw
} from 'lucide-react';

interface BazaarSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export const BazaarSubscriptionModal: React.FC<BazaarSubscriptionModalProps> = ({
  isOpen,
  onClose,
  initialMessage
}) => {
  const { 
    subscription, 
    isVip, 
    upgradeToVip, 
    cancelVipSubscription, 
    redeemActivationCode,
    restoreVipPurchases 
  } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>('vip_quarterly');
  const [activationCode, setActivationCode] = useState<string>('');
  const [codeFeedback, setCodeFeedback] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'vip_monthly' as SubscriptionPlanId,
      name: 'اشتراک ۱ ماهه',
      price: '۴۹,۰۰۰ تومان',
      pricePerMonth: '۴۹,۰۰۰ تومان در ماه',
      badge: null,
      popular: false
    },
    {
      id: 'vip_quarterly' as SubscriptionPlanId,
      name: 'اشتراک ۳ ماهه',
      price: '۹۹,۰۰۰ تومان',
      pricePerMonth: '۳۳,۰۰۰ تومان در ماه',
      badge: 'پیشنهاد ویژه بازار (۳۳٪ تخفیف)',
      popular: true
    },
    {
      id: 'vip_yearly' as SubscriptionPlanId,
      name: 'اشتراک ۱ ساله',
      price: '۱۹۹,۰۰۰ تومان',
      pricePerMonth: '۱۶,۵۰۰ تومان در ماه',
      badge: 'بصرفه‌ترین انتخاب (۶۶٪ تخفیف)',
      popular: false
    }
  ];

  const handleBazaarPurchase = () => {
    setIsProcessingPurchase(true);

    // Simulate Cafe Bazaar native purchase sheet & webhook
    setTimeout(() => {
      upgradeToVip(selectedPlan);
      setIsProcessingPurchase(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 2000);
    }, 1200);
  };

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationCode.trim()) return;

    const res = redeemActivationCode(activationCode);
    setCodeFeedback(res);
    if (res.success) {
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 2000);
    }
  };

  const handleRestore = () => {
    const success = restoreVipPurchases();
    if (success) {
      setCodeFeedback({
        success: true,
        message: 'خریدهای قبلی شما از حساب کاربری کافه‌بازار با موفقیت بازیابی شد.'
      });
    } else {
      setCodeFeedback({
        success: false,
        message: 'هیچ خرید فعالی در حساب بازار یافت نشد.'
      });
    }
  };

  // Calculate days remaining if VIP
  let daysRemaining = 0;
  if (subscription.expiresAt) {
    const diffTime = new Date(subscription.expiresAt).getTime() - Date.now();
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto text-zinc-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Bazaar & VIP Header Banner */}
        <div className="relative bg-gradient-to-br from-amber-600/30 via-emerald-600/20 to-zinc-950 p-5 sm:p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {/* Cafe Bazaar / VIP Badge */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-amber-400">
                  <Crown className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-black text-white">
                    اشتراک ویژه بازار
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    VIP فیت‌پرو
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-0.5">
                  پرداخت امن از طریق درگاه درون‌برنامه‌ای کافه‌بازار
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {initialMessage && (
            <div className="mt-3.5 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{initialMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Active VIP Status Banner (If User is already VIP) */}
          {isVip ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-amber-950/40 border border-emerald-500/40 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>اشتراک طلایی شما فعال است</span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {subscription.planNameFa}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <span className="text-zinc-400 text-[10px] block">اعتبار باقیمانده:</span>
                  <span className="font-bold text-white mt-0.5 block">
                    {daysRemaining > 0 ? `${daysRemaining} روز دیگر` : 'دائمی / هدیه'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <span className="text-zinc-400 text-[10px] block">شناسه سفارش بازار:</span>
                  <span className="font-mono text-zinc-300 mt-0.5 block truncate">
                    {subscription.orderId || 'bz_verified'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <button
                  onClick={cancelVipSubscription}
                  className="text-[11px] text-zinc-400 hover:text-red-400 transition-colors"
                >
                  انصراف از اشتراک (تست پلن رایگان)
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 transition-all"
                >
                  بازگشت به برنامه
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Feature Matrix Comparison (Free vs VIP) */}
              <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>مقایسه نسخه پایه (رایگان) و اشتراک طلایی بازار</span>
                </h4>

                <div className="space-y-2 pt-1 text-xs">
                  {/* Feature 1 */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                    <span className="text-zinc-300">استفاده کامل از برنامه‌های پیش‌فرض</span>
                    <div className="flex items-center gap-3 font-semibold text-[11px]">
                      <span className="text-emerald-400">رایگان: ✅</span>
                      <span className="text-amber-400">ویژه: ✅</span>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                    <span className="text-zinc-300">ثبت ست‌ها، رکوردها و تایمر استراحت</span>
                    <div className="flex items-center gap-3 font-semibold text-[11px]">
                      <span className="text-emerald-400">رایگان: ✅</span>
                      <span className="text-amber-400">ویژه: ✅</span>
                    </div>
                  </div>

                  {/* Feature 3 (The key differentiator requested by user) */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-950/20 border border-amber-500/30">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-white font-medium">تولید پرامپت هوشمند بدنسازی (AI)</span>
                    </div>
                    <div className="flex items-center gap-3 font-bold text-[11px]">
                      <span className="text-red-400 line-through">رایگان: ❌</span>
                      <span className="text-amber-400">ویژه: ✅ نامحدود</span>
                    </div>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                    <span className="text-zinc-300">شخصی‌سازی آسیب‌ها، تجهیزات و اولویت‌ها</span>
                    <div className="flex items-center gap-3 font-bold text-[11px]">
                      <span className="text-red-400 line-through">رایگان: ❌</span>
                      <span className="text-amber-400">ویژه: ✅ کامل</span>
                    </div>
                  </div>

                  {/* Feature 5 */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                    <span className="text-zinc-300">ایمپورت و ذخیره برنامه‌های اختصاصی AI</span>
                    <div className="flex items-center gap-3 font-bold text-[11px]">
                      <span className="text-red-400 line-through">رایگان: ❌</span>
                      <span className="text-amber-400">ویژه: ✅ نامحدود</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Cards Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-zinc-300 block">
                  پلن اشتراک بازار خود را انتخاب کنید:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`relative p-3.5 rounded-2xl cursor-pointer border transition-all duration-150 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10 scale-[1.02]'
                            : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        {plan.badge && (
                          <span className="absolute -top-2.5 left-2 right-2 text-center py-0.5 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-emerald-500 text-zinc-950 shadow-md">
                            {plan.badge}
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1 mt-0.5">
                            <span className="text-xs font-bold text-white">
                              {plan.name}
                            </span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-amber-400 bg-amber-400 text-zinc-950' : 'border-zinc-600'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>

                          <div className="text-sm font-black text-amber-400 mt-1">
                            {plan.price}
                          </div>
                        </div>

                        <span className="text-[10px] text-zinc-400 mt-2 block">
                          {plan.pricePerMonth}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Purchase Button (Simulated Bazaar In-App Purchase Flow) */}
              <div className="space-y-2 pt-1">
                <button
                  id="btn-bazaar-purchase"
                  onClick={handleBazaarPurchase}
                  disabled={isProcessingPurchase}
                  className="w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 text-zinc-950 hover:brightness-110 shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  {isProcessingPurchase ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin"></div>
                      <span>در حال اتصال به کافه‌بازار...</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>خرید مستقیم و پرداخت از کافه‌بازار</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    ضمانت امن بازار
                  </span>
                  <span>•</span>
                  <button 
                    onClick={handleRestore}
                    className="flex items-center gap-1 hover:text-zinc-200 underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    بازیابی خرید قبلی
                  </button>
                </div>
              </div>

              {/* Redeem Gift / Activation Code Section (Essential for Reviewers & Users) */}
              <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 mb-2">
                  <Gift className="w-3.5 h-3.5 text-emerald-400" />
                  <span>کد هدیه، تخفیف یا فعال‌سازی بازار دارید؟</span>
                </div>

                <form onSubmit={handleRedeemCode} className="flex gap-2">
                  <input
                    type="text"
                    value={activationCode}
                    onChange={(e) => setActivationCode(e.target.value)}
                    placeholder="مثلاً: BAZAAR یا VIP"
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-left uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-emerald-400 border border-zinc-700 transition-colors shrink-0"
                  >
                    اعمال کد
                  </button>
                </form>

                {codeFeedback && (
                  <p className={`text-[11px] mt-2 flex items-center gap-1 ${
                    codeFeedback.success ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {codeFeedback.success ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                    <span>{codeFeedback.message}</span>
                  </p>
                )}

                <span className="text-[10px] text-zinc-500 mt-2 block">
                  کدهای تست ویژه داوران و کاربران: <code className="text-zinc-400 font-mono">BAZAAR</code> یا <code className="text-zinc-400 font-mono">VIP</code>
                </span>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <span className="text-[11px]">پشتیبانی درون‌برنامه‌ای بازار</span>
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            بستن
          </button>
        </div>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150 z-20">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-white">
              تبریک! اشتراک طلایی فعال شد 🎉
            </h3>
            <p className="text-xs text-zinc-300 mt-1 max-w-xs">
              هم‌اکنون دسترسی کامل به موتور تولید پرامپت اختصاصی هوش مصنوعی و امکانات ویژه برای شما باز است.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
