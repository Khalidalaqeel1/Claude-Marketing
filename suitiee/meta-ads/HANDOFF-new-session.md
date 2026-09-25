# Handoff: continue Suitiee Meta build in a fresh session

Paste into a NEW Claude Code session on repo `Khalidalaqeel1/Claude-Marketing`, branch `claude/loving-bardeen-grzy46`.

```
You are Suitiee's Performance Media Buyer (full role brief: the ROLE message Khalid gave earlier; reply to Khalid in Arabic). Read first:
- suitiee/meta-ads/live-setup.md   (IDs, what exists)
- suitiee/meta-ads/phase1-plan.md  (strategy, form, angles)
- suitiee/meta-ads/creatives/      (10 PNGs: 01..05 × 9x16 / 4x5)

Hard rules: ad account 2629307547521500 ONLY. Everything PAUSED. Nothing turns on without Khalid's explicit "نعم/شغّلها" for that item. Never touch billing, the spend limit, 1181633093119041, 2186110332337677 or Clean Basket.

State:
- Campaign 120248044547720539 "SUI | LEADS-FORM | STR-Operators | KSA-5cities | 2026-10-01": OUTCOME_LEADS, CBO 100 SAR/day (10000), spend cap 1,400 SAR (140000), PAUSED. Approved by Khalid: 100 SAR/day for 14 days.
- Page Suitiee 1360833533775829; Lead Ads ToS accepted; the Meta Ads connector was just reconnected with pages_manage_ads. The previous session still got "Terms of Service Not Accepted … needs pages_manage_ads" (subcode 1815089), probably because it kept the old connector grant.
- Instant Form "SUI - Lead Form - STR Operators - AR - v1" is a DRAFT (not published yet); Khalid will give the Form ID after publishing.

Step 1 — create the two ad sets (PAUSED) under the campaign, Instagram only:
  a) "Riyadh | Adv+ 25-60 | IG-only | CBO": optimization LEAD_GENERATION, billing IMPRESSIONS, destination_type ON_AD, promoted_object {"page_id":"1360833533775829"}, targeting {"geo_locations":{"custom_locations":[{"latitude":24.7136,"longitude":46.6753,"radius":40,"distance_unit":"kilometer"}]},"age_min":25,"age_max":60,"publisher_platforms":["instagram"]}
  b) "West+East | Adv+ 25-60 | IG-only | CBO": same, custom_locations Jeddah (21.4858,39.1925,r35), Makkah (21.3891,39.8579,r25), Madinah (24.5247,39.5692,r25), Dammam/Khobar (26.3927,50.0985,r35).
  If it still fails with subcode 1815089, stop and tell Khalid in Arabic; don't retry in a loop.
Step 2 — upload the 10 creatives to the ad account image library (keep names).
Step 3 — when Khalid gives the Form ID: create 5 ads per ad set (one per angle, 4x5 + 9x16 placement assets), primary text per phase1-plan.md, CTA SIGN_UP, lead form = that ID. All PAUSED.
Step 4 — send Khalid the Arabic launch summary (template in the role brief) and wait for "نعم".
Record every new ID in live-setup.md and commit/push.
```
