export function isTimelineRoute(pathname) {
  return pathname === "/timeline" || pathname.endsWith("/timeline");
}

export function navigateTo(pathname) {
  if (typeof window === "undefined") {
    return;
  }

  const targetPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (window.location.pathname !== targetPath) {
    window.history.pushState({}, "", targetPath);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}
