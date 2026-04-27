import ko from './ko.json';
import en from './en.json';

export const languages = { ko, en } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'ko';

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    const keys = key.split('.');
    let result: unknown = languages[lang];
    for (const k of keys) {
      if (result && typeof result === 'object') {
        result = (result as Record<string, unknown>)[k];
      } else {
        result = undefined;
        break;
      }
    }
    if (result === undefined) {
      let fallback: unknown = languages[defaultLang];
      for (const k of keys) {
        if (fallback && typeof fallback === 'object') {
          fallback = (fallback as Record<string, unknown>)[k];
        } else {
          fallback = undefined;
          break;
        }
      }
      return typeof fallback === 'string' ? fallback : key;
    }
    return typeof result === 'string' ? result : key;
  };
}

export function getLangFromUrl(url: URL): Lang {
  const segments = url.pathname.split('/').filter(Boolean);
  for (const seg of segments) {
    if (seg in languages) return seg as Lang;
  }
  return defaultLang;
}
