import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If a hash exists (e.g. #contact), scroll to that element smoothly
    if (hash) {
      const targetElement = document.getElementById(hash.replace('#', ''));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Otherwise, immediately reset viewport scroll position to (0, 0)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    // Fallbacks for document element and body scroll
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
      document.documentElement.scrollLeft = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
      document.body.scrollLeft = 0;
    }
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
