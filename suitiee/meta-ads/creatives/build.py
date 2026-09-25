#!/usr/bin/env python3
"""Render Suitiee Instagram ad creatives (5 angles x 9:16 + 4:5) from HTML.

Brand tokens from suitiee-design-spec.md: white canvas, ink #16130F,
terracotta accent #A8481B for the CTA only, IBM Plex Sans Arabic + Inter.
All product panels are illustrative mock-ups (labelled on the image).
"""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
FONTS = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "fonts"

AR = "fontsource-ibm-plex-sans-arabic-5.3.0/files/ibm-plex-sans-arabic-arabic-{w}-normal.woff2"
LA = "fontsource-inter-5.3.0/files/inter-latin-{w}-normal.woff2"

css_fonts = "".join(
    f"@font-face{{font-family:'Plex';font-weight:{w};src:url('file://{FONTS / AR.format(w=w)}') format('woff2');}}"
    for w in (400, 500, 600, 700)
) + "".join(
    f"@font-face{{font-family:'Inter';font-weight:{w};src:url('file://{FONTS / LA.format(w=w)}') format('woff2');}}"
    for w in (400, 600)
)

BASE_CSS = """
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:var(--h);background:#FFFFFF;color:#16130F;font-family:'Inter','Plex',sans-serif}
body{direction:rtl;font-family:'Plex','Inter',sans-serif;display:flex;flex-direction:column;padding:var(--pt) 84px var(--pb);gap:var(--gap)}
.brand{display:flex;align-items:center;justify-content:space-between;font-size:30px;color:#6B645B}
.word{font-family:'Inter';font-weight:600;font-size:40px;color:#16130F;letter-spacing:-.02em;direction:ltr}
.word b{color:#A8481B}
h1{font-weight:600;font-size:var(--h1);line-height:1.18;letter-spacing:-.01em;text-wrap:balance}
.sub{font-size:34px;line-height:1.55;color:#3B3630;max-width:30ch}
.panel{border:2px solid #E6E3DE;border-radius:28px;padding:36px;background:#FAFAF9;box-shadow:0 30px 60px -30px rgba(22,19,15,.25);display:flex;flex-direction:column;gap:22px;flex:1;min-height:0;position:relative}
.ph{display:flex;justify-content:space-between;align-items:center;font-size:28px;color:#6B645B}
.ph strong{color:#16130F;font-weight:600;font-size:32px}
.row{display:flex;align-items:center;gap:20px;background:#fff;border:2px solid #E6E3DE;border-radius:20px;padding:22px 26px;font-size:30px}
.row .t{flex:1}
.row .m{font-family:'Inter';color:#787165;font-size:26px;direction:ltr}
.chip{border-radius:999px;padding:6px 18px;font-size:24px;font-weight:600;white-space:nowrap}
.ok{background:#EAF6F1;color:#0E7150}.warn{background:#FBF3E0;color:#9A6B00}.info{background:#EBF2FA;color:#1B5DA6}.acc{background:#FCF3EE;color:#A8481B}
.demo{position:absolute;bottom:14px;left:22px;font-size:20px;color:#787165}
.cta{display:flex;align-items:center;justify-content:space-between;gap:24px}
.btn{background:#A8481B;color:#fff;border-radius:14px;padding:26px 40px;font-size:36px;font-weight:600}
.fine{font-size:26px;color:#6B645B}
.cal{display:grid;grid-template-columns:150px repeat(7,1fr);gap:8px;font-size:22px}
.cal .d{text-align:center;color:#787165;font-family:'Inter'}
.cal .u{font-size:24px;color:#3B3630;display:flex;align-items:center}
.cal .c{height:54px;border-radius:10px;background:#fff;border:1.5px solid #E6E3DE}
.bar{height:54px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:600;font-family:'Inter'}
.tl{display:flex;flex-direction:column;gap:18px}
.step{display:flex;gap:22px;align-items:flex-start}
.dot{width:26px;height:26px;border-radius:50%;margin-top:10px;flex:none}
.step .x{flex:1;background:#fff;border:2px solid #E6E3DE;border-radius:18px;padding:18px 24px;font-size:29px}
.step .x small{display:block;font-size:24px;color:#787165;font-family:'Inter';direction:ltr;text-align:right}
.big{font-family:'Inter';font-weight:600;font-size:120px;color:#16130F;direction:ltr;text-align:center;line-height:1}
"""

DEMO = '<span class="demo">واجهة توضيحية</span>'


def rows(items):
    return "".join(
        f'<div class="row"><span class="t">{t}</span><span class="m">{m}</span><span class="chip {c}">{s}</span></div>'
        for t, m, s, c in items
    )


def panel_system():
    return f'''<div class="panel"><div class="ph"><strong>اليوم</strong><span>كل وحداتك</span></div>
{rows([("حجز جديد · شقة 102", "09:14", "Airbnb", "info"),
       ("وصل الضيف · شقة 204", "11:30", "تم الدخول", "ok"),
       ("خروج الضيف · شقة 107", "12:00", "تنظيف مجدول", "warn"),
       ("تنظيف مكتمل · شقة 311", "13:45", "موثّق بالصور", "ok")])}{DEMO}</div>'''


