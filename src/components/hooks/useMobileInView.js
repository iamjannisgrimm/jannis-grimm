import { useRef, useState, useEffect } from "react";

export function useMobileInView(threshold = 0.2, once = true) {
  const ref = useRef();
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) {
            // If once is true, disconnect the observer after detection
            // This ensures the component stays visible once it appears
            observer.disconnect();
          }
        } else if (!once) {
          setInView(false);
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin: "0px 0px -100px 0px", // Trigger earlier (100px from bottom edge)
        threshold: threshold, // Portion of element that must be visible
      }
    );
    
    observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);
  
  return [ref, inView];
} 