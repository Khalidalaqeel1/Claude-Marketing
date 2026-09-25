# Engineering prompt: Meta Pixel + Conversions API on suitiee.com (Laravel)

Paste this into the Claude Code session that has the suitiee.com backend (`C:\backend`).

---

```
You are working on the suitiee.com codebase (Laravel + Vite, served by nginx). Goal: connect the site to Meta so ads can be measured — Meta Pixel in the browser, Conversions API (CAPI) from the server, domain verification, and the privacy-policy update that must ship WITH it.

## Fixed values
- Meta Pixel / dataset ID: 1308075597982037
- Domain verification code: 6nwxma31w7ehnoq4r5fgivp1r7occl
- Privacy page: https://suitiee.com/privacy (Arabic)

## Hard rules
1. Work on a new git branch (e.g. feat/meta-pixel-capi). Do NOT push to main and do NOT deploy to production. Stop at a reviewable diff/PR and wait for Khalid's "yes".
2. Secrets only in .env / server env. Never commit tokens. Add the variables to .env.example with empty values.
3. The privacy-policy change (Task 1) must be in the SAME release as the pixel. Never ship tracking while section 10 still says the site uses no advertising/tracking cookies.
4. Tracking only on public marketing pages. Do NOT load the pixel inside the logged-in app/dashboard, admin, or any page that shows customer or property data.
5. Never send raw personal data to Meta. Email/phone/name must be normalized and SHA-256 hashed before sending (see Task 4).
6. The CAPI call must never block or break a user request. Queue it, retry it, log failures quietly.
7. Keep changes minimal and consistent with the existing code style. Run the project's tests/linters before you hand over.

## Task 1 — Privacy policy update (content from Khalid; show the diff)
In the privacy page view (Arabic, and English if it exists):
- Replace section 10 (which currently says the site places no advertising/tracking files) with:
  «نستخدم ملفات تعريف الارتباط وتقنيات مشابهة، منها Meta Pixel، لقياس أداء إعلاناتنا وتحسينها وعرض إعلانات مناسبة لزوّار موقعنا على منصات Meta. يمكنك التحكم بها أو إيقافها من إعدادات متصفحك أو من إعدادات الإعلانات في حسابك على Meta.»
- Add a new section "البيانات من نماذج الإعلانات":
  «إذا عبّأت نموذجاً في أحد إعلاناتنا على إنستقرام أو فيسبوك، نستلم البيانات التي أدخلتها (الاسم، الجوال، المدينة، عدد الوحدات، طريقة التنظيف الحالية، وأفضل وقت للتواصل). نستخدمها فقط للتواصل معك بخصوص خدماتنا، ولا نبيعها لأي طرف ثالث. ويمكنك طلب حذفها بمراسلتنا على [EMAIL].»
- Update the "last updated" date. Leave [EMAIL] as a visible TODO for Khalid if you can't find the site's contact email in the code/config.
- Flag in your report: this text is a draft and needs Khalid's legal review.

## Task 2 — Config
Add to config/services.php (or a new config/meta.php):
  META_PIXEL_ENABLED (bool, default false), META_PIXEL_ID, META_CAPI_TOKEN, META_TEST_EVENT_CODE (optional), META_GRAPH_VERSION (default to the current supported Graph API version; make it configurable).
Add the keys to .env.example (empty). Everything must be a no-op when META_PIXEL_ENABLED=false.

## Task 3 — Browser: Pixel base code + domain verification
In the main public Blade layout <head> (only the marketing layout, per rule 4):
- <meta name="facebook-domain-verification" content="6nwxma31w7ehnoq4r5fgivp1r7occl" />  (always rendered; it lets Meta verify the domain even before the DNS TXT record is added)
- Meta Pixel base code with fbq('init', config pixel id) and fbq('track','PageView'), rendered only when enabled. Include the <noscript> image fallback.
- A small JS helper, e.g. window.suitieeTrack(eventName, eventId, customData), that calls fbq('track', eventName, customData, {eventID: eventId}).

## Task 4 — Server: Conversions API
- Create a service class (e.g. App\Services\MetaConversions) and a queued job (e.g. SendMetaEvent) that POSTs to
  https://graph.facebook.com/{version}/{pixel_id}/events?access_token={META_CAPI_TOKEN}
  with data[]: event_name, event_time (unix), event_id, action_source "website", event_source_url, user_data, custom_data; plus test_event_code when META_TEST_EVENT_CODE is set.
- user_data: em / ph / fn / ln / ct / country as SHA-256 of normalized values (trim + lowercase; phone digits only in international format, e.g. 9665XXXXXXXX with no +; country "sa"). Unhashed: client_ip_address, client_user_agent, fbp (from _fbp cookie), fbc (from _fbc cookie, or built from fbclid if present).
- Use Laravel's HTTP client with a timeout, 3 retries with backoff, and log failures (no PII in logs).

## Task 5 — Events (browser + server with the SAME event_id for deduplication)
Generate one UUID event_id per action on the server, pass it to the view/JS, and send the server event with the same id.
- Lead: when any contact / "request a demo" / "talk to sales" form on the marketing site is submitted successfully.
- CompleteRegistration: when a free-trial / account sign-up completes successfully.
- (Optional) Schedule: if the site embeds or redirects to Calendly and you can detect a completed booking; otherwise skip and say so.
List every form/flow you wired and the file/line.

## Task 6 — Verify before handing over
- Unit/feature tests: hashing/normalization, job payload shape, event_id reuse, disabled flag = no output/no calls.
- Run the existing test suite and linters.
- Local/staging check with META_TEST_EVENT_CODE set: trigger PageView, Lead and CompleteRegistration, and confirm in Events Manager → suitiee-web → Test events that browser and server events arrive and are shown as deduplicated.
- Do NOT deploy. Report back.

## Report back (table)
| Item | Status | Files changed | Notes |
Covering: privacy policy (with the exact new text), config/env keys, pixel base code + noscript, domain-verification meta tag, CAPI service + job, events wired (which forms), tests run + results, Test Events result, anything blocked.
Then list the exact deploy steps and the env values Khalid must set on production:
META_PIXEL_ENABLED=true, META_PIXEL_ID=1308075597982037, META_CAPI_TOKEN=(generate in Events Manager → suitiee-web → Settings → Conversions API → Generate access token; paste only into the server env).
```

---

## After deploy (Khalid ← media buyer)
Tell the media buyer "deployed". They'll check from the Meta Ads connection:
- `suitiee-web` receives PageView / Lead / CompleteRegistration (ads_get_dataset_stats)
- event match quality and freshness (ads_get_dataset_quality)
