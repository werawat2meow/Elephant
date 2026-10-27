
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayoutWrapper from './ClientLayoutWrapper';
import { site, siteOrigin } from '../lib/site';
import JsonLd from '../components/JsonLd';
import VisitorAnalytics from '../components/VisitorAnalytics';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'Jasmine Tour | Phuket Tour Booking Agent', template: '%s | Jasmine Tour' },
  description: 'Jasmine Tour is a booking agent for Phuket elephant tour enquiries. Availability, providers and prices require confirmation.',
  ...(siteOrigin ? { metadataBase: new URL(siteOrigin) } : {}),
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
  robots: { index: !!siteOrigin, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {siteOrigin && <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Organization', '@id': `${siteOrigin}/#organization`, name: site.name, url: siteOrigin, description: 'Phuket elephant tour booking agent', ...(site.operator ? { legalName: site.operator } : {}) }} />}
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        <VisitorAnalytics id={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
      </body>
    </html>
  );
}
