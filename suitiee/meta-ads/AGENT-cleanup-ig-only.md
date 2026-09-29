# Browser-agent prompt: clean up drafts, Instagram-only, 2 ad sets × 5 ads (all OFF)

```
You are fixing Suitiee's lead-ad drafts in Meta Ads Manager, in Khalid's browser, as Khalid's personal profile. Khalid's decision is final: INSTAGRAM ONLY. No Facebook placements. Everything stays OFF. Nothing may deliver or spend.

## Fixed values
- Ad account: Suitiee Ads, act_2629307547521500 (the ONLY account you may touch; check the account ID at the top of Ads Manager before every step)
- Campaign (keep, OFF, don't change budget or limit): 120248044547720539 "SUI | LEADS-FORM | STR-Operators | KSA-5cities | 2026-10-01"
- Page: Suitiee (1360833533775829), Instagram: @suitiee.sa
- Lead form (published, Higher intent): 1618687339646791

## Hard rules
1. Every campaign, ad set and ad stays OFF. Before any "Publish", confirm every toggle is OFF.
2. Don't change the budget, spending limit, billing or payment. Don't touch ad accounts 1181633093119041 or 2186110332337677, or anything Clean Basket.
3. Don't accept any terms yourself. If "Terms of Service Not Accepted" (1815089) appears, stop and tell Khalid to open https://www.facebook.com/ads/leadgen/tos?page_id=1360833533775829 and accept as the Suitiee Page.
4. Only discard UNPUBLISHED drafts listed in Step 1. Never delete anything that has been published. If something looks different from this prompt, stop and report the exact message.

## Step 1: Discard these unpublished drafts only (Ads Manager → Review drafts / Discard)
- Ad set 120248046284830539 "Riyadh | Adv+ 25-60 | IG-only | CBO" and its ad 120248046284820539 (the old duplicate)
- All 6 ads named "ZZ-DISCARD | …" under ad set 120248055735970539

## Step 2: Fix the two remaining ad sets
Ad set 120248055892030539 (Riyadh) and ad set 120248055735970539 (West+East):
- Rename: "Riyadh | Adv+ 25-60 | IG-only | CBO" and "West+East | Adv+ 25-60 | IG-only | CBO"
- Placements: Manual → uncheck Facebook, Messenger, Audience Network, Threads. Instagram: keep Feed, Stories, Reels, Explore. Uncheck Explore home, Profile feed, Search.
- Turn OFF "Allow limited spending to excluded placements".
- Audience: Advantage+ audience with suggested age 25–60, languages Arabic + English. Turn off location expansion.
- Locations: Riyadh must be a 40 km (25 mi) pin on Riyadh. West+East: Jeddah 35 km, Makkah 25 km, Madinah 25 km, Dammam 35 km. Check them.
- Conversion location Instant forms, Maximize number of leads, Page Suitiee. No ad-set budget.
- If Meta shows "The current selected placement is not supported for forms using 'Higher Intent'", also uncheck Explore, then try again. If it still shows with only Feed + Stories + Reels, stop and report. Do NOT add Facebook.

## Step 3: Fix the 5 ads in EACH ad set (10 total)
Rename each to "<ANGLE> | IMG | H1+H2 | v1" (SYSTEM, CALENDAR, CLEANING, SCALE, TRIAL).
For each ad:
- Identity: Page Suitiee + Instagram @suitiee.sa. Format: single image. 4:5 image for Feed/Explore, 9:16 for Stories/Reels (files 01-system … 05-trial in the media library).
- Instant form 1618687339646791. Call to action: Sign up.
- Add BOTH primary texts (Add text option), headline and description exactly as in suitiee/meta-ads/AGENT-build-adsets-ads.md, Step 4 (Khalid can paste it if you can't open the file).
- Advantage+ creative: turn OFF everything that changes text or adds music/overlays. Keep only standard image cropping.

## Step 4: Save OFF and verify
- All toggles OFF, then Publish.
- In the table: campaign Off, exactly 2 ad sets Off, exactly 10 ads Off ("In review" is fine).

## Report back (table)
| Item | ID | Status | Placements |
Rows: both ad sets, all 10 ads, every discarded draft, and any errors or warnings (exact text). Confirm: Instagram only, nothing On, no budget or billing change, no terms accepted by you. Then tell Khalid: "send this report to the media buyer".
```
