# Browser-agent prompt: give the Meta Ads connector permission on the Suitiee Page

```
Goal: the "Meta Ads" connector in Claude (the "ads MCP server" business integration on Facebook) must get the pages_manage_ads permission on the Facebook Page "Suitiee" (ID 1360833533775829), so lead-ad ad sets can be created in ad account Suitiee Ads (ID 2629307547521500). Right now Meta rejects ad sets with: "Terms of Service Not Accepted … needs the pages_manage_ads permission granted for this Page". The Lead Ads terms ARE already accepted.

## Hard rules
1. Act only as Khalid's personal Facebook profile "Khalid Alaqeel". Never use the @suitiee.sa Instagram identity or "act as Page".
2. Do not create, publish, activate or edit any campaign, ad set, ad or lead form. Do NOT publish the draft lead form "SUI - Lead Form - STR Operators - AR - v1".
3. Do not touch billing, payment methods, spending limits, people or partners. Do not touch Clean Basket assets, ad account 1181633093119041 or 2186110332337677.
4. Only remove the "ads MCP server" business integration if the steps below say so AND Khalid says "yes" first. Never remove "Comment to DM", "Clean Basket Agent" or "Blaze".
5. Never display tokens or passwords. If a login, 2FA or security check appears, stop and let Khalid complete it.
6. If a screen looks different from what's described, stop and ask.

## Step 1 — Reconnect from Claude and grant the Page
1. Open https://claude.ai/customize/connectors → "Meta Ads" → Disconnect → Connect.
2. On the Facebook window, confirm the account shown is Khalid Alaqeel (not @suitiee.sa).
3. Before clicking Continue, look for "Edit access", "Edit previous settings" or "Choose what you allow". If present, open it and make sure these are ALL selected:
   - Businesses: Suitiee
   - Ad accounts: Suitiee Ads (2629307547521500)
   - Pages: Suitiee (1360833533775829)
   - Instagram accounts: @suitiee.sa
   - Every permission toggle ON (including anything about managing ads for Pages / pages_manage_ads, lead ads, and "show a list of Pages you manage").
4. Continue / Save until you're back in Claude and Meta Ads shows as connected.

## Step 2 — If there was NO asset/Page picker in Step 1
Facebook reused the old consent. Force a fresh consent:
1. Open https://www.facebook.com/settings/?tab=business_tools
2. Find ONLY the row "ads MCP server" (says "Connected to Claude"). Click "View and edit" and check if there is any Pages section you can tick "Suitiee" in. If yes, tick it and Save, then go to Step 3.
3. If there is no Pages section: tell Khalid "I need to remove the 'ads MCP server' integration and reconnect it to get the Page permission. OK?" Wait for "yes". Then click Remove on that row ONLY, confirm, and redo Step 1 (Disconnect/Connect in Claude). This time the full picker should appear. Select everything listed in Step 1.3.

## Step 3 — Check the Page role
1. business.facebook.com/settings (portfolio Suitiee) → Accounts → Pages → Suitiee → People.
2. Confirm "Khalid Alaqeel" has full control / Admin-level access (including "Ads" or "Advertise" permission). Report what you see. Don't change anything unless it's missing, and ask Khalid first.

## Report back (table)
| Step | Status | What you did |
Include: account used for consent, whether an asset picker appeared, which Pages/ad accounts/permissions were granted, whether the integration was removed and re-added, Khalid's role on the Page, and confirmation that no campaigns/ads/forms were created, published or activated.
Then tell Khalid: "say «كمّل» to the media buyer".
```
