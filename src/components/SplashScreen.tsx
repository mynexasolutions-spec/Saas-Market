"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if we've already shown the splash screen this session
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (hasVisited) {
      setLoading(false);
      return;
    }

    sessionStorage.setItem("hasVisited", "true");

    // Lock scrolling on the body so the landing page isn't interactable/visible
    document.body.style.overflow = "hidden";

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Increment by a random amount between 1 and 2
        const increment = Math.floor(Math.random() * 2) + 1;
        return prev + increment;
      });
    }, 15);

    // Fade out after 1 seconds
    const timer1 = setTimeout(() => {
      setFading(true);
    }, 1000);

    // Completely remove from DOM
    const timer2 = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "unset";
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!loading) return null;

  return (
    <div className={`splash-screen ${fading ? "splash-fade-out" : ""}`}>
      {/* Background abstract shapes */}
      <div className="splash-background">
        <div className="splash-blob splash-blob-1"></div>
        <div className="splash-blob splash-blob-2"></div>
      </div>

      <div className="global-loader-container">
        <div className="global-loader-brand">
          <div className="global-loader-icon-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image src="/logo.png" alt="SaaS MRKT" width={38} height={38} priority style={{ objectFit: "contain" }} />
          </div>
          <div className="global-loader-text">SaaS MRKT</div>
        </div>

        <div className="global-loader-progress-wrap">
          <div className="global-loader-progress-bar">
            <div
              className="global-loader-progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="global-loader-percentage">{Math.min(progress, 100)}%</div>
        </div>
      </div>
    </div>
  );
}

