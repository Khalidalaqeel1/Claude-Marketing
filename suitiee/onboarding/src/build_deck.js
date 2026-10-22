// Suitiee team onboarding deck (Arabic, RTL) — presented by Abdullah, operations team.
// node build_deck.js <out.pptx>
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const lu = require("react-icons/lu");
const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
const { applyTheme } = require(path.join(process.env.PPTX_SKILL, "scripts/apply_theme.js"));
const { NOTES, notesText } = require("./notes.js");

const OUT = process.argv[2] || "deck.pptx";
const FONT = "IBM Plex Sans Arabic";

// Proposed visual direction: warm ivory, charcoal, bronze (no official brand file was available).
const THEME = {
  name: "Suitiee Onboarding",
  headFontFace: FONT,
  bodyFontFace: FONT,
  colors: {
    dk1: "1E1A16", // charcoal
    lt1: "FFFFFF",
    dk2: "5C534A", // warm grey, secondary text
    lt2: "F8F4EE", // warm ivory
    accent1: "93602E", // bronze
    accent2: "EFE4D4", // bronze tint
    accent3: "2E6B52", // ready / green
    accent4: "D4AE7E", // light bronze, for dark slides
    accent5: "E3D9CB", // hairline / border
    accent6: "A9472A", // exception / rust
    hlink: "93602E",
    folHlink: "5C534A",
  },
};
const HEX = THEME.colors;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.rtlMode = true;
pres.theme = { headFontFace: FONT, bodyFontFace: FONT };
pres.title = "كيف نعمل في سويتي؟ — جلسة تعريفية للفريق";
pres.author = "عبدالله | فريق التشغيل";
pres.company = "Suitiee";
const C = pres.SchemeColor;

const W = 13.333;
const MX = 0.6;
const CW = W - 2 * MX; // content width

// ---------- layouts ----------
function frame(name, dark) {
  const ink = dark ? C.background1 : C.text1;
  const muted = dark ? C.accent4 : C.text2;
  pres.defineSlideMaster({
    title: name,
    background: { color: dark ? C.text1 : C.background2 },
    margin: [0.4, MX, 0.5, MX],
    objects: [
      { text: { text: "Suitiee", options: { x: MX, y: 0.38, w: 2.2, h: 0.4, fontFace: FONT, fontSize: 18, bold: true, color: dark ? C.accent4 : C.accent1, align: "left", margin: 0, valign: "middle" } } },
      { text: { text: "سويتي · جلسة تعريفية داخلية · فريق التشغيل", options: { x: W - MX - 6, y: 6.98, w: 6, h: 0.3, fontFace: FONT, fontSize: 10, color: muted, align: "right", rtlMode: true, margin: 0, valign: "middle" } } },
      { placeholder: { options: { name: "kicker", type: "body", x: MX + 2.6, y: 0.38, w: CW - 2.6, h: 0.36, fontFace: FONT, fontSize: 14, bold: true, color: dark ? C.accent4 : C.accent1, align: "right", rtlMode: true, margin: 0, valign: "middle" }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x: MX, y: 0.78, w: CW, h: 0.8, fontFace: FONT, fontSize: 32, bold: true, color: ink, align: "right", rtlMode: true, margin: 0, valign: "middle" }, text: "" } },
    ],
    slideNumber: { x: MX, y: 6.98, w: 0.6, h: 0.3, fontFace: FONT, fontSize: 10, color: muted, align: "left", margin: 0 },
  });
}
frame("CONTENT", false);
frame("CONTENT_DARK", true);
pres.defineSlideMaster({
  title: "COVER",
  background: { color: C.text1 },
  objects: [
    { text: { text: "Suitiee", options: { x: MX, y: 0.5, w: 3, h: 0.5, fontFace: FONT, fontSize: 24, bold: true, color: C.accent4, align: "left", margin: 0, valign: "middle" } } },
    { placeholder: { options: { name: "title", type: "title", x: 5.0, y: 1.95, w: W - MX - 5.0, h: 1.25, fontFace: FONT, fontSize: 52, bold: true, color: C.background1, align: "right", rtlMode: true, margin: 0, valign: "middle" }, text: "" } },
    { placeholder: { options: { name: "subtitle", type: "body", x: 5.0, y: 3.25, w: W - MX - 5.0, h: 0.7, fontFace: FONT, fontSize: 24, color: C.accent2, align: "right", rtlMode: true, margin: 0, valign: "top" }, text: "" } },
  ],
});

// ---------- helpers ----------
const iconCache = {};
async function iconPng(name, hex) {
  const key = name + hex;
  if (!iconCache[key]) {
    const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(lu[name], { color: "#" + hex, size: 256, strokeWidth: 1.75 }));
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    iconCache[key] = "image/png;base64," + buf.toString("base64");
  }
  return iconCache[key];
}

function T(slide, text, x, y, w, h, o = {}) {
  slide.addText(text, {
    x, y, w, h,
    fontFace: FONT, fontSize: 16, color: C.text1,
    align: "right", rtlMode: true, lang: "ar-SA",
    valign: "top", margin: 0, isTextBox: true,
    ...o,
  });
}
function box(slide, x, y, w, h, o = {}) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: o.r ?? 0.12,
    fill: { color: o.fill ?? C.background1, transparency: o.transparency ?? 0 },
    line: o.line ? { color: o.line, width: o.lineW ?? 1, dashType: o.dash ?? "solid" } : { type: "none" },
    objectName: o.name,
  });
}
function circle(slide, cx, cy, d, fill, o = {}) {
  slide.addShape(pres.shapes.OVAL, {
    x: cx - d / 2, y: cy - d / 2, w: d, h: d,
    fill: { color: fill, transparency: o.transparency ?? 0 },
    line: o.line ? { color: o.line, width: o.lineW ?? 1.25, dashType: o.dash ?? "solid" } : { type: "none" },
    objectName: o.name,
  });
}
async function icon(slide, name, cx, cy, size, hex) {
  slide.addImage({ data: await iconPng(name, hex), x: cx - size / 2, y: cy - size / 2, w: size, h: size, altText: name });
}
async function iconDisc(slide, name, cx, cy, d, fill, iconHex) {
  circle(slide, cx, cy, d, fill);
  await icon(slide, name, cx, cy, d * 0.52, iconHex);
}
function num(slide, n, cx, cy, d, fill, color, size) {
  circle(slide, cx, cy, d, fill);
  slide.addText(String(n), { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fontFace: FONT, fontSize: size ?? 16, bold: true, color, align: "center", valign: "middle", margin: 0, isTextBox: true });
}
// arrow pointing left (RTL flow) from xRight to xLeft
function arrowLeft(slide, xLeft, xRight, y, color, width = 1.75) {
  slide.addShape(pres.shapes.LINE, { x: xLeft, y, w: xRight - xLeft, h: 0, flipH: true, line: { color, width, endArrowType: "triangle" } });
}
function arrowDown(slide, x, yTop, yBottom, color, width = 1.75) {
  slide.addShape(pres.shapes.LINE, { x, y: yTop, w: 0, h: yBottom - yTop, line: { color, width, endArrowType: "triangle" } });
}
// small label pill: kind = brief | proposed | confirm
const TAGS = {
  brief: { text: "من الإحاطة", fill: C.accent2, color: C.accent1 },
  proposed: { text: "مقترح", fill: C.background1, color: C.text2, line: C.accent5 },
  confirm: { text: "يحتاج تأكيدًا داخليًا", fill: C.background1, color: C.accent6, line: C.accent6 },
};
function pill(slide, kind, xRight, y, o = {}) {
  const t = TAGS[kind];
  const text = o.text ?? t.text;
  const w = o.w ?? Math.max(0.9, text.length * 0.085 + 0.35);
  box(slide, xRight - w, y, w, 0.32, { fill: o.fill ?? t.fill, line: t.line, r: 0.16 });
  slide.addText(text, { x: xRight - w, y, w, h: 0.32, fontFace: FONT, fontSize: 11, bold: true, color: o.color ?? t.color, align: "center", valign: "middle", rtlMode: true, margin: 0, isTextBox: true });
  return w;
}
function head(slide, kicker, title) {
  if (kicker) slide.addText(kicker, { placeholder: "kicker", rtlMode: true, align: "right" });
  slide.addText(title, { placeholder: "title", rtlMode: true, align: "right" });
}

