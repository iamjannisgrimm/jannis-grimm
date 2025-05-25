import { useState, useEffect } from 'react';

/**
 * A custom hook that determines if an element is visible in the viewport
 * @param {React.RefObject} ref - The ref of the element to observe
 * @param {number} threshold - The percentage of the element that needs to be visible (0-1)
 * @returns {boolean} - Whether the element is visible
 */
export function useIsVisible(ref, threshold = 0.2) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when element visibility changes
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.disconnect();
      }
    };
  }, [ref, threshold]);

  return isVisible;
} 