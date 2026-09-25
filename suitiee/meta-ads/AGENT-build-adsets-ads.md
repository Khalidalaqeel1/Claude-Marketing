# Browser-agent prompt: build the 2 ad sets + 10 ads in Ads Manager (all OFF)

```
You are building Suitiee's first Instagram lead-ad structure in Meta Ads Manager, in Khalid's browser, as Khalid's personal profile (Khalid Alaqeel). The Meta Ads API connector can't create lead ad sets for this Page (error subcode 1815089), so we build them in the Ads Manager UI. Everything must end up OFF (paused). Nothing may deliver or spend.

## Fixed values
- Ad account: Suitiee Ads — act_2629307547521500 (the ONLY account you may touch)
- Existing campaign (keep as is, OFF): "SUI | LEADS-FORM | STR-Operators | KSA-5cities | 2026-10-01" (ID 120248044547720539) — Leads, Advantage campaign budget 100 SAR/day, spending limit 1,400 SAR
- Facebook Page: Suitiee (1360833533775829) · Instagram: @suitiee.sa
- Instant Form (draft): "SUI - Lead Form - STR Operators - AR - v1"
- Images already in the ad account media library (names): 01-system_4x5.png, 01-system_9x16.png, 02-calendar_4x5.png, 02-calendar_9x16.png, 03-cleaning_4x5.png, 03-cleaning_9x16.png, 04-scale_4x5.png, 04-scale_9x16.png, 05-trial_4x5.png, 05-trial_9x16.png

## Hard rules
1. Every campaign, ad set and ad must be OFF. Before clicking "Publish", check every toggle for the campaign, both ad sets and all 10 ads is OFF. Publishing with toggles OFF only saves them; it does not start delivery. After publishing, verify in the table that the Delivery column shows "Off" for all of them.
2. Do NOT change the campaign budget, spending limit, billing or payment method. Do not touch ad accounts 1181633093119041, 2186110332337677 or anything Clean Basket.
3. Do NOT publish the Instant Form unless Khalid has said "انشر النموذج" in this chat. If he hasn't, ask him now: "Publish the lead form? (it can't be edited after publishing)" and wait. If he says no, stop after Step 2 and report.
4. Do NOT accept any terms on Khalid's behalf. Don't delete anything. If something looks different from this prompt or an error appears, stop and report it with the exact message.

## Step 1 — Publish the Instant Form (only after Khalid's "انشر النموذج")
Business Suite / Ads Manager → Instant forms → draft "SUI - Lead Form - STR Operators - AR - v1" → review → Publish. Report the Form ID.

## Step 2 — Ad set A (inside the existing campaign)
Ads Manager → select campaign 120248044547720539 → Create ad set (or duplicate nothing — create new):
- Name: "Riyadh | Adv+ 25-60 | IG-only | CBO"
- Conversion location: Instant forms · Performance goal: Maximize number of leads · Page: Suitiee
- Audience: Advantage+ audience. Location: drop a pin on Riyadh with a 40 km radius (or "Riyadh" + 40 km). Age suggestion 25–60. Languages: Arabic, English.
- Placements: Manual placements → Instagram ONLY: Feed, Profile feed, Explore, Explore home, Stories, Reels. Uncheck Facebook, Messenger, Audience Network, Threads.
- No ad-set budget (the campaign budget controls it).

## Step 3 — Ad set B
Same as ad set A except:
- Name: "West+East | Adv+ 25-60 | IG-only | CBO"
- Locations (each a pin + radius): Jeddah 35 km, Makkah 25 km, Madinah 25 km, Dammam 35 km (covers Khobar).

## Step 4 — 5 ads in EACH ad set (10 total)
For each ad: Identity = Page Suitiee + Instagram @suitiee.sa · Format: Single image · Media: choose the 4:5 image for Feed/Explore/Profile placements and the 9:16 image for Stories/Reels (use "Select images" per placement group, or placement asset customization) · Instant form: the published form · Call to action: Sign up.
Add BOTH primary-text options (Ads Manager "Add text option") so each ad tests 2 hooks. Headline and description as listed.

Ad 1 — name "SYSTEM | IMG | H1+H2 | v1" · images 01-system_4x5 / 01-system_9x16
  Primary text 1:
  لمشغّلي الشقق المفروشة والإيجار القصير:
  الحجوزات والضيوف والتنظيف… كلها في نظام واحد بدل ما تتنقل بين تطبيقات وقروبات.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة، أو جرّب سويتي 14 يوم مجانًا.
  Primary text 2:
  كم تطبيق تفتح عشان تدير وحداتك؟
  سويتي يجمع الحجوزات والضيوف والتنظيف في نظام واحد.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Headline: الحجوزات والضيوف والتنظيف في نظام واحد
  Description: سويتي · لمشغّلي الإيجار القصير

Ad 2 — "CALENDAR | IMG | H1+H2 | v1" · 02-calendar_4x5 / 02-calendar_9x16
  Primary text 1:
  Airbnb وBooking وجاذر إن… كل حجوزات وحداتك في تقويم واحد يتزامن تلقائيًا.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Primary text 2:
  حجز مكرر لنفس الليلة؟ خلّ التقويم واحد.
  سويتي يزامن حجوزات منصاتك في تقويم واحد لكل وحدة.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Headline: كل حجوزاتك في تقويم واحد
  Description: سويتي · لمشغّلي الإيجار القصير

Ad 3 — "CLEANING | IMG | H1+H2 | v1" · 03-cleaning_4x5 / 03-cleaning_9x16
  Primary text 1:
  أول ما يطلع الضيف، التنظيف يتجدول ويوصل للعامل تلقائيًا، وتستلم صور تثبت إن الوحدة جاهزة.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Primary text 2:
  لسا تلاحق عمال النظافة بالواتساب بعد كل خروج؟
  مع سويتي التنظيف يتجدول لحاله بعد كل خروج.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Headline: التنظيف يتجدول لحاله بعد كل خروج
  Description: سويتي · لمشغّلي الإيجار القصير

Ad 4 — "SCALE | IMG | H1+H2 | v1" · 04-scale_4x5 / 04-scale_9x16
  Primary text 1:
  من 5 وحدات لـ50… بدون فوضى.
  سويتي يجمع حجوزات وحداتك وضيوفها وتنظيفها في شاشة وحدة.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Primary text 2:
  كل ما زادت وحداتك زادت الملاحقة؟
  شغّل وحداتك كلها من مكان واحد مع سويتي.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Headline: وحداتك كلها من مكان واحد
  Description: سويتي · لمشغّلي الإيجار القصير

Ad 5 — "TRIAL | IMG | H1+H2 | v1" · 05-trial_4x5 / 05-trial_9x16
  Primary text 1:
  جرّب سويتي 14 يوم مجانًا، بدون بطاقة بنكية.
  الحجوزات والضيوف والتنظيف في نظام واحد لمشغّلي الشقق المفروشة والإيجار القصير.
  عبّئ بياناتك ونساعدك تبدأ.
  Primary text 2:
  شوف كل وحداتك في شاشة وحدة، ببلاش 14 يوم.
  عبّئ بياناتك وفريقنا يتواصل معك خلال 24 ساعة.
  Headline: 14 يوم مجانًا · بدون بطاقة
  Description: سويتي · لمشغّلي الإيجار القصير

Turn OFF Meta's "Advantage+ creative" enhancements that change text or add music/overlays (keep only standard image cropping), so the Arabic copy isn't rewritten.

## Step 5 — Save OFF and verify
- Make sure all toggles are OFF → Publish.
- In the Ads Manager table, confirm: campaign Off, 2 ad sets Off, 10 ads Off (ads may show "In review" — fine, they stay Off).

## Report back (table)
| Item | ID | Status |
Rows: Form ID, ad set A, ad set B, the 10 ads (name + ID), and any errors or warnings (exact text). Confirm: nothing is On, no budget/billing change, no terms accepted by you. Then tell Khalid: "send this report to the media buyer".
```
