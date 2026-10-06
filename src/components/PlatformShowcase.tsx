"use client";

import React from "react";
import Image from "next/image";

export default function PlatformShowcase() {
  return (
    <section className="platform-showcase-section" id="platform-showcase" aria-label="Platform Showcase">
      <div className="container">
        <div className="platform-showcase-card">
          <div className="platform-showcase-image-wrapper">
            <Image
              src="/images/laptop-handover.jpg"
              alt="Person handing over a laptop showing the SaaS MRKT website dashboard to a woman"
              width={1600}
              height={900}
              className="platform-showcase-image"
              priority={false}
            />

            {/* Bottom-Left Feature Paragraph Card */}
            <div className="platform-showcase-caption-box">
              <h3 className="platform-caption-title">Experience Before You Decide</h3>
              <p className="platform-caption-text">
                Explore interactive sandboxes and test verified SaaS tools with your team in real time. Compare live workflows and onboard with complete confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
