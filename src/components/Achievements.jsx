import React, { useEffect, useState } from 'react'
import { achievements } from '../data/achievements'

export default function Achievements() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const mobileTrack = [...achievements, ...achievements]

  return (
    <div style={{
      width: '100%',
      padding: '1rem 0 75px',
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <style>
        {`
          @keyframes achievements-marquee {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(-50%, 0, 0); }
          }
        `}
      </style>

      {isMobile ? (
        <div
          style={{
            width: '100%',
            overflow: 'hidden',
            padding: '0 14px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 'max-content',
              alignItems: 'stretch',
              gap: '18px',
              animation: 'achievements-marquee 18s linear infinite',
            }}
          >
            {mobileTrack.map(({ title, subtitle }, idx) => (
              <div
                key={`${title}-${subtitle}-${idx}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '148px',
                  padding: '0 6px',
                  flexShrink: 0,
                }}
              >
                <h3 style={{
                  margin: '0 0 4px',
                  fontSize: '1.55rem',
                  fontWeight: 800,
                  color: '#111827',
                  textAlign: 'center',
                  letterSpacing: '-0.5px',
                  whiteSpace: 'nowrap',
                }}>
                  {title}
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '0.8rem',
                  color: '#666',
                  textAlign: 'center',
                  lineHeight: 1.25,
                  whiteSpace: 'nowrap',
                }}>
                  {subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          gap: '40px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '800px',
          padding: '0 24px',
          boxSizing: 'border-box',
        }}>
          {achievements.map(({ title, subtitle }, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '100px',
            }}>
              <h3 style={{
                margin: '0 0 4px',
                fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
                fontWeight: 800,
                color: '#111827',
                textAlign: 'center',
                letterSpacing: '-0.5px',
              }}>
                {title}
              </h3>
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                color: '#666',
                textAlign: 'center',
                lineHeight: 1.3,
              }}>
                {subtitle}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
