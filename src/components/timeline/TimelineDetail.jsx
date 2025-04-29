import React from "react";

export function TimelineDetail({ data }) {
  return (
    <div className="timeline-detail">
      {data.map((item, idx) => (
        <React.Fragment key={idx}>
          {item.title && <h4>{item.title}</h4>}
          {item.subtitle && <p className="subtitle">{item.subtitle}</p>}
          {item.body && <p>{item.body}</p>}
          {item.image && (
            <img src={item.image} alt={item.title} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}