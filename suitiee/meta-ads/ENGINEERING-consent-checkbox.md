# Engineering prompt: ad-measurement consent checkbox on suitiee.com lead forms

Paste this into the Claude Code session working on `Clean-Basket-SA/suitiee` (`C:\Projects\apartments-meta`).

---

```
Continue on the existing branch feat/meta-pixel-privacy-and-verification (not merged yet), so the consent change ships in the same release as the pixel. Same rules as before: no merge, no deploy, secrets only in env, keep changes minimal and in the project's style.

## Goal
Add an explicit, optional consent checkbox to the marketing lead forms, so hashed contact data (em/ph/fn/ln/ct/country) is sent to Meta Conversions API ONLY for people who opt in. This improves event match quality for Lead events while staying compliant with the Saudi PDPL.

## Forms in scope
The same forms already wired for the Lead event:
1. "Request access" form on the home page
2. The /contact form
3. The waitlist form
(If the sign-up form already has a marketing-consent field, reuse its storage pattern and don't add a second checkbox there. Report what you found.)

## Checkbox requirements
- Unchecked by default. Never pre-ticked.
- OPTIONAL: the form must submit normally whether or not it's ticked. Consent must not be a condition of contacting us.
- Placed directly above the submit button, with a visible label (clickable), keyboard accessible, correct RTL/LTR alignment.
- Text (put in lang/ar and lang/en; the link goes to the privacy page, route name as in the codebase):
  AR: «أوافق على استخدام بياناتي للتواصل معي وقياس أداء الإعلانات، حسب [سياسة الخصوصية].»
  EN: «I agree to my data being used to contact me and to measure ad performance, as described in the [Privacy Policy].»
- Field name: e.g. `ads_consent` (boolean). Validate as `nullable|boolean` (or `accepted` only when present — must not fail when absent).

## Storage (audit trail)
For each submission, store with the lead/waitlist record:
- ads_consent (boolean, default false)
- ads_consent_at (timestamp, null when not given)
- ads_consent_version (string, e.g. "2026-09-25", so we know which wording they agreed to)
Add a migration for the relevant table(s) (nullable/defaults so existing rows are fine). Don't store the IP separately for this unless the table already stores it.

## CAPI behavior
- ads_consent = true  → send the Lead event with hashed user_data (em, ph, fn, ln, ct, country="sa") + client_ip_address, client_user_agent, fbp, fbc (same as the sign-up flow).
- ads_consent = false → keep current behavior: send only non-PII signals (client_ip_address, client_user_agent, fbp, fbc, event_source_url). No hashed contact fields.
- Browser pixel Lead event is unchanged (same event_id as the server event for dedup). Never put raw or hashed PII into the browser fbq call.

## Privacy policy (same branch)
In section 11 ("البيانات من نماذج الإعلانات" / the ads-data section) add one sentence, AR + EN:
  AR: «ولا نشارك بيانات تواصلك (بصيغة مشفّرة) مع Meta لقياس أداء الإعلانات إلا إذا وافقت على ذلك صراحةً عند تعبئة النموذج، ويمكنك سحب موافقتك في أي وقت بمراسلتنا.»
  EN: «We only share your contact details (in hashed form) with Meta to measure ad performance if you explicitly agree when submitting the form, and you can withdraw consent at any time by contacting us.»
Flag again that the policy text needs Khalid's legal review.

## Tests
- Form submits successfully with and without the checkbox.
- Consent fields stored correctly (true + timestamp + version / false + nulls).
- CAPI job payload: hashed user_data present only when consent = true; absent when false.
- Checkbox renders unchecked, with the privacy link, in AR and EN.
- Existing Meta/landing tests still pass.
Try to run them; if PHP/MySQL still isn't available locally, say so clearly.

## Report back (table)
| Item | Status | Files | Notes |
Covering: forms updated, checkbox text AR/EN, migration, storage fields, CAPI branching, privacy sentence, tests written/run. Then push to the same branch and give the compare/PR link. No merge, no deploy.
```
