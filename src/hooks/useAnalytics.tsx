import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

// Session storage key
const SESSION_KEY = 'analytics_session_id';

// Get or create session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

// Track page view
export const usePageView = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const sessionId = getSessionId();
        const pagePath = location.pathname;
        const pageTitle = document.title;

        // Log to console in development
        if (import.meta.env.DEV) {
          console.log('[Analytics] Page view tracked:', pagePath);
        }

        // Check if analytics tables exist
        const { error } = await supabase
          .from('analytics_page_views')
          .insert([
            {
              session_id: sessionId,
              page_path: pagePath,
              page_title: pageTitle,
              referrer: document.referrer,
              user_agent: navigator.userAgent,
              timestamp: new Date().toISOString(),
            },
          ]);

        if (error && import.meta.env.DEV) {
          console.warn('[Analytics] Could not save page view:', error.message);
        }
      } catch (err) {
        // Silently fail in production, log in development
        if (import.meta.env.DEV) {
          console.warn('[Analytics] Page view tracking error:', err);
        }
      }
    };

    trackPageView();
  }, [location]);
};

// Track click events
export const useClickTracking = (category: string) => {
  const trackClick = useCallback(
    async (action: string, label?: string) => {
      try {
        const sessionId = getSessionId();

        // Log to console in development
        if (import.meta.env.DEV) {
          console.log('[Analytics] Click tracked:', { category, action, label });
        }

        // Check if analytics tables exist
        const { error } = await supabase
          .from('analytics_events')
          .insert([
            {
              session_id: sessionId,
              event_category: category,
              event_action: action,
              event_label: label || '',
              page_path: window.location.pathname,
              timestamp: new Date().toISOString(),
            },
          ]);

        if (error && import.meta.env.DEV) {
          console.warn('[Analytics] Could not save event:', error.message);
        }
      } catch (err) {
        // Silently fail in production, log in development
        if (import.meta.env.DEV) {
          console.warn('[Analytics] Click tracking error:', err);
        }
      }
    },
    [category]
  );

  return trackClick;
};

// Track form submissions
export const useFormTracking = () => {
  const trackFormSubmit = useCallback(
    async (formName: string, formData?: Record<string, any>) => {
      try {
        const sessionId = getSessionId();

        // Log to console in development
        if (import.meta.env.DEV) {
          console.log('[Analytics] Form submission tracked:', formName);
        }

        // Track as event
        const { error } = await supabase
          .from('analytics_events')
          .insert([
            {
              session_id: sessionId,
              event_category: 'form',
              event_action: 'submit',
              event_label: formName,
              page_path: window.location.pathname,
              timestamp: new Date().toISOString(),
            },
          ]);

        if (error && import.meta.env.DEV) {
          console.warn('[Analytics] Could not save form event:', error.message);
        }
      } catch (err) {
        // Silently fail in production, log in development
        if (import.meta.env.DEV) {
          console.warn('[Analytics] Form tracking error:', err);
        }
      }
    },
    []
  );

  return trackFormSubmit;
};

// Initialize analytics session
export const useAnalyticsSession = () => {
  useEffect(() => {
    const initSession = async () => {
      try {
        const sessionId = getSessionId();

        // Check if session already recorded
        const sessionRecorded = sessionStorage.getItem('session_recorded');
        if (sessionRecorded) return;

        // Log to console in development
        if (import.meta.env.DEV) {
          console.log('[Analytics] Session initialized:', sessionId);
        }

        // Try to record session
        const { error } = await supabase
          .from('analytics_sessions')
          .insert([
            {
              session_id: sessionId,
              start_time: new Date().toISOString(),
              user_agent: navigator.userAgent,
              landing_page: window.location.pathname,
            },
          ]);

        if (!error) {
          sessionStorage.setItem('session_recorded', 'true');
        } else if (import.meta.env.DEV) {
          console.warn('[Analytics] Could not save session:', error.message);
        }
      } catch (err) {
        // Silently fail in production, log in development
        if (import.meta.env.DEV) {
          console.warn('[Analytics] Session init error:', err);
        }
      }
    };

    initSession();
  }, []);
};
