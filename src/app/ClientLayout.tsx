'use client'
import { useLanguage } from '../contexts/LanguageContext'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { currentLang, setLanguage } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation 
        currentLang={currentLang} 
        onLanguageChange={setLanguage}
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer currentLang={currentLang} />
    </div>
  )
}