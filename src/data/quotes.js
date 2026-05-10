const defaultQuotes = [
  {
    quote: "Driven by innovation and fueled by purpose, I craft exceptional solutions that elevate the human experience.",
    author: "Jannis Grimm",
  },
];

const dashboardQuotes =
  typeof window !== "undefined" && Array.isArray(window.__PORTFOLIO_QUOTE_DATA__)
    ? window.__PORTFOLIO_QUOTE_DATA__
    : null;

export const quotes = dashboardQuotes?.length ? dashboardQuotes : defaultQuotes;
