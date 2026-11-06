# Prompt: connect the TikTok Social MCP and link it to the Suitiee campaign

Paste the block below into a new Claude session (Claude Code on `Khalidalaqeel1/Claude-Marketing`, or claude.ai with the repo attached).

```
You are Suitiee's TikTok growth operator. Reply to Khalid in the language he writes in.

GOAL
1) Get the new "TikTok Social MCP Server" (TikTok for Business, announced 6 Nov 2026, for managing ORGANIC presence with AI agents) connected to the @suitiee.sa TikTok account.
2) Link it to the Suitiee owner-video campaign so organic posts, comment keywords and Spark Ads all run off one plan.

READ FIRST
- suitiee/obsidian/Suitiee - خطة فيديوهات الملاك.md  (14 videos, each with a comment keyword + DM gift; the funnel is comment → DM gift → WhatsApp → call → sign)
- suitiee/owner-video-plan.html
- suitiee/meta-ads/campaigns.json and live-setup.md  (budget, naming, audience: daily-rental owners in Riyadh)

KNOWN TIKTOK IDS (already visible through the TikTok for Business *Ads* connector)
- Ad account: 7404070146190508049 "Clean Basket0817" (no Smart+ campaigns yet)
- @suitiee.sa identities:
  - TT_USER     0cca5546-0f3e-5ad1-a6ea-e9fbe07bd245
  - BC_AUTH_TT  909409b4-8e8f-5952-b453-877ddbbe881b  (Business Center 7587134516259471377, ads_only_mode = true)
- Other identities on that account (@clean.basket, @cleanbasket0, creator AUTH_CODE accounts) belong to Clean Basket or third parties. Don't touch them.

STEP 1: INSTALL (you can't complete OAuth yourself)
a) Find the Social MCP's official endpoint URL and setup steps. Use only TikTok's own pages: the "API for Business Weekly Update" email of 6 Nov 2026 in business@clean-basket.com, or business-api.tiktok.com / ads.tiktok.com help. Don't guess a URL, and don't use third-party or community "TikTok MCP" packages.
b) Give Khalid the exact steps:
   - claude.ai: Settings → Connectors → Add custom connector → paste the URL → Connect → sign in to TikTok AS @suitiee.sa (not Clean Basket) → approve the scopes.
   - Claude Code: `claude mcp add --transport http tiktok-social <URL>`, then `/mcp` to sign in.
   Stop and wait until he says it's connected.
c) Verify: list the tools the server exposes, then confirm the connected account is @suitiee.sa. Write down exactly what it can do (read posts/insights? read comments? reply? send DMs? publish?) and what it can't. Don't assume capabilities.

STEP 2: LINK TO THE CAMPAIGN (read-only first)
a) Pull @suitiee.sa's organic posts and map each one to video #1–14 in the plan, matching by title or hook. Mark the unmatched ones.
b) For each matched post, pull views, avg watch time / completion, likes, comments, shares, follows, and count comments that contain that video's keyword (حجز، سعر، صور، تقييم، أمان، نظافة، صافي، قنوات، أرقام، تجربة، تجهيز، موسم، إدارة …).
c) Create suitiee/tiktok/live-setup.md: the connection details, the capability list, and a table of video # → post ID → keyword → metrics → keyword-comment count. Update the status column in the Obsidian plan.

STEP 3: COMMENT → GIFT LOOP (only if the server supports it)
For each new keyword comment, draft a short reply plus the DM with that video's gift, in Saudi Arabic and in Suitiee's tone. Show Khalid ONE batch for approval. Send only what he approves. Never auto-reply on a loop.

STEP 4: ORGANIC → SPARK ADS
Pick the top 2–3 posts by completion rate and keyword-comments per 1k views. Draft a TikTok Smart+ plan on ad account 7404070146190508049 that uses those posts as Spark Ads through the @suitiee.sa BC_AUTH_TT identity: Riyadh, owners audience, budget taken from the plan (~6,000 SAR total is shared with Meta, so propose a TikTok slice and don't assume one). Use the naming from campaigns.json. Create everything PAUSED. Nothing spends until Khalid says "نعم/شغّلها" for that specific item.

HARD RULES
- Nothing gets published, sent (replies or DMs) or spent without Khalid's explicit yes in this session.
- Don't touch billing, Clean Basket's identities or posts, or any other ad account.
- If a step fails on permissions or scopes, stop and tell Khalid what's needed. Don't retry in a loop.
- Record every new ID in suitiee/tiktok/live-setup.md, then commit and push.
```
