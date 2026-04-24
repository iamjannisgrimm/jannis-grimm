import React, { useMemo } from "react";
import { getPortfolioTimelineData } from "../../data/portfolio-data";
import "./AssistantsShowcase.css";

function pickAssistantProjects() {
  const projects = getPortfolioTimelineData();

  const matches = projects.filter((project) => {
    const haystack = [
      project.title,
      project.subtitle,
      project.description,
      project.secondDescription,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      haystack.includes("assistant") ||
      haystack.includes("openclaw") ||
      haystack.includes("coach")
    );
  });

  const unique = [];
  const seen = new Set();

  for (const project of matches) {
    const key = `${project.title}-${project.subtitle || ""}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(project);
  }

  const selected = unique.slice(0, 3);

  return selected.map((project, index) => ({
    id: `${project.title}-${index}`,
    eyebrow: project.date || `Assistant 0${index + 1}`,
    title: project.title || `Assistant 0${index + 1}`,
    subtitle: project.subtitle || "AI Assistant",
    body:
      project.description ||
      project.secondDescription ||
      "Designed to feel immediate, personal, and useful from the first interaction.",
    image:
      project.productImageMobile ||
      project.productImage ||
      project.image ||
      project.icon ||
      "",
    accent:
      index === 0 ? "#111111" : index === 1 ? "#3a6cff" : "#0ea56d",
  }));
}

function AssistantPhone({ assistant }) {
  return (
    <article
      className="assistants-showcase__card"
      data-page-snap="card"
      data-snap-anchor="center"
    >
      <div className="assistants-showcase__phone">
        <div className="assistants-showcase__phoneNotch" />
        <div className="assistants-showcase__phoneScreen">
          {assistant.image ? (
            <img
              className="assistants-showcase__phoneImage"
              src={assistant.image}
              alt={assistant.title}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              className="assistants-showcase__phoneFallback"
              style={{ background: assistant.accent }}
            >
              <span>{assistant.title}</span>
            </div>
          )}
        </div>
      </div>

      <div className="assistants-showcase__copy">
        <p className="assistants-showcase__eyebrow">{assistant.eyebrow}</p>
        <h3 className="assistants-showcase__title">{assistant.title}</h3>
        <p className="assistants-showcase__subtitle">{assistant.subtitle}</p>
        <p className="assistants-showcase__body">{assistant.body}</p>
      </div>
    </article>
  );
}

export default function AssistantsShowcase() {
  const assistants = useMemo(() => pickAssistantProjects(), []);

  return (
    <section className="assistants-showcase">
      <div
        className="assistants-showcase__hero"
        data-page-snap="card"
        data-snap-anchor="center"
      >
        <div className="assistants-showcase__heroInner">
          <p className="assistants-showcase__label">Next up</p>
          <h2 className="assistants-showcase__headline">Meet My Assistants</h2>
          <p className="assistants-showcase__lede">
            Three focused AI characters, each presented like a product on its own.
          </p>
        </div>
      </div>

      <div className="assistants-showcase__rail">
        {assistants.map((assistant) => (
          <AssistantPhone key={assistant.id} assistant={assistant} />
        ))}
      </div>
    </section>
  );
}
