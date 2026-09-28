#!/usr/bin/env python3
"""Build the 22s 9:16 motion ad (HTML + CSS animations) from the static creatives.

Scenes: hook → one system → calendar → cleaning → scale → 14-day trial CTA.
render_motion.js pauses every animation at each frame time and screenshots it.
"""
import re

import build as b

OUT = b.HERE / "html" / "motion_9x16.html"

# (start, end) seconds per scene
SCENES = [(0, 3.2), (3.2, 7.2), (7.2, 11.2), (11.2, 15.2), (15.2, 18.6), (18.6, 22)]
DURATION = SCENES[-1][1]

MOTION_CSS = """
html,body{height:1920px;overflow:hidden}
body{padding:300px 84px 380px;display:block;position:relative}
.brand{position:absolute;top:220px;left:84px;right:84px}
.scene{position:absolute;left:84px;right:84px;top:320px;bottom:380px;display:flex;flex-direction:column;justify-content:center;gap:48px;opacity:0}
.scene h1{font-size:76px}
.panel{flex:none}
@keyframes sceneIn{0%{opacity:0;transform:translateY(40px)}100%{opacity:1;transform:none}}
@keyframes sceneOut{0%{opacity:1}100%{opacity:0;transform:translateY(-30px)}}
@keyframes up{0%{opacity:0;transform:translateY(36px)}100%{opacity:1;transform:none}}
@keyframes pop{0%{opacity:0;transform:scale(.6)}70%{transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
@keyframes grow{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}
@keyframes fly{0%{opacity:1;transform:none}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.3)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
.a{opacity:0;animation-fill-mode:both;animation-timing-function:cubic-bezier(.2,.8,.2,1)}
.bar{transform-origin:right center}
.chips{display:flex;flex-wrap:wrap;gap:22px;justify-content:center;margin-top:30px}
.chips .chip{font-size:40px;padding:18px 34px}
.count{font-family:'Inter';font-weight:600;font-size:150px;direction:ltr;text-align:center;line-height:1}
.cta{position:absolute;left:0;right:0;bottom:0}
"""


def a(anim, t, dur=0.6, extra=""):
    return f'style="animation:{anim} {dur}s {t:.2f}s both;{extra}"'


def scene(i, inner):
    s, e = SCENES[i]
    out = "" if i == len(SCENES) - 1 else f",sceneOut .4s {e - .4:.2f}s forwards"
    return f'<section class="scene" style="animation:sceneIn .5s {s:.2f}s both{out}">{inner}</section>'


def hook():
    s = SCENES[0][0]
    apps = [("Airbnb", "acc", "-300px", "500px"), ("Booking", "info", "300px", "480px"),
            ("جاذر إن", "ok", "-260px", "420px"), ("واتساب", "ok", "260px", "400px"),
            ("إكسل", "warn", "0px", "520px"), ("قروب العمال", "warn", "0px", "450px")]
    chips = "".join(
        f'<span class="chip {c} a" style="--dx:{dx};--dy:{dy};animation:pop .4s {s + .5 + k * .15:.2f}s both,fly .5s {s + 2.4:.2f}s forwards">{n}</span>'
        for k, (n, c, dx, dy) in enumerate(apps))
    return scene(0, f'<h1 class="a" {a("up", s + .1)}>كم تطبيق تفتح عشان تدير وحداتك؟</h1><div class="chips">{chips}</div>')


def system():
    s = SCENES[1][0]
    rows = [("حجز جديد · شقة 102", "09:14", "Airbnb", "info"), ("وصل الضيف · شقة 204", "11:30", "تم الدخول", "ok"),
            ("خروج الضيف · شقة 107", "12:00", "تنظيف مجدول", "warn"), ("تنظيف مكتمل · شقة 311", "13:45", "موثّق بالصور", "ok")]
    r = "".join(f'<div class="row a" {a("up", s + .8 + k * .35)}><span class="t">{t}</span><span class="m">{m}</span><span class="chip {c}">{x}</span></div>'
                for k, (t, m, x, c) in enumerate(rows))
    return scene(1, f'<h1 class="a" {a("up", s + .2)}>الحجوزات والضيوف والتنظيف… في نظام واحد</h1>'
                    f'<div class="panel a" {a("up", s + .5)}><div class="ph"><strong>اليوم</strong><span>كل وحداتك</span></div>{r}{b.DEMO}</div>')


