import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { translations } from '../i18n/translations';

export const useTranslation = () => {
  const currentLanguage = useSelector((state: RootState) => state.settings?.language || 'en');

  const t = (key: string): string => {
    // Check if the current language has the translation, otherwise fallback to english
    const langDictionary = translations[currentLanguage] || translations['en'];
    return langDictionary[key] || translations['en'][key] || key;
  };

  return { t, currentLanguage };
};
