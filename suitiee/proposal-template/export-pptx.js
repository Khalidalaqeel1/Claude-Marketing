// Export the Suitiee proposal (HTML frames) to an editable PowerPoint.
//   node export-pptx.js [suitiee-proposal.html] [suitiee-proposal.pptx] [--data clients/x/data.json]
//
// Each slide = one background image of the design art (patterns, shapes, cards)
// + live text boxes, + real pictures (right-click → Change Picture), + a native
// table for the financial study. Fonts: install assets/fonts/*.otf (Thmanyah Sans).
const { chromium } = require('playwright');
const PptxGenJS = require('pptxgenjs');
const JSZip = require('jszip');
const path = require('path');
const fs = require('fs');

const ARGV = process.argv.slice(2), DI = ARGV.indexOf('--data');
const DATA = DI >= 0 ? path.resolve(ARGV.splice(DI, 2)[1]) : null;
const SRC = path.resolve(ARGV[0] || 'suitiee-proposal.html');
const OUT = path.resolve(ARGV[1] || 'suitiee-proposal.pptx');
const PX = 144;                 // 1920px slide ↔ 13.333in  → 144 px per inch
const PT = 0.5;                 // 1px ↔ 0.5pt
const TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'suitiee-pptx-'));
const inch = v => +(v / PX).toFixed(4);

