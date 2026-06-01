const VISIT_ENDPOINT = "https://dashboard.iamjannisgrimm.com/api/visits";
const TRACKED_HOSTS = new Set([
  "iamjannisgrimm.com",
  "www.iamjannisgrimm.com",
  "iamjannisgrimm.github.io",
]);

function shouldTrackVisits() {
  if (typeof window === "undefined") return false;
  return TRACKED_HOSTS.has(window.location.hostname);
}

function detectOperatingSystem(userAgent = "", platform = "") {
  const ua = userAgent.toLowerCase();
  const pf = platform.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua) || (/mac/.test(pf) && navigator.maxTouchPoints > 1)) return "iOS";
  if (/android/.test(ua)) return "Android";
  if (/win/.test(pf) || /windows/.test(ua)) return "Windows";
  if (/mac/.test(pf) || /mac os/.test(ua)) return "macOS";
  if (/linux/.test(pf) || /linux/.test(ua)) return "Linux";
  return "Unknown";
}

function getPlatformLabel() {
  const userAgentData = navigator.userAgentData;
  if (userAgentData?.platform) return userAgentData.platform;
  return navigator.platform || "Unknown";
}

function normalizeClickTarget(target) {
  const element = target?.closest?.("a, button, [role='button'], input, select, textarea, summary, [data-analytics-label]");
  if (!element) return "page";

  const explicitLabel = element.getAttribute("data-analytics-label");
  if (explicitLabel) return explicitLabel.slice(0, 180);

  if (element instanceof HTMLAnchorElement) {
    const label = element.innerText?.trim() || element.getAttribute("aria-label") || element.href;
    return `link:${label}`.slice(0, 180);
  }

  const label = element.innerText?.trim() || element.getAttribute("aria-label") || element.getAttribute("name") || element.tagName.toLowerCase();
  return `${element.tagName.toLowerCase()}:${label}`.slice(0, 180);
}

function maxScrollPercent() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
  const scrollableHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  ) - window.innerHeight;

  if (scrollableHeight <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round(((scrollTop + window.innerHeight) / (scrollableHeight + window.innerHeight)) * 100)));
}

function postVisit(payload) {
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon(VISIT_ENDPOINT, blob)) return;
  }

  fetch(VISIT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function installVisitTracking() {
  if (!shouldTrackVisits()) return () => {};

  const startedAt = Date.now();
  const clickTargets = [];
  let clickCount = 0;
  let maxScroll = maxScrollPercent();
  let sent = false;

  const recordScroll = () => {
    maxScroll = Math.max(maxScroll, maxScrollPercent());
  };

  const recordClick = (event) => {
    clickCount += 1;
    const label = normalizeClickTarget(event.target);
    if (label && !clickTargets.includes(label) && clickTargets.length < 20) {
      clickTargets.push(label);
    }
  };

  const flush = () => {
    if (sent) return;
    sent = true;
    recordScroll();

    postVisit({
      path: `${window.location.pathname}${window.location.search}` || "/",
      referrer: document.referrer || "",
      sessionDurationMs: Date.now() - startedAt,
      maxScrollPercent: maxScroll,
      clickCount,
      clickTargets,
      platform: getPlatformLabel(),
      os: detectOperatingSystem(navigator.userAgent || "", getPlatformLabel()),
    });
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") flush();
  };

  window.addEventListener("scroll", recordScroll, { passive: true });
  window.addEventListener("click", recordClick, { capture: true, passive: true });
  window.addEventListener("pagehide", flush, { once: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    window.removeEventListener("scroll", recordScroll);
    window.removeEventListener("click", recordClick, { capture: true });
    window.removeEventListener("pagehide", flush);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}
