// src/components/Achievements.jsx
import React, { useEffect, useRef, useState } from 'react'
import { achievements } from '../data/achievements'

export default function Achievements() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 600 : false
  )
  const wrapperRef = useRef(null)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 600)
    window.addEventListener('resize', onResize, { passive: true })
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const total = wrapper.scrollWidth
    const half = total / 2

    let tag = document.getElementById('ach-scroll-keyframes')
    if (!tag) {
      tag = document.createElement('style')
      tag.id = 'ach-scroll-keyframes'
      document.head.appendChild(tag)
    }
    tag.textContent = `
      @keyframes achScroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-${half}px); }
      }
    `

    wrapper.style.display = 'flex'
    wrapper.style.gap = isMobile ? '0px' : '1rem'
    wrapper.style.animation = 'achScroll 15s linear infinite'
    wrapper.style.willChange = 'transform'

    const pause = () => wrapper.style.setProperty('animation-play-state', 'paused')
    const resume = () => wrapper.style.setProperty('animation-play-state', 'running')
    wrapper.addEventListener('mouseenter', pause)
    wrapper.addEventListener('mouseleave', resume)
    wrapper.addEventListener('touchstart', pause)
    wrapper.addEventListener('touchend', resume)

    return () => {
      wrapper.style.animation = ''
      wrapper.removeEventListener('mouseenter', pause)
      wrapper.removeEventListener('mouseleave', resume)
      wrapper.removeEventListener('touchstart', pause)
      wrapper.removeEventListener('touchend', resume)
    }
  }, [isMobile])

  const itemNodes = achievements.map(({ title, subtitle }, idx) => (
    <div
      key={idx}
      style={{
        flex: '0 0 auto',
        minWidth: '200px',
        padding: isMobile ? '0.1rem' : '0.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: !isMobile && idx !== 0 ? '-20px' : '0', // negative gap!
    }}
    >
      <h3
        style={{
          margin: '0 0 0.25rem',
          fontSize: '1.2rem',
          fontWeight: 800,
          color: '#111827',
          width: "100px",
          display: "block",
          textAlign: "center",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: '0.875rem',
          color: '#555',
          opacity: 0.8,
          lineHeight: 1.3,
          width: "100px",
          textAlign: 'center',
        }}
      >
        {subtitle}
      </p>
    </div>
  ))

  if (isMobile) {
    return (
      <div
        style={{
          margin: "0 auto",
          fontSize: "0.875rem",
          color: "#555",
          opacity: 0.8,
          lineHeight: 1.3,
          marginTop: '30px',
          width: "100px",
          display: "block",
          textAlign: "center",
        }}
      >
        <div ref={wrapperRef} style={{ width: '100%' }}>
          {itemNodes}
          {itemNodes}
        </div>
      </div>
    )
  }

  // DESKTOP: For absolute centering, wrap inner container in a flexbox that aligns center, and remove any fixed widths on parent containers.
  return (
    <div
      style={{
        width: '100%',
        padding: '1rem 0',
        marginTop: '-45px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',   // Center the whole grid horizontally
        alignItems: 'center',       // Center vertically (if parent allows)
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '0px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '1200px',       // Cap so grid doesn’t overgrow
          margin: '0 auto',         // Center within parent
        }}
      >
        {itemNodes}
      </div>
    </div>
  )
}