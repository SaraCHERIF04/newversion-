
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Available languages
export type Language = 'fr' | 'en' | 'ar';

// Translation keys
type TranslationKey = 
  | 'settings'
  | 'language'
  | 'password'
  | 'appLanguage'
  | 'selectLanguage'
  | 'french'
  | 'english'
  | 'arabic'
  | 'currentPassword'
  | 'newPassword'
  | 'confirmPassword'
  | 'updatePassword'
  | 'success'
  | 'error'
  | 'passwordUpdated'
  | 'passwordsDontMatch'
  | 'passwordTooShort'
  | 'languageUpdated'
  | 'languageChangeSuccess';

// Translations
const translations: Record<Language, Record<TranslationKey, string>> = {
  fr: {
    settings: 'Paramètres',
    language: 'Langue',
    password: 'Mot de passe',
    appLanguage: 'Langue de l\'application',
    selectLanguage: 'Sélectionner une langue',
    french: 'Français',
    english: 'Anglais',
    arabic: 'Arabe',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    updatePassword: 'Mettre à jour le mot de passe',
    success: 'Succès',
    error: 'Erreur',
    passwordUpdated: 'Votre mot de passe a été mis à jour',
    passwordsDontMatch: 'Les mots de passe ne correspondent pas',
    passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
    languageUpdated: 'Langue mise à jour',
    languageChangeSuccess: 'La langue a été changée avec succès'
  },
  en: {
    settings: 'Settings',
    language: 'Language',
    password: 'Password',
    appLanguage: 'Application language',
    selectLanguage: 'Select a language',
    french: 'French',
    english: 'English',
    arabic: 'Arabic',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    updatePassword: 'Update password',
    success: 'Success',
    error: 'Error',
    passwordUpdated: 'Your password has been updated',
    passwordsDontMatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 8 characters',
    languageUpdated: 'Language updated',
    languageChangeSuccess: 'The language has been changed successfully'
  },
  ar: {
    settings: 'الإعدادات',
    language: 'اللغة',
    password: 'كلمة المرور',
    appLanguage: 'لغة التطبيق',
    selectLanguage: 'اختر لغة',
    french: 'الفرنسية',
    english: 'الإنجليزية',
    arabic: 'العربية',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور',
    updatePassword: 'تحديث كلمة المرور',
    success: 'نجاح',
    error: 'خطأ',
    passwordUpdated: 'تم تحديث كلمة المرور الخاصة بك',
    passwordsDontMatch: 'كلمات المرور غير متطابقة',
    passwordTooShort: 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل',
    languageUpdated: 'تم تحديث اللغة',
    languageChangeSuccess: 'تم تغيير اللغة بنجاح'
  }
};

// Define the shape of our context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: () => '',
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with the stored language or default to French
  const [language, setLanguageState] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem('appLanguage');
    return (storedLanguage as Language) || 'fr';
  });

  // Update the language and store it in localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);
    
    // If using Arabic language, add RTL direction to the document
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  // Translate function
  const t = (key: TranslationKey) => {
    return translations[language][key] || key;
  };

  // Set the initial direction on first render
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
