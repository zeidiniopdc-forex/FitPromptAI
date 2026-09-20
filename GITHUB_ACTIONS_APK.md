# 📱 دریافت و ساخت فایل APK با GitHub Actions

پروژه **FitPrompt AI** مجهز به پیکربندی رسمی **Capacitor Android** و ورک‌فلو خودکار **GitHub Actions** است. هر زمان که کد را در گیت‌هاب پوش (Push) کنید یا از تب Actions روی دکمه **Run workflow** کلیک کنید، گیت‌هاب فایل APK نصب‌شدنی اندروید را به طور خودکار کامپایل کرده و به عنوان Artifact تحویل می‌دهد.

---

## 🚀 مراحل دریافت فایل APK از طریق GitHub Actions

### مرحله ۱: بردن کد به مخزن گیت‌هاب (GitHub Repository)
اگر پروژه را از منوی بالا یا گیت‌هاب اکسپورت کرده‌اید یا در ریپوزیتوری گیت‌هاب خود پوش می‌کنید:
```bash
git add .
git commit -m "Add GitHub Actions APK Workflow and Capacitor Android"
git push origin main
```

### مرحله ۲: اجرای ورک‌فلو و دانلود فایل APK
1. در صفحه مخزن خود در گیت‌هاب، به تب **Actions** بروید.
2. از ستون سمت چپ، ورک‌فلو **Build Android APK** را انتخاب کنید.
3. روی دکمه **Run workflow** کلیک کرده و شاخه `main` را انتخاب کنید (نوع بیلد: `debug` یا `release`).
4. گیت‌هاب به صورت خودکار عملیات زیر را انجام می‌دهد:
   - راه‌اندازی Node.js و نصب وابستگی‌ها
   - کامپایل وب‌اپلیکیشن Vite
   - همگام‌سازی Capacitor با پروژه نیتیو اندروید (`android`)
   - راه‌اندازی محیط JDK 17
   - اجرای کامپایلر گریدل اندروید (`./gradlew assembleDebug`)
   - تولید و بسته‌بندی فایل `fitprompt-ai-debug.apk`
5. پس از سبز شدن تیک اجرای اکشن (حدود ۲ الی ۳ دقیقه)، وارد صفحه همان اجرا شوید و در بخش پایینی به نام **Artifacts**، فایل **FitPrompt-AI-APK** را با یک کلیک دانلود کنید!
6. فایل زیپ دانلودشده حاوی فایل نصبی مستقیم `fitprompt-ai-debug.apk` است که روی هر گوشی اندروید نصب می‌شود.

---

## 🏷️ ساخت خودکار Release رسمی (با فایل APK)
اگر یک تگ به مخزن بفرستید، گیت‌هاب اکشن به صورت خودکار یک GitHub Release رسمی می‌سازد و فایل APK را ضمیمه آن می‌کند:
```bash
git tag v1.0.0
git push origin v1.0.0
```
سپس فایل APK مستقیماً در صفحه **Releases** مخزن شما در دسترس عموم خواهد بود.

---

## 🛠️ ساخت لوکال با Android Studio یا ترمینال
در صورت تمایل به تست روی سیستم خودتان:
```bash
# بیلد و همگام‌سازی
npm run build:android

# بیلد مستقیم با گریدل
cd android
./gradlew assembleDebug

# فایل APK تولید شده در این مسیر قرار دارد:
# android/app/build/outputs/apk/debug/app-debug.apk
```
یا فولدر `/android` را مستقیماً در **Android Studio** باز کرده و دکمه **Run** یا **Build APK** را بزنید.
