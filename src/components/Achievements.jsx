import React, { useEffect, useMemo, useState } from 'react'
import { achievements } from '../data/achievements'

const WORK_CONTRIBUTION_OFFSET = 2500

const formatMonthlyCommits = (githubContributionTotal) => {
  if (typeof githubContributionTotal !== 'number') {
    return '...'
  }

  const monthlyCommits = (githubContributionTotal + WORK_CONTRIBUTION_OFFSET) / 12
  return `${(Math.round(monthlyCommits / 10) * 10).toLocaleString('en-US')}+`
}

export default function Achievements({ githubContributionTotal }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const stats = useMemo(() => {
    const commitsPerMonth = {
      title: formatMonthlyCommits(githubContributionTotal),
      subtitle: 'Commits per Month',
    }

    const experienceIndex = achievements.findIndex(({ subtitle }) => subtitle === 'Years of Experience')

    if (experienceIndex === -1) {
      return [...achievements, commitsPerMonth]
    }

    return [
      ...achievements.slice(0, experienceIndex + 1),
      commitsPerMonth,
      ...achievements.slice(experienceIndex + 1),
    ]
  }, [githubContributionTotal])

  const mobileTrack = [...stats, ...stats]
  const desktopTrack = [...stats, ...stats]

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
          .achievements-desktop-viewport {
            --achievement-gap: 32px;
            position: relative;
            width: min(100%, 760px);
            overflow: hidden;
            padding: 0 24px;
            box-sizing: border-box;
          }
          .achievements-fade-viewport {
            --achievement-fade-width: 58px;
            position: relative;
            -webkit-mask-image: linear-gradient(
              90deg,
              transparent 0,
              #000 var(--achievement-fade-width),
              #000 calc(100% - var(--achievement-fade-width)),
              transparent 100%
            );
            mask-image: linear-gradient(
              90deg,
              transparent 0,
              #000 var(--achievement-fade-width),
              #000 calc(100% - var(--achievement-fade-width)),
              transparent 100%
            );
          }
          .achievements-fade-viewport::before,
          .achievements-fade-viewport::after {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            width: 58px;
            z-index: 2;
            pointer-events: none;
          }
          .achievements-fade-viewport::before {
            left: 0;
            background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
          }
          .achievements-fade-viewport::after {
            right: 0;
            background: linear-gradient(270deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
          }
          .achievements-desktop-track {
            display: flex;
            width: max-content;
            align-items: stretch;
            gap: var(--achievement-gap);
            animation: achievements-marquee 18s linear infinite;
          }
          .achievements-desktop-card {
            flex: 0 0 calc((min(100vw, 760px) - 48px - (var(--achievement-gap) * 3)) / 4);
            max-width: calc((760px - 48px - (var(--achievement-gap) * 3)) / 4);
          }
          @media (max-width: 768px) {
            .achievements-fade-viewport {
              --achievement-fade-width: 54px;
            }
            .achievements-fade-viewport::before,
            .achievements-fade-viewport::after {
              width: 54px;
            }
          }
        `}
      </style>

      {isMobile ? (
        <div
          className="achievements-fade-viewport"
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
              gap: '10px',
              animation: 'achievements-marquee 13.5s linear infinite',
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
                  minWidth: '136px',
                  padding: '0 4px',
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
        <div className="achievements-desktop-viewport achievements-fade-viewport">
          <div className="achievements-desktop-track">
            {desktopTrack.map(({ title, subtitle }, idx) => (
              <div key={`${title}-${subtitle}-${idx}`} className="achievements-desktop-card" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
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
                  whiteSpace: 'nowrap',
                }}>
                  {subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
