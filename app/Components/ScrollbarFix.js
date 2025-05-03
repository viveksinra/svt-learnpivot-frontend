"use client";
import { useEffect } from 'react';

export default function ScrollbarFix() {
  useEffect(() => {
    // Function to ensure scrollbar visibility
    const ensureScrollbar = () => {
      document.documentElement.style.overflowY = 'scroll';
      
      // If the body has overflow hidden, make sure we restore it
      if (document.body.style.overflowY === 'hidden') {
        document.body.style.overflowY = 'auto';
      }
    };

    // Run on mount
    ensureScrollbar();

    // Handle browser back button and page shows
    window.addEventListener('pageshow', (event) => {
      // This fires when navigating back via browser history
      if (event.persisted) {
        ensureScrollbar();
      }
    });

    // Also listen for popstate events (browser back/forward)
    window.addEventListener('popstate', ensureScrollbar);

    return () => {
      window.removeEventListener('pageshow', ensureScrollbar);
      window.removeEventListener('popstate', ensureScrollbar);
    };
  }, []);

  // This component doesn't render anything
  return null;
} 