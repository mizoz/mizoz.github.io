---
title: "YYC Class Finder"
order: 13
kind: "projects"
size: "normal"
summary: "City of Calgary rec programs, filtered by age, budget, day and activity."
link: "https://city-picks.vercel.app"
repo: "https://github.com/mizoz/yyc-class-finder"
cover: "/assets/lab/yyc-class-finder.jpg"
gallery: []
stack: ["Next.js", "TypeScript", "Socrata API", "Open data"]
status: "live"
---

The City of Calgary publishes its recreation program listings as open data: swim lessons, skating, art, fitness, camps. The data is good. The problem is its shape. It sits in a large table on the open-data portal, and the questions a parent or adult learner actually has ("my kid is eight, I have about $120, Saturdays work") don't map to scrolling a spreadsheet.

YYC Class Finder starts from those four constraints, age, maximum price, day of the week and a keyword, and returns a short list of upcoming classes with dates, times, price, age range, venue and a trimmed description. Every result points back to the official dataset, and registration still happens through the City.

The interesting part is how little machinery that takes. The City's portal runs on Socrata, which accepts a SQL-like query language (SoQL) over HTTP. So instead of downloading and indexing the dataset, I turn each search into one SoQL query and let the City's API do the filtering.

## How it works

A single Next.js route, `/api/programs`, sits between the browser and the Recreation Program Listings dataset (`data.calgary.ca/resource/q9hh-gfbx.json`). It builds a `$where` clause from whichever filters are set:

| Filter | SoQL condition |
|---|---|
| Always | `course_status = 'Active'` and `class_date >= today` |
| Age | `course_min_age_allowed <= age` and `course_max_age_allowed >= age` |
| Max price | `course_default_price <= maxPrice` |
| Day | `upper(class_date_day) = 'SATURDAY'` |
| Keyword | case-insensitive `like` across course name, brochure section and venue name |

Results are ordered `class_date ASC, course_default_price ASC` and capped at 100 rows. The "Weekend kids" preset (age 8, $120, Saturday, "swim") becomes one request that returns active swim classes an eight-year-old is eligible for, on a Saturday, at $120 or less, soonest and cheapest first.

A few details matter more than they look:

- **"Today" is Calgary's today.** The date is computed with `Intl.DateTimeFormat` in the `America/Edmonton` time zone, not the server's clock. A serverless function running on UTC would otherwise start hiding same-day classes in the late afternoon, Calgary time.
- **Age is a range check, not a match.** Each program has a minimum and maximum allowed age, and a person qualifies when their age falls inside both bounds.
- **Input is escaped before it reaches SoQL.** Age and price are parsed to finite numbers or dropped. Text filters are case-normalised and single quotes are doubled, so a search like `o'brien` can't break out of the string literal.
- **Responses are trimmed.** The route maps each row to a small object, strips HTML tags and entities from the description, and cuts it to 220 characters. The browser never handles the raw dataset.
- **Caching protects the City's API.** Upstream fetches use Next.js revalidation of 900 seconds, so identical searches inside a 15-minute window are served from cache instead of hitting the portal again.

In the browser, results can be re-sorted (soonest, cheapest, saved first), saved to a shortlist in `localStorage`, opened as a map search, or downloaded as an `.ics` calendar file generated on the spot. Saved items are keyed by course ID, date and start time so separate sessions of one course stay distinct.

## Design decisions

- **No database, no sync job.** Querying the live API means there's nothing to keep fresh and no copy of the City's data drifting out of date. The trade-off is a dependency on the portal being up; if it isn't, the route returns a clear error rather than stale results.
- **No accounts, no keys.** The Socrata endpoint is public, the app needs no environment variables, and the shortlist lives only in the visitor's browser.
- **Link back, don't replace.** The City is the source of truth for prices, spaces and registration. The sidebar links to the official dataset so anyone can audit a listing.
- **Presets over a blank form.** Four presets ("Weekend kids", "Free today-ish", "Adult reset", "Teen active") and quick keywords like swim, skate and pickleball give people a sensible first search.

## Limits

- Results stop at 100 rows per query. Broad searches (no keyword, no age) are truncated; narrowing the filters is the fix.
- Keyword search is a substring match on three fields, not full-text search. "swimming" won't find a class listed only as "aquatics".
- The app is only as accurate as the dataset. It shows the listed default price and status; it knows nothing about available spaces, discounts or fee assistance.
- The shortlist stores keys, not full listings, so saved classes only show when they appear in the current results.
- Calendar files use the class's local time with no time zone attached. Most calendar apps read that as local time, which is right for Calgary users but not guaranteed elsewhere.
- There are no automated tests in the repository yet; checks so far are the TypeScript compiler and manual use.

Program data belongs to the City of Calgary and is used under its open-data terms. Try a search on the live site, or read the source: the whole query layer is one short route file.
