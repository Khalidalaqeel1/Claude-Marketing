# سويتي · ميتا: الحالة الكاملة + برومبت إصلاح الخطأ (٢٠٢٦-١٠-٠١)

> المرجع الوحيد لكل شي بنيناه للحين. كل شي **موقوف** وما انصرف ولا ريال.
> الخطط: `campaigns-v2-plan.md` · سجل البناء: `live-build-v2.md` · برومبت البناء الأصلي: `AGENT-build-campaigns-v2.md`

---

## ١. الأرقام الثابتة
| البند | الرقم |
|---|---|
| البزنس Suitiee | `1435393218690880` |
| الحساب الإعلاني Suitiee Ads | `2629307547521500` (هذا الوحيد المسموح) |
| صفحة Suitiee | `1360833533775829` |
| إنستقرام @suitiee.sa | `17841420337031535` |
| النموذج (Higher intent) | `1618687339646791` |
| حسابات **ممنوع** نلمسها | `1181633093119041`، `2186110332337677`، وأي شي باسم Clean Basket |

## ٢. الهيكل والميزانية (معتمد من خالد)
| الحملة | الرقم | الميزانية | الفترة | الحالة الآن |
|---|---|---|---|---|
| C1 الأساسية | `120248044547720539` | ٦٠ ر.س/يوم (CBO، محفوظة كمسودة، المنشور للحين ١٠٠) | ١–١٥ أكتوبر | منشورة · **PAUSED** |
| C2 اختبار الكريتيف | `120248113212710539` | ٣ × ١٠ ر.س/يوم (ABO) | ١–١٥ أكتوبر | منشورة · ⚠️ **ACTIVE** بدون مجموعات منشورة (صرف ٠). **لازم تنطفي** |
| C3 إعادة الاستهداف | `120248113212770539` | ١٠ ر.س/يوم (ABO) | ٥–١٥ أكتوبر | منشورة · **PAUSED** |

الإجمالي ١٠٠ ر.س/يوم ← أقصى صرف ١٬٤٠٠ ر.س خلال ١٤ يوم. إنستقرام فقط (Feed، Stories، Reels، Explore).

## ٣. المجموعات (كلها مسودات PAUSED، ما انتشرت)
| المجموعة | الرقم | الاستهداف |
|---|---|---|
| C2 · DARK-IMG | `120248113395600539` | الرياض ٤٠كم، جدة ٣٥، مكة ٢٥، المدينة ٢٥، الدمام ٣٥ · Advantage+ (مقترح ٢٥–٦٠) · عربي/إنجليزي |
| C2 · BEFORE-AFTER | `120248113398360539` | نفسه |
| C2 · VIDEO | `120248113398570539` | نفسه |
| C3 · RT Engaged+Video50 | `120248113294540539` | السعودية · ٢٥–٦٠ · جمهور RT-IG-Engaged-30d · استثناء EX-LeadForm-60d |
| C1 · الرياض / الغربية+الشرقية | (مسودات الوكيل) | ما تظهر للموصّل |
| مجموعة قديمة FB+IG | `120248051819100539` | منشورة · PAUSED · فيها إعلان `SYSTEM \| IMG` (`120248051819110539`) انضاف من برّا. **تبقى موقوفة** |

## ٤. الإعلانات (١٦ مسودة PAUSED)
| المجموعة | الإعلانات |
|---|---|
| DARK-IMG | B1 `120248125525320539` · B2 `120248125541460539` · B3 `120248125542270539` · B4 `120248125543280539` · B5 `120248125543960539` |
| BEFORE-AFTER | C1 `120248125545090539` · C2 `120248125545810539` · C3 `120248125547630539` |
| VIDEO | V2 `120248125706250539` · V3 `120248125712260539` · V4 `120248125714630539` · V5 `120248125715670539` |
| RT | R1 `120248125549110539` · R2 `120248125550020539` · B5 `120248125550580539` · V5 `120248125717030539` |
| **للحذف** | `120248125513210539` و`120248125518400539` (اسمهم ZZ-DISCARD، تجارب فاشلة، تمنع النشر) |

