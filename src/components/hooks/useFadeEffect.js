import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for creating edge-fade effects on elements
 * @param {Object} options - Configuration options
 * @param {number} options.edgeDistance - Distance from edge in pixels to start fading (default: 100px)
 * @returns {[React.RefObject, number]} - [ref to attach to element, current opacity]
 */
export function useFadeEffect(options = {}) {
  const {
    edgeDistance = 100  // Default 100px from edge
  } = options;
  
  const elementRef = useRef(null);
  const [opacity, setOpacity] = useState(1);
  
  useEffect(() => {
    // Function to calculate opacity based on element position
    const calculateOpacity = () => {
      const element = elementRef.current;
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Top edge fade logic - start fading when within edgeDistance px of top edge
      if (elementTop < edgeDistance) {
        // Calculate fade progress - we want to be fully faded BEFORE bottom reaches edge
        // So we use 75% of the element height as our fade distance
        const fadeDistance = Math.min(elementHeight * 0.75, edgeDistance);
        const scrollProgress = (edgeDistance - elementTop) / fadeDistance;
        setOpacity(Math.max(0, 1 - Math.min(1, scrollProgress)));
      }
      else {
        // Element is fully visible or below the fade threshold
        setOpacity(1);
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', calculateOpacity, { passive: true });
    
    // Initial calculation
    calculateOpacity();
    
    // Cleanup
    return () => window.removeEventListener('scroll', calculateOpacity);
  }, [edgeDistance]);
  
  return [elementRef, opacity];
}

export default useFadeEffect; 