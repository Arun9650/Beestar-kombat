import {create} from 'zustand';

interface LanguageState {
  language: string;
  languageCode: string;
  id: string;
  setLanguage: (language: string, languageCode: string, id: string) => void;
}

const useLanguageStore = create<LanguageState>((set) => ({
  language: 'English',
  languageCode: 'GB',
  id: '',
  setLanguage: (language, languageCode, id) => set({ language, languageCode, id }),
}));

export default useLanguageStore;