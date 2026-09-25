#!/usr/bin/env python3
"""Suitiee Meta Ads runner (Marketing API, stdlib only).

Reads campaigns.json and talks to the Graph API with a token from the
environment. Everything it creates is PAUSED. Writes are dry-run unless
--apply is passed, and nothing is ever switched to ACTIVE by this script
except through the explicit `activate` command.

Env:
  META_ACCESS_TOKEN   System User token (ads_management, ads_read) scoped to the Suitiee ad account
  META_AD_ACCOUNT_ID  e.g. act_1234567890
  META_PAGE_ID        Facebook Page id linked to WhatsApp Business
  META_API_VERSION    optional, default v23.0

Usage:
  python3 meta_ads.py check
  python3 meta_ads.py build [--apply]
  python3 meta_ads.py report [--preset last_7d]
  python3 meta_ads.py activate <object_id> [--apply]
"""
import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
SPEC = json.loads((HERE / "campaigns.json").read_text(encoding="utf-8"))
API = os.environ.get("META_API_VERSION", "v23.0")
BASE = f"https://graph.facebook.com/{API}"


def env(name, required=True):
    v = os.environ.get(name, "").strip()
    if required and not v:
        sys.exit(f"Missing environment variable {name}. Add it in the environment settings, not in chat.")
    return v


