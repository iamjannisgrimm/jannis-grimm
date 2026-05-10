import timelineData from "./timeline-data";

const BUCKET_BASE_URL =
  import.meta.env.DEV
    ? "/images"
    : "https://pub-6eb94f6bdfbf410fa3232ad37ef1deab.r2.dev";

function resolvePortfolioAsset(src) {
  if (!src || typeof src !== "string") {
    return src || "";
  }

  if (
    /^https?:\/\//.test(src) ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return src;
  }

  if (
    src.startsWith("/") ||
    src.startsWith("./") ||
    src.startsWith("../")
  ) {
    return src;
  }

  return `${BUCKET_BASE_URL}/${src.replace(/^\/+/, "")}`;
}

function normalizeProject(item) {
  return {
    ...item,
    icon: resolvePortfolioAsset(item.icon),
    image: resolvePortfolioAsset(item.image),
    backgroundImage: resolvePortfolioAsset(item.backgroundImage),
    productImage: resolvePortfolioAsset(item.productImage),
    productImageMobile: resolvePortfolioAsset(item.productImageMobile),
    appStoreBadge: resolvePortfolioAsset(item.appStoreBadge),
    techStack: Array.isArray(item.techStack)
      ? item.techStack.map((entry) => resolvePortfolioAsset(entry))
      : [],
  };
}

export function getPortfolioTimelineData() {
  const source =
    typeof window !== "undefined" &&
    Array.isArray(window.__PORTFOLIO_TIMELINE_DATA__)
      ? window.__PORTFOLIO_TIMELINE_DATA__
      : timelineData;

  return source.map((item) => normalizeProject(item));
}

export function getOrderedTimelineData() {
  return [...getPortfolioTimelineData()].reverse();
}

function findProject(projects, matcher) {
  return projects.find((project) => matcher(project)) || null;
}

export function getFeaturedStoryProjects() {
  const projects = getPortfolioTimelineData();

  const picks = [
    {
      matcher: (project) => project.title === "Flight LogBook",
      eyebrow: "The spark",
      headline: "The journey started with a tiny aviation app and a big instinct for product.",
      body:
        "What began as a focused iOS project became the pattern for everything after it: notice real behavior, design around it, and ship until the experience feels obvious.",
      accent: "#5c84ff",
      surface: "#f4f8ff",
    },
    {
      matcher: (project) => project.title === "Arizona State University",
      eyebrow: "The systems layer",
      headline: "Computer science sharpened the engineering, design, and innovation muscle at the same time.",
      body:
        "The work moved from single apps to deeper systems thinking: architecture, product framing, and the discipline to turn rough ideas into repeatable execution.",
      accent: "#901340",
      surface: "#f8eef3",
    },
    {
      matcher: (project) =>
        project.title === "Lufthansa" &&
        project.subtitle === "Software Engineer Intern",
      eyebrow: "The scale shift",
      headline: "Then came enterprise software, operational stakes, and products used in the real world.",
      body:
        "Design decisions started carrying operational weight. Reliability, maintainability, and user trust became product features, not just technical concerns.",
      accent: "#101820",
      surface: "#f3f5f7",
    },
    {
      matcher: (project) => project.title === "Synechron Inc",
      eyebrow: "The AI chapter",
      headline: "AI engineering became professional craft — delivered at enterprise scale.",
      body:
        "Production LLM systems, AI-first product features, and intelligent automation for major enterprise clients. The discipline of connecting strategy, engineering, and UX into deployed intelligence became the foundation for everything that followed.",
      accent: "#f6e228",
      surface: "#f8f8ea",
    },
    {
      matcher: (project) => project.title === "SeeMe" && project.isHero,
      eyebrow: "The current chapter",
      headline: "Everything converges: a private AI coaching network built to make real growth accessible to everyone.",
      body:
        "Sole engineer. iOS live. Multi-coach AI on a privacy-first, on-device architecture. Raising a $500K seed round at a $5M cap — and building toward a B2B platform for 232,000+ professional coaches.",
      accent: "#8cf0ff",
      surface: "#111111",
      dark: true,
    },
  ];

  return picks
    .map((pick, index) => {
      const project = findProject(projects, pick.matcher);

      if (!project) {
        return null;
      }

      const mediaSource =
        project.productImage ||
        project.image ||
        project.backgroundImage ||
        project.icon;

      return {
        ...project,
        orderLabel: `0${index + 1}`,
        mediaSource,
        eyebrow: pick.eyebrow,
        headline: pick.headline,
        body: pick.body,
        accent: pick.accent,
        surface: pick.surface,
        dark: Boolean(pick.dark),
      };
    })
    .filter(Boolean);
}

export function getProjectByMatcher(matcher) {
  return findProject(getPortfolioTimelineData(), matcher);
}