// ---------- slides ----------
async function build() {
  // 1 — Welcome
  {
    pres.addSection({ title: "الافتتاح" });
    const s = pres.addSlide({ masterName: "COVER", sectionTitle: "الافتتاح" });
    T(s, "جلسة تعريفية داخلية للفريق", 5.0, 1.45, W - MX - 5.0, 0.4, { fontSize: 16, bold: true, color: C.accent4 });
    s.addText("كيف نعمل في سويتي؟", { placeholder: "title", rtlMode: true, align: "right" });
    s.addText("من الحجز إلى جاهزية الوحدة للضيف التالي", { placeholder: "subtitle", rtlMode: true, align: "right" });
    box(s, 5.0 + (W - MX - 5.0) - 6.2, 4.3, 6.2, 0.62, { fill: C.background1, transparency: 92, r: 0.31 });
    T(s, "وحدة جاهزة لاستقبال الضيف، في الوقت المناسب", 5.0 + (W - MX - 5.0) - 6.2 + 0.3, 4.3, 5.6, 0.62, { fontSize: 18, color: C.accent4, valign: "middle", align: "center" });
    await iconDisc(s, "LuUser", W - MX - 0.3, 5.85, 0.6, C.accent1, "FFFFFF");
    T(s, "عبدالله | فريق التشغيل", 5.0, 5.6, W - MX - 5.0 - 0.8, 0.5, { fontSize: 20, bold: true, color: C.background1, valign: "middle" });
    // cycle motif: booking → stay → departure → ready
    const cx = 2.75, cy = 4.0, r = 1.55;
    circle(s, cx, cy, r * 2, C.text1, { line: C.accent4, lineW: 1.25, dash: "dash" });
    T(s, "دورة\nكل وحدة", cx - 0.9, cy - 0.45, 1.8, 0.9, { fontSize: 16, color: C.accent4, align: "center", valign: "middle" });
    const nodes = [
      ["الحجز", 0, -1, "LuCalendarCheck"],
      ["الإقامة", -1, 0, "LuKeyRound"],
      ["المغادرة", 0, 1, "LuLogOut"],
      ["الجاهزية", 1, 0, "LuSparkles"],
    ];
    for (const [label, dx, dy, ic] of nodes) {
      const nx = cx + dx * r, ny = cy + dy * r;
      circle(s, nx, ny, 0.78, C.accent1);
      await icon(s, ic, nx, ny, 0.4, "FFFFFF");
      const ly = dy === 1 ? ny + 0.45 : dy === -1 ? ny - 0.8 : ny + 0.45;
      T(s, label, nx - 0.8, ly, 1.6, 0.35, { fontSize: 14, bold: true, color: C.background1, align: "center" });
    }
    s.addNotes(notesText(0));
  }

  pres.addSection({ title: "سويتي والنشاط" });
  // 2 — What is Suitiee?
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "سويتي والنشاط" });
    head(s, "تعريف في جملة واحدة", "ما هي سويتي؟");
    T(s, "منصة لإدارة وتشغيل وحدات الإقامة قصيرة المدى، تربط الحجوزات والتواصل مع الضيوف والنظافة والصيانة، وتساعد الفريق على تجهيز كل وحدة لاستقبال الضيف في الوقت المناسب، حسب نطاق الخدمة المتفق عليه.",
      MX, 1.75, CW, 1.0, { fontSize: 20, color: C.text1 });
    const y = 3.0, h = 3.15;
    // owner (right)
    box(s, 9.73, y + 0.35, 3.0, h - 0.7, { fill: C.background1, line: C.accent5 });
    await iconDisc(s, "LuHouse", 11.23, y + 0.95, 0.75, C.accent2, HEX.accent1);
    T(s, "المالك", 9.93, y + 1.45, 2.6, 0.45, { fontSize: 20, bold: true, align: "center" });
    T(s, "يملك الوحدة ويتفق معنا على نطاق الخدمة", 9.93, y + 1.92, 2.6, 0.8, { fontSize: 15, color: C.text2, align: "center" });
    // Suitiee (center)
    box(s, 3.93, y, 5.47, h, { fill: C.text1 });
    T(s, "سويتي", 4.13, y + 0.18, 5.07, 0.45, { fontSize: 20, bold: true, color: C.accent4, align: "center" });
    const sub = [["الفريق", "ينفّذ وينسّق على أرض الواقع", "LuUsers", 6.78], ["المنصة", "تنظّم الحجوزات والمهام والمعلومات", "LuLaptop", 4.13]];
    for (const [t, d, ic, x] of sub) {
      box(s, x, y + 0.78, 2.42, 2.17, { fill: C.background1, transparency: 90 });
      await icon(s, ic, x + 1.21, y + 1.25, 0.5, HEX.accent4);
      T(s, t, x + 0.1, y + 1.6, 2.22, 0.4, { fontSize: 17, bold: true, color: C.background1, align: "center" });
      T(s, d, x + 0.15, y + 2.02, 2.12, 0.8, { fontSize: 14, color: C.accent2, align: "center" });
    }
    // guest (left)
    box(s, MX, y + 0.35, 3.0, h - 0.7, { fill: C.background1, line: C.accent5 });
    await iconDisc(s, "LuUser", MX + 1.5, y + 0.95, 0.75, C.accent2, HEX.accent1);
    T(s, "الضيف", MX + 0.2, y + 1.45, 2.6, 0.45, { fontSize: 20, bold: true, align: "center" });
    T(s, "يحجز ويتوقع وحدة جاهزة وتواصلًا واضحًا", MX + 0.2, y + 1.92, 2.6, 0.8, { fontSize: 15, color: C.text2, align: "center" });
    arrowLeft(s, 9.45, 9.7, y + h / 2, C.accent1, 2);
    arrowLeft(s, 3.63, 3.9, y + h / 2, C.accent1, 2);
    await icon(s, "LuCircleHelp", W - MX - 0.13, 6.48, 0.26, HEX.dk2);
    T(s, "الخدمات المشمولة تختلف حسب العقد المتفق عليه مع كل مالك.", MX, 6.33, CW - 0.4, 0.32, { fontSize: 13, color: C.text2, valign: "middle" });
    s.addNotes(notesText(1));
  }

  // 3 — What are short-term rentals?
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "سويتي والنشاط" });
    head(s, "أساسيات النشاط", "ما هي الإقامة قصيرة المدى؟");
    const rx = 7.13, rw = W - MX - rx;
    box(s, rx, 1.8, rw, 2.15, { fill: C.accent2 });
    T(s, "ببساطة", rx + 0.35, 2.0, rw - 0.7, 0.4, { fontSize: 15, bold: true, color: C.accent1 });
    T(s, "وحدة مفروشة يحجزها الضيف لليلة أو عدة ليالٍ، بدل عقد إيجار طويل.", rx + 0.35, 2.45, rw - 0.7, 1.3, { fontSize: 22, bold: true });
    box(s, rx, 4.2, rw, 2.25, { fill: C.text1 });
    T(s, "الحجز ليس موعدًا في التقويم فقط", rx + 0.35, 4.4, rw - 0.7, 0.45, { fontSize: 18, bold: true, color: C.background1 });
    T(s, "كل حجز يطلق سلسلة مهام:", rx + 0.35, 4.85, rw - 0.7, 0.35, { fontSize: 14, color: C.accent4 });
    const chips = ["تأكيد", "تواصل", "تجهيز", "استقبال", "متابعة", "تنظيف"];
    const cw = 0.78, gap = 0.08;
    let cx = rx + rw - 0.35;
    for (let i = 0; i < chips.length; i++) {
      box(s, cx - cw, 5.4, cw, 0.5, { fill: C.accent1, r: 0.25 });
      T(s, chips[i], cx - cw, 5.4, cw, 0.5, { fontSize: 13, bold: true, color: C.background1, align: "center", valign: "middle" });
      cx -= cw + gap;
    }
    // stakeholders (left)
    const lx = MX, lw = 6.2;
    T(s, "ثلاثة أطراف في كل إقامة", lx, 1.8, lw, 0.4, { fontSize: 16, bold: true, color: C.text2 });
    const rows = [
      ["المالك", "يملك الوحدة ويريد تشغيلًا منظمًا ووضوحًا", "LuHouse"],
      ["الضيف", "يريد وحدة نظيفة وجاهزة وتعليمات واضحة", "LuUser"],
      ["فريق التشغيل", "يحوّل كل حجز إلى مهام منسّقة", "LuUsers"],
    ];
    for (let i = 0; i < rows.length; i++) {
      const y = 2.35 + i * 1.38;
      box(s, lx, y, lw, 1.18, { fill: C.background1, line: C.accent5 });
      await iconDisc(s, rows[i][2], lx + lw - 0.65, y + 0.59, 0.72, i === 2 ? C.accent1 : C.accent2, i === 2 ? "FFFFFF" : HEX.accent1);
      T(s, rows[i][0], lx + 0.3, y + 0.18, lw - 1.55, 0.4, { fontSize: 18, bold: true });
      T(s, rows[i][1], lx + 0.3, y + 0.6, lw - 1.55, 0.4, { fontSize: 15, color: C.text2 });
    }
    s.addNotes(notesText(2));
  }

  // 4 — Daily rentals vs hotels
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "سويتي والنشاط" });
    head(s, "مقارنة متوازنة", "الإيجار اليومي والفنادق: ما الفرق؟");
    const cols = [
      { x: 9.98, w: 2.75 },
      { x: 5.33, w: 4.45 },
      { x: MX, w: 4.53 },
    ];
    const hy = 1.8;
    box(s, cols[1].x, hy, cols[1].w, 0.58, { fill: C.text1 });
    await icon(s, "LuHouse", cols[1].x + cols[1].w - 0.4, hy + 0.29, 0.32, HEX.accent4);
    T(s, "الشقق اليومية (نمط شائع)", cols[1].x + 0.2, hy, cols[1].w - 0.8, 0.58, { fontSize: 16, bold: true, color: C.background1, valign: "middle" });
    box(s, cols[2].x, hy, cols[2].w, 0.58, { fill: C.background1, line: C.text2 });
    await icon(s, "LuHotel", cols[2].x + cols[2].w - 0.4, hy + 0.29, 0.32, HEX.dk2);
    T(s, "الفنادق (نمط شائع)", cols[2].x + 0.2, hy, cols[2].w - 0.8, 0.58, { fontSize: 16, bold: true, color: C.text1, valign: "middle" });
    const rows = [
      ["الوحدة والموقع", "وحدات مستقلة، غالبًا في مبانٍ ومواقع متفرقة", "غرف في مبنى واحد مخصص للضيافة"],
      ["الاستقبال والدخول", "غالبًا دخول ذاتي أو تسليم منسّق مسبقًا", "غالبًا مكتب استقبال في الموقع"],
      ["النظافة والتجهيز", "تجهيز كامل بين كل ضيف وآخر", "غالبًا فريق تدبير داخلي بجداول منتظمة"],
      ["التواصل مع الضيف", "غالبًا عن بُعد: رسائل واتصالات", "غالبًا وجهًا لوجه عبر الاستقبال"],
      ["احتياج التنسيق", "أعلى: فرق وموردون عبر مواقع مختلفة", "داخل أقسام مبنى واحد"],
    ];
    rows.forEach((r, i) => {
      const y = 2.5 + i * 0.76;
      box(s, cols[0].x, y, cols[0].w, 0.66, { fill: C.accent2, r: 0.08 });
      T(s, r[0], cols[0].x + 0.2, y, cols[0].w - 0.4, 0.66, { fontSize: 16, bold: true, color: C.accent1, valign: "middle" });
      box(s, cols[1].x, y, cols[1].w, 0.66, { fill: C.background1, r: 0.08 });
      T(s, r[1], cols[1].x + 0.2, y, cols[1].w - 0.4, 0.66, { fontSize: 15, valign: "middle" });
      box(s, cols[2].x, y, cols[2].w, 0.66, { fill: C.background1, r: 0.08 });
      T(s, r[2], cols[2].x + 0.2, y, cols[2].w - 0.4, 0.66, { fontSize: 15, color: C.text2, valign: "middle" });
    });
    T(s, "أنماط شائعة للتوضيح وليست قواعد ثابتة؛ تختلف من وحدة ومنشأة لأخرى.", MX, 6.42, CW, 0.32, { fontSize: 13, color: C.text2, valign: "middle" });
    s.addNotes(notesText(3));
  }

  pres.addSection({ title: "كيف نعمل" });
  // 5 — What work does Suitiee connect?
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "كيف نعمل" });
    head(s, "ستة مجالات، نتيجة واحدة", "ما الأعمال التي تربطها سويتي؟");
    const hubX = W / 2, hubY = 3.95;
    const cards = [
      ["الحجوزات", "استلام الحجز والتحقق من التوفر والتأكيد", "LuCalendarCheck", false],
      ["التواصل مع الضيف", "الاستفسارات والتعليمات وموعد الوصول", "LuMessageCircle", false],
      ["الدخول والخروج", "تنسيق الوصول والمغادرة", "LuKeyRound", false],
      ["النظافة والتجهيز *", "تجهيز الوحدة بين ضيف وآخر", "LuSparkles", true],
      ["تنسيق الصيانة *", "متابعة البلاغات والإصلاحات", "LuWrench", true],
      ["حالة الوحدة والتقارير *", "حالة محدّثة وتقارير متفق عليها", "LuClipboardList", true],
    ];
    const cw = 4.35, ch = 1.22;
    for (let i = 0; i < 6; i++) {
      const right = i < 3;
      const x = right ? W - MX - cw : MX;
      const y = 1.85 + (i % 3) * 1.45;
      // connector to hub
      const ex = right ? x : x + cw;
      const ey = y + ch / 2;
      s.addShape(pres.shapes.LINE, { x: Math.min(ex, hubX), y: Math.min(ey, hubY), w: Math.abs(hubX - ex), h: Math.max(Math.abs(hubY - ey), 0.001), flipH: (hubX - ex) * (hubY - ey) < 0, line: { color: C.accent5, width: 1.25 } });
      box(s, x, y, cw, ch, { fill: C.background1, line: C.accent5 });
      await iconDisc(s, cards[i][2], x + cw - 0.6, y + ch / 2, 0.7, cards[i][3] ? C.accent2 : C.accent1, cards[i][3] ? HEX.accent1 : "FFFFFF");
      T(s, cards[i][0], x + 0.25, y + 0.17, cw - 1.4, 0.42, { fontSize: 17, bold: true });
      T(s, cards[i][1], x + 0.25, y + 0.6, cw - 1.4, 0.42, { fontSize: 14, color: C.text2 });
    }
    circle(s, hubX, hubY, 2.35, C.text1);
    await icon(s, "LuBadgeCheck", hubX, hubY - 0.55, 0.45, HEX.accent4);
    T(s, "وحدة جاهزة\nلاستقبال الضيف", hubX - 1.0, hubY - 0.2, 2.0, 0.85, { fontSize: 16, bold: true, color: C.background1, align: "center", valign: "middle" });
    box(s, MX, 6.28, CW, 0.5, { fill: C.accent2, r: 0.1 });
    T(s, "* تعتمد على العقد: قد ننفّذها مباشرة، أو ننسّقها مع مزوّد، أو لا تكون ضمن النطاق المتفق عليه.", MX + 0.25, 6.28, CW - 0.5, 0.5, { fontSize: 14, color: C.text1, valign: "middle" });
    s.addNotes(notesText(4));
  }

  // 6 — Guest & unit journey
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "كيف نعمل" });
    head(s, "من الحجز إلى الضيف التالي", "رحلة الضيف والوحدة");
    const stages = [
      ["قبل الوصول", ["استلام الحجز", "التحقق من التوفر وتأكيد الحجز", "تنسيق موعد الوصول", "التحقق من جاهزية الوحدة"]],
      ["خلال الإقامة", ["دخول الضيف", "دعم الضيف خلال الإقامة"]],
      ["بعد المغادرة", ["تأكيد المغادرة", "فحص ونظافة وصيانة عند الحاجة", "جاهزة للضيف التالي"]],
    ];
    const pw = 3.83, gap = 0.32, py = 1.8, ph = 4.4;
    let n = 1;
    for (let k = 0; k < 3; k++) {
      const x = W - MX - pw - k * (pw + gap);
      box(s, x, py, pw, ph, { fill: k === 1 ? C.accent2 : C.background1, line: k === 1 ? undefined : C.accent5 });
      num(s, k + 1, x + pw - 0.45, py + 0.42, 0.5, C.text1, C.background1, 15);
      T(s, stages[k][0], x + 0.2, py + 0.17, pw - 1.05, 0.5, { fontSize: 19, bold: true, valign: "middle" });
      stages[k][1].forEach((st, j) => {
        const y = py + 0.95 + j * 0.84;
        const last = n === 9;
        box(s, x + 0.18, y, pw - 0.36, 0.7, { fill: last ? C.accent3 : (k === 1 ? C.background1 : C.background2), r: 0.1 });
        num(s, n, x + pw - 0.55, y + 0.35, 0.42, last ? C.background1 : C.accent1, last ? C.accent3 : C.background1, 13);
        T(s, st, x + 0.3, y, pw - 1.3, 0.7, { fontSize: 15, bold: last, color: last ? C.background1 : C.text1, valign: "middle" });
        n++;
      });
      if (k < 2) arrowLeft(s, x - gap + 0.05, x - 0.05, py + ph / 2, C.accent1, 2);
    }
    await icon(s, "LuRefreshCw", W - MX - 0.15, 6.5, 0.3, HEX.accent1);
    T(s, "الخطوة الأخيرة هي بداية الدورة التالية: الوحدة الجاهزة تستقبل الحجز القادم.", MX, 6.33, CW - 0.45, 0.34, { fontSize: 14, bold: true, color: C.accent1, valign: "middle" });
    s.addNotes(notesText(5));
  }

  // 7 — How the day begins
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "كيف نعمل" });
    head(s, "بداية كل يوم تشغيلي", "كيف يبدأ اليوم؟");
    box(s, MX, 1.78, CW, 0.82, { fill: C.text1 });
    pill(s, "brief", W - MX - 0.25, 2.03, { fill: C.accent1, color: C.background1 });
    T(s, "نراجع الحجوزات القادمة، والوصول والمغادرة المتوقعة، وجاهزية الوحدات، ثم نتابع طوال اليوم.", MX + 0.3, 1.78, CW - 2.0, 0.82, { fontSize: 17, color: C.background1, valign: "middle" });
    const tiles = [
      ["وصول اليوم", "من سيصل؟ ومتى تقريبًا؟", "LuLogIn", "brief"],
      ["مغادرة اليوم", "من سيغادر؟ وأي وحدة ستفرغ؟", "LuLogOut", "brief"],
      ["حالة الوحدات", "جاهزة، أو تحتاج تجهيزًا، أو متوقفة؟", "LuHouse", "brief"],
      ["مهام النظافة", "من ينظّف أي وحدة؟ وبأي ترتيب؟", "LuSparkles", "proposed"],
      ["أعطال صيانة مفتوحة", "ما الذي قد يوقف الجاهزية؟", "LuWrench", "proposed"],
      ["تعارضات وترتيبات خاصة", "وصول مبكر، مغادرة متأخرة، طلب خاص", "LuTriangleAlert", "proposed"],
    ];
    const tw = (CW - 0.6) / 3, th = 1.62;
    for (let i = 0; i < 6; i++) {
      const x = W - MX - tw - (i % 3) * (tw + 0.3);
      const y = 2.85 + Math.floor(i / 3) * (th + 0.25);
      const prop = tiles[i][3] === "proposed";
      box(s, x, y, tw, th, { fill: C.background1, line: prop ? C.accent5 : C.accent4, dash: prop ? "dash" : "solid", lineW: prop ? 1.25 : 1.5 });
      await iconDisc(s, tiles[i][2], x + tw - 0.55, y + 0.55, 0.66, prop ? C.accent2 : C.accent1, prop ? HEX.accent1 : "FFFFFF");
      T(s, tiles[i][0], x + 0.2, y + 0.3, tw - 1.25, 0.5, { fontSize: 18, bold: true, valign: "middle" });
      T(s, tiles[i][1], x + 0.2, y + 0.85, tw - 0.4, 0.38, { fontSize: 14, color: C.text2 });
      pill(s, tiles[i][3], x + tw - 0.2, y + 1.2, { w: 1.05 });
    }
    s.addNotes(notesText(6));
  }

  // 8 — The critical window (dark centerpiece)
  {
    const s = pres.addSlide({ masterName: "CONTENT_DARK", sectionTitle: "كيف نعمل" });
    head(s, "من إحاطة عبدالله", "النافذة الحرجة: من 12 ظهرًا إلى 5 مساءً");
    const x12 = 9.25, hr = 1.65; // RTL time axis: 12:00 at right, 17:00 at left
    const X = (t) => x12 - (t - 12) * hr;
    const labels = ["12 ظهرًا", "1", "2", "3", "4", "5 مساءً"];
    for (let i = 0; i <= 5; i++) {
      s.addShape(pres.shapes.LINE, { x: X(12 + i), y: 2.2, w: 0, h: 3.3, line: { color: "4A423A", width: 0.75, dashType: "dash" } });
      T(s, labels[i], X(12 + i) - 0.6, 1.8, 1.2, 0.35, { fontSize: 14, bold: true, color: C.accent4, align: "center" });
    }
    const lanes = [
      ["متابعة مغادرة الضيوف", 12.0, 14.0, C.accent4, C.text1],
      ["تنظيف وتجهيز الوحدات", 12.5, 16.0, C.accent1, C.background1],
      ["التحقق من الجاهزية", 13.5, 16.5, C.accent3, C.background1],
      ["تنسيق وصول الضيوف الجدد", 14.0, 17.0, C.background2, C.text1],
      ["معالجة الاستثناءات", 12.0, 17.0, null, C.background1],
    ];
    lanes.forEach(([label, t1, t2, fill, tc], i) => {
      const y = 2.32 + i * 0.64;
      T(s, label, 9.75, y, W - MX - 9.75, 0.5, { fontSize: 16, bold: true, color: C.background1, valign: "middle" });
      if (fill) {
        box(s, X(t2), y, (t2 - t1) * hr, 0.5, { fill, r: 0.25 });
      } else {
        box(s, X(t2), y, (t2 - t1) * hr, 0.5, { fill: C.accent6, transparency: 70, line: C.accent6, dash: "dash", lineW: 1.25, r: 0.25 });
        T(s, "تأخر نظافة · عطل صيانة · وحدة غير جاهزة", X(t2) + 0.2, y, (t2 - t1) * hr - 0.4, 0.5, { fontSize: 14, bold: true, color: C.background1, valign: "middle", align: "center" });
      }
    });
    T(s, "الأشرطة توضيحية لإظهار التداخل، وليست جدولًا زمنيًا فعليًا.", X(17) - 0.1, 5.55, x12 - X(17) + 0.2, 0.3, { fontSize: 12, color: C.accent4, align: "center" });
    // disclaimer (read first, right) + why (left)
    const dx = 5.83, dw = W - MX - dx;
    box(s, dx, 5.98, dw, 0.82, { fill: C.text1, line: C.accent4, lineW: 1.5 });
    await icon(s, "LuCircleHelp", dx + dw - 0.4, 6.39, 0.34, HEX.accent4);
    T(s, "فترة ذروة تشغيلية، وليست تحديدًا لمواعيد الدخول والخروج المعتمدة.", dx + 0.25, 5.98, dw - 1.0, 0.82, { fontSize: 15, bold: true, color: C.accent4, valign: "middle" });
    box(s, MX, 5.98, dx - MX - 0.25, 0.82, { fill: C.background1, transparency: 90 });
    T(s, "لماذا هي حرجة؟ مهام متعددة يجب أن تتم بالترتيب الصحيح حتى لا يتأخر الضيف القادم.", MX + 0.2, 5.98, dx - MX - 0.65, 0.82, { fontSize: 14, color: C.background1, valign: "middle" });
    s.addNotes(notesText(7));
  }

  // 9 — Housekeeping priorities
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "كيف نعمل" });
    head(s, "إطار مقترح لترتيب الأولويات", "كيف نرتّب أولويات النظافة؟");
    const steps = [
      "تأكّد أن الضيف السابق غادر فعلًا قبل دخول الوحدة",
      "حدّد الوحدات التي لديها وصول قادم",
      "افحص حالة الوحدة وأي عائق صيانة",
      "وزّع النظافة حسب قرب الوصول ووقت التجهيز اللازم",
      "تحقّق من الجاهزية قبل تحديث الحالة إلى «جاهزة»",
    ];
    const lx = 4.95, lw = W - MX - lx;
    steps.forEach((t, i) => {
      const y = 1.82 + i * 0.92;
      box(s, lx, y, lw, 0.78, { fill: i === 4 ? C.accent2 : C.background1, line: i === 4 ? undefined : C.accent5 });
      num(s, i + 1, lx + lw - 0.48, y + 0.39, 0.52, i === 4 ? C.accent3 : C.accent1, C.background1, 16);
      T(s, t, lx + 0.3, y, lw - 1.1, 0.78, { fontSize: 18, bold: i === 0 || i === 4, valign: "middle" });
    });
    box(s, MX, 1.82, 4.05, 4.46, { fill: C.text1 });
    await icon(s, "LuShieldCheck", MX + 4.05 - 0.6, 2.4, 0.6, HEX.accent4);
    T(s, "السرعة لا تتقدّم على:", MX + 0.3, 2.95, 3.45, 0.5, { fontSize: 20, bold: true, color: C.background1 });
    const guards = ["النظافة", "خصوصية الضيف", "فحص الجاهزية"];
    for (let i = 0; i < 3; i++) {
      const y = 3.65 + i * 0.75;
      await icon(s, "LuCircleCheck", MX + 4.05 - 0.55, y + 0.25, 0.38, HEX.accent4);
      T(s, guards[i], MX + 0.3, y, 2.85, 0.5, { fontSize: 18, color: C.background1, valign: "middle" });
    }
    T(s, "لا يوجد إجراء مكتوب معتمد بعد؛ هذا إطار تدريبي.", MX + 0.3, 5.75, 3.45, 0.4, { fontSize: 12, color: C.accent4 });
    s.addNotes(notesText(8));
  }

  // 10 — Who coordinates with whom?
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "كيف نعمل" });
    head(s, "توزيع وظيفي توضيحي", "من ينسّق مع من؟");
    const cols = [
      { x: 10.08, w: 2.65, h: "الوظيفة" },
      { x: 6.68, w: 3.25, h: "ماذا تتابع؟" },
      { x: 3.43, w: 3.1, h: "ماذا تسلّم؟" },
      { x: MX, w: 2.68, h: "من يحتاج التحديث؟" },
    ];
    cols.forEach((c, i) => {
      if (i === 0) return;
      box(s, c.x, 1.8, c.w, 0.5, { fill: C.text1, r: 0.08 });
      T(s, c.h, c.x + 0.2, 1.8, c.w - 0.4, 0.5, { fontSize: 15, bold: true, color: C.background1, valign: "middle" });
    });
    const rows = [
      ["الحجوزات", "LuCalendarCheck", "التقويم والتوفر والتعديلات", "تأكيد الحجز وتفاصيله", "التواصل · التنسيق"],
      ["التواصل مع الضيوف", "LuMessageCircle", "الرسائل وموعد الوصول وطلبات الضيف", "موعد الوصول المتوقع والطلبات الخاصة", "التنسيق · النظافة"],
      ["النظافة والتجهيز", "LuSparkles", "مهام التنظيف وحالة الوحدة بعد المغادرة", "«تم التنظيف» مع أي ملاحظة أو عطل", "التنسيق · الصيانة"],
      ["الصيانة", "LuWrench", "البلاغات المفتوحة والإصلاحات", "حالة العطل والموعد المتوقع للحل", "التنسيق · التواصل"],
      ["تنسيق التشغيل", "LuRoute", "صورة اليوم وحالة كل وحدة", "قرار الجاهزية وترتيب الأولويات", "جميع الوظائف"],
    ];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const y = 2.4 + i * 0.79;
      const last = i === 4;
      box(s, cols[0].x, y, cols[0].w, 0.7, { fill: last ? C.accent1 : C.accent2, r: 0.08 });
      await icon(s, r[1], cols[0].x + cols[0].w - 0.33, y + 0.35, 0.3, last ? "FFFFFF" : HEX.accent1);
      T(s, r[0], cols[0].x + 0.12, y, cols[0].w - 0.75, 0.7, { fontSize: 15, bold: true, color: last ? C.background1 : C.accent1, valign: "middle" });
      [2, 3, 4].forEach((k, j) => {
        const c = cols[j + 1];
        box(s, c.x, y, c.w, 0.7, { fill: C.background1, r: 0.08 });
        T(s, r[k], c.x + 0.18, y, c.w - 0.36, 0.7, { fontSize: 14, color: k === 4 ? C.accent1 : C.text1, bold: k === 4, valign: "middle" });
      });
    }
    T(s, "هذه وظائف وليست أقسامًا أو أشخاصًا محددين؛ قد يغطي شخص واحد أكثر من وظيفة.", MX, 6.4, CW, 0.32, { fontSize: 13, color: C.text2, valign: "middle" });
    s.addNotes(notesText(9));
  }

  // 11 — What does “ready” mean?
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "كيف نعمل" });
    head(s, "أداة تدريبية مقترحة", "ماذا تعني «جاهزة»؟");
    // right checkpoint
    const ry = 2.75, rh = 2.2, cw = 2.75;
    box(s, W - MX - cw, ry, cw, rh, { fill: C.background1, line: C.accent5 });
    await iconDisc(s, "LuSparkles", W - MX - cw / 2, ry + 0.6, 0.7, C.accent2, HEX.accent1);
    T(s, "تم التنظيف", W - MX - cw + 0.15, ry + 1.05, cw - 0.3, 0.45, { fontSize: 20, bold: true, align: "center" });
    T(s, "نقطة تحقق أولى", W - MX - cw + 0.15, ry + 1.5, cw - 0.3, 0.4, { fontSize: 14, color: C.text2, align: "center" });
    // left checkpoint
    box(s, MX, ry, cw, rh, { fill: C.accent3 });
    await iconDisc(s, "LuBadgeCheck", MX + cw / 2, ry + 0.6, 0.7, C.background1, HEX.accent3);
    T(s, "جاهزة لاستقبال الضيف", MX + 0.15, ry + 1.05, cw - 0.3, 0.45, { fontSize: 18, bold: true, align: "center", color: C.background1 });
    T(s, "نقطة التحقق النهائية", MX + 0.15, ry + 1.5, cw - 0.3, 0.4, { fontSize: 14, color: C.background1, align: "center" });
    // checklist panel
    const px = MX + cw + 0.55, pw = W - 2 * MX - 2 * cw - 1.1;
    box(s, px, 1.8, pw, 4.55, { fill: C.background1, line: C.accent4, lineW: 1.5 });
    T(s, "ما بين النقطتين: قائمة تحقق مقترحة", px + 0.3, 1.98, pw - 0.6, 0.45, { fontSize: 17, bold: true, color: C.accent1 });
    const items = ["النظافة والترتيب", "المستلزمات المطلوبة حسب نطاق الخدمة", "معالجة الملاحظات والأعطال المبلّغ عنها", "تأكيد ترتيبات الدخول", "تحديث حالة الوحدة وإبلاغ المعنيين"];
    for (let i = 0; i < items.length; i++) {
      const y = 2.6 + i * 0.72;
      box(s, px + 0.25, y, pw - 0.5, 0.6, { fill: C.background2, r: 0.1 });
      await icon(s, "LuCircleCheck", px + pw - 0.6, y + 0.3, 0.36, HEX.accent3);
      T(s, items[i], px + 0.45, y, pw - 1.35, 0.6, { fontSize: 16, valign: "middle" });
    }
    arrowLeft(s, px + pw + 0.08, W - MX - cw - 0.08, ry + rh / 2, C.accent1, 2);
    arrowLeft(s, MX + cw + 0.08, px - 0.08, ry + rh / 2, C.accent1, 2);
    s.addNotes(notesText(10));
  }

  // 12 — Scenario
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "كيف نعمل" });
    head(s, "تمرين جماعي", "موقف تشغيلي للتدريب");
    const rx = 6.98, rw = W - MX - rx;
    box(s, rx, 1.8, rw, 4.55, { fill: C.text1 });
    pill(s, "proposed", rx + rw - 0.3, 2.0, { text: "مثال تدريبي افتراضي", fill: C.accent1, color: C.background1, w: 2.1 });
    const facts = [
      ["LuLogOut", "ضيف يغادر متأخرًا"],
      ["LuSparkles", "النظافة لم تبدأ بعد"],
      ["LuLogIn", "ضيف آخر قادم للوحدة نفسها اليوم"],
      ["LuWrench", "بلاغ عن عطل (مثل تسريب في المغسلة)"],
    ];
    for (let i = 0; i < facts.length; i++) {
      const y = 2.55 + i * 0.6;
      await icon(s, facts[i][0], rx + rw - 0.55, y + 0.25, 0.36, HEX.accent4);
      T(s, facts[i][1], rx + 0.3, y, rw - 1.2, 0.5, { fontSize: 17, color: C.background1, valign: "middle" });
    }
    box(s, rx + 0.3, 5.1, rw - 0.6, 1.0, { fill: C.accent1, r: 0.1 });
    T(s, "ما أول خطوة؟ ومن يحتاج يعرف؟", rx + 0.5, 5.1, rw - 1.0, 1.0, { fontSize: 22, bold: true, color: C.background1, valign: "middle", align: "center" });
    // proposed response
    const lw = 6.05;
    T(s, "استجابة مقترحة", MX, 1.8, lw, 0.42, { fontSize: 17, bold: true, color: C.accent1 });
    const steps = [
      ["تحقّق من المعلومات", "هل غادر الضيف؟ ما حجم العطل؟"],
      ["قيّم الجاهزية والتوقيت", "كم من الوقت نحتاج فعليًا؟"],
      ["نسّق مع الوظائف المسؤولة", "النظافة · الصيانة · التواصل"],
      ["أبلغ الضيف بتحديث واقعي", "دون وعود لا نملكها"],
      ["أكّد الحل والجاهزية", "قبل تحديث الحالة إلى «جاهزة»"],
    ];
    s.addShape(pres.shapes.LINE, { x: MX + lw - 0.3, y: 2.6, w: 0, h: 3.4, line: { color: C.accent5, width: 2 } });
    steps.forEach((st, i) => {
      const y = 2.3 + i * 0.83;
      num(s, i + 1, MX + lw - 0.3, y + 0.33, 0.5, i === 4 ? C.accent3 : C.accent1, C.background1, 15);
      T(s, st[0], MX, y, lw - 0.75, 0.38, { fontSize: 17, bold: true });
      T(s, st[1], MX, y + 0.38, lw - 0.75, 0.34, { fontSize: 14, color: C.text2 });
    });
    s.addNotes(notesText(11));
  }

  pres.addSection({ title: "أسئلة الملاك" });
  // 13 — Owner questions: scope & visibility
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "أسئلة الملاك" });
    head(s, "أسئلة الملاك (1 من 2)", "النطاق والمتابعة: كيف نجيب بدقة؟");
    const qs = [
      ["عرّفني عن شركتكم، وش تقدمون؟", "ندعم تشغيل الوحدات وإدارة حجوزاتها ومتابعة الضيوف وتنسيق الدخول والخروج، ضمن نطاق الخدمة المتفق عليه.", null],
      ["إيش الخدمات اللي تقدمونها لي؟", "اذكر ما يشمله العقد فعلًا، ووضّح ما يعتمد على الاتفاق كالنظافة والصيانة والتقارير.", null],
      ["هل تتعاملون مع Airbnb وجاذر إن وبوكينج؟", "اذكر المنصات المعتمدة فعليًا فقط وطريقة إدارة الحجوزات عليها، دون افتراض أي ربط مباشر.", "confirm"],
      ["هل أقدر أتابع حجوزات شقتي وإيراداتها؟", "اشرح وسائل المتابعة والتقارير المتاحة فعلًا، دون وعد بلوحة أو ميزة غير مؤكدة.", "confirm"],
    ];
    const cw = (CW - 0.3) / 2, ch = 2.08;
    for (let i = 0; i < 4; i++) {
      const x = W - MX - cw - (i % 2) * (cw + 0.3);
      const y = 1.8 + Math.floor(i / 2) * (ch + 0.25);
      box(s, x, y, cw, ch, { fill: C.background1, line: C.accent5 });
      num(s, i + 1, x + cw - 0.48, y + 0.48, 0.52, C.accent1, C.background1, 15);
      T(s, "«" + qs[i][0] + "»", x + 0.3, y + 0.22, cw - 1.25, 0.55, { fontSize: 17, bold: true, valign: "middle" });
      T(s, qs[i][1], x + 0.3, y + 0.9, cw - 0.6, 0.8, { fontSize: 15, color: C.text2 });
      if (qs[i][2]) pill(s, qs[i][2], x + 0.3 + 2.2, y + ch - 0.45, { w: 2.2 });
    }
    box(s, MX, 6.3, CW, 0.5, { fill: C.accent2, r: 0.1 });
    T(s, "إذا لم تكن متأكدًا: «أتأكد لك وأرجع لك»، ثم عُد بإجابة معتمدة.", MX + 0.25, 6.3, CW - 0.5, 0.5, { fontSize: 15, bold: true, valign: "middle" });
    s.addNotes(notesText(12));
  }

  // 14 — Owner questions: money & responsibility
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "أسئلة الملاك" });
    head(s, "أسئلة الملاك (2 من 2)", "المال والمسؤوليات: المبدأ الصحيح للإجابة");
    const qx = 8.18, qw = W - MX - qx, ax = MX, aw = qx - MX - 0.18;
    box(s, qx, 1.8, qw, 0.48, { fill: C.text1, r: 0.08 });
    T(s, "السؤال", qx + 0.2, 1.8, qw - 0.4, 0.48, { fontSize: 15, bold: true, color: C.background1, valign: "middle" });
    box(s, ax, 1.8, aw, 0.48, { fill: C.text1, r: 0.08 });
    T(s, "المبدأ الصحيح للإجابة", ax + 0.2, 1.8, aw - 0.4, 0.48, { fontSize: 15, bold: true, color: C.background1, valign: "middle" });
    const rows = [
      ["كم عمولتكم أو رسوم الإدارة؟", "الرسوم المعتمدة وطريقة حسابها وأي تكاليف إضافية، من العقد فقط."],
      ["متى أستلم مستحقاتي؟", "دورة التسوية ومواعيد التحويل وكشف الإيرادات والخصومات، حسب الاتفاق."],
      ["هل تضمنون لي حجوزات كل شهر؟", "لا نَعِد بعدد حجوزات أو دخل؛ الطلب يتغير بالموسم والسوق والتسعير."],
      ["من المسؤول عن تنظيف الشقة بعد خروج الضيف؟", "من ينفّذ (مباشرة أو عبر مزوّد) ومن يتحمل التكلفة، حسب الاتفاق."],
      ["إذا صار عطل في الشقة، من يتحمل تكلفته؟", "فرّق بين الإبلاغ والتنسيق وبين دفع تكلفة الإصلاح؛ حسب العقد ونوع العطل."],
      ["كيف تضمنون عدم تداخل الحجوزات؟", "تنظيم التقويم ومراجعة التواريخ والتحقق من التوفر قبل التأكيد، دون ادعاء منع كامل."],
    ];
    rows.forEach((r, i) => {
      const y = 2.38 + i * 0.66;
      box(s, qx, y, qw, 0.58, { fill: C.accent2, r: 0.08 });
      num(s, i + 5, qx + qw - 0.32, y + 0.29, 0.4, C.accent1, C.background1, 13);
      T(s, r[0], qx + 0.2, y, qw - 0.8, 0.58, { fontSize: 15, bold: true, valign: "middle" });
      box(s, ax, y, aw, 0.58, { fill: C.background1, r: 0.08 });
      T(s, r[1], ax + 0.2, y, aw - 0.4, 0.58, { fontSize: 15, valign: "middle" });
    });
    box(s, MX, 6.38, CW, 0.46, { fill: C.background1, line: C.accent6, r: 0.1 });
    T(s, "الأرقام والمواعيد والشروط التجارية الدقيقة تأتي من الاتفاقية المعتمدة فقط.", MX + 0.25, 6.38, CW - 0.5, 0.46, { fontSize: 15, bold: true, color: C.accent6, valign: "middle" });
    s.addNotes(notesText(13));
  }

  pres.addSection({ title: "الختام" });
  // 15 — How each team member contributes
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "الختام" });
    head(s, "دورك في تجربة الضيف", "كيف يساهم كل فرد في الفريق؟");
    const roles = [
      ["التشغيل", "حالة وحدة دقيقة ومحدّثة", "LuSettings2"],
      ["التواصل مع الضيوف", "توقعات واضحة وصادقة", "LuMessagesSquare"],
      ["المبيعات", "شرح النطاق المتفق عليه بدقة", "LuHandshake"],
      ["التسويق والمحتوى", "عرض التجربة الفعلية للضيف", "LuMegaphone"],
      ["الجميع", "إيصال المعلومة المفيدة للوظيفة الصحيحة", "LuUsers"],
    ];
    const gap = 0.25, cw = (CW - 4 * gap) / 5, ch = 2.85;
    for (let i = 0; i < 5; i++) {
      const x = W - MX - cw - i * (cw + gap);
      const all = i === 4;
      box(s, x, 1.85, cw, ch, { fill: all ? C.accent2 : C.background1, line: all ? undefined : C.accent5 });
      await iconDisc(s, roles[i][2], x + cw - 0.55, 2.4, 0.7, C.accent1, "FFFFFF");
      T(s, roles[i][0], x + 0.2, 2.95, cw - 0.4, 0.75, { fontSize: 18, bold: true, valign: "bottom" });
      T(s, roles[i][1], x + 0.2, 3.78, cw - 0.4, 0.8, { fontSize: 15, color: C.text2 });
      arrowDown(s, x + cw / 2, 4.75, 5.22, C.accent1, 1.5);
    }
    box(s, MX, 5.3, CW, 0.95, { fill: C.text1 });
    await icon(s, "LuBadgeCheck", W - MX - 0.6, 5.775, 0.45, HEX.accent4);
    T(s, "النتيجة: تجربة ضيف واضحة وموثوقة، تبدأ بمعلومة صحيحة تصل للشخص الصحيح", MX + 0.4, 5.3, CW - 1.3, 0.95, { fontSize: 18, bold: true, color: C.background1, valign: "middle" });
    T(s, "مساهمات عامة لكل وظيفة، ولا تحدد مسؤوليات رسمية لأشخاص بعينهم.", MX, 6.4, CW, 0.32, { fontSize: 13, color: C.text2, valign: "middle" });
    s.addNotes(notesText(14));
  }

  // 16 — Recap & discussion
  {
    const s = pres.addSlide({ masterName: "CONTENT_DARK", sectionTitle: "الختام" });
    head(s, "ثلاث أفكار نخرج بها", "الخلاصة والنقاش");
    const rx = 6.98, rw = W - MX - rx;
    const take = [
      "كل حجز يحتاج عملًا تشغيليًا منسّقًا.",
      "جاهزية الوحدة يجب أن نتحقق منها ثم نبلّغ عنها.",
      "التسليم الواضح بين الوظائف يقلل التأخير والأخطاء.",
    ];
    take.forEach((t, i) => {
      const y = 1.85 + i * 1.45;
      T(s, String(i + 1), rx + rw - 0.75, y, 0.75, 1.1, { fontSize: 54, bold: true, color: C.accent4, align: "center", valign: "middle" });
      T(s, t, rx, y, rw - 1.0, 1.1, { fontSize: 21, bold: true, color: C.background1, valign: "middle" });
    });
    box(s, MX, 1.85, 5.98, 4.95, { fill: C.background1, transparency: 91 });
    await icon(s, "LuMessagesSquare", MX + 5.98 - 0.55, 2.35, 0.45, HEX.accent4);
    T(s, "أسئلة للنقاش", MX + 0.3, 2.1, 4.8, 0.5, { fontSize: 19, bold: true, color: C.accent4, valign: "middle" });
    const qs = [
      "لماذا لا تكفي «تم التنظيف» لاعتبار الوحدة جاهزة؟",
      "بين 12 ظهرًا و5 مساءً، ما الذي قد يؤخر ضيفًا قادمًا؟ ومن يحتاج يعرف؟",
      "مالك سأل عن العمولة ولا تعرف الرقم المعتمد. وش تقول؟",
    ];
    qs.forEach((q, i) => {
      const y = 2.8 + i * 0.95;
      num(s, i + 1, MX + 5.98 - 0.55, y + 0.38, 0.44, C.accent1, C.background1, 14);
      T(s, q, MX + 0.3, y, 4.85, 0.8, { fontSize: 16, color: C.background1, valign: "middle" });
    });
    box(s, MX + 0.3, 5.75, 5.38, 0.75, { fill: C.accent1, r: 0.1 });
    T(s, "المجال مفتوح لأسئلتكم ونقاشكم", MX + 0.5, 5.75, 4.98, 0.75, { fontSize: 18, bold: true, color: C.background1, valign: "middle", align: "center" });
    s.addNotes(notesText(15));
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  // Point the theme's complex-script (Arabic) fonts at the deck font too; pptxgenjs leaves them empty / Times New Roman.
  const zip = await JSZip.loadAsync(fs.readFileSync(OUT));
  const part = "ppt/theme/theme1.xml";
  let xml = await zip.file(part).async("string");
  xml = xml.replace(/<a:cs typeface=""\/>/g, `<a:cs typeface="${FONT}"/>`).replace(/<a:font script="Arab" typeface="[^"]*"\/>/g, `<a:font script="Arab" typeface="${FONT}"/>`);
  zip.file(part, xml);
  fs.writeFileSync(OUT, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  console.log("wrote", OUT, "slides:", NOTES.length);
}

build().catch((e) => { console.error(e); process.exit(1); });
