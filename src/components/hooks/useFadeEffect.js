import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook that handles fade effects for elements as they approach screen edges
 * @param {Object} options - Configuration options
 * @param {number} options.topEdgeDistance - Distance from top edge to start fading (in px)
 * @param {number} options.bottomEdgeDistance - Distance from bottom edge to start fading (in px)
 * @param {boolean} options.fadeTop - Whether to fade when element approaches top edge
 * @param {boolean} options.fadeBottom - Whether to fade when element approaches bottom edge
 * @returns {[React.RefObject, number]} - Ref to attach to element and current opacity value
 */
export function useFadeEffect({
  topEdgeDistance = 100,
  bottomEdgeDistance = 200,
  fadeTop = true,
  fadeBottom = true
} = {}) {
  const ref = useRef(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const calculateOpacity = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if element is near top edge
      let topOpacity = 1;
      if (fadeTop && rect.top < topEdgeDistance) {
        const topFadeProgress = (topEdgeDistance - rect.top) / topEdgeDistance;
        // Apply a smoother fade curve using power function
        topOpacity = Math.max(0, 1 - Math.pow(topFadeProgress, 1.5));
      }
      
      // Check if element is near bottom edge
      let bottomOpacity = 1;
      if (fadeBottom && rect.bottom > windowHeight - bottomEdgeDistance) {
        const bottomFadeProgress = (rect.bottom - (windowHeight - bottomEdgeDistance)) / bottomEdgeDistance;
        // Apply a more pronounced fade curve for bottom edge
        bottomOpacity = Math.max(0, 1 - Math.pow(bottomFadeProgress, 1.2));
      }
      
      // Use the lower of the two opacities (more faded)
      setOpacity(Math.min(topOpacity, bottomOpacity));
    };

    window.addEventListener('scroll', calculateOpacity, { passive: true });
    window.addEventListener('resize', calculateOpacity, { passive: true });

    // Calculate initial opacity
    calculateOpacity();

    return () => {
      window.removeEventListener('scroll', calculateOpacity);
      window.removeEventListener('resize', calculateOpacity);
    };
  }, [topEdgeDistance, bottomEdgeDistance, fadeTop, fadeBottom]);

  return [ref, opacity];
}

export default useFadeEffect; 