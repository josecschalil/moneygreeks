'use client';

import { useEffect } from 'react';

interface PageTrackerProps {
  pageType:
    | 'blog_post'
    | 'market_report'
    | 'post_market'
    | 'education'
    | 'news_today'
    | 'home'
    | 'blog'
    | 'archive'
    | 'other';
  pageSlug?: string;
  pageTitle?: string;
}

/**
 * Fires a single fire-and-forget analytics beacon on mount.
 * Drop this anywhere inside a public page — no props are required for landing pages,
 * but pass pageSlug + pageTitle for slug-level analytics.
 */
export default function PageTracker({ pageType, pageSlug = '', pageTitle = '' }: PageTrackerProps) {
  useEffect(() => {
    // Get or create a per-session ID (survives page navigations, not tab reopens)
    let sessionId = sessionStorage.getItem('mg_sid');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('mg_sid', sessionId);
    }

    const referrer = document.referrer ?? '';

    const payload = {
      page_type: pageType,
      page_slug: pageSlug,
      page_title: pageTitle || document.title,
      session_id: sessionId,
      referrer,
    };

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

    // fire-and-forget — we don't await or handle errors to avoid blocking UX
    fetch(`${apiBase}/track/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // Use keepalive so the beacon survives page unload if triggered close to navigation
      keepalive: true,
    }).catch(() => {
      // Intentionally silent — analytics should never break the user experience
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
