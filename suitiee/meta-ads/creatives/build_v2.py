#!/usr/bin/env python3
"""Second creative wave: new visual families so each campaign tests different looks, not just new text.

B = dark "pain" series (5 angles), C = before/after comparison (3 angles), R = retargeting (2).
Each in 9:16 + 4:5. Same brand tokens as build.py. All product/chat panels are illustrative
and labelled on the image. Only features already on suitiee.com are shown.
usage: python3 build_v2.py <fonts_dir>  then  node render_png.js html/jobs_v2.json
"""
import json

import build as b

DARK_CSS = """
body.dark{background:#16130F;color:#FAFAF9}
body.dark .brand{color:#A39B90}
body.dark .word{color:#FAFAF9}
body.dark .sub{color:#D6D0C7}
body.dark .panel{background:#211D18;border-color:#3A342D;box-shadow:none}
body.dark .ph{color:#A39B90}body.dark .ph strong{color:#FAFAF9}
body.dark .row{background:#2A2520;border-color:#3A342D;color:#FAFAF9}
body.dark .row .m{color:#A39B90}
body.dark .demo{color:#8A8277}
body.dark .fine{color:#A39B90}
body.dark .cal .c{background:#2A2520;border-color:#3A342D}
body.dark .cal .u{color:#D6D0C7}
.cloud{display:flex;flex-wrap:wrap;gap:20px;justify-content:center;align-content:center;flex:1}
.cloud .chip{font-size:36px;padding:16px 30px}
.one{background:#FAFAF9;color:#16130F;border-radius:22px;padding:26px 30px;font-size:34px;font-weight:600;display:flex;justify-content:space-between;align-items:center}
.one .word{font-size:36px;color:#16130F}
body.dark .one .word{color:#16130F}
.clash{display:flex;flex-direction:column;gap:16px}
.clash .row{border-color:#9A6B00}
.flag{align-self:center;background:#FBF3E0;color:#9A6B00;border-radius:999px;padding:10px 28px;font-size:30px;font-weight:600}
.fix{display:flex;align-items:center;gap:16px;font-size:30px;color:#0E7150;background:#EAF6F1;border-radius:18px;padding:18px 24px;font-weight:600}
.chat{display:flex;flex-direction:column;gap:12px;flex:1;justify-content:center;min-height:0}
.bub{max-width:78%;border-radius:22px;padding:14px 22px;font-size:28px;line-height:1.35}
.bub small{display:block;font-family:'Inter';font-size:20px;opacity:.6;direction:ltr;text-align:left;margin-top:4px}
.me{align-self:flex-start;background:#1F4D3A;color:#fff;border-bottom-right-radius:6px}
.them{align-self:flex-end;background:#2A2520;color:#FAFAF9;border:2px solid #3A342D;border-bottom-left-radius:6px}
.stack{display:flex;flex-direction:column;gap:14px;flex:1;justify-content:center}
.note{display:flex;gap:18px;align-items:center;background:#2A2520;border:2px solid #3A342D;border-radius:18px;padding:18px 24px;font-size:29px}
.note i{width:14px;height:14px;border-radius:50%;background:#A8481B;flex:none}
.more{align-self:center;direction:ltr;font-family:'Inter';font-weight:600;font-size:40px;color:#A8481B}
.checks{display:flex;flex-direction:column;gap:18px;justify-content:center;flex:1}
.check{display:flex;gap:20px;align-items:center;font-size:37px}
.check b{width:52px;height:52px;border-radius:50%;background:#EAF6F1;color:#0E7150;display:flex;align-items:center;justify-content:center;font-family:'Inter';flex:none}
.vs{display:grid;grid-template-columns:1fr 1fr;gap:20px;flex:1;min-height:0}
.col{border-radius:24px;padding:28px;display:flex;flex-direction:column;gap:18px;justify-content:center}
.col h3{font-size:34px;font-weight:600}
.col.before{background:#F4F2EF;border:2px solid #E6E3DE}.col.before h3{color:#6B645B}
.col.after{background:#EAF6F1;border:2px solid #BFE3D3}.col.after h3{color:#0E7150}
.col .it{background:#fff;border-radius:16px;padding:20px 22px;font-size:31px;line-height:1.35}
.col.before .it{color:#6B645B;text-decoration:line-through;text-decoration-color:#C9C3BA}
.steps3{display:flex;flex-direction:column;gap:20px;flex:1;justify-content:center}
.s3{display:flex;gap:24px;align-items:center;background:#fff;border:2px solid #E6E3DE;border-radius:22px;padding:24px 28px;font-size:32px}
.s3 b{font-family:'Inter';font-size:44px;color:#A8481B;width:56px;text-align:center;flex:none}
.s3 small{display:block;font-size:24px;color:#787165;margin-top:4px}
"""

