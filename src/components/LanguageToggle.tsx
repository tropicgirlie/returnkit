import { useLanguage } from './LanguageContext';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center bg-[#F3F4F6] rounded-full p-0.5">
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 text-xs rounded-full transition-all ${
          lang === 'en'
            ? 'bg-white text-[#111827] shadow-sm font-semibold'
            : 'text-[#6B7280] hover:text-[#374151]'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('ga')}
        className={`px-2.5 py-1 text-xs rounded-full transition-all ${
          lang === 'ga'
            ? 'bg-white text-[#111827] shadow-sm font-semibold'
            : 'text-[#6B7280] hover:text-[#374151]'
        }`}
        aria-label="Athraigh go Gaeilge"
      >
        GA
      </button>
    </div>
  );
}
