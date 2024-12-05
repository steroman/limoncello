import { createI18n } from 'vue-i18n';
import en from './locales/en.js';
import es from './locales/es.js';
import it from './locales/it.js';

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    es,
    it
  }
});