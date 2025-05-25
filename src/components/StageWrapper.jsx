import React from 'react';

/**
 * Wrapper component for stage sections in the StagedScroll component
 * Provides consistent styling and navigation hints
 */
const StageWrapper = ({ 
  children, 
  isActive, 
  stageIndex, 
  totalStages,
  bgColor = "#ffffff",
  maxWidth = "700px"
}) => {
  // Define the pulse animation
  const pulseKeyframes = `
    @keyframes pulse {
      0% {
        opacity: 0.7;
        transform: translateX(-50%) translateY(0);
      }
      50% {
        opacity: 1;
        transform: translateX(-50%) translateY(5px);
      }
      100% {
        opacity: 0.7;
        transform: translateX(-50%) translateY(0);
      }
    }
  `;
  
  return (
    <section className="stage-section" style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: bgColor,
      position: "relative",
      overflow: "hidden"
    }}>
      <div className="stage-content" style={{
        width: "100%",
        maxWidth: maxWidth,
        padding: "0 20px",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 2
      }}>
        {children}
        
        {/* Navigation hints - only shown when the stage is active */}
        {isActive && (
          <>
            {/* Up indicator - show only if not the first stage */}
            {stageIndex > 0 && (
              <div 
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: 0.7
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
                <div style={{ fontSize: '14px', marginTop: '4px' }}>
                  {stageIndex === 1 ? "Return to Landing Page" : "Previous Section"}
                </div>
              </div>
            )}
            
            {/* Down indicator - show only if not the last stage */}
            {stageIndex < totalStages - 1 && (
              <div 
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: 0.7,
                  animation: 'pulse 1.5s infinite ease-in-out'
                }}
              >
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                  {stageIndex === 0 ? "View Quotes" : stageIndex === 1 ? "View Skills" : "Next Section"}
                </div>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Add keyframes animation */}
      <style>{pulseKeyframes}</style>
    </section>
  );
};

export default StageWrapper; 