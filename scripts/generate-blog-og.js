const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '..', 'public', 'images', 'blog');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Existing images map for posts that correspond directly to product mockups
const existingImageMap = {
  'hr-saas-comparison-2026': path.join(__dirname, '..', 'public', 'images', 'manage360.jpg'),
  'taskflow-case-study': path.join(__dirname, '..', 'public', 'images', 'taskflow.jpg'),
  'email-marketing-automation-guide': path.join(__dirname, '..', 'public', 'images', 'mailboost.jpg'),
  'saas-pricing-models-explained': path.join(__dirname, '..', 'public', 'images', 'finmate.jpg'),
  'future-of-ai-customer-support': path.join(__dirname, '..', 'public', 'images', 'supportly.jpg'),
};

// 2. Custom graphics generator for remaining posts & blog home
const customPosts = [
  {
    slug: 'top-10-saas-tools-2026',
    tag: 'BUSINESS GROWTH',
    tagBg: '#5E4BEE',
    title: 'Top 10 SaaS Tools for Growing Businesses in 2026',
    subtitle: 'Data-driven rankings of the highest ROI software stacks for modern teams',
    accent1: '#5E4BEE',
    accent2: '#8B5CF6',
    iconType: 'chart',
  },
  {
    slug: 'how-to-choose-right-saas-tool',
    tag: 'BUYER GUIDE',
    tagBg: '#2563EB',
    title: 'How to Choose the Right SaaS Tool for Your Team',
    subtitle: 'A repeatable 5-step framework: Job-to-be-done, TCO, integration & scoring',
    accent1: '#2563EB',
    accent2: '#06B6D4',
    iconType: 'guide',
  },
  {
    slug: 'saas-trends-2026',
    tag: 'INDUSTRY TRENDS',
    tagBg: '#EC4899',
    title: 'SaaS Trends to Watch in 2026',
    subtitle: 'AI-native defaults, usage-based pricing, vertical software & security shift',
    accent1: '#EC4899',
    accent2: '#F97316',
    iconType: 'trends',
  },
  {
    slug: 'saas-for-remote-teams',
    tag: 'PRODUCTIVITY',
    tagBg: '#8B5CF6',
    title: 'Best SaaS Stacks for Remote Teams in 2026',
    subtitle: 'Async-first collaboration, zero-distraction workflows & global team tools',
    accent1: '#8B5CF6',
    accent2: '#5E4BEE',
    iconType: 'remote',
  },
  {
    slug: 'securing-cloud-infrastructure',
    tag: 'SECURITY & CLOUD',
    tagBg: '#10B981',
    title: 'Best Practices for Securing Your Cloud Infrastructure',
    subtitle: 'Zero Trust architecture, SOC 2 Type II compliance & data breach prevention',
    accent1: '#10B981',
    accent2: '#06B6D4',
    iconType: 'security',
  },
  {
    slug: 'og-blog-home',
    tag: 'SAAS MRKT BLOG',
    tagBg: '#5E4BEE',
    title: 'Expert Insights, Guides & Trends for the SaaS Era',
    subtitle: 'Compare software, discover vetted tools & make smarter tech buying decisions',
    accent1: '#5E4BEE',
    accent2: '#3B82F6',
    iconType: 'home',
  }
];

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function wrapText(text, maxCharsPerLine = 32) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function getIllustration(type, accent1, accent2) {
  if (type === 'chart' || type === 'home') {
    return `
      <!-- Dashboard Mockup Card -->
      <g transform="translate(680, 110)">
        <rect width="450" height="410" rx="20" fill="#141B2D" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
        <rect width="450" height="44" rx="20" fill="#1A233A" />
        <circle cx="28" cy="22" r="6" fill="#EF4444" />
        <circle cx="48" cy="22" r="6" fill="#F59E0B" />
        <circle cx="68" cy="22" r="6" fill="#10B981" />
        <text x="96" y="27" font-family="Segoe UI, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#94A3B8">saasmrkt.com/top-10</text>
        
        <!-- KPI Card 1 -->
        <rect x="24" y="64" width="190" height="96" rx="12" fill="#1E2942" stroke="rgba(255,255,255,0.06)" />
        <text x="40" y="92" font-family="Segoe UI, sans-serif" font-size="12" fill="#94A3B8">Active Businesses</text>
        <text x="40" y="126" font-family="Segoe UI, sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF">8,420+</text>
        <text x="40" y="146" font-family="Segoe UI, sans-serif" font-size="11" font-weight="600" fill="#10B981">↑ +34% MoM</text>

        <!-- KPI Card 2 -->
        <rect x="234" y="64" width="190" height="96" rx="12" fill="#1E2942" stroke="rgba(255,255,255,0.06)" />
        <text x="250" y="92" font-family="Segoe UI, sans-serif" font-size="12" fill="#94A3B8">Verified Software</text>
        <text x="250" y="126" font-family="Segoe UI, sans-serif" font-size="28" font-weight="bold" fill="#8B5CF6">5,000+</text>
        <text x="250" y="146" font-family="Segoe UI, sans-serif" font-size="11" font-weight="600" fill="#38BDF8">★ 4.9 Rating</text>

        <!-- Chart Graphic -->
        <rect x="24" y="180" width="400" height="206" rx="12" fill="#192339" stroke="rgba(255,255,255,0.06)" />
        <path d="M 44 340 Q 110 320 180 270 T 320 220 T 404 200" fill="none" stroke="${accent1}" stroke-width="4" stroke-linecap="round" />
        <path d="M 44 340 Q 110 320 180 270 T 320 220 T 404 200 L 404 360 L 44 360 Z" fill="url(#chartGrad)" opacity="0.25" />
        <circle cx="404" cy="200" r="7" fill="#FFFFFF" stroke="${accent1}" stroke-width="3" />
        <text x="44" y="210" font-family="Segoe UI, sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF">ROI &amp; Growth Velocity</text>
        <text x="44" y="230" font-family="Segoe UI, sans-serif" font-size="11" fill="#94A3B8">Evaluated across 8 categories</text>
      </g>
    `;
  } else if (type === 'guide') {
    return `
      <!-- Guide Checklist Card -->
      <g transform="translate(680, 110)">
        <rect width="450" height="410" rx="20" fill="#141B2D" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
        <rect width="450" height="44" rx="20" fill="#1A233A" />
        <circle cx="28" cy="22" r="6" fill="#EF4444" />
        <circle cx="48" cy="22" r="6" fill="#F59E0B" />
        <circle cx="68" cy="22" r="6" fill="#10B981" />
        <text x="96" y="27" font-family="Segoe UI, sans-serif" font-size="13" font-weight="600" fill="#94A3B8">Buyer Decision Framework</text>
        
        <!-- Checklist rows -->
        <g transform="translate(24, 68)">
          <rect width="400" height="64" rx="10" fill="#1E2942" />
          <circle cx="36" cy="32" r="14" fill="#10B981" />
          <text x="31" y="37" font-family="Segoe UI, sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF">✓</text>
          <text x="66" y="28" font-family="Segoe UI, sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">1. Job-to-be-Done Defined</text>
          <text x="66" y="48" font-family="Segoe UI, sans-serif" font-size="11" fill="#94A3B8">Eliminate 80% irrelevant products</text>
        </g>

        <g transform="translate(24, 144)">
          <rect width="400" height="64" rx="10" fill="#1E2942" />
          <circle cx="36" cy="32" r="14" fill="#10B981" />
          <text x="31" y="37" font-family="Segoe UI, sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF">✓</text>
          <text x="66" y="28" font-family="Segoe UI, sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">2. Full TCO Cost Model</text>
          <text x="66" y="48" font-family="Segoe UI, sans-serif" font-size="11" fill="#94A3B8">Subscription + Onboarding + Migration</text>
        </g>

        <g transform="translate(24, 220)">
          <rect width="400" height="64" rx="10" fill="#1E2942" />
          <circle cx="36" cy="32" r="14" fill="#3B82F6" />
          <text x="31" y="37" font-family="Segoe UI, sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF">✓</text>
          <text x="66" y="28" font-family="Segoe UI, sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">3. Native API &amp; CRM Integrations</text>
          <text x="66" y="48" font-family="Segoe UI, sans-serif" font-size="11" fill="#94A3B8">Zero data silos across workflow</text>
        </g>

        <g transform="translate(24, 296)">
          <rect width="400" height="84" rx="10" fill="#1E2942" stroke="${accent1}" stroke-width="1.5" />
          <text x="24" y="34" font-family="Segoe UI, sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF">Final Score: 9.6 / 10</text>
          <text x="24" y="58" font-family="Segoe UI, sans-serif" font-size="12" font-weight="600" fill="#10B981">Recommended for Modern Teams</text>
        </g>
      </g>
    `;
  } else if (type === 'security') {
    return `
      <g transform="translate(680, 110)">
        <rect width="450" height="410" rx="20" fill="#141B2D" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
        <rect width="450" height="44" rx="20" fill="#1A233A" />
        <circle cx="28" cy="22" r="6" fill="#EF4444" />
        <circle cx="48" cy="22" r="6" fill="#F59E0B" />
        <circle cx="68" cy="22" r="6" fill="#10B981" />
        <text x="96" y="27" font-family="Segoe UI, sans-serif" font-size="13" font-weight="600" fill="#94A3B8">Cloud Security Center</text>

        <!-- Big Shield Icon -->
        <g transform="translate(165, 80)">
          <circle cx="60" cy="60" r="54" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" stroke-width="3" />
          <path d="M 60 26 L 90 38 L 90 65 Q 90 92 60 102 Q 30 92 30 65 L 30 38 Z" fill="#10B981" />
          <path d="M 50 63 L 57 70 L 73 54" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </g>

        <!-- Badges -->
        <g transform="translate(35, 230)">
          <rect width="180" height="60" rx="10" fill="#1E2942" />
          <text x="20" y="28" font-family="Segoe UI, sans-serif" font-size="11" fill="#94A3B8">ARCHITECTURE</text>
          <text x="20" y="48" font-family="Segoe UI, sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">Zero Trust</text>
        </g>
        <g transform="translate(235, 230)">
          <rect width="180" height="60" rx="10" fill="#1E2942" />
          <text x="20" y="28" font-family="Segoe UI, sans-serif" font-size="11" fill="#94A3B8">COMPLIANCE</text>
          <text x="20" y="48" font-family="Segoe UI, sans-serif" font-size="14" font-weight="bold" fill="#10B981">SOC 2 Type II</text>
        </g>
        <g transform="translate(35, 305)">
          <rect width="380" height="70" rx="10" fill="#1E2942" />
          <text x="24" y="32" font-family="Segoe UI, sans-serif" font-size="12" fill="#94A3B8">ENCRYPTION PROTOCOL</text>
          <text x="24" y="55" font-family="Segoe UI, sans-serif" font-size="15" font-weight="bold" fill="#38BDF8">AES-256 + TLS 1.3 End-to-End</text>
        </g>
      </g>
    `;
  } else {
    // Trends / Remote generic illustration
    return `
      <g transform="translate(680, 110)">
        <rect width="450" height="410" rx="20" fill="#141B2D" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
        <rect width="450" height="44" rx="20" fill="#1A233A" />
        <circle cx="28" cy="22" r="6" fill="#EF4444" />
        <circle cx="48" cy="22" r="6" fill="#F59E0B" />
        <circle cx="68" cy="22" r="6" fill="#10B981" />
        <text x="96" y="27" font-family="Segoe UI, sans-serif" font-size="13" font-weight="600" fill="#94A3B8">Enterprise SaaS Intelligence</text>

        <!-- Stats Card -->
        <g transform="translate(30, 70)">
          <rect width="390" height="90" rx="12" fill="#1E2942" />
          <text x="24" y="34" font-family="Segoe UI, sans-serif" font-size="12" fill="#94A3B8">MARKET SHIFT</text>
          <text x="24" y="65" font-family="Segoe UI, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF">AI-Native Stacks</text>
          <text x="270" y="65" font-family="Segoe UI, sans-serif" font-size="26" font-weight="bold" fill="${accent1}">+142%</text>
        </g>

        <!-- Metric Bars -->
        <g transform="translate(30, 180)">
          <rect width="390" height="195" rx="12" fill="#1E2942" />
          <text x="24" y="35" font-family="Segoe UI, sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF">Key Growth Benchmarks</text>
          
          <text x="24" y="70" font-family="Segoe UI, sans-serif" font-size="12" fill="#94A3B8">Async Workflow Adoption</text>
          <rect x="24" y="80" width="340" height="10" rx="5" fill="#334155" />
          <rect x="24" y="80" width="295" height="10" rx="5" fill="${accent1}" />

          <text x="24" y="120" font-family="Segoe UI, sans-serif" font-size="12" fill="#94A3B8">Usage-Based Pricing Models</text>
          <rect x="24" y="130" width="340" height="10" rx="5" fill="#334155" />
          <rect x="24" y="130" width="270" height="10" rx="5" fill="${accent2}" />

          <text x="24" y="165" font-family="Segoe UI, sans-serif" font-size="11" font-weight="600" fill="#10B981">Verified by SaaS MRKT Benchmark Dataset</text>
        </g>
      </g>
    `;
  }
}

