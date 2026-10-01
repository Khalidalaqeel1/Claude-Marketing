#!/usr/bin/env python3
"""Short 9:16 motion cuts (6-13s) for Reels/Stories, one hook each, built like motion.py.

V2 double-booking · V3 cleaning chat · V4 chaos→one system · V5 14-day bumper · V6 why-not-booked.
usage: python3 motion_v2.py <fonts_dir>  → html/V*.html + html/videos_v2.json (name, seconds)
"""
import json
import re

import build as b
import build_v2 as v2
from motion import MOTION_CSS, a

OUT = b.HERE / "html"
EXTRA = """
@keyframes inR{0%{opacity:0;transform:translateX(-120px)}100%{opacity:1;transform:none}}
@keyframes inL{0%{opacity:0;transform:translateX(120px)}100%{opacity:1;transform:none}}
@keyframes shake{0%,100%{transform:none}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
.center{text-align:center}
"""


def scene(scenes, i, inner):
    s, e = scenes[i]
    out = "" if i == len(scenes) - 1 else f",sceneOut .4s {e - .4:.2f}s forwards"
    return f'<section class="scene" style="animation:sceneIn .5s {s:.2f}s both{out}">{inner}</section>'


def cta(scenes, i, dark):
    s = scenes[i][0]
    col = "#FAFAF9" if dark else "#16130F"
    return scene(scenes, i,
                 f'<h1 class="a center" {a("up", s + .2)}>جرّب سويتي</h1>'
                 f'<div class="big a" {a("pop", s + .45, extra=f"color:{col}")}>14</div>'
                 f'<div class="a" {a("up", s + .7, extra="font-size:56px;font-weight:600;text-align:center")}>يوم مجانًا</div>'
                 f'<div class="a" {a("up", s + .9, extra="text-align:center")}><span class="chip ok" style="font-size:34px;padding:12px 28px">بدون بطاقة بنكية</span></div>'
                 f'<div class="cta a" {a("up", s + 1.2)}><span class="btn" style="animation:pulse 1.2s {s + 1.8:.2f}s 2">ابدأ تجربة 14 يوم مجانًا</span><span class="fine">suitiee.com</span></div>')


def calendar_bars(s):
    count = iter(range(100))
    return re.sub(r'class="bar (\w+)" style="',
                  lambda m: f'class="bar {m.group(1)}" style="animation:grow .5s {s + .8 + next(count) * .18:.2f}s both;',
                  b.panel_calendar())


def v2_double():
    sc = [(0, 4.2), (4.2, 8.2), (8.2, 11)]
    s = 0
    rows = [("حجز · الخميس ليلة واحدة", "Airbnb", "محجوز", "acc", "inR", .8), ("حجز · الخميس ليلة واحدة", "Booking", "محجوز", "info", "inL", 1.4)]
    r = "".join(f'<div class="row a" {a(an, s + t, .5)}><span class="t">{x}</span><span class="m">{m}</span><span class="chip {c}">{y}</span></div>'
                for x, m, y, c, an, t in rows)
    one = scene(sc, 0, f'<h1 class="a" {a("up", s + .1)}>نفس الليلة… انحجزت مرتين؟</h1>'
                       f'<div class="panel"><div class="ph"><strong>شقة 107 · الخميس</strong><span>ليلة وحدة</span></div><div class="clash">{r}</div>'
                       f'<span class="flag a" style="animation:pop .4s {s + 2.1:.2f}s both,shake .5s {s + 2.6:.2f}s">تعارض</span>{b.DEMO}</div>')
    s = sc[1][0]
    two = scene(sc, 1, f'<h1 class="a" {a("up", s + .2)}>مع سويتي: تقويم واحد لكل وحدة</h1>'
                       f'<div class="a" {a("up", s + .5)}>{calendar_bars(s)}</div>')
    return "V2-double-booking", sc, True, one + two + cta(sc, 2, True)


def v3_chat():
    sc = [(0, 5.6), (5.6, 10.2), (10.2, 13)]
    s = 0
    msgs = [("me", "الضيف طلع من 107، تقدر تجي الحين؟", "12:04"), ("them", "أي شقة؟", "12:31"),
            ("me", "107 اللي بالملقا", "12:33"), ("them", "بعد العصر إن شاء الله", "13:10"),
            ("me", "الضيف الجاي يوصل 3 العصر", "13:11")]
    chat = "".join(f'<div class="bub {w} a" {a("pop", s + .7 + k * .8, .35)}>{t}<small>{m}</small></div>' for k, (w, t, m) in enumerate(msgs))
    one = scene(sc, 0, f'<h1 class="a" {a("up", s + .1)}>بعد كل خروج… نفس الملاحقة؟</h1>'
                       f'<div class="panel"><div class="ph"><strong>عامل النظافة</strong><span>واتساب</span></div><div class="chat">{chat}</div>{v2.CHAT_LABEL}</div>')
    s = sc[1][0]
    steps = [("#1B5DA6", "خروج الضيف · شقة 107", "12:00"), ("#9A6B00", "انرسلت مهمة التنظيف للعامل تلقائيًا", "12:01"),
             ("#0E7150", "تم التنظيف · 8 صور", "13:40"), ("#FAFAF9", "الوحدة جاهزة للضيف الجاي", "15:00")]
    tl = "".join(f'<div class="step a" {a("up", s + .7 + k * .6)}><span class="dot" style="background:{c}"></span><div class="x" style="background:#2A2520;border-color:#3A342D">{t}<small>{m}</small></div></div>'
                 for k, (c, t, m) in enumerate(steps))
    two = scene(sc, 1, f'<h1 class="a" {a("up", s + .2)}>مع سويتي… التنظيف يتجدول لحاله</h1>'
                       f'<div class="panel"><div class="ph"><strong>بعد كل خروج</strong><span>تلقائي</span></div><div class="tl">{tl}</div>{b.DEMO}</div>')
    return "V3-cleaning-chat", sc, True, one + two + cta(sc, 2, True)