def panel_calendar():
    days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    head = '<span></span>' + "".join(f'<span class="d">{d}</span>' for d in days)
    # (unit, [(start, span, label, cls)])
    units = [
        ("شقة 102", [(0, 3, "Airbnb", "acc"), (4, 3, "Booking", "info")]),
        ("شقة 107", [(1, 2, "Gathern", "ok"), (3, 4, "Airbnb", "acc")]),
        ("شقة 204", [(0, 2, "Booking", "info"), (2, 3, "Gathern", "ok")]),
        ("شقة 311", [(2, 5, "Airbnb", "acc")]),
    ]
    body = ""
    for name, bars in units:
        body += f'<span class="u">{name}</span>'
        col = 0
        for s, n, lab, c in bars:
            while col < s:
                body += '<span class="c"></span>'
                col += 1
            body += f'<span class="bar {c}" style="grid-column:span {n}">{lab}</span>'
            col += n
        while col < 7:
            body += '<span class="c"></span>'
            col += 1
    return f'''<div class="panel"><div class="ph"><strong>تقويم واحد لكل وحدة</strong><span>هذا الأسبوع</span></div>
<div class="cal">{head}{body}</div>
<div class="row"><span class="t">بدون حجز مكرر لنفس الليلة</span><span class="chip ok">متزامن</span></div>{DEMO}</div>'''


def panel_cleaning():
    steps = [
        ("#1B5DA6", "خروج الضيف · شقة 107", "12:00"),
        ("#9A6B00", "انرسلت مهمة التنظيف للعامل تلقائيًا", "12:01"),
        ("#0E7150", "تم التنظيف · 8 صور", "13:40"),
        ("#16130F", "الوحدة جاهزة للضيف الجاي", "15:00"),
    ]
    tl = "".join(
        f'<div class="step"><span class="dot" style="background:{c}"></span><div class="x">{t}<small>{m}</small></div></div>'
        for c, t, m in steps
    )
    return f'<div class="panel"><div class="ph"><strong>بعد كل خروج</strong><span>تلقائي</span></div><div class="tl">{tl}</div>{DEMO}</div>'


def panel_scale():
    return f'''<div class="panel"><div class="ph"><strong>كل الوحدات في شاشة وحدة</strong><span>اليوم</span></div>
{rows([("شقة 102 · الرياض", "", "جاهزة", "ok"),
       ("شقة 107 · الرياض", "", "قيد التنظيف", "info"),
       ("جناح 12 · جدة", "", "تنظيف مجدول", "warn"),
       ("شقة 204 · الخبر", "", "جاهزة", "ok"),
       ("شقة 311 · الرياض", "", "ضيف مقيم", "acc")])}{DEMO}</div>'''


def panel_trial():
    return f'''<div class="panel" style="justify-content:center;align-items:center;text-align:center;gap:28px">
<div class="big">14</div><div style="font-size:44px;font-weight:600">يوم مجانًا</div>
<div class="row" style="width:100%;justify-content:center"><span class="chip ok">بدون بطاقة بنكية</span></div>
<div class="fine">الحجوزات والضيوف والتنظيف · في نظام واحد</div></div>'''


CONCEPTS = [
    ("01-system", "الحجوزات والضيوف والتنظيف… في نظام واحد", "لمشغّلي الشقق المفروشة والإيجار القصير.", panel_system),
    ("02-calendar", "Airbnb وBooking وجاذر إن… كل حجوزاتك في تقويم واحد", "كل منصة تتزامن مع وحداتك تلقائيًا.", panel_calendar),
    ("03-cleaning", "الضيف يطلع… والتنظيف يتجدول لحاله", "وتستلم صور تثبت إن الوحدة جاهزة.", panel_cleaning),
    ("04-scale", "من 5 وحدات لـ50… بدون فوضى", "تشغيل وحداتك كلها من مكان واحد.", panel_scale),
    ("05-trial", "جرّب سويتي 14 يوم مجانًا", "بدون بطاقة بنكية. ابدأ بوحداتك الحالية.", panel_trial),
]

SIZES = {"9x16": (1920, "300px", "380px", "44px", "72px"), "4x5": (1350, "72px", "72px", "32px", "62px")}


def page(title, sub, panel, size):
    h, pt, pb, gap, h1 = SIZES[size]
    return f"""<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{css_fonts}{BASE_CSS}
:root{{--h:{h}px;--pt:{pt};--pb:{pb};--gap:{gap};--h1:{h1}}}</style></head><body>
<div class="brand"><span class="word">Suit<b>i</b>ee</span><span>سويتي</span></div>
<h1>{title}</h1><p class="sub">{sub}</p>{panel()}
<div class="cta"><span class="btn">ابدأ تجربة 14 يوم مجانًا</span><span class="fine">suitiee.com</span></div>
</body></html>"""


def main():
    out = HERE / "html"
    out.mkdir(exist_ok=True)
    jobs = []
    for key, title, sub, panel in CONCEPTS:
        for size, (h, *_) in SIZES.items():
            f = out / f"{key}_{size}.html"
            f.write_text(page(title, sub, panel, size), encoding="utf-8")
            jobs.append({"html": str(f), "png": str(HERE / f"{key}_{size}.png"), "h": h})
    (out / "jobs.json").write_text(json.dumps(jobs), encoding="utf-8")
    print(len(jobs), "pages written")


if __name__ == "__main__":
    main()
