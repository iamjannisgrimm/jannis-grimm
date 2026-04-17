import React, { useEffect, useState } from "react";
import { Home } from "./pages/Home";
import TimelinePage from "./pages/TimelinePage";
import TopSegmentedNav from "./components/TopSegmentedNav";
import { isTimelineRoute } from "./lib/navigation";
import "./App.css";

function getCurrentPathname() {
  if (typeof window === "undefined") {
    return "/";
  }

  const path = window.location.pathname || "/";
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function App() {
  const [pathname, setPathname] = useState(getCurrentPathname);

  useEffect(() => {
    const handleNavigation = () => {
      setPathname(getCurrentPathname());
    };

    window.addEventListener("popstate", handleNavigation);
    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: "white",
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div className="app-top-safe-scrim" aria-hidden="true" />
      <TopSegmentedNav />
      {isTimelineRoute(pathname) ? <TimelinePage /> : <Home />}
    </div>
  );
}

export default App;
