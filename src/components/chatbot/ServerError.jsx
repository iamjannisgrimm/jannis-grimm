import React from 'react';

const ServerError = ({ onRetry }) => {
  return (
    <div className="server-error-container" style={{
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#fff4f4',
      borderRadius: '8px',
      marginBottom: '10px'
    }}>
      <div style={{ marginBottom: '15px', color: '#e53e3e', fontWeight: 'bold' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>Server Unavailable</span>
      </div>
      <p style={{ marginBottom: '15px', color: '#555', fontSize: '14px' }}>
        The chat service is currently unavailable. Please check your connection or try again later.
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          style={{
            backgroundColor: '#3182ce',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};

export default ServerError; 