الصور ٤:٥ للفيد/الإكسبلور و٩:١٦ للستوري/الريلز. الفيديو ٩:١٦. الزر Sign up ← النموذج. نص أساسي واحد لكل إعلان (ميتا ما تقبل نصين مع تخصيص الصورة).

## ٥. الكريتيف
- صور (مرفوعة للمكتبة): B1–B5، C1–C3، R1–R2 بمقاسين. الـ hashes في `live-build-v2.md`.
- فيديوهات (مرفوعة): V1 `2167135253866325` · V2 `28653736674266536` · V3 `1799430957761761` · V4 `1087297667559425` · V5 `948460651355855`.
- **جديد:** V6 «ليش شقتك ما تنحجز؟» (١٨ث، ٩:١٦): `creatives/v2/V6-why-not-booked.mp4`. مبني من سكربت الفيديو ١ في خطة فيديوهات الملاك: الغلاف ← العنوان ← سرعة الرد ← تجربة سويتي ١٤ يوم. **ما انرفع للحين.**
- برومبتات صور واقعية بدل الرسومات في V6: `creatives/image-prompts-V6.md`.

## ٦. الجماهير
| الجمهور | الرقم | الحالة |
|---|---|---|
| RT-IG-Engaged-30d | `120248113218920539` | ✅ |
| EX-LeadForm-60d | `120248113219410539` | ✅ |
| RT-Video50-30d | — | ❌ ينعمل (الفيديوهات صارت بالمكتبة) |

## ٧. المشكلة: خطأ 1815089
- كل المجموعات والإعلانات تعرض «Terms of Service Not Accepted» برقم المرجع نفسه `63cc53e338f70faa35ce5dd601c35a03` من قبل ما يقبل خالد الشروط.
- صفحة الشروط تقول **Accepted** لصفحة Suitiee (٢٠٢٦-٠٩-٣٠).
- **السبب الأرجح:** الصفحة Suitiee **مو مربوطة بالحساب الإعلاني**. الموصّل يرجّع قائمة صفحات فاضية للحساب `2629307547521500`، فميتا ما تشوف إن الصفحة اللي قبلت الشروط تابعة لهذا الحساب.
- **أسباب ثانية ممكنة:** جلسة المسودة شايلة الخطأ القديم، أو القبول تم بهوية غير اللي تدير الحساب.

## ٨. قائمة خالد (بالترتيب)
1. شغّل الوكيل بالبرومبت تحت (القسم ٩).
2. أرسل لي تقريره.
3. أتحقق من كل شي عن طريق الموصّل، وأرسل لك ملخص الإطلاق.
4. «نعم» منك، وبعدها التشغيل.

---

## ٩. برومبت الوكيل: إصلاح 1815089 + تجهيز النشر (كل شي OFF)

