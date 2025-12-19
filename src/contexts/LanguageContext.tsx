"use client";
import { createContext, ReactNode, useContext, useState } from "react";

export type Language = "th" | "en" | "de" | "cn" | "fr";

interface LanguageContextType {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>("en");

  const setLanguage = (lang: Language) => {
    setCurrentLang(lang);
    // TODO: Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
