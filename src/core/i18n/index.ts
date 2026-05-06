/**
 * i18n Configuration
 * i18next setup with Arabic RTL support
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ar from './ar.json';
import en from './en.json';

// Supported languages
export const LANGUAGES = {
  ar: { name: 'العربية', dir: 'rtl' as const },
  en: { name: 'English', dir: 'ltr' as const },
} as const;

export type Language = keyof typeof LANGUAGES;

// Default language
export const DEFAULT_LANGUAGE: Language = 'ar';

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar, consumer: ar, auth: ar },
      en: { translation: en, consumer: en, auth: en },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: Object.keys(LANGUAGES),
    ns: ['translation', 'consumer', 'auth'],
    defaultNS: 'translation',
    keySeparator: '.',
    nsSeparator: ':',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'fawz_language',
    },
  });

/**
 * Set document direction based on language
 */
export function setDirection(lang: Language): void {
  const dir = LANGUAGES[lang].dir;
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
}

/**
 * Change language and update direction
 */
export async function changeLanguage(lang: Language): Promise<void> {
  await i18n.changeLanguage(lang);
  setDirection(lang);
  localStorage.setItem('fawz_language', lang);
}

/**
 * Get current language
 */
export function getCurrentLanguage(): Language {
  return (i18n.language as Language) || DEFAULT_LANGUAGE;
}

/**
 * Check if current language is RTL
 */
export function isRTL(): boolean {
  return LANGUAGES[getCurrentLanguage()].dir === 'rtl';
}

// Set initial direction
setDirection(getCurrentLanguage());

export default i18n;
