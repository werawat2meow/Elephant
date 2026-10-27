import type { Metadata } from 'next';

const configuredOrigin = process.env.SITE_ORIGIN;
export const siteOrigin = configuredOrigin ? new URL(configuredOrigin).origin : null;
export const site = {
  name: 'Jasmine Tour',
  origin: siteOrigin,
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || '',
  hours: process.env.NEXT_PUBLIC_CONTACT_HOURS || '',
  operator: process.env.NEXT_PUBLIC_LEGAL_OPERATOR || '',
  line: approvedLink(process.env.NEXT_PUBLIC_LINE_URL, ['line.me', 'lin.ee']),
  facebook: approvedLink(process.env.NEXT_PUBLIC_FACEBOOK_URL, ['facebook.com', 'www.facebook.com']),
  instagram: approvedLink(process.env.NEXT_PUBLIC_INSTAGRAM_URL, ['instagram.com', 'www.instagram.com']),
};
function approvedLink(value: string | undefined, hosts: string[]) {
  try { const url = new URL(value || ''); return url.protocol === 'https:' && hosts.includes(url.hostname) ? url.href : ''; }
  catch { return ''; }
}
export function pageMetadata(title: string, description: string, path: string, privatePage = false): Metadata {
  return { title, description, ...(siteOrigin ? { alternates: { canonical: new URL(path, siteOrigin).href } } : {}),
    robots: { index: !privatePage && !!siteOrigin, follow: !privatePage },
  };
}