def calendar():
    s = SCENES[2][0]
    count = iter(range(100))
    html = re.sub(r'class="bar (\w+)" style="',
                  lambda m: f'class="bar {m.group(1)}" style="animation:grow .5s {s + .8 + next(count) * .2:.2f}s both;',
                  b.panel_calendar())
    return scene(2, f'<h1 class="a" {a("up", s + .2)}>Airbnb وBooking وجاذر إن… كل حجوزاتك في تقويم واحد</h1>'
                    f'<div class="a" {a("up", s + .5)}>{html}</div>')


def cleaning():
    s = SCENES[3][0]
    steps = [("#1B5DA6", "خروج الضيف · شقة 107", "12:00"), ("#9A6B00", "انرسلت مهمة التنظيف للعامل تلقائيًا", "12:01"),
             ("#0E7150", "تم التنظيف · 8 صور", "13:40"), ("#16130F", "الوحدة جاهزة للضيف الجاي", "15:00")]
    tl = "".join(f'<div class="step a" {a("up", s + .8 + k * .6)}><span class="dot" style="background:{c}"></span><div class="x">{t}<small>{m}</small></div></div>'
                 for k, (c, t, m) in enumerate(steps))
    return scene(3, f'<h1 class="a" {a("up", s + .2)}>الضيف يطلع… والتنظيف يتجدول لحاله</h1>'
                    f'<div class="panel a" {a("up", s + .5)}><div class="ph"><strong>بعد كل خروج</strong><span>تلقائي</span></div><div class="tl">{tl}</div>{b.DEMO}</div>')


def scale():
    s = SCENES[4][0]
    nums = "".join(f'<span class="a" style="position:absolute;inset:0;display:block;text-align:center;animation:pop .25s {s + .6 + k * .35:.2f}s both{"" if k == 4 else f",sceneOut .1s {s + .95 + k * .35:.2f}s forwards"}">{n}</span>'
                   for k, n in enumerate(["5", "12", "20", "35", "50"]))
    return scene(4, f'<h1 class="a" {a("up", s + .2)}>من 5 وحدات لـ50… بدون فوضى</h1>'
                    f'<div class="count" style="position:relative;height:160px">{nums}</div>'
                    f'<p class="sub a" {a("up", s + 2.2, extra="max-width:none;text-align:center")}>وحداتك كلها من مكان واحد.</p>')


def trial():
    s = SCENES[5][0]
    return scene(5, f'<h1 class="a" {a("up", s + .2, extra="text-align:center")}>جرّب سويتي</h1>'
                    f'<div class="big a" {a("pop", s + .5)}>14</div>'
                    f'<div class="a" {a("up", s + .8, extra="font-size:56px;font-weight:600;text-align:center")}>يوم مجانًا</div>'
                    f'<div class="a" {a("up", s + 1.1, extra="text-align:center")}><span class="chip ok" style="font-size:34px;padding:12px 28px">بدون بطاقة بنكية</span></div>'
                    f'<div class="cta a" {a("up", s + 1.5)}><span class="btn" style="animation:pulse 1.2s {s + 2.2:.2f}s 2">ابدأ تجربة 14 يوم مجانًا</span><span class="fine">suitiee.com</span></div>')


def main():
    h, pt, pb, gap, h1 = b.SIZES["9x16"]
    page = f"""<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{b.css_fonts}{b.BASE_CSS}
:root{{--h:{h}px;--pt:{pt};--pb:{pb};--gap:{gap};--h1:{h1}}}{MOTION_CSS}</style></head><body>
<div class="brand"><span class="word">Suit<b>i</b>ee</span><span>سويتي</span></div>
{hook()}{system()}{calendar()}{cleaning()}{scale()}{trial()}
</body></html>"""
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(page, encoding="utf-8")
    print(OUT, DURATION)


if __name__ == "__main__":
    main()
