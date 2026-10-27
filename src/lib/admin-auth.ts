import { compare } from 'bcryptjs';

export async function authenticateAdmin(credentials: { email?: string; password?: string } | undefined) {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!process.env.NEXTAUTH_SECRET || !email || !hash || !credentials?.email || !credentials.password || credentials.password.length > 256) return null;
  try {
    const matches = await compare(credentials.password, hash);
    if (credentials.email.trim().toLowerCase() !== email || !matches) return null;
    return { id: 'site-admin', name: 'Admin', email };
  } catch { return null; }
}