CHAT_LABEL = '<span class="demo">محادثة توضيحية</span>'


# ---- B: dark pain series -------------------------------------------------
def b_system():
    apps = [("Airbnb", "acc"), ("Booking", "info"), ("جاذر إن", "ok"), ("واتساب", "ok"),
            ("إكسل", "warn"), ("قروب العمال", "warn"), ("ملاحظات الجوال", "info")]
    cloud = "".join(f'<span class="chip {c}" style="transform:rotate({(-4, 3, -2, 5, -3, 2, -5)[i]}deg)">{n}</span>'
                    for i, (n, c) in enumerate(apps))
    return (f'<div class="panel"><div class="cloud">{cloud}</div>'
            f'<div class="one"><span>كلها في نظام واحد</span><span class="word">Suit<b>i</b>ee</span></div></div>')


def b_calendar():
    return f'''<div class="panel"><div class="ph"><strong>شقة 107 · الخميس</strong><span>ليلة وحدة</span></div>
<div class="clash">{b.rows([("حجز · الخميس ليلة واحدة", "Airbnb", "محجوز", "acc"), ("حجز · الخميس ليلة واحدة", "Booking", "محجوز", "info")])}</div>
<span class="flag">نفس الليلة… مرتين</span>
<div class="fix">مع التقويم الموحّد: الليلة المحجوزة تتزامن مع باقي المنصات</div>{b.DEMO}</div>'''


def b_cleaning():
    msgs = [("me", "الضيف طلع من 107، تقدر تجي الحين؟", "12:04"), ("them", "أي شقة؟", "12:31"),
            ("me", "107 اللي بالملقا", "12:33"), ("them", "بعد العصر إن شاء الله", "13:10"),
            ("me", "الضيف الجاي يوصل 3 العصر", "13:11")]
    chat = "".join(f'<div class="bub {w}">{t}<small>{m}</small></div>' for w, t, m in msgs)
    return f'<div class="panel"><div class="ph"><strong>عامل النظافة</strong><span>واتساب</span></div><div class="chat">{chat}</div>{CHAT_LABEL}</div>'


def b_scale():
    notes = ["وين مفتاح شقة 204؟", "مين بينظف 311 اليوم؟", "حجز جديد على 102 من Booking", "الضيف يسأل عن باسورد الواي فاي", "تم الخروج من 107؟"]
    stack = "".join(f'<div class="note"><i></i>{n}</div>' for n in notes)
    return f'<div class="panel"><div class="ph"><strong>إشعارات اليوم</strong><span>قبل الظهر</span></div><div class="stack">{stack}<span class="more">+23</span></div>{b.DEMO}</div>'


def b_trial():
    items = ["حجوزات كل المنصات في تقويم واحد", "التنظيف يتجدول بعد كل خروج", "كل وحداتك وضيوفك في شاشة وحدة"]
    checks = "".join(f'<div class="check"><b>✓</b><span>{t}</span></div>' for t in items)
    return f'<div class="panel"><div class="ph"><strong>وش تجرب في 14 يوم</strong><span>على وحداتك الحالية</span></div><div class="checks">{checks}</div></div>'


# ---- C: before / after ---------------------------------------------------
def vs(before, after):
    col = lambda cls, h, items: f'<div class="col {cls}"><h3>{h}</h3>' + "".join(f'<div class="it">{i}</div>' for i in items) + '</div>'
    return f'<div class="panel" style="background:none;border:0;box-shadow:none;padding:0"><div class="vs">{col("before", "قبل", before)}{col("after", "مع سويتي", after)}</div></div>'


def c_system():
    return vs(["4 تطبيقات مفتوحة", "قروب واتساب للعمال", "إكسل للحجوزات"], ["نظام واحد", "مهام التنظيف تلقائي", "تقويم واحد لكل وحدة"])


