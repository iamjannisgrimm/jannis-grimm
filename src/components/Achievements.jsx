import React from 'react'
import { achievements } from '../data/achievements'

export default function Achievements() {
  return (
    <div style={{
      width: '100%',
      padding: '1rem 0',
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
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
    </div>
  )
}
