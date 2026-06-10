#!/usr/bin/env node
/**
 * Build images/let-it-out-og.png for Let It Out social previews (1200×630).
 */
const path = require('path');

const htmlPath = path.join(__dirname, 'let-it-out-og-image.html');
const pngPath = path.join(__dirname, '../images/let-it-out-og.png');

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
  await new Promise((r) => setTimeout(r, 500));

  await page.screenshot({ path: pngPath, type: 'png' });
  await browser.close();

  console.log('Wrote', pngPath);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
