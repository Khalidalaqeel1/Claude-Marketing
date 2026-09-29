# Browser-agent prompt: 3 campaigns, 35 creatives (all OFF)

Run this only after Khalid has said «نعم» to `campaigns-v2-plan.md`, **and** `AGENT-cleanup-ig-only.md` has finished.

```
You are building Suitiee's lead-ad campaigns in Meta Ads Manager, in Khalid's browser, as Khalid's personal profile. INSTAGRAM ONLY. Everything stays OFF. Nothing may deliver or spend.

## Fixed values
- Ad account: Suitiee Ads, act_2629307547521500. This is the ONLY account you may touch. Check the account ID at the top of Ads Manager before every step.
- Existing campaign (C1): 120248044547720539 "SUI | LEADS-FORM | STR-Operators | KSA-5cities | 2026-10-01"
- Page: Suitiee (1360833533775829). Instagram: @suitiee.sa
- Lead form (published, Higher intent): 1618687339646791
- Files: the repo folder suitiee/meta-ads/creatives/ (Khalid uploads them if you can't reach the repo).

## Hard rules
1. Every campaign, ad set and ad stays OFF. Before any "Publish", confirm every toggle is OFF.
2. Only change budgets exactly as written below. Don't touch the account spending limit, billing or payment. Don't touch ad accounts 1181633093119041 or 2186110332337677, or anything Clean Basket.
3. Don't accept any terms yourself. If "Terms of Service Not Accepted" (1815089) appears, stop and tell Khalid to open https://www.facebook.com/ads/leadgen/tos?page_id=1360833533775829 and accept as the Suitiee Page.
4. Never delete anything. Leave ad set 120248051819100539 "Riyadh | Adv+ 25-60 | FB+IG | CBO" OFF and empty.
5. If something looks different from this prompt, stop and report the exact message.

## Same for every ad set
- Placements: Manual. Instagram only: Feed, Stories, Reels, Explore. Uncheck Facebook, Messenger, Audience Network, Threads. Turn OFF "Allow limited spending to excluded placements".
- If "The current selected placement is not supported for forms using 'Higher Intent'" appears, uncheck Explore and try again. Never add Facebook.
- Conversion location: Instant forms. Performance goal: Maximize number of leads. Page: Suitiee.
- Audience: Advantage+ audience, suggested age 25–60, languages Arabic + English.
- KSA5 locations (each a pin + radius): Riyadh 40 km, Jeddah 35 km, Makkah 25 km, Madinah 25 km, Dammam 35 km.

## Same for every ad
- Identity: Page Suitiee + Instagram @suitiee.sa. Instant form 1618687339646791. CTA: Sign up.
- Image ads: single image. Use the 4:5 file for Feed/Explore and the 9:16 file for Stories/Reels (placement asset customization).
- Video ads: single video, the 9:16 mp4, for all 4 placements. Thumbnail: a frame where the headline is visible.
- Add BOTH primary texts ("Add text option"), plus the headline and description below.
- Advantage+ creative: turn OFF everything that changes text or adds music, overlays or animation. Keep only standard cropping. (The videos already have music.)

## Step 1: Upload media to the account library
- Images, 20 files: creatives/v2/B1…B5, C1…C3, R1…R2 (each _4x5.png and _9x16.png).
- Videos, 5 files: creatives/suitiee-motion-ad_9x16.mp4 (V1), plus creatives/v2/V2-double-booking.mp4, V3-cleaning-chat.mp4, V4-chaos-to-one.mp4, V5-trial-bumper.mp4.
- The A-series images (01…05) are already in the library.

## Step 2: C1 (existing campaign 120248044547720539)
- Campaign budget (CBO): change 100 → **60 SAR/day**. Don't change the campaign spending limit.
- In BOTH ad sets (Riyadh, West+East), add 1 video ad, "V1-STORY | VID | H1+H2 | v1" (copy below). Each ad set now has 6 ads (the 5 image ads + V1).

## Step 3: C2 (new campaign)
- Campaign: "SUI | LEADS | CREATIVE-TEST | IG | KSA5". Objective: Leads. Budget at ad-set level (ABO). Campaign spending limit: **420 SAR**. OFF.
- Ad set "DARK-IMG | KSA5 | Adv+ 25-60 | IG", 10 SAR/day: ads B1, B2, B3, B4, B5
- Ad set "BEFORE-AFTER | KSA5 | Adv+ 25-60 | IG", 10 SAR/day: ads C1, C2, C3
- Ad set "VIDEO | KSA5 | Adv+ 25-60 | IG", 10 SAR/day: ads V2, V3, V4, V5

## Step 4: Audiences + C3 (new campaign)
- Create custom audiences (Audiences → Create → Custom audience):
  - "RT-IG-Engaged-30d": Instagram account @suitiee.sa, everyone who engaged, 30 days.
  - "RT-Video50-30d": Video, people who watched at least 50%. Select all 5 videos above. 30 days.
  - "EX-LeadForm-60d": Lead form 1618687339646791, people who opened this form, 60 days.
- Campaign: "SUI | LEADS | RETARGET | IG | Engaged-30d". Objective: Leads. ABO. Campaign spending limit: **140 SAR**. OFF.
- Ad set "RT | Engaged+Video50 | IG", 10 SAR/day. Custom audiences: RT-IG-Engaged-30d + RT-Video50-30d. Exclude EX-LeadForm-60d. Locations: Saudi Arabia. Age 25–60. Advantage+ audience OFF, so it stays retargeting only.
- Ads: R1, R2, B5 (image) and V5 (video).

## Step 5: Save OFF and verify
- All toggles OFF, then Publish.
- In the table: 3 campaigns Off. C1: 2 ad sets, 12 ads. C2: 3 ad sets, 12 ads. C3: 1 ad set, 4 ads. "In review" is fine.

## Ad copy (headline · description = "سويتي · لمشغّلي الإيجار القصير" unless written otherwise)

V1-STORY | VID | H1+H2 | v1 · suitiee-motion-ad_9x16.mp4
  Text 1:
  كم تطبيق تفتح عشان تدير وحداتك؟
  سويتي يجمع الحجوزات والضيوف والتنظيف في نظام واحد.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة، أو جرّب سويتي 14 يوم مجانًا.
  Text 2:
  من التقويم للتنظيف… كل تشغيل وحداتك في مكان واحد.
  جرّب سويتي 14 يوم مجانًا، بدون بطاقة بنكية.
  Headline: الحجوزات والضيوف والتنظيف في نظام واحد

B1-APPS | IMG-DARK | H1+H2 | v1 · B1-system
  Text 1:
  Airbnb وBooking وجاذر إن وواتساب وإكسل وقروب العمال… كلها عشان تدير كم شقة؟
  سويتي يجمعها في نظام واحد.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Text 2:
  لسا تتنقل بين 4 تطبيقات وقروب واتساب؟
  خلّ الحجوزات والضيوف والتنظيف في مكان واحد مع سويتي.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Headline: كلها في نظام واحد

B2-DOUBLE | IMG-DARK | H1+H2 | v1 · B2-calendar
  Text 1:
  نفس الليلة انحجزت مرتين؟
  سويتي يجمع حجوزات Airbnb وBooking وجاذر إن في تقويم واحد لكل وحدة، ويتزامن تلقائيًا.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Text 2:
  كل منصة لها تقويم… وأنت تحدّثها كلها يدوي؟
  مع سويتي تقويم واحد لكل وحدة.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Headline: تقويم واحد لكل منصاتك

B3-CHAT | IMG-DARK | H1+H2 | v1 · B3-cleaning
  Text 1:
  "أي شقة؟"… "بعد العصر إن شاء الله"… والضيف الجاي يوصل 3.
  مع سويتي التنظيف يتجدول ويوصل للعامل تلقائيًا بعد كل خروج.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Text 2:
  لسا تلاحق عامل النظافة بالواتساب بعد كل خروج؟
  خلّ التنظيف يتجدول لحاله مع سويتي.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Headline: التنظيف يتجدول لحاله

B4-NOISE | IMG-DARK | H1+H2 | v1 · B4-scale
  Text 1:
  كل ما زادت وحداتك زادت الرسائل: وين المفتاح؟ مين بينظف؟ في حجز جديد؟
  سويتي يجمع وحداتك وضيوفها وتنظيفها في شاشة وحدة.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Text 2:
  تبي تزيد وحداتك بدون ما تزيد الفوضى؟
  شغّلها كلها من مكان واحد مع سويتي.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Headline: وحداتك كلها في شاشة وحدة

B5-TRIAL | IMG-DARK | H1+H2 | v1 · B5-trial
  Text 1:
  14 يوم. بدون بطاقة.
  جرّب سويتي على وحداتك الحالية: حجوزات كل المنصات في تقويم واحد، وتنظيف يتجدول بعد كل خروج.
  عبّئ بياناتك ونساعدك تبدأ.
  Text 2:
  جرّب قبل ما تقرر.
  سويتي 14 يوم مجانًا، بدون بطاقة بنكية.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Headline: 14 يوم مجانًا · بدون بطاقة

C1-VS-SYSTEM | IMG-VS | H1+H2 | v1 · C1-system
  Text 1:
  قبل: 4 تطبيقات، وقروب واتساب، وإكسل.
  مع سويتي: نظام واحد للحجوزات والضيوف والتنظيف.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Text 2:
  نفس وحداتك… بس بنظام واحد.
  جرّب سويتي 14 يوم مجانًا، بدون بطاقة بنكية.
  Headline: نفس وحداتك، بنظام واحد

C2-VS-CALENDAR | IMG-VS | H1+H2 | v1 · C2-calendar
  Text 1:
  قبل: تفتح كل منصة لحالها وتحدّث التواريخ يدوي.
  مع سويتي: تقويم واحد لكل وحدة، والمنصات تتزامن تلقائيًا.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Text 2:
  خوف الحجز المكرر ينتهي لما يصير التقويم واحد.
  جرّب سويتي 14 يوم مجانًا.
  Headline: قبل وبعد التقويم الموحّد

C3-VS-CLEANING | IMG-VS | H1+H2 | v1 · C3-cleaning
  Text 1:
  قبل: تراسل العامل بعد كل خروج وتنتظر رده.
  مع سويتي: المهمة توصل للعامل تلقائيًا، وتستلم صور بعد التنظيف.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Text 2:
  تعرف إن الوحدة جاهزة بدون ما تتصل على أحد.
  جرّب سويتي 14 يوم مجانًا.
  Headline: قبل وبعد التنظيف التلقائي

V2-DOUBLE | VID | H1+H2 | v1 · V2-double-booking.mp4
  Text 1: (same as B2 Text 1)
  Text 2:
  11 ثانية تشرح ليش التقويم الواحد يفرق.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Headline: تقويم واحد لكل منصاتك

V3-CHAT | VID | H1+H2 | v1 · V3-cleaning-chat.mp4
  Text 1: (same as B3 Text 1)
  Text 2: (same as B3 Text 2)
  Headline: التنظيف يتجدول لحاله

V4-CHAOS | VID | H1+H2 | v1 · V4-chaos-to-one.mp4
  Text 1: (same as B1 Text 1)
  Text 2: (same as B1 Text 2)
  Headline: كلها في نظام واحد

V5-BUMPER | VID | H1+H2 | v1 · V5-trial-bumper.mp4
  Text 1: (same as B5 Text 1)
  Text 2: (same as B5 Text 2)
  Headline: 14 يوم مجانًا · بدون بطاقة

R1-STEPS | IMG | H1+H2 | v1 · R1-steps
  Text 1:
  تبدأ مع سويتي بـ3 خطوات: أضف وحداتك، اربط منصاتك، وخلّ التنظيف يتجدول لحاله.
  وتجربتك 14 يوم مجانًا، بدون بطاقة.
  Text 2:
  شفت سويتي قبل؟ جرّبه على وحداتك الحالية.
  عبّئ بياناتك ونساعدك تبدأ.
  Headline: 3 خطوات وتبدأ

R2-THINK | IMG | H1+H2 | v1 · R2-think
  Text 1:
  لسا تفكر؟ جرّب سويتي 14 يوم على وحداتك، بدون بطاقة بنكية.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Text 2:
  الحجوزات والضيوف والتنظيف في نظام واحد. جرّبه قبل ما تقرر.
  Headline: جرّبه قبل ما تقرر

(C3 reuses B5 and V5 with the same copy.)

## Report back (table)
| Level | Name | ID | Status | Budget | Placements |
Rows: 3 campaigns, 6 ad sets, 28 ads, 3 audiences (with ID and size), and any errors or warnings (exact text). Confirm: Instagram only, nothing On, only the budgets listed above were changed, no billing change, no terms accepted by you. Then tell Khalid: "send this report to the media buyer".
```
