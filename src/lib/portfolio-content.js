import { useSyncExternalStore } from "react";

function subscribe(onChange) {
  window.addEventListener("portfolio-content", onChange);
  return () => window.removeEventListener("portfolio-content", onChange);
}

export function usePortfolioContent(key) {
  return useSyncExternalStore(subscribe, () => window[key]);
}
