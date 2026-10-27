'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; }
}
export function track(event: string) {
  try { if (localStorage.getItem('analytics-consent') === 'accepted') window.gtag?.('event', event); } catch { /* Storage may be disabled. */ }
}
export default function VisitorAnalytics({ id }: { id: string }) {
  const [consent, setConsent] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const valid = /^G-[A-Z0-9]+$/.test(id);
  useEffect(() => { try { setConsent(localStorage.getItem('analytics-consent') || 'unset'); } catch { setConsent('unset'); } }, []);
  useEffect(() => {
    if (ready && consent === 'accepted') window.gtag?.('event', 'page_view', { page_path: pathname, page_location: window.location.origin + pathname });
  }, [pathname, ready, consent]);
  function choose(value: string) { try { localStorage.setItem('analytics-consent', value); } catch { /* Continue for this visit. */ } setConsent(value); }
  if (!valid || pathname?.startsWith('/admin')) return null;
  return <>
    {consent === 'accepted' && <Script id="visitor-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" onReady={() => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer?.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', id, { send_page_view: false, page_location: window.location.origin + pathname, allow_google_signals: false, allow_ad_personalization_signals: false });
      setReady(true);
    }} />}
    {consent === 'unset' && <aside className="fixed bottom-0 inset-x-0 z-50 p-4 bg-white border-t shadow-lg text-gray-900 flex flex-wrap items-center justify-center gap-4"><p>Allow optional visitor analytics? / อนุญาตการวิเคราะห์การใช้งานหรือไม่</p><button onClick={() => choose('accepted')} className="bg-green-700 text-white rounded px-4 py-2">Allow / อนุญาต</button><button onClick={() => choose('declined')} className="border rounded px-4 py-2">Decline / ปฏิเสธ</button></aside>}
    {consent && consent !== 'unset' && <button className="block mx-auto p-3 text-sm underline" onClick={() => { choose('unset'); setReady(false); window.location.reload(); }}>Analytics preferences / ตั้งค่าการวิเคราะห์</button>}
  </>;
}
