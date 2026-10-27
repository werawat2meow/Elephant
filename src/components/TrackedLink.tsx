'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { track } from './VisitorAnalytics';

export default function TrackedLink({ href, event, className, children }: { href: string; event: 'book_now_click' | 'line_click'; className?: string; children: ReactNode }) {
  return <Link href={href} className={className} onClick={() => track(event)}>{children}</Link>;
}