def c_calendar():
    return vs(["تفتح كل منصة لحالها", "تحدّث التواريخ يدوي", "تخاف من الحجز المكرر"], ["تقويم واحد لكل وحدة", "المنصات تتزامن تلقائي", "الليلة المحجوزة تنقفل"])


def c_cleaning():
    return vs(["تراسل العامل بعد كل خروج", "تنتظر رده", "ما تدري خلص ولا لا"], ["المهمة توصل للعامل تلقائي", "صور بعد التنظيف", "تعرف إن الوحدة جاهزة"])


# ---- R: retargeting ------------------------------------------------------
def r_steps():
    s = [("1", "أضف وحداتك", "شقق، أجنحة، فلل"), ("2", "اربط منصاتك", "Airbnb · Booking · جاذر إن"), ("3", "خلّ التنظيف يتجدول لحاله", "بعد كل خروج")]
    rows = "".join(f'<div class="s3"><b>{n}</b><div>{t}<small>{m}</small></div></div>' for n, t, m in s)
    return f'<div class="panel" style="background:none;border:0;box-shadow:none;padding:0"><div class="steps3">{rows}</div></div>'


def r_think():
    return b.panel_trial()


# key, family, title, sub, panel, dark?
CONCEPTS = [
    ("B1-system", "لسا تدير وحداتك من 4 تطبيقات وقروب واتساب؟", "خلّ الحجوزات والضيوف والتنظيف في نظام واحد.", b_system, True),
    ("B2-calendar", "نفس الليلة… انحجزت مرتين؟", "سويتي يجمع حجوزات Airbnb وBooking وجاذر إن في تقويم واحد.", b_calendar, True),
    ("B3-cleaning", "لسا تلاحق عامل النظافة بالواتساب بعد كل خروج؟", "مع سويتي التنظيف يتجدول لحاله.", b_cleaning, True),
    ("B4-scale", "كل ما زادت وحداتك… زادت الملاحقة؟", "سويتي يجمع وحداتك كلها في شاشة وحدة.", b_scale, True),
    ("B5-trial", "14 يوم. بدون بطاقة.", "جرّب سويتي على وحداتك الحالية.", b_trial, True),
    ("C1-system", "نفس وحداتك… بس بنظام واحد", "الحجوزات والضيوف والتنظيف في مكان واحد.", c_system, False),
    ("C2-calendar", "قبل وبعد التقويم الموحّد", "كل منصاتك تتزامن في تقويم واحد لكل وحدة.", c_calendar, False),
    ("C3-cleaning", "قبل وبعد التنظيف التلقائي", "أول ما يطلع الضيف، المهمة توصل للعامل.", c_cleaning, False),
    ("R1-steps", "تبدأ مع سويتي بـ3 خطوات", "وتجربتك المجانية 14 يوم، بدون بطاقة.", r_steps, False),
    ("R2-think", "لسا تفكر؟ جرّبه على وحداتك", "14 يوم مجانًا. بدون بطاقة بنكية.", r_think, False),
]


def page(title, sub, panel, size, dark):
    h, pt, pb, gap, h1 = b.SIZES[size]
    return f"""<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{b.css_fonts}{b.BASE_CSS}{DARK_CSS}
:root{{--h:{h}px;--pt:{pt};--pb:{pb};--gap:{gap};--h1:{h1}}}</style></head><body class="{'dark' if dark else ''}">
<div class="brand"><span class="word">Suit<b>i</b>ee</span><span>سويتي</span></div>
<h1>{title}</h1><p class="sub">{sub}</p>{panel()}
<div class="cta"><span class="btn">ابدأ تجربة 14 يوم مجانًا</span><span class="fine">suitiee.com</span></div>
</body></html>"""


def main():
    out = b.HERE / "html"
    out.mkdir(exist_ok=True)
    jobs = []
    for key, title, sub, panel, dark in CONCEPTS:
        for size, (h, *_) in b.SIZES.items():
            f = out / f"{key}_{size}.html"
            f.write_text(page(title, sub, panel, size, dark), encoding="utf-8")
            jobs.append({"html": str(f), "png": str(b.HERE / "v2" / f"{key}_{size}.png"), "h": h})
    (b.HERE / "v2").mkdir(exist_ok=True)
    (out / "jobs_v2.json").write_text(json.dumps(jobs), encoding="utf-8")
    print(len(jobs), "pages written")


if __name__ == "__main__":
    main()
