// Arabic presenter guide (RTL .docx) built from the same notes as the deck.
// node build_guide.js <out.docx>
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  AlignmentType, HeadingLevel, BorderStyle, PageBreak, Footer, PageNumber, LevelFormat,
} = require("docx");
const { NOTES, TAG, fmtTime } = require("./notes.js");

const OUT = process.argv[2] || "guide.docx";
const FONT = "IBM Plex Sans Arabic";
const INK = "1E1A16", MUTED = "5C534A", BRONZE = "93602E", TINT = "EFE4D4", RUST = "A9472A", GREEN = "2E6B52", LINE = "E3D9CB";
const TAG_COLOR = { [TAG.brief]: BRONZE, [TAG.proposed]: GREEN, [TAG.confirm]: RUST };

const run = (text, o = {}) => new TextRun({ text, rightToLeft: true, font: { ascii: FONT, hAnsi: FONT, cs: FONT }, ...o });
const para = (children, o = {}) => new Paragraph({ bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { after: 120, line: 300 }, children: Array.isArray(children) ? children : [children], ...o });
const p = (text, o = {}, ro = {}) => para(run(text, ro), o);
const labeled = (label, text, color = BRONZE) => para([run(label + ": ", { bold: true, boldComplexScript: true, color }), run(text)]);
const bullet = (children) => new Paragraph({ bidirectional: true, alignment: AlignmentType.RIGHT, numbering: { reference: "bul", level: 0 }, spacing: { after: 80, line: 290 }, children });

// A4 portrait, 2 cm margins → text width 9638 DXA
const TW = 9638;
function cell(text, w, o = {}) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [p(text, { spacing: { after: 0 } }, { bold: !!o.bold, boldComplexScript: !!o.bold, color: o.color ?? INK, size: o.size ?? 21, sizeComplexScript: o.size ?? 21 })],
  });
}
function table(widths, rows, headFill = INK) {
  const border = { style: BorderStyle.SINGLE, size: 4, color: LINE };
  return new Table({
    visuallyRightToLeft: true,
    width: { size: TW, type: WidthType.DXA },
    columnWidths: widths,
    borders: { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border },
    rows: rows.map((r, i) => new TableRow({
      tableHeader: i === 0,
      children: r.map((t, j) => cell(t, widths[j], i === 0 ? { fill: headFill, color: "FFFFFF", bold: true } : { fill: j === 0 ? TINT : undefined, bold: j === 0 })),
    })),
  });
}

const children = [];
children.push(p("Suitiee | سويتي", { alignment: AlignmentType.LEFT, bidirectional: false }, { bold: true, color: BRONZE, size: 24 }));
children.push(new Paragraph({ heading: HeadingLevel.TITLE, bidirectional: true, alignment: AlignmentType.RIGHT, children: [run("دليل المقدّم: كيف نشتغل في سويتي؟")] }));
children.push(p("من أول ما يجينا الحجز… لين تجهز الشقة للضيف اللي بعده", {}, { size: 28, sizeComplexScript: 28, color: MUTED }));
children.push(p("المقدّم: عبدالله | فريق التشغيل", {}, { bold: true, boldComplexScript: true }));
children.push(p("جلسة تعريفية داخلية للفريق · 21 شريحة · حوالي 23 دقيقة عرض + 5 دقائق نقاش · مبنية على إحاطة عبدالله بتاريخ 22 أكتوبر 2026", {}, { color: MUTED }));

children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, bidirectional: true, alignment: AlignmentType.RIGHT, children: [run("كيف تستخدم هذا الدليل")] }));
children.push(p("لكل شريحة: الفكرة الرئيسية، وكلام مقترح باللهجة اللي نتكلم فيها بالشغل، ومثال لو احتجت، ومصدر المحتوى، وجملة تنقلك للشريحة اللي بعدها، والوقت التقريبي. لا تقرأ النص حرفيًا؛ خذه كمرشد. شرائح «الحالات» (10، 11، 14، 15، 18، 20) تمارين: اسأل القاعة أول، وبعدها اشرح الحل."));
children.push(p("وسوم مصدر المحتوى:", {}, { bold: true, boldComplexScript: true }));
children.push(bullet([run(`[${TAG.brief}] `, { bold: true, boldComplexScript: true, color: BRONZE }), run("معلومة من إحاطة عبدالله التشغيلية.")]));
children.push(bullet([run(`[${TAG.proposed}] `, { bold: true, boldComplexScript: true, color: GREEN }), run("ممارسة أو أداة تدريبية مقترحة، وليست إجراءً معتمدًا في الشركة بعد.")]));
children.push(bullet([run(`[${TAG.confirm}] `, { bold: true, boldComplexScript: true, color: RUST }), run("بند يجب تأكيده من العقد المعتمد أو سياسة الشركة قبل ذكره كحقيقة.")]));

children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, bidirectional: true, alignment: AlignmentType.RIGHT, children: [run("خطة التوقيت")] }));
let cum = 0;
const timing = [["#", "الشريحة", "الوقت", "التراكمي"]];
NOTES.forEach((n, i) => { cum += n.minutes; timing.push([String(i + 1), n.title, fmtTime(n.minutes), fmtTime(cum)]); });
timing.push(["", "نقاش وأسئلة", "5:00 د", fmtTime(cum + 5)]);
children.push(table([700, 5338, 1800, 1800], timing));
children.push(p("لو ضاق الوقت: اختصر الشرائح 3 و4 و19، أو خلّ الجولة السريعة (20) جزء من النقاش. لا تختصر الشريحة 8 (أزحم وقت) ولا 17 (الفلوس والمسؤوليات).", { spacing: { before: 120, after: 120 } }, { color: MUTED }));

