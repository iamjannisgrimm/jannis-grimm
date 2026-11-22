import { useEffect, useMemo, useState } from "react";
import { usePortfolioContent } from "../lib/portfolio-content";

const DEFAULT_QUOTES = [
  {
    quote: "Driven by innovation and fueled by purpose, I craft exceptional solutions that elevate the human experience.",
    author: "Jannis Grimm",
  },
];

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

export default function Quotes() {
    const publishedQuotes = usePortfolioContent("__PORTFOLIO_QUOTE_DATA__");
    const visibleQuotes = useMemo(() => normalizeQuotes(publishedQuotes), [publishedQuotes]);
    const [isMobile, setIsMobile] = useState(
      typeof window !== "undefined" ? window.innerWidth <= 600 : false
    );
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 600);
      window.addEventListener("resize", handleResize, { passive: true });
      return () => window.removeEventListener("resize", handleResize);
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
