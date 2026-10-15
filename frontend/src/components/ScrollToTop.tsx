import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Automatically scrolls window to top (0, 0) whenever the route pathname changes.
 * Fixes SPA scroll preservation when navigating from links at the bottom (e.g., Footer).
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
      // Fallback for older browsers
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
}
