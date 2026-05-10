import React, { useEffect, useState } from "react";

const DEFAULT_QUOTES = [
  {
    quote: "Driven by innovation and fueled by purpose, I craft exceptional solutions that elevate the human experience.",
    author: "Jannis Grimm",
  },
];

const DASHBOARD_QUOTE_ENDPOINT = "https://dashboard.iamjannisgrimm.com/api/content?key=hero_quote";

function normalizeQuotes(items) {
  if (!Array.isArray(items)) {
    return DEFAULT_QUOTES;
  }

  const normalized = items
    .map((item) => ({
      quote: typeof item?.quote === "string" ? item.quote : "",
      author: typeof item?.author === "string" ? item.author : "Jannis Grimm",
    }))
    .filter((item) => item.quote.trim());

  return normalized.length ? normalized : DEFAULT_QUOTES;
}

function getInitialQuotes() {
  if (
    typeof window !== "undefined" &&
    Array.isArray(window.__PORTFOLIO_QUOTE_DATA__)
  ) {
    return normalizeQuotes(window.__PORTFOLIO_QUOTE_DATA__);
  }

  return DEFAULT_QUOTES;
}

function parseDashboardQuote(body) {
  try {
    return normalizeQuotes([JSON.parse(body)]);
  } catch {
    return DEFAULT_QUOTES;
  }
}

// Simple component with no fancy animations
export default function Quotes() {
    const [visibleQuotes, setVisibleQuotes] = useState(getInitialQuotes);
    const [isMobile, setIsMobile] = useState(
      typeof window !== "undefined" ? window.innerWidth <= 600 : false
    );
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 600);
      window.addEventListener("resize", handleResize, { passive: true });
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
      if (
        typeof window !== "undefined" &&
        Array.isArray(window.__PORTFOLIO_QUOTE_DATA__)
      ) {
        setVisibleQuotes(normalizeQuotes(window.__PORTFOLIO_QUOTE_DATA__));
        return;
      }

      let isMounted = true;

      fetch(DASHBOARD_QUOTE_ENDPOINT)
        .then((response) => (response.ok ? response.json() : null))
        .then((payload) => {
          if (!isMounted || typeof payload?.body !== "string") {
            return;
          }

          setVisibleQuotes(parseDashboardQuote(payload.body));
        })
        .catch(() => {
          // Keep the bundled fallback if the dashboard content is unavailable.
        });

      return () => {
        isMounted = false;
      };
    }, []);
  
    return (
        <div
          className="quotes-container"
          style={{
            width: "100%",
            maxWidth: 600,
            paddingLeft: "10px",
            paddingRight: "10px",
            boxSizing: "border-box",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "0px",
            marginTop: isMobile ? "40px" : "48px",
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "2rem" : "1.5rem",
            alignItems: "center",
          }}
        >
          {visibleQuotes.map(({ quote, author }, idx) => (
            <div
              key={idx}
              style={{
                width: "100%",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#22223b",
                  lineHeight: 1.6,
                  marginBottom: "0.65rem",
                  fontStyle: "italic",
                }}
              >
                {quote}
              </div>
              <div
                style={{
                  fontSize: "1rem",
                  color: "#7a7a89",
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                — {author}
              </div>
            </div>
          ))}
        </div>
      );
  }
