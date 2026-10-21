---
title: "YYC Flight Radar"
order: 15
kind: "projects"
size: "normal"
summary: "Self-hosted flight-deal tracker for YYC and YEG that ranks by the real bookable fare."
link: "https://github.com/mizoz/yyc-flight-radar"
repo: "https://github.com/mizoz/yyc-flight-radar"
cover: "/assets/lab/yyc-flight-radar.jpg"
gallery: []
stack: ["Python", "FastAPI", "SQLite", "Beautiful Soup", "Leaflet"]
status: "beta"
---

Cheap fares out of Calgary and Edmonton show up across a handful of small sources: local deal blogs, RSS feeds, airline promo pages. Checking them by hand is slow, and the headline numbers often aren't what you'd pay. A post titled "$89 (CB) to $221" is a $221 fare; the $89 is what it works out to after a cashback offer. Sort a feed by that first number and the wrong deals float to the top.

YYC Flight Radar is a self-hosted tracker that collects deals for trips departing YYC and YEG, keeps a history in SQLite, scores each deal against a per-destination target price, and shows the results on a filterable dashboard. The core rule is simple: **rank on the fare you can book, and keep the effective price as a note.** It only reads public pages and links out; it never books anything.

## Sources

Sources live in `config.toml`, so adding or dropping one is a config change:

- **YYC Deals and YEG Deals:** Atom feeds, plus up to 6 archive listing pages per site (45 articles max) to catch posts the feed has rotated out.
- **Travelzoo Canada and The Flight Deal:** RSS feeds, kept only when an item mentions Calgary, Edmonton, YYC or YEG.
- **Public promo pages:** Travelzoo Canada's flight collection, Sunwing's cheap flights from Calgary and from Edmonton, and Air Transat's cheap flights page.
- **Google Flights sampling:** an optional, capped sampler using the open-source `fast-flights` library. This is unofficial, scraping-style sampling, not a Google integration.
- **Kiwi/Tequila, SerpApi, Amadeus:** adapters that stay off unless they're enabled in config *and* `FLIGHT_RADAR_ENABLE_PAID_APIS=1` is set. Adding an API key alone never starts paid or rate-limited calls; there's a test for exactly that.

## Real fare vs effective price

The deal blogs write cashback deals in a consistent pattern, so the parser matches it directly: a dollar amount, a bracketed marker containing `cb`, `cashback`, `cash back`, `clickbait` or `rebate`, then "to" or a dash, then a second dollar amount.

```
"$89 (CB) to $221 CAD"
  price_min_cad            = 221     # ranked and displayed
  effective_price_min_cad  = 89      # kept as an annotation
  verification_status      = "cashback-adjusted"
  price_basis              = "bookable-fare-excluding-cashback"
```

That case is in the test suite. When there's no cashback pattern, the deal falls back to the plain prices in the headline (`source-only`). If there's no parseable price at all it's marked `needs-price`, scored down, and dropped entirely for feed and promo-page sources. Headlines are trusted over body text, because deal articles often mention unrelated hotel or credit-card dollar amounts; the body is only used when the title has no price. Prices outside $20 to $10,000 are ignored as parsing noise.

On the dashboard, each status maps to a trust level. A complete live Google sample is "verified"; a partial sample or a cashback-adjusted fare is labelled as needing a check; a parsed-only fare is "unverified" and points you to Google Flights first. Every deal gets a Google Flights link. When dates are known, the app builds a prefilled dated search (round trip if there's a return date) by encoding the route into Google's `tfs` URL parameter; otherwise it falls back to a plain text query.

## Scoring

Each deal gets an integer score from additive rules. Weights come from `config.toml`, except a few fixed values:

| Signal | Points |
|---|---|
| Price under $300 / $500 / $700 / $1,000 | +35 / +28 / +18 / +10 |
| At or under the destination's target | +24, plus `min(20, int((target - price) / target × 45))` |
| Destination flagged unusual | +7 |
| Nonstop | +14 |
| "New record" in tags or text | +28 |
| Mistake or error fare language | +24 |
| Complete live Google sample | +10 |
| Multi-city or open-jaw | +8 |
| Marked as an update | +8 |
| Source updated within 30 h / 96 h | +8 / +4 |
| Cashback language | −3 |
| Cashback-adjusted or needs verification | −8 |
| No parseable price | −30 |
| Travel dates already past | −120 |

Scores floor at zero. Targets are rough CAD round-trip thresholds for 49 destinations, from Vancouver at $180 to Sydney and Melbourne at $1,250, with 17 marked as unusual picks. For one-way fares the target is scaled to 55%.

Worked example: "$89 (CB) to $221" from Calgary to Toronto (target $300), nonstop, posted today. On the $221 fare: 35 (under $300) + 24 + `int(79/300 × 45)` = 11, then +14 nonstop, +8 fresh, −8 cashback-adjusted, for **84**. Ranked on the $89 instead, the under-target bonus alone would jump from 11 to the 20-point cap, and every cashback headline would outrank ordinary fares that are actually cheaper to book.

## Sampling without hammering anyone

The Google sampler runs at most 24 one-way queries per scan across the 98 origin and destination pairs, keeping the 3 cheapest results each. Routes are prioritised by what the feeds are saying: a route recently seen with a new-record, error-fare, cashback-adjusted or unverified tag goes first, then unusual destinations, then those outside Canada and the US. Departure dates rotate through offsets from 21 to 360 days out. So the sampler spends its small budget checking the deals most likely to be wrong or remarkable. Duplicate and placeholder rows (no itinerary details, "mixed" airline, maximum stops) are discarded.

## History and the dashboard

Deals are keyed by URL. Each scan hashes the meaningful fields (title, route, dates, prices, tags); a new hash means an update and a new snapshot, otherwise only `last_seen` moves. That's how the dashboard separates new, updated and expired deals. History is pruned to 8 snapshots per deal and the last 120 scans, and a file lock stops two scans from running at once.

The FastAPI and Jinja2 dashboard filters by origin, domestic, transborder or international scope, region, provider, verification status, price, dates and tags, with charts by scope and price bucket and a Leaflet route map where line weight and dashing reflect trust. A JSON API (`/api/status`, `/api/summary`, `/api/map/routes` and more) exposes the same data. Example systemd units run a scan every 12 hours.

## Limits

- Parsers depend on page layouts; when a source redesigns, its parser will need updating.
- Sampled prices are snapshots that can change or vanish within minutes. Always confirm on the airline or booking site.
- The `fast-flights` sampler is unofficial and may break or be blocked.
- Target prices are my rough thresholds, not market data, and the weights were set by judgement, not fitted.
- Airport coordinates for the map are approximate.
- The 11 automated tests cover fare parsing, route inference, filters, the paid-API gate, secret redaction and the scan lock, not the live scrapers.

Run it yourself from the repository; please keep scan frequency low and respect each source's terms.
