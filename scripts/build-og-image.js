#!/usr/bin/env node
/**
 * Build pattern-reset-og.png using Puppeteer (renders Anton font correctly).
 * Sharp/librsvg does not render @font-face embedded fonts.
 */
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'og-image.html');
const pngPath = path.join(__dirname, '../images/pattern-reset-og.png');
const svgPath = path.join(__dirname, '../images/pattern-reset-og.svg');

async function build() {
  const puppeteer = require('puppeteer');
  const chromePath = process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined;
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.fonts && document.fonts.ready);
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: pngPath, type: 'png' });
  await browser.close();

  console.log('Wrote', pngPath);
}

// Also write the SVG (for reference; fonts embedded but Sharp won't render them)
const fontB64 = fs.readFileSync(path.join(__dirname, '../anton-font-base64.txt'), 'utf8').trim();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <style>
      @font-face { font-family: 'Anton'; font-style: normal; font-weight: 400;
        src: url(data:font/woff2;charset=utf-8;base64,${fontB64}) format('woff2'); }
      .brand-text { font-family: 'Anton', sans-serif; font-weight: 400; fill: #000000; }
      .tagline-text { font-family: Arial, Helvetica, sans-serif; font-weight: 500; fill: #000000; }
    </style>
  </defs>
  <rect width="1200" height="630" fill="#fffcf1"/>
  <g transform="translate(475, 80) scale(2.5)">
    <path d="M50,5 Q5,5 5,50 Q5,95 50,95 Q95,95 95,50 Q95,5 50,5" stroke="#ca0013" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M50,20 Q25,20 25,50 Q25,80 50,80 Q75,80 75,50 Q75,20 50,20" stroke="#ca0013" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M50,35 Q35,35 35,50 Q35,65 50,65 Q65,65 65,50 Q65,35 50,35" stroke="#ca0013" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="50" cy="50" r="3.5" fill="#ca0013"/>
  </g>
  <text x="600" y="458" text-anchor="middle" class="brand-text" font-size="72" letter-spacing="2">PATTERN RESET</text>
  <text x="600" y="478" text-anchor="middle" class="tagline-text" font-size="28" letter-spacing="1">Discover Your Life Pattern</text>
</svg>`;
fs.writeFileSync(svgPath, svg, 'utf8');
console.log('Wrote', svgPath);

build().catch(err => { console.error(err); process.exit(1); });
