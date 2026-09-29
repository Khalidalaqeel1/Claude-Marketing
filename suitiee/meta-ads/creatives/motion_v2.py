#!/usr/bin/env python3
"""Short 9:16 motion cuts (6-13s) for Reels/Stories, one hook each, built like motion.py.

V2 double-booking · V3 cleaning chat · V4 chaos→one system · V5 14-day bumper.
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


def main():
    h, pt, pb, gap, h1 = b.SIZES["9x16"]
    videos = []
    for name, sc, dark, body in (v2_double(), v3_chat(), v4_chaos(), v5_bumper()):
        page = f"""<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{b.css_fonts}{b.BASE_CSS}{v2.DARK_CSS}
:root{{--h:{h}px;--pt:{pt};--pb:{pb};--gap:{gap};--h1:{h1}}}{MOTION_CSS}{EXTRA}</style></head><body class="{'dark' if dark else ''}">
<div class="brand"><span class="word">Suit<b>i</b>ee</span><span>سويتي</span></div>
{body}
</body></html>"""
        (OUT / f"{name}.html").write_text(page, encoding="utf-8")
        videos.append({"name": name, "seconds": sc[-1][1]})
    (OUT / "videos_v2.json").write_text(json.dumps(videos), encoding="utf-8")
    print(videos)


if __name__ == "__main__":
    main()
