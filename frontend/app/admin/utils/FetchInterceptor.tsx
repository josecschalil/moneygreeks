"use client";

import { useEffect } from "react";
import { getAuthToken } from "./auth";

export default function FetchInterceptor() {
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      let [resource, config] = args;
      const url = typeof resource === 'string' ? resource : (resource instanceof Request ? resource.url : '');
      
      // Add token to any request going to the backend API
      if (url.includes(process.env.NEXT_PUBLIC_API_BASE_URL || 'http')) {
        const token = getAuthToken();
        if (token) {
          config = config || {};
          // Only add Authorization if not already present
          const headers = new Headers(config.headers || {});
          if (!headers.has('Authorization')) {
            headers.set('Authorization', `Token ${token}`);
          }
          config.headers = headers;
          args[1] = config;
        }
      }
      return originalFetch(...args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
