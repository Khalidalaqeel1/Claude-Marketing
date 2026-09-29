// Render html/motion_9x16.html to PNG frames: pause every CSS animation at t and screenshot.
// usage: node render_motion.js <html> <outDir> <seconds> [fps]
const { chromium } = require('playwright');
const [html, outDir, secs, fpsArg] = process.argv.slice(2);
const fps = Number(fpsArg || 30);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + html);
  await p.evaluate(() => document.fonts.ready);
  const n = Math.round(Number(secs) * fps);
  for (let i = 0; i < n; i++) {
    const ms = (i / fps) * 1000;
    await p.evaluate((ms) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ms; }), ms);
    await p.screenshot({ path: `${outDir}/f${String(i).padStart(4, '0')}.png` });
  }
  await b.close();
  console.log('frames', n);
})();
