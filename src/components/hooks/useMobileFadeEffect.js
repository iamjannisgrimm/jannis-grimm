import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for mobile-specific enhanced fade effects with more aggressive fading
 * @param {Object} options - Configuration options
 * @param {number} options.topFadeDistance - Distance to fade completely when approaching top (px)
 * @param {number} options.bottomFadeDistance - Distance to fade completely when approaching bottom (px)
 * @param {number} options.startVisibleThreshold - How much of element must be visible before starting to appear (0-1)
 * @returns {[React.RefObject, number]} - Ref to attach to element and current opacity value
 */
export function useMobileFadeEffect({
  topFadeDistance = 100,
  bottomFadeDistance = 120,
  startVisibleThreshold = 0.1
} = {}) {
  const ref = useRef(null);
  const [opacity, setOpacity] = useState(0); // Start invisible
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const calculateOpacity = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // First check if element is in view enough to be considered "visible"
      const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const elementHeight = rect.height;
      const visibleRatio = visibleHeight / elementHeight;

      // Determine if element should be considered "in view"
      if (visibleRatio >= startVisibleThreshold) {
        isVisibleRef.current = true;
      }

      // Only continue with fade calculations once element has been "in view"
      if (!isVisibleRef.current) {
        setOpacity(0);
        return;
      }
      
      // Calculate top fade - only start fading when very close to the top edge
      let topOpacity = 1;
      if (rect.top < topFadeDistance) {
        // More aggressive fade curve for top
        topOpacity = Math.max(0, rect.top / topFadeDistance);
        // Apply steeper power curve for more concentrated fading near the edges
        topOpacity = Math.pow(topOpacity, 1.5);
      }
      
      // Calculate bottom fade - only start fading when very close to the bottom edge
      let bottomOpacity = 1;
      if (rect.bottom > windowHeight - bottomFadeDistance) {
        const distanceFromBottom = windowHeight - rect.bottom;
        // More aggressive fade curve for bottom
        bottomOpacity = Math.max(0, (distanceFromBottom + bottomFadeDistance) / bottomFadeDistance);
        // Apply steeper power curve for more concentrated fading near the edges
        bottomOpacity = Math.pow(bottomOpacity, 1.5);
      }
      
      // Use the lower of the two opacities (more faded)
      setOpacity(Math.min(topOpacity, bottomOpacity));
    };

    // Run more frequently for smoother fades
    const handleScroll = () => {
      window.requestAnimationFrame(calculateOpacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    calculateOpacity(); // Calculate initial opacity

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [topFadeDistance, bottomFadeDistance, startVisibleThreshold]);

  return [ref, opacity];
}

export default useMobileFadeEffect; 