async function generateCustomImage(post) {
  const lines = wrapText(post.title, 26);
  const titleTspans = lines.map((line, idx) => {
    return `<tspan x="70" dy="${idx === 0 ? 0 : 54}">${escapeXml(line)}</tspan>`;
  }).join('');

  const subLines = wrapText(post.subtitle, 42);
  const subTspans = subLines.map((line, idx) => {
    return `<tspan x="70" dy="${idx === 0 ? 0 : 28}">${escapeXml(line)}</tspan>`;
  }).join('');

  const illustrationSvg = getIllustration(post.iconType, post.accent1, post.accent2);

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080C14" />
      <stop offset="50%" stop-color="#0E1626" />
      <stop offset="100%" stop-color="#090E1A" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${post.accent1}" />
      <stop offset="100%" stop-color="${post.accent2}" />
    </linearGradient>
    <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${post.accent1}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="${post.accent1}" stop-opacity="0.0" />
    </linearGradient>
    <radialGradient id="glow" cx="20%" cy="30%" r="50%">
      <stop offset="0%" stop-color="${post.accent1}" stop-opacity="0.28" />
      <stop offset="100%" stop-color="${post.accent1}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glowRight" cx="80%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${post.accent2}" stop-opacity="0.22" />
      <stop offset="100%" stop-color="${post.accent2}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background Canvas -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect width="1200" height="630" fill="url(#glow)" />
  <rect width="1200" height="630" fill="url(#glowRight)" />

  <!-- Subtle Grid Pattern -->
  <g stroke="rgba(255,255,255,0.03)" stroke-width="1">
    <line x1="100" y1="0" x2="100" y2="630" />
    <line x1="300" y1="0" x2="300" y2="630" />
    <line x1="500" y1="0" x2="500" y2="630" />
    <line x1="700" y1="0" x2="700" y2="630" />
    <line x1="900" y1="0" x2="900" y2="630" />
    <line x1="1100" y1="0" x2="1100" y2="630" />
    <line x1="0" y1="100" x2="1200" y2="100" />
    <line x1="0" y1="250" x2="1200" y2="250" />
    <line x1="0" y1="400" x2="1200" y2="400" />
    <line x1="0" y1="550" x2="1200" y2="550" />
  </g>

  <!-- Left Content Area -->
  <g>
    <!-- Tag Badge -->
    <g transform="translate(70, 75)">
      <rect width="170" height="34" rx="17" fill="${post.tagBg}" fill-opacity="0.18" stroke="${post.tagBg}" stroke-width="1.5" />
      <!-- Book/Document Icon -->
      <path d="M 18 12 L 28 12 L 28 22 L 18 22 Z" fill="none" stroke="${post.tagBg}" stroke-width="1.8" />
      <text x="36" y="22" font-family="Segoe UI, -apple-system, sans-serif" font-size="12" font-weight="bold" fill="${post.tagBg}" letter-spacing="1">${escapeXml(post.tag)}</text>
    </g>

    <!-- Main Title -->
    <text x="70" y="180" font-family="Segoe UI, -apple-system, sans-serif" font-size="44" font-weight="800" fill="#FFFFFF" letter-spacing="-0.5">
      ${titleTspans}
    </text>

    <!-- Subtitle / Excerpt -->
    <text x="70" y="370" font-family="Segoe UI, -apple-system, sans-serif" font-size="18" font-weight="400" fill="#94A3B8" line-height="1.5">
      ${subTspans}
    </text>

    <!-- Footer Branding Watermark -->
    <g transform="translate(70, 520)">
      <rect width="360" height="52" rx="12" fill="#141B2D" stroke="rgba(255,255,255,0.1)" stroke-width="1.2" />
      <!-- Logo icon box -->
      <rect x="12" y="10" width="32" height="32" rx="8" fill="url(#accentGrad)" />
      <text x="21" y="32" font-family="Segoe UI, sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF">S</text>
      <!-- Brand Name -->
      <text x="56" y="28" font-family="Segoe UI, sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF">SaaS MRKT</text>
      <text x="56" y="44" font-family="Segoe UI, sans-serif" font-size="11" fill="#94A3B8">www.saasmrkt.com</text>
      <text x="240" y="33" font-family="Segoe UI, sans-serif" font-size="12" font-weight="600" fill="#10B981">● Verified Guide</text>
    </g>
  </g>

  <!-- Right Visual / Mockup Illustration -->
  ${illustrationSvg}
</svg>
`;

  const destPath = path.join(outDir, `${post.slug}.jpg`);
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 88, progressive: true })
    .toFile(destPath);
  
  const stat = fs.statSync(destPath);
  console.log(`✓ Generated ${post.slug}.jpg (${Math.round(stat.size / 1024)} KB)`);
}

async function processExistingImages() {
  for (const [slug, srcPath] of Object.entries(existingImageMap)) {
    if (fs.existsSync(srcPath)) {
      const destPath = path.join(outDir, `${slug}.jpg`);
      await sharp(srcPath)
        .resize(1200, 630, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 86, progressive: true })
        .toFile(destPath);
      
      const stat = fs.statSync(destPath);
      console.log(`✓ Processed mockup ${slug}.jpg from ${path.basename(srcPath)} (${Math.round(stat.size / 1024)} KB)`);
    } else {
      console.warn(`Source image not found: ${srcPath}`);
    }
  }
}

async function run() {
  console.log('Generating Blog OpenGraph 1200x630 banner images for WhatsApp & Social Sharing...');
  await processExistingImages();
  for (const post of customPosts) {
    await generateCustomImage(post);
  }
  console.log('Done! All 1200x630 banner images ready in public/images/blog/');
}

run().catch(console.error);
