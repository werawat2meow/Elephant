import type { MetadataRoute } from 'next';
import { siteOrigin } from '../lib/site';
export default function robots(): MetadataRoute.Robots {
  return { rules: siteOrigin ? { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/booking'] } : { userAgent: '*', disallow: '/' }, ...(siteOrigin ? { sitemap: `${siteOrigin}/sitemap.xml` } : {}) };
}