def v4_chaos():
    sc = [(0, 4.4), (4.4, 7.6), (7.6, 10.4)]
    s = 0
    apps = [("Airbnb", "acc", "-300px", "500px"), ("Booking", "info", "300px", "480px"), ("جاذر إن", "ok", "-260px", "420px"),
            ("واتساب", "ok", "260px", "400px"), ("إكسل", "warn", "0px", "520px"), ("قروب العمال", "warn", "-120px", "450px"),
            ("ملاحظات الجوال", "info", "140px", "470px")]
    chips = "".join(f'<span class="chip {c} a" style="--dx:{dx};--dy:{dy};animation:pop .35s {s + .6 + k * .22:.2f}s both,fly .5s {s + 3.5:.2f}s forwards">{n}</span>'
                    for k, (n, c, dx, dy) in enumerate(apps))
    one = scene(sc, 0, f'<h1 class="a" {a("up", s + .1)}>لسا تدير وحداتك من 4 تطبيقات وقروب واتساب؟</h1><div class="chips">{chips}</div>')
    s = sc[1][0]
    two = scene(sc, 1, f'<div class="one a" {a("pop", s + .3, .5)}><span>كلها في نظام واحد</span><span class="word">Suit<b>i</b>ee</span></div>'
                       f'<p class="sub a" {a("up", s + .9, extra="max-width:none;text-align:center")}>الحجوزات والضيوف والتنظيف… في مكان واحد.</p>')
    return "V4-chaos-to-one", sc, True, one + two + cta(sc, 2, True)


def v5_bumper():
    sc = [(0, 6)]
    s = 0
    inner = (f'<h1 class="a center" {a("up", s + .1)}>كل وحداتك في شاشة وحدة</h1>'
             f'<div class="big a" {a("pop", s + .6)}>14</div>'
             f'<div class="a" {a("up", s + .9, extra="font-size:56px;font-weight:600;text-align:center")}>يوم مجانًا</div>'
             f'<div class="a" {a("up", s + 1.2, extra="text-align:center")}><span class="chip ok" style="font-size:34px;padding:12px 28px">بدون بطاقة بنكية</span></div>'
             f'<div class="cta a" {a("up", s + 1.6)}><span class="btn" style="animation:pulse 1.2s {s + 2.4:.2f}s 3">ابدأ تجربة 14 يوم مجانًا</span><span class="fine">suitiee.com</span></div>')
    return "V5-trial-bumper", sc, False, scene(sc, 0, inner)


LISTING_CSS = """
.lst{background:#fff;border:2px solid #E6E3DE;border-radius:24px;overflow:hidden;box-shadow:0 30px 60px -30px rgba(22,19,15,.25)}
.lst .linfo{padding:20px 26px;font-size:30px;display:flex;justify-content:space-between;align-items:center}
.lst .linfo small{font-family:'Inter';color:#787165;font-size:24px;direction:ltr}
.cover{height:420px;position:relative;overflow:hidden}
.cover.dim{background:linear-gradient(180deg,#3B342C,#1E1A16)}
.cover.lit{background:linear-gradient(180deg,#F7EBDA,#FFF9F1)}
.cover .win{position:absolute;top:50px;right:70px;width:230px;height:190px;border-radius:12px}
.cover.dim .win{background:#4A4238}.cover.lit .win{background:#CFE6F5;box-shadow:0 0 80px 30px rgba(255,236,200,.8)}
.cover .sofa{position:absolute;bottom:60px;left:60px;right:60px;height:120px;border-radius:30px 30px 14px 14px}
.cover.dim .sofa{background:#2C2620}.cover.lit .sofa{background:#C9B79C}
.cover .lamp{position:absolute;top:70px;left:90px;width:60px;height:60px;border-radius:50%}
.cover.lit .lamp{background:#FFE7B0;box-shadow:0 0 60px 20px #FFE7B0}
.cover .tag{position:absolute;top:18px;left:18px;font-size:24px;padding:6px 16px;border-radius:999px;background:rgba(255,255,255,.85);color:#16130F}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.pair .cover{height:360px;border-radius:22px}
.lbl{text-align:center;font-size:30px;font-weight:600;margin-top:10px}
.title-old{font-size:44px;color:#9A938A;text-decoration:line-through;text-align:center}
.title-new{font-size:44px;font-weight:600;text-align:center;background:#EAF6F1;color:#0E7150;border-radius:20px;padding:24px}
"""


