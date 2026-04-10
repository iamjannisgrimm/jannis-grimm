import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      width: "100vw",
      backgroundColor: "#2A2A2A",
      padding: "40px 0", // Slightly reduced padding
      marginTop: "0px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        maxWidth: "1200px",
        width: "100%",
        padding: "0 0px",
        textAlign: "center",
        color: "white",
        marginBottom: "10px",
        fontFamily: "SF Pro, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontSize: "14px" // Made text slightly smaller
      }}>
        
        {/* Added LinkedIn Link */}
        <a 
          href="https://www.linkedin.com/in/iamjannisgrimm" 
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "white",
            textDecoration: "none",
            marginBottom: "12px",
            display: "block",
            opacity: 0.8,
            transition: "opacity 0.2s ease",
            fontSize: "14px",
            fontFamily: "SF Pro"
          }}
          onMouseOver={(e) => e.target.style.opacity = "1"}
          onMouseOut={(e) => e.target.style.opacity = "0.8"}
        >
          Connect on LinkedIn
        </a>

        <a 
          href="mailto:iamjannisgrimm@gmail.com" 
          style={{
            color: "white",
            textDecoration: "none",
            marginBottom: "12px",
            display: "block",
            opacity: 0.8,
            transition: "opacity 0.2s ease",
            fontSize: "14px",
            fontFamily: "SF Pro"
          }}
          onMouseOver={(e) => e.target.style.opacity = "1"}
          onMouseOut={(e) => e.target.style.opacity = "0.8"}
        >
          iamjannisgrimm@gmail.com
        </a>

        <a 
          href="https://github.com/iamjannisgrimm/my-portfolio" 
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "white",
            textDecoration: "none",
            marginBottom: "12px",
            display: "block",
            opacity: 0.8,
            transition: "opacity 0.2s ease",
            fontSize: "14px",
            fontFamily: "SF Pro"
          }}
          onMouseOver={(e) => e.target.style.opacity = "1"}
          onMouseOut={(e) => e.target.style.opacity = "0.8"}
        >
          View Source on my GitHub
        </a>

        <p style={{ 
          margin: 0, 
          fontSize: "12px", // Reduced footer copyright text size
          fontFamily: "SF Pro"
        }}>
          © {new Date().getFullYear()} Jannis Grimm. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;