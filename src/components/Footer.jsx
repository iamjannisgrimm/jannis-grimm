import { navigateTo } from '../lib/navigation';

const Footer = () => {
  return (
    <footer className="portfolio-footer" data-mobile-chrome-color="#0d1117" style={{
      width: "100vw",
      backgroundColor: "#0d1117",
      padding: "44px 0 calc(52px + env(safe-area-inset-bottom, 0px))",
      marginTop: "0px",
      marginLeft: "calc(50% - 50vw)",
      marginRight: "calc(50% - 50vw)",
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
        marginBottom: "2px",
        fontFamily: "SF Pro, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontSize: "14px"
      }}>
        
        <nav
          aria-label="Footer links"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "22px",
            marginBottom: "12px",
            flexWrap: "wrap"
          }}
        >
          <a 
            href="https://www.linkedin.com/in/iamjannisgrimm" 
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "white",
              textDecoration: "none",
              opacity: 0.8,
              transition: "opacity 0.2s ease",
              fontSize: "14px",
              fontFamily: "SF Pro"
            }}
            onMouseOver={(e) => e.target.style.opacity = "1"}
            onMouseOut={(e) => e.target.style.opacity = "0.8"}
          >
            LinkedIn
          </a>

          <a 
            href="mailto:iamjannisgrimm@gmail.com" 
            style={{
              color: "white",
              textDecoration: "none",
              opacity: 0.8,
              transition: "opacity 0.2s ease",
              fontSize: "14px",
              fontFamily: "SF Pro"
            }}
            onMouseOver={(e) => e.target.style.opacity = "1"}
            onMouseOut={(e) => e.target.style.opacity = "0.8"}
          >
            Email
          </a>

          <a 
            href="https://github.com/iamjannisgrimm/my-portfolio" 
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "white",
              textDecoration: "none",
              opacity: 0.8,
              transition: "opacity 0.2s ease",
              fontSize: "14px",
              fontFamily: "SF Pro"
            }}
            onMouseOver={(e) => e.target.style.opacity = "1"}
            onMouseOut={(e) => e.target.style.opacity = "0.8"}
          >
            GitHub
          </a>

          <button
            type="button"
            onClick={() => navigateTo("/timeline")}
            style={{
              color: "white",
              textDecoration: "none",
              opacity: 0.8,
              transition: "opacity 0.2s ease",
              fontSize: "14px",
              fontFamily: "SF Pro",
              background: "transparent",
              border: 0,
              padding: 0,
              cursor: "pointer"
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = "1"}
            onMouseOut={(e) => e.currentTarget.style.opacity = "0.8"}
          >
            History
          </button>

          <a
            href="./privacy.html"
            style={{
              color: "white",
              textDecoration: "none",
              opacity: 0.8,
              transition: "opacity 0.2s ease",
              fontSize: "14px",
              fontFamily: "SF Pro"
            }}
            onMouseOver={(e) => e.target.style.opacity = "1"}
            onMouseOut={(e) => e.target.style.opacity = "0.8"}
          >
            Privacy
          </a>
        </nav>

        <p style={{ 
          margin: 0, 
          fontSize: "12px",
          fontFamily: "SF Pro"
        }}>
          © {new Date().getFullYear()} Jannis Grimm. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
