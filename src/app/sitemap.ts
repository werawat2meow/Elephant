import type { MetadataRoute } from 'next';
import { siteOrigin } from '../lib/site';
import { tours } from '../lib/tours';
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteOrigin) return [];
  return ['/', '/about', '/contact', '/packages', '/gallery', '/cancellation-policy', '/privacy-policy', ...tours.map(t => `/tours/${t.slug}`)].map(path => ({ url: `${siteOrigin}${path}` }));
}