const FONT = w => w >= 800 ? ['thmanyah sans Black', false]
               : w >= 650 ? ['thmanyah sans', true]
               : w >= 450 ? ['thmanyah sans Med', false]
               : w <= 350 ? ['thmanyah sans Light', false]
               : ['thmanyah sans', false];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  if (DATA) await page.addInitScript(`window.__PROPOSAL = ${fs.readFileSync(DATA, 'utf8')};`);
  await page.goto('file://' + SRC, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);

  // ── 1. read the layout of every slide ─────────────────────────────
  const slides = await page.evaluate(() => {
    const hex = c => { const m = c.match(/\d+(\.\d+)?/g); if (!m) return '000000';
      return m.slice(0,3).map(v => (+v).toString(16).padStart(2,'0')).join('').toUpperCase(); };
    return [...document.querySelectorAll('.slide')].map((s, si) => {
      const S = s.getBoundingClientRect();
      const box = el => { const r = el.getBoundingClientRect(); return { x: r.left - S.left, y: r.top - S.top, w: r.width, h: r.height }; };
      const texts = [...s.querySelectorAll('[data-t]')].map(el => {
        const cs = getComputedStyle(el);
        const runs = [];
        const walk = n => n.childNodes.forEach(c => {
          if (c.nodeType === 3) { const tx = c.textContent.replace(/\s+/g, ' '); if (tx) {
              const p = getComputedStyle(c.parentElement);
              runs.push({ text: tx, color: hex(p.color), weight: +p.fontWeight, size: parseFloat(p.fontSize),
                          ph: !!c.parentElement.closest('.ph') }); } }
          else if (c.nodeName === 'BR') runs.push({ br: true });
          else if (c.nodeType === 1) walk(c);
        });
        walk(el);
        const fs = parseFloat(cs.fontSize);
        const lh = cs.lineHeight === 'normal' ? fs * 1.3 : parseFloat(cs.lineHeight);
        let align = cs.textAlign;
        if (align === 'start') align = cs.direction === 'rtl' ? 'right' : 'left';
        if (align === 'end') align = cs.direction === 'rtl' ? 'left' : 'right';
        const flexMid = cs.display.includes('flex') && cs.alignItems === 'center';
        if (cs.display.includes('flex') && cs.justifyContent === 'center') align = 'center';
        return { ...box(el), runs, lh, align, rtl: cs.direction === 'rtl', vert: cs.writingMode.startsWith('vertical'),
                 valign: flexMid ? 'middle' : 'top', dark: !!el.closest('.on-dark') };
      });
      const pics = [...s.querySelectorAll('[data-pic]')].map(el => {
        const cs = getComputedStyle(el), img = el.querySelector('img');
        return { ...box(el), name: el.dataset.pic, shape: el.dataset.shape, src: img ? img.getAttribute('src') : null,
                 radius: parseFloat(cs.borderTopLeftRadius) || 0, bw: parseFloat(cs.borderTopWidth) || 0, bc: hex(cs.borderTopColor) };
      });
      const imgs = [...s.querySelectorAll('[data-img]')].map(el => ({ ...box(el), src: el.getAttribute('src') }));
      return { texts, pics, imgs, table: !!s.querySelector('[data-table]'), bg: hex(getComputedStyle(s).backgroundColor) };
    });
  });
  const FIN = await page.evaluate(() => window.__FIN);

  // ── 2. snapshots: empty picture slots, then the art layer per slide ─
  const slideEls = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    for (const p of slides[i].pics) if (!p.src) {
      const el = await slideEls[i].$(`[data-pic="${p.name}"]`);
      p.file = path.join(TMP, `slot-${i}-${p.name}.png`);
      await el.screenshot({ path: p.file });
    }
  }
  await page.evaluate(() => document.documentElement.classList.add('bgonly'));
  for (let i = 0; i < slides.length; i++) {
    slides[i].bgFile = path.join(TMP, `bg-${i + 1}.jpg`);
    await slideEls[i].screenshot({ path: slides[i].bgFile, type: 'jpeg', quality: 90 });
  }
  await browser.close();

  // ── 3. build the deck ─────────────────────────────────────────────
  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'عرض تشغيل سويتي';
  pres.company = 'Suitiee';
  pres.author = 'Suitiee';
  pres.rtlMode = true;
  pres.theme = { headFontFace: 'thmanyah sans Black', bodyFontFace: 'thmanyah sans' };

  const resolve = src => path.resolve(path.dirname(SRC), src);

  slides.forEach((S, si) => {
    const slide = pres.addSlide();
    slide.background = { path: S.bgFile };

    if (S.table) { buildFinance(slide, FIN); return; }

    S.pics.forEach(p => {
      const file = p.src ? resolve(p.src) : p.file;
      const tag = ['PHOTO', p.shape, p.radius, p.bw ? p.bc : '', p.bw, p.name].join('|');
      slide.addImage({ path: file, x: inch(p.x), y: inch(p.y), w: inch(p.w), h: inch(p.h),
        sizing: { type: 'cover', w: inch(p.w), h: inch(p.h) }, objectName: tag,
        altText: 'صورة قابلة للاستبدال: زر الفأرة الأيمن ← تغيير الصورة' });
    });
    S.imgs.forEach(m => slide.addImage({ path: resolve(m.src), x: inch(m.x), y: inch(m.y), w: inch(m.w), h: inch(m.h), objectName: 'Suitiee logo', altText: 'Suitiee' }));

    S.texts.forEach(T => {
      // runs → pptx text array; trim spaces around line breaks
      const parts = []; let line = [];
      const flush = (last) => {
        if (line.length) { line[0].text = line[0].text.replace(/^\s+/, ''); line[line.length-1].text = line[line.length-1].text.replace(/\s+$/, ''); }
        line = line.filter(r => r.text);
        if (!line.length) line = [{ text: ' ', color: '000000', weight: 400, size: 20 }];
        line.forEach((r, k) => parts.push({ r, brk: !last && k === line.length - 1 }));
        line = [];
      };
      T.runs.forEach(r => { if (r.br) flush(false); else line.push({ ...r }); });
      flush(true);
      const runs = parts.map(({ r, brk }) => {
        const [face, bold] = FONT(r.weight);
        const o = { fontFace: face, bold, fontSize: +(r.size * PT).toFixed(1), color: r.color, breakLine: brk,
                    rtlMode: T.rtl, lang: T.rtl ? 'ar-SA' : 'en-US' };
        return { text: r.text, options: o };
      });
      // a little slack so PowerPoint's line breaking never wraps earlier than the browser did
      const slack = T.vert ? 0 : T.w * 0.035;
      let x = T.x, w = T.w + slack;
      if (T.align === 'right') x -= slack; else if (T.align === 'center') x -= slack / 2;
      let y = T.y, h = T.h;
      if (T.vert) { h += 24; y -= 12; }
      slide.addText(runs, { x: inch(Math.max(0, x)), y: inch(y), w: inch(w), h: inch(h), margin: 0,
        align: T.align, valign: T.valign, lineSpacing: +(T.lh * PT).toFixed(1), fit: 'none', wrap: true,
        rtlMode: T.rtl, vert: T.vert ? 'vert' : undefined, isTextBox: true, paraSpaceBefore: 0, paraSpaceAfter: 0 });
    });
  });

  // financial study: rounded sheet + title bar + native table
  function buildFinance(slide, F) {
    const X = 56, Y = 28, W = 1808, H = 1024, TB = 84;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: inch(X), y: inch(Y), w: inch(W), h: inch(H), rectRadius: inch(22),
      fill: { color: 'FFFFFF' }, line: { type: 'none' }, shadow: { type: 'outer', color: '2B1D14', opacity: 0.18, blur: 24, offset: 8, angle: 90 }, objectName: 'Sheet' });
    slide.addShape(pres.shapes.ROUND_2_SAME_RECTANGLE, { x: inch(X), y: inch(Y), w: inch(W), h: inch(TB), rectRadius: inch(22), fill: { color: '2B1D14' }, line: { type: 'none' }, objectName: 'Title bar' });
    slide.addImage({ path: resolve('assets/logo/suitiee-mark-light.png'), x: inch(X + W - 30 - 43), y: inch(Y + 16), w: inch(43), h: inch(52), objectName: 'Suitiee logo', altText: 'Suitiee' });
    slide.addText(F.title, { x: inch(X + 300), y: inch(Y), w: inch(W - 600), h: inch(TB), margin: 0, align: 'center', valign: 'middle',
      fontFace: 'thmanyah sans Black', fontSize: 22, color: 'FCF7EF', rtlMode: true, lang: 'ar-SA', isTextBox: true });
    slide.addText('suitiee.com', { x: inch(X + 34), y: inch(Y), w: inch(300), h: inch(TB), margin: 0, align: 'left', valign: 'middle',
      fontFace: 'thmanyah sans Med', fontSize: 11, color: 'C9BCAD', isTextBox: true });

    const SC = ['8A6A52', 'C2703D', 'E0A33D'];            // scenario bar colours (المتحفظ، متوازن، متفائل)
    const LINE = { type: 'solid', pt: 0.5, color: 'EFE7DA' }, NONE = { type: 'none' };
    const base = { fontFace: 'thmanyah sans', fontSize: 14, color: '2B1D14', valign: 'middle', rtlMode: true, lang: 'ar-SA', margin: [0, 0.09, 0, 0.09] };
    const rows = [], heights = [];
    const RH = F.rh || 44, NUMW = 320, LBLW = W - 3 * NUMW;
    const sec = (label, h = 52) => { rows.push([{ text: label, options: { ...base, colspan: 4, align: 'center', fontFace: 'thmanyah sans Black', fontSize: 15, fill: { color: 'F0E6D9' }, border: [NONE, NONE, NONE, NONE] } }]); heights.push(h); };
    sec(F.sec);
    let zebra = 0;
    F.rows.forEach(r => {
      if (r.kind === 'sec') { sec(r.label); zebra = 0; return; }
      const head = r.kind === 'head', bold = r.kind === 'bold', tot = r.kind === 'tot' || r.kind === 'mo', net = r.kind === 'net';
      const fill = net ? '2B1D14' : bold ? 'F6E4D8' : (head || tot) ? 'FFFFFF' : (zebra++ % 2 ? 'FBF8F3' : 'FFFFFF');
      const face = (head || bold || net) ? 'thmanyah sans Black' : tot ? 'thmanyah sans' : 'thmanyah sans';
      const size = net ? 17 : 14;
      const top = r.kind === 'tot' ? { type: 'solid', pt: 1, color: '2B1D14' } : NONE;
      const cells = [];
      for (let vi = 2; vi >= 0; vi--) {                      // visual order: left → right = متفائل … المتحفظ
        cells.push({ text: r.vals[vi] ?? '', options: { ...base, fontFace: face, bold: tot, fontSize: size, align: head ? 'center' : 'right', rtlMode: head, lang: head ? 'ar-SA' : 'en-US',
          color: net ? 'FFFFFF' : '2B1D14', fill: { color: fill },
          border: [top, { type: 'solid', pt: 3, color: SC[vi] }, net ? NONE : LINE, NONE], margin: [0, 0.1, 0, 0.1] } });
      }
      cells.push({ text: r.label, options: { ...base, fontFace: face, bold: tot, fontSize: size, align: 'right', color: net ? 'F0B48C' : '2B1D14',
        fill: { color: fill }, border: [top, NONE, net ? NONE : LINE, NONE] } });
      rows.push(cells); heights.push(head ? 56 : net ? 66 : RH);
    });
    rows.push([
      { text: F.foot[1], options: { ...base, rtlMode: false, align: 'left', color: 'C2703D', fontSize: 13, colspan: 3, border: [NONE, NONE, LINE, NONE] } },
      { text: F.foot[0], options: { ...base, align: 'right', color: '5A3F2E', fontSize: 13, border: [NONE, NONE, LINE, NONE] } }]);
    heights.push(RH);
    const used = TB + heights.reduce((a, b) => a + b, 0);
    const NOTES = [].concat(F.notes || []);
    rows.push([{ text: [{ text: 'ملاحظات الدراسة', options: { fontFace: 'thmanyah sans Black', breakLine: true } },
      ...NOTES.map((n, k) => ({ text: '· ' + n, options: { breakLine: k < NOTES.length - 1 } }))],
      options: { ...base, colspan: 4, align: 'right', valign: 'top', fontSize: 13, color: '5A3F2E', margin: [0.06, 0.09, 0, 0.09], border: [NONE, NONE, NONE, NONE] } }]);
    heights.push(Math.max(60, H - used - 6));
    slide.addTable(rows, { x: inch(X), y: inch(Y + TB), w: inch(W), colW: [inch(NUMW), inch(NUMW), inch(NUMW), inch(LBLW)], rowH: heights.map(inch), objectName: 'Financial study' });
  }

  await pres.writeFile({ fileName: OUT });

  // ── 4. post-process: arch / rounded photo frames + cream borders ───
  const zip = await JSZip.loadAsync(fs.readFileSync(OUT));
  const LABEL = { 'cover-photo': 'صورة الغلاف', 'map-photo': 'صورة الموقع على الخريطة', 'property-photo': 'صورة واجهة العقار' };
  for (const f of Object.keys(zip.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f))) {
    let xml = await zip.file(f).async('string');
    xml = xml.replace(/<p:pic>[\s\S]*?<\/p:pic>/g, pic => {
      const m = pic.match(/name="PHOTO\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^"]*)"/);
      if (!m) return pic;
      const [, shape, radius, bc, bw, name] = m;
      const ext = pic.match(/<a:ext cx="(\d+)" cy="(\d+)"/);
      const minSide = ext ? Math.min(+ext[1], +ext[2]) : 1;
      let geom;
      if (shape === 'arch') geom = '<a:prstGeom prst="round2SameRect"><a:avLst><a:gd name="adj1" fmla="val 50000"/><a:gd name="adj2" fmla="val 0"/></a:avLst></a:prstGeom>';
      else { const adj = Math.min(50000, Math.round(+radius * 6350 / minSide * 100000)); // 1px = 6350 EMU on this 144px/in canvas
             geom = `<a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val ${adj}"/></a:avLst></a:prstGeom>`; }
      const ln = bc ? `<a:ln w="${Math.round(+bw * 6350)}"><a:solidFill><a:srgbClr val="${bc}"/></a:solidFill></a:ln>` : '';
      return pic.replace(/<a:prstGeom prst="rect">[\s\S]*?<\/a:prstGeom>/, geom + ln)
                .replace(/name="PHOTO\|[^"]*"/, `name="${LABEL[name] || name}"`);
    });
    zip.file(f, xml);
  }
  fs.writeFileSync(OUT, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log('wrote', OUT);
})();
