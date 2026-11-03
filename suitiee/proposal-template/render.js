// Render the Suitiee proposal template to PDF (+ optional PNG previews).
// usage: node render.js [suitiee-proposal.html] [out.pdf] [png_dir] [--data clients/x/data.json]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const argv = process.argv.slice(2), di = argv.indexOf('--data');
  const data = di >= 0 ? argv.splice(di, 2)[1] : null;
  const [src = 'suitiee-proposal.html', out = 'suitiee-proposal.pdf', pngDir] = argv;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1952, height: 1200 } });
  if (data) await page.addInitScript(`window.__PROPOSAL = ${fs.readFileSync(data, 'utf8')};`);
  await page.goto('file://' + path.resolve(src), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: out, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
  if (pngDir) {
    fs.mkdirSync(pngDir, { recursive: true });
    await page.setViewportSize({ width: 1920, height: 1080 });
    const slides = await page.$$('.slide');
    for (let i = 0; i < slides.length; i++) {
      await slides[i].screenshot({ path: path.join(pngDir, `slide-${String(i + 1).padStart(2, '0')}.png`) });
    }
  }
  await browser.close();
  console.log('wrote', out);
})();
