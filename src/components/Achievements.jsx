import React, { useEffect, useRef, useState } from 'react'
import { achievements } from '../data/achievements'

export default function Achievements() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 600 : false
  )
  const wrapperRef = useRef(null)
  const [scrollWidth, setScrollWidth] = useState(0)

  // Track mobile/desktop
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 600)
    window.addEventListener('resize', onResize, { passive: true })
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Always re-measure scrollWidth for accurate animation
  useEffect(() => {
    if (!isMobile) return

    function measureWidth() {
      // Use double requestAnimationFrame for layout to settle (fixes prod jank)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (wrapperRef.current) {
            // Only half the scrollWidth, because we double the items for looping
            setScrollWidth(wrapperRef.current.scrollWidth / 2)
          }
        })
      })
    }

    measureWidth()
    window.addEventListener('resize', measureWidth)
    return () => window.removeEventListener('resize', measureWidth)
  }, [isMobile, achievements.length])

  // Set up the keyframes animation using measured scrollWidth
  useEffect(() => {
    if (!isMobile || !scrollWidth) return
    const wrapper = wrapperRef.current
    if (!wrapper) return

    // Inject or update keyframes for exact seamless loop
    let tag = document.getElementById('ach-scroll-keyframes')
    if (!tag) {
      tag = document.createElement('style')
      tag.id = 'ach-scroll-keyframes'
      document.head.appendChild(tag)
    }
    tag.textContent = `
      @keyframes achScroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-${scrollWidth}px); }
      }
    `

    wrapper.style.display = 'flex'
    wrapper.style.gap = '0px'
    wrapper.style.animation = `achScroll 6s linear infinite`
    wrapper.style.willChange = 'transform'

    return () => {
      wrapper.style.animation = ''
    }
  }, [isMobile, scrollWidth])

  // Each tile
  const itemNodes = achievements.map(({ title, subtitle }, idx) => (
    <div
      key={idx}
      style={{
        flex: '0 0 auto',
        minWidth: '180px',
        padding: isMobile ? '0.1rem' : '0.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: !isMobile && idx !== 0 ? '-20px' : '0',
      }}
    >
      <h3 style={{
        margin: '0 0 0.25rem',
        fontSize: '1.2rem',
        fontWeight: 800,
        color: '#111827',
        width: "100px",
        display: "block",
        textAlign: "center",
      }}>
        {title}
      </h3>
      <p style={{
        margin: 0,
        fontSize: '0.875rem',
        color: '#555',
        opacity: 0.8,
        lineHeight: 1.3,
        width: "100px",
        textAlign: 'center',
      }}>
        {subtitle}
      </p>
    </div>
  ))

  // MOBILE: Double the items for a seamless infinite scroll
  if (isMobile) {
    return (
      <div
        style={{
          margin: "0 auto",
          fontSize: "0.875rem",
          color: "#555",
          opacity: 0.8,
          lineHeight: 1.3,
          marginTop: '0px',
          marginBottom: '30px',
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

  // DESKTOP: Centered grid as usual
  return (
    <div
      style={{
        width: '100%',
        padding: '1rem 0',
        marginTop: '0px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '0px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {itemNodes}
      </div>
    </div>
  )
}