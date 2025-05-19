import { useRef, useState, useEffect } from "react";

export function useInView(options = {}, delay = 200) {
  const ref = useRef();
  const [inView, setInView] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutRef.current = setTimeout(() => setInView(true), delay);
        } else {
          clearTimeout(timeoutRef.current);
          setInView(false);
        }
      },
      options
    );
    observer.observe(ref.current);
    return () => {
      clearTimeout(timeoutRef.current);
      observer.disconnect();
    };
  }, [options, delay]);

  return [ref, inView];
}