"use client";

import React from "react";
import Image from "next/image";

export default function ClientRelationBanner() {
  return (
    <section className="client-relation-section" id="partnership-showcase" aria-label="SaaS & Client Partnership">
      <div className="container">
        <div className="client-relation-card">
          <div className="client-relation-image-wrapper">
            <Image
              src="/images/saas-client-work-session.jpg"
              alt="SaaS specialist and client actively collaborating in front of an ultrawide monitor analyzing cloud metrics and workflow dashboards"
              width={1600}
              height={900}
              className="client-relation-image"
              priority={true}
            />

            {/* Bottom-Left Feature Paragraph Card */}
            <div className="client-relation-caption-box">
              <span className="client-relation-badge">COLLABORATIVE SUCCESS</span>
              <h3 className="client-relation-caption-title">Built Together, Scaled for Growth</h3>
              <p className="client-relation-caption-text">
                Every software solution on SaaS MRKT brings direct collaboration between your team and verified builders to guarantee successful onboarding and lasting impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