def cover(kind, tag=""):
    t = f'<span class="tag">{tag}</span>' if tag else ""
    return f'<div class="cover {kind}"><div class="win"></div><div class="lamp"></div><div class="sofa"></div>{t}</div>'


def v6_listing():
    """'ليش شقتك ما تنحجز؟' from the owner video plan (video 1): 3 listing tips, then the Suitiee trial.
    Covers are drawn shapes (illustrative); swap for generated photos, see prompts in campaigns-v2-plan.md."""
    sc = [(0, 3.4), (3.4, 7.4), (7.4, 10.8), (10.8, 14.4), (14.4, 18)]
    s = 0
    one = scene(sc, 0, f'<h1 class="a" {a("up", s + .1)}>شقتك على جاذر إن… وما تنحجز؟</h1>'
                       f'<div class="lst a" {a("up", s + .5)}>{cover("dim")}<div class="linfo"><span>شقة مفروشة</span><small>0 bookings</small></div></div>'
                       f'<p class="sub a" {a("up", s + 1.4, extra="max-width:none")}>أكثر ٣ أسباب نشوفها…</p>')
    s = sc[1][0]
    two = scene(sc, 1, f'<h1 class="a" {a("up", s + .1)}>١) صورة الغلاف</h1>'
                       f'<div class="pair"><div class="a" {a("inL", s + .5, .5)}>{cover("dim")}<div class="lbl" style="color:#9A938A">معتمة</div></div>'
                       f'<div class="a" {a("inR", s + 1.1, .5)}>{cover("lit")}<div class="lbl" style="color:#0E7150">مضيئة ✓</div></div></div>'
                       f'<p class="sub a" {a("up", s + 1.8, extra="max-width:none")}>الضيف يقرر بثانيتين.</p>')
    s = sc[2][0]
    three = scene(sc, 2, f'<h1 class="a" {a("up", s + .1)}>٢) العنوان</h1>'
                         f'<div class="title-old a" {a("up", s + .6)}>شقة مفروشة</div>'
                         f'<div class="title-new a" {a("pop", s + 1.4, .5)}>غرفتين · دخول ذاتي · موقف خاص</div>'
                         f'<p class="sub a" {a("up", s + 2.0, extra="max-width:none")}>اكتب وش يميزك.</p>')
    s = sc[3][0]
    rows = (f'<div class="row a" {a("inL", s + .6, .5)}><span class="t">رد بعد ٣ ساعات</span><span class="chip warn">راح الحجز</span></div>'
            f'<div class="row a" {a("inR", s + 1.3, .5)}><span class="t">رد بعد دقيقتين</span><span class="chip ok">انحجزت</span></div>')
    four = scene(sc, 3, f'<h1 class="a" {a("up", s + .1)}>٣) سرعة الرد</h1>'
                        f'<div class="panel" style="flex:none">{rows}<span class="demo">مثال توضيحي</span></div>'
                        f'<p class="sub a" {a("up", s + 2.0, extra="max-width:none")}>اللي يرد أول ياخذ الحجز.</p>')
    s = sc[4][0]
    five = scene(sc, 4, f'<h1 class="a center" {a("up", s + .2)}>وخلّ التشغيل علينا</h1>'
                        f'<p class="sub a" {a("up", s + .6, extra="max-width:none;text-align:center")}>الحجوزات والضيوف والتنظيف في نظام واحد.</p>'
                        f'<div class="big a" {a("pop", s + 1.0)}>14</div>'
                        f'<div class="a" {a("up", s + 1.3, extra="font-size:52px;font-weight:600;text-align:center")}>يوم مجانًا · بدون بطاقة</div>'
                        f'<div class="cta a" {a("up", s + 1.6)}><span class="btn" style="animation:pulse 1.2s {s + 2.2:.2f}s 2">ابدأ تجربة 14 يوم مجانًا</span><span class="fine">suitiee.com</span></div>')
    return "V6-why-not-booked", sc, False, one + two + three + four + five


def main():
    h, pt, pb, gap, h1 = b.SIZES["9x16"]
    videos = []
    for name, sc, dark, body in (v2_double(), v3_chat(), v4_chaos(), v5_bumper(), v6_listing()):
        page = f"""<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{b.css_fonts}{b.BASE_CSS}{v2.DARK_CSS}
:root{{--h:{h}px;--pt:{pt};--pb:{pb};--gap:{gap};--h1:{h1}}}{MOTION_CSS}{EXTRA}{LISTING_CSS}</style></head><body class="{'dark' if dark else ''}">
<div class="brand"><span class="word">Suit<b>i</b>ee</span><span>سويتي</span></div>
{body}
</body></html>"""
        (OUT / f"{name}.html").write_text(page, encoding="utf-8")
        videos.append({"name": name, "seconds": sc[-1][1]})
    (OUT / "videos_v2.json").write_text(json.dumps(videos), encoding="utf-8")
    print(videos)


if __name__ == "__main__":
    main()
