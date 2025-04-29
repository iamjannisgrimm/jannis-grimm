import React from 'react';

export const TimelineDetail = ({ 
  data, 
  titleFontSize = '24px', 
  subtitleFontSize = '22px', 
  bodyFontSize = '18px' 
}) => {
  return (
    <div style={{ padding: '20px', textAlign: 'left' }}>
      {data.map((item, index) => (
        <div key={index} style={{ marginBottom: '40px', textAlign: 'left' }}>
          {item.title && (
            <h2
              style={{
                marginBottom: '10px',
                fontFamily: 'SF Pro',
                fontWeight: 700,
                textAlign: 'left',
                fontSize: titleFontSize,
              }}
            >
              {item.title}
            </h2>
          )}
          {item.subtitle && (
            <h3
              style={{
                marginBottom: '10px',
                fontFamily: 'SF Pro',
                fontWeight: 600,
                textAlign: 'left',
                fontSize: subtitleFontSize,
              }}
            >
              {item.subtitle}
            </h3>
          )}
          {item.body && (
            <p
              style={{
                marginBottom: '10px',
                maxWidth: "min(850px, 90vw)",

                fontFamily: 'SF Pro',
                fontWeight: 400,
                textAlign: 'left',
                fontSize: bodyFontSize,
              }}
            >
              {item.body}
            </p>
          )}
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              style={{
                maxWidth: "min(650px, 70vw)",
                height: 'auto',
                borderRadius: '8px',
                display: 'block',
                marginLeft: '0',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};