NOTES.forEach((n, i) => {
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, bidirectional: true, alignment: AlignmentType.RIGHT, children: [run(`الشريحة ${i + 1}: ${n.title}`)] }));
  children.push(p(`الوقت التقريبي: ${fmtTime(n.minutes)}`, {}, { bold: true, boldComplexScript: true, color: BRONZE }));
  children.push(labeled("الفكرة الرئيسية", n.main));
  children.push(p("كيف تقولها:", { spacing: { after: 60 } }, { bold: true, boldComplexScript: true, color: BRONZE }));
  for (const line of n.say.split("\n")) children.push(p(line, { indent: { right: 280 } }));
  if (n.example) children.push(labeled("مثال", n.example));
  children.push(p("مصدر المحتوى:", { spacing: { after: 60 } }, { bold: true, boldComplexScript: true, color: BRONZE }));
  for (const [tag, txt] of n.sources) children.push(bullet([run(`[${tag}] `, { bold: true, boldComplexScript: true, color: TAG_COLOR[tag] }), run(txt)]));
  children.push(labeled("الانتقال", n.transition, MUTED));
});

// Appendices
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, bidirectional: true, alignment: AlignmentType.RIGHT, children: [run("ملحق أ: أين تُغطّى أسئلة الملاك العشرة؟")] }));
children.push(table([3800, 1300, 4538], [
  ["السؤال", "الشريحة", "حالة الإجابة"],
  ["عرّفني عن شركتكم، وش تقدمون؟", "16", "مبدأ معتمد من الإحاطة"],
  ["إيش الخدمات اللي تقدمونها لي؟", "16", "مبدأ معتمد؛ التفاصيل حسب العقد"],
  ["هل تتعاملون مع Airbnb وجاذر إن وبوكينج؟", "16، 20", "يحتاج تأكيد المنصات المدعومة فعليًا"],
  ["هل أقدر أتابع حجوزات شقتي وإيراداتها؟", "16", "يحتاج تأكيد وسائل المتابعة المتاحة"],
  ["كم عمولتكم أو رسوم الإدارة؟", "17، 18", "يحتاج الرسوم المعتمدة"],
  ["متى أستلم مستحقاتي؟", "17", "يحتاج دورة التسوية المعتمدة"],
  ["هل تضمنون لي حجوزات كل شهر؟", "17، 18", "مبدأ معتمد: لا ضمان لعدد أو دخل"],
  ["من المسؤول عن تنظيف الشقة بعد خروج الضيف؟", "17", "حسب الاتفاق"],
  ["إذا صار عطل في الشقة، من يتحمل تكلفته؟", "17", "حسب العقد ونوع العطل"],
  ["كيف تضمنون عدم تداخل الحجوزات؟", "6، 17", "مبدأ معتمد من الإحاطة"],
]));

children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { before: 360 }, children: [run("ملحق ب: بنود تحتاج تأكيدًا داخليًا قبل الجلسة")] }));
[
  "مواعيد الدخول والخروج المعتمدة (الفترة من 12 الظهر إلى 5 العصر ذروة تشغيلية فقط، وليست مواعيد رسمية).",
  "الرسوم ونسب العمولة وطريقة الحساب والتكاليف الإضافية.",
  "دورة التسوية ومواعيد التحويل وشكل كشف الإيرادات والخصومات.",
  "المنصات المدعومة فعليًا وطريقة إدارة الإعلانات والحجوزات عليها، وهل يوجد ربط مباشر مع أي منصة.",
  "وسائل المتابعة والتقارير المتاحة للمالك (لم يُفترض وجود لوحة تحكم للمالك).",
  "من ينفّذ النظافة (مباشرة أو عبر مزوّد) ومن يتحمل تكلفتها، ومن يتحمل تكلفة الصيانة حسب نوع العطل.",
  "هل توجد إجراءات مكتوبة معتمدة لترتيب أولويات النظافة، أو قائمة جاهزية، أو مسارات تصعيد ومسؤولين محددين.",
  "سياسات أوقات الاستجابة والتعويض للضيوف (لم تُذكر في العرض عمدًا).",
  "ملف الشعار الرسمي لسويتي (المعالجة البرونزية المعتمدة)؛ العرض يستخدم شعارًا نصيًا مؤقتًا.",
].forEach((t) => children.push(bullet([run(t)])));

const doc = new Document({
  creator: "عبدالله | فريق التشغيل",
  title: "دليل المقدّم: كيف نشتغل في سويتي؟",
  styles: {
    default: { document: { run: { font: { ascii: FONT, hAnsi: FONT, cs: FONT }, size: 22, sizeComplexScript: 22, color: INK, rightToLeft: true } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", next: "Normal", run: { font: { ascii: FONT, hAnsi: FONT, cs: FONT }, size: 44, sizeComplexScript: 44, bold: true, boldComplexScript: true, color: INK }, paragraph: { spacing: { after: 120 } } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: { ascii: FONT, hAnsi: FONT, cs: FONT }, size: 32, sizeComplexScript: 32, bold: true, boldComplexScript: true, color: INK }, paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 0 } },
    ],
  },
  numbering: { config: [{ reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.RIGHT, style: { paragraph: { indent: { right: 400, hanging: 260 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [run("دليل المقدّم · سويتي · صفحة ", { color: MUTED, size: 18, sizeComplexScript: 18 }), new TextRun({ children: [PageNumber.CURRENT], color: MUTED, size: 18, rightToLeft: true })] })] }) },
    children,
  }],
});

Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log("wrote", OUT); });