def call(method, path, params=None):
    params = dict(params or {})
    params["access_token"] = env("META_ACCESS_TOKEN")
    for k, v in list(params.items()):
        if isinstance(v, (dict, list)):
            params[k] = json.dumps(v, ensure_ascii=False)
    data = urllib.parse.urlencode(params).encode()
    url = f"{BASE}/{path.lstrip('/')}"
    if method == "GET":
        req = urllib.request.Request(f"{url}?{data.decode()}")
    else:
        req = urllib.request.Request(url, data=data, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        try:
            err = json.loads(body).get("error", {})
            msg = f"{err.get('type')} {err.get('code')}: {err.get('error_user_msg') or err.get('message')}"
        except ValueError:
            msg = body[:500]
        sys.exit(f"Meta API error on {method} {path}: {msg}")


def halalas(sar):
    return int(round(float(sar) * 100))


# ---------- check ----------
def cmd_check(_):
    acct = env("META_AD_ACCOUNT_ID")
    a = call("GET", acct, {"fields": "name,currency,timezone_name,account_status,spend_cap,amount_spent,business"})
    print("Ad account:", a.get("name"), f"({acct})")
    ok = lambda c: "OK " if c else "FIX"
    print(f"  [{ok(a.get('currency') == SPEC['account']['currency'])}] currency: {a.get('currency')}")
    print(f"  [{ok(a.get('timezone_name') == SPEC['account']['timezone'])}] timezone: {a.get('timezone_name')}")
    cap = int(a.get("spend_cap") or 0) / 100
    print(f"  [{ok(0 < cap <= SPEC['account']['spend_cap_sar'])}] account spend cap: {cap or 'none'} (want {SPEC['account']['spend_cap_sar']})")
    print(f"  [{ok(a.get('account_status') == 1)}] status: {a.get('account_status')} (1 = active)")
    pages = call("GET", f"{acct}/promote_pages", {"fields": "id,name,instagram_business_account{id,username}"}).get("data", [])
    print("Pages:")
    for p in pages:
        ig = p.get("instagram_business_account") or {}
        print(f"  - {p['name']} ({p['id']}) IG: {ig.get('username', 'not linked')}")
    page_id = env("META_PAGE_ID", required=False)
    if page_id:
        wa = call("GET", page_id, {"fields": "name,whatsapp_number"})
        print(f"  [{ok(bool(wa.get('whatsapp_number')))}] WhatsApp on page {wa.get('name')}: {wa.get('whatsapp_number') or 'not linked'}")
    px = call("GET", f"{acct}/adspixels", {"fields": "id,name,last_fired_time"}).get("data", [])
    print("Pixels:")
    for p in px or [{"name": "none found", "id": "-", "last_fired_time": "-"}]:
        print(f"  - {p['name']} ({p['id']}) last fired: {p.get('last_fired_time', 'never')}")
    camps = call("GET", f"{acct}/campaigns", {"fields": "id,name,status,effective_status", "limit": 50}).get("data", [])
    print(f"Existing campaigns: {len(camps)}")
    for c in camps:
        print(f"  - {c['name']} [{c['effective_status']}] {c['id']}")


# ---------- build ----------
def riyadh_city_key():
    r = call("GET", "search", {"type": "adgeolocation", "q": "Riyadh", "location_types": ["city"], "country_code": "SA"})
    for item in r.get("data", []):
        if item.get("country_code") == "SA":
            return item["key"]
    sys.exit("Could not find the Riyadh city key.")


def targeting(core, city_key):
    t = {
        "geo_locations": {"cities": [{"key": city_key, "radius": core["geo"]["radius_km"], "distance_unit": "kilometer"}]},
        "age_min": core["age_min"],
        "age_max": core["age_max"],
        "publisher_platforms": ["facebook", "instagram", "messenger"],
        "targeting_automation": {"advantage_audience": 1 if core.get("advantage_audience") else 0},
    }
    return t


def cmd_build(args):
    acct = env("META_AD_ACCOUNT_ID")
    page_id = env("META_PAGE_ID")
    apply = args.apply
    existing = {c["name"] for c in call("GET", f"{acct}/campaigns", {"fields": "name", "limit": 200}).get("data", [])} if apply else set()
    city = riyadh_city_key() if apply else "<RIYADH_CITY_KEY>"
    core = SPEC["audiences"]["core_targeting"]
    print(("APPLY" if apply else "DRY RUN") + ": everything below is created PAUSED.\n")
    for c in SPEC["campaigns"]:
        if c["name"] in existing:
            print(f"skip (exists): {c['name']}")
            continue
        cp = {
            "name": c["name"],
            "objective": c["objective"],
            "status": "PAUSED",
            "special_ad_categories": SPEC["account"]["special_ad_categories"],
            "spend_cap": halalas(c["spend_cap_sar"]),
        }
        if c["budget_level"] == "campaign":
            cp["daily_budget"] = halalas(c["daily_budget_sar"])
            cp["bid_strategy"] = "LOWEST_COST_WITHOUT_CAP"
        else:
            cp["is_adset_budget_sharing_enabled"] = False
        print("CAMPAIGN", json.dumps(cp, ensure_ascii=False))
        cid = call("POST", f"{acct}/campaigns", cp)["id"] if apply else "<CAMPAIGN_ID>"
        for s in c["adsets"]:
            if "include_audiences" in s:
                print(f"  skip ad set {s['name']}: needs custom audiences (video viewers) that exist only after the videos are posted")
                continue
            ap = {
                "name": s["name"],
                "campaign_id": cid,
                "status": "PAUSED",
                "destination_type": s["destination_type"],
                "optimization_goal": s["optimization_goal"],
                "billing_event": s.get("billing_event", "IMPRESSIONS"),
                "promoted_object": {"page_id": page_id},
                "targeting": targeting(core, city),
            }
            if c["budget_level"] == "adset":
                ap["daily_budget"] = halalas(s["daily_budget_sar"])
                ap["bid_strategy"] = s.get("bid_strategy", "LOWEST_COST_WITHOUT_CAP")
            print("  AD SET", json.dumps(ap, ensure_ascii=False))
            if apply:
                print("   ->", call("POST", f"{acct}/adsets", ap)["id"])
    print("\nAds are not created here: they use the organic reels' post IDs, added after the best 3 videos are known.")
    if not apply:
        print("Nothing was sent. Re-run with --apply after approval.")


# ---------- report ----------
def cmd_report(args):
    acct = env("META_AD_ACCOUNT_ID")
    rows = call("GET", f"{acct}/insights", {
        "level": "ad",
        "date_preset": args.preset,
        "fields": "campaign_name,ad_name,spend,impressions,frequency,actions,cost_per_action_type,video_p25_watched_actions",
        "limit": 200,
    }).get("data", [])
    def act(r, key, name):
        for a in r.get(key, []) or []:
            if a.get("action_type") == name:
                return float(a.get("value", 0))
        return 0.0
    conv = "onsite_conversion.messaging_conversation_started_7d"
    print(f"| الإعلان | الحملة | الصرف | الظهور | التكرار | محادثات | تكلفة المحادثة |")
    print("|---|---|---|---|---|---|---|")
    total = 0.0
    for r in sorted(rows, key=lambda r: -float(r.get("spend", 0))):
        spend = float(r.get("spend", 0)); total += spend
        n = act(r, "actions", conv)
        cpc = f"{spend / n:.1f}" if n else "—"
        print(f"| {r['ad_name']} | {r['campaign_name']} | {spend:.0f} | {r.get('impressions')} | {float(r.get('frequency', 0)):.1f} | {n:.0f} | {cpc} |")
    print(f"\nإجمالي الصرف ({args.preset}): {total:.0f} ريال")


# ---------- activate ----------
def cmd_activate(args):
    print(f"About to set {args.object_id} to ACTIVE. This starts spending.")
    if not args.apply:
        print("Dry run. Re-run with --apply only after Khalid said 'شغّلها' in this session.")
        return
    print(call("POST", args.object_id, {"status": "ACTIVE"}))


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("check").set_defaults(fn=cmd_check)
    b = sub.add_parser("build"); b.add_argument("--apply", action="store_true"); b.set_defaults(fn=cmd_build)
    r = sub.add_parser("report"); r.add_argument("--preset", default="last_7d"); r.set_defaults(fn=cmd_report)
    a = sub.add_parser("activate"); a.add_argument("object_id"); a.add_argument("--apply", action="store_true"); a.set_defaults(fn=cmd_activate)
    args = p.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