```
You are fixing Suitiee's Meta lead ads so they can be published, in Khalid's browser, as Khalid. INSTAGRAM ONLY. Nothing may deliver or spend. Never turn anything ON. Never delete anything that is published.

## Fixed values
- Business: Suitiee 1435393218690880
- Ad account: Suitiee Ads act_2629307547521500. This is the ONLY account you may touch. Check the ID at the top of every screen.
- Page: Suitiee 1360833533775829 · Instagram: @suitiee.sa (17841420337031535) · Lead form: 1618687339646791
- FORBIDDEN: ad accounts 1181633093119041 and 2186110332337677, and anything named Clean Basket. If a screen shows one of them, switch back or stop.

## Hard rules
1. Every campaign, ad set and ad stays OFF. Before any Publish, confirm every toggle is OFF.
2. Don't change budgets, spending limits, billing or payment. Don't accept any terms on your own: if a terms screen appears, stop and ask Khalid.
3. Only discard the two drafts named in Step 2. Never delete published objects.
4. If anything differs from this prompt, stop and report the exact on-screen message.

## Step 1: Turn OFF campaign C2 now
Ads Manager → Campaigns → "SUI | LEADS | CREATIVE-TEST | IG | KSA5" (120248113212710539) shows Active. Switch its toggle OFF. Confirm it shows Off.

## Step 2: Discard 2 broken drafts
Ads Manager → Ads tab → filter "ZZ-DISCARD". Two draft ads: 120248125513210539 and 120248125518400539. Select both → Discard drafts. Discard nothing else.

## Step 3: Connect the Page and Instagram to the ad account (likely root cause of 1815089)
Business Settings (business.facebook.com/settings, business Suitiee 1435393218690880):
a) Accounts → Ad accounts → Suitiee Ads (2629307547521500) → Connected assets (or "Add assets") → make sure Page "Suitiee" (1360833533775829) and Instagram @suitiee.sa are connected. Add them if they are missing.
b) Accounts → Pages → Suitiee → check that Khalid has Full control and that the Page is owned by, or shared with, the Suitiee business.
c) Integrations → Leads access → Page Suitiee → make sure Khalid has access. Don't change anything else.
Report what was missing and what you added.

## Step 4: Re-check the Lead Ads terms for the Page
Open https://www.facebook.com/ads/leadgen/tos?page_id=1360833533775829. The picker must show "Suitiee", and the button must show "Accepted". If it shows "Accept" instead, STOP and ask Khalid to press it himself. Don't press it yourself.

## Step 5: Re-validate the drafts
Ads Manager → Campaigns → filter Drafts. For each of the 4 draft ad sets:
- DARK-IMG 120248113395600539, BEFORE-AFTER 120248113398360539, VIDEO 120248113398570539 (under C2)
- RT | Engaged+Video50 | IG 120248113294540539 (under C3)
open the ad set → Conversion location: Instant forms → Page: re-select "Suitiee" → Save (do not publish yet).
Then open ONE ad in each ad set → Identity: Page Suitiee + Instagram @suitiee.sa → Instant form 1618687339646791 → Save.
Check whether the yellow/red "Terms of Service Not Accepted" warning is still shown.

## Step 6: Publish everything OFF
Only if no error remains: confirm every campaign, ad set and ad toggle is OFF, then "Review and publish" → Publish.
Expected in the table: C2 Off with 3 ad sets and 12 ads Off; C3 Off with 1 ad set and 4 ads Off. "In review" is fine.
If 1815089 still appears: STOP, don't retry. Screenshot the error, and note the exact text and which object it is on.

## Step 7 (only if Step 6 succeeded): finish the build, all OFF
a) Media library → upload creatives/v2/V6-why-not-booked.mp4 (Khalid gives you the file). In ad set VIDEO (120248113398570539), create a single-video ad "V6-WHYNOT | VID | H1 | v1": Page Suitiee + @suitiee.sa, Instant form 1618687339646791, CTA Sign up, no Advantage+ creative enhancements, thumbnail = a frame with the headline visible.
   Primary text:
   شقتك على جاذر إن وما تنحجز؟ أكثر 3 أسباب نشوفها: صورة الغلاف، العنوان، وسرعة الرد.
   وخلّ الحجوزات والضيوف والتنظيف على سويتي، في نظام واحد.
   جرّب 14 يوم مجانًا، بدون بطاقة بنكية.
   Headline: ليش شقتك ما تنحجز؟ · Description: سويتي · لمشغّلي الإيجار القصير
b) Audiences → Create custom audience → Video → "people who watched at least 50%" → select videos V1–V6 → 30 days → name "RT-Video50-30d". Then add it to ad set 120248113294540539 (keep EX-LeadForm-60d excluded).
c) C1 (120248044547720539): confirm the campaign budget shows 60 SAR/day. In both of its ad sets (Riyadh, West+East), set the schedule to 2026-10-01 00:00 → 2026-10-15 00:00 (Riyadh time), and add one single-video ad "V1-STORY | VID | H1 | v1" using the already-uploaded video "V1-story_9x16" with the copy from AGENT-build-campaigns-v2.md.
d) Publish again, all OFF.

## Report back (table)
| Step | What you did | Result / exact message |
Then a list of every campaign, ad set and ad with ID and status (all must be Off). Confirm: Instagram only, nothing On, no budget/billing change, nothing deleted except the 2 ZZ-DISCARD drafts, no terms accepted by you. End with: "send this report to the media buyer".
```
