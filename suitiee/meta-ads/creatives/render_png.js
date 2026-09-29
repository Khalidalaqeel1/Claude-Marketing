// Screenshot each {html, png, h} job to a 1080-wide PNG.
// usage: node render_png.js <jobs.json>
const { chromium } = require('playwright');
const jobs = require(require('path').resolve(process.argv[2]));
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const j of jobs) {
    await p.setViewportSize({ width: 1080, height: j.h });
    await p.goto('file://' + j.html);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: j.png });
  }
  await b.close();
  console.log('rendered', jobs.length);
})();
