import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '../contexts/LanguageContext'
import ClientLayout from './ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Elephant Nature Sanctuary | Ethical Elephant Tours',
  description: 'Experience ethical elephant tourism in Thailand. Feed elephants, observe their natural behaviors, and support conservation efforts.',
  keywords: 'elephant sanctuary, ethical tourism, Thailand, elephant conservation, eco-tourism',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <LanguageProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  )
}