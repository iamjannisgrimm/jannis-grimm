import React from "react";
import "./AssistantsShowcase.css";

export default function AssistantsShowcase() {
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
            Focused AI characters designed to feel immediate, personal, and useful from the very first interaction.
          </p>
        </div>
      </div>
    </section>
  );
}
