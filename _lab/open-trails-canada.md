---
title: "Open Trails Canada"
order: 10
kind: "projects"
size: "wide"
summary: "The outdoors around Calgary, for newcomers, in their own language."
link: "/open-trails-canada/"
repo: "https://github.com/mizoz/open-trails-canada"
cover: "/assets/lab/open-trails-canada.jpg"
gallery: []
stack: ["HTML", "CSS", "JavaScript", "Leaflet", "14 languages"]
status: "live"
---

About 60% of Alberta is Crown land, owned by the government for the public. On most of it anyone can walk, hike, picnic and camp without asking permission. Youth 17 and under get into national parks free, and new permanent residents and citizens can get a year of free Parks Canada entry through the Canoo app. A lot of people who move to Calgary don't know any of this, or which passes and licences they need.

The information exists, but it's spread across Parks Canada, Alberta Parks, the provincial government, the City of Calgary and Transport Canada, written for people who already know what a Kananaskis Conservation Pass or a Public Land Use Zone is. Open Trails Canada puts the basics in one place, in plain language, in 14 languages: English, French, Punjabi, Tagalog, Simplified and Traditional Chinese, Arabic, Spanish, Urdu, Hindi, Vietnamese, Korean, Farsi and Ukrainian. Arabic, Urdu and Farsi render right to left.

It covers 12 topics: start here, passes and fees, hiking, camping, public land, fishing, hunting, rivers and lakes, winter, safety, programs and gear, and a glossary. A map marks ten places from Fish Creek and Nose Hill out to Canmore, Kananaskis and Banff.

## How accuracy is kept

A guide like this is only useful if it's right, and the risk multiplies with every language. A fee typed into 14 files will eventually be wrong in some of them. So no translation contains a price, a link or a coordinate.

**Facts live in one file.** `data/facts.json` holds every price, every official link (63 of them), the map places and a last-checked date. Translations refer to values by placeholder: the English text says `{kpass_day} per day`, and the page fills in `$15` at render time. When Alberta changes the Kananaskis pass price, one line changes and every language updates. Placeholder values are wrapped in a left-to-right isolate, so a dollar figure doesn't scramble inside Arabic or Farsi text.

**Every block links to its source.** Content is a list of blocks, and each block carries the IDs of the official pages it's based on. Those link lists are identical across languages, so a reader in Punjabi sees the same government sources as a reader in English.

**A checker enforces the structure.** `scripts/check.py` compares every translation against English and fails on:

- invalid JSON or a missing language file
- a placeholder that isn't in `facts.json`
- a link ID that doesn't exist
- a different number of topics, blocks, list items, glossary terms or paragraphs
- a block whose links or kind (tip, warning) differ from the English one
- missing interface text or map places

That catches the mechanical failures of translation: a dropped warning, a list that lost an item, a paragraph merged away, a link pointing somewhere else. It doesn't check meaning.

**Honesty about the translations.** Most translations started as machine-assisted drafts. Every non-English page says so in a notice at the top, and tells the reader to check the linked official page for anything that matters: licences, fines and safety. Corrections from native speakers are the main thing I'm asking for. If a translation is missing a topic, the site shows that topic in English rather than leaving a gap.

## Safety content

Safety gets its own topic and also runs through the others as warning blocks. Every rule comes from an official source:

| Topic | Sources |
|---|---|
| Emergencies, trip plans | 911 (free, with interpreters on request), AdventureSmart, Kananaskis backcountry safety |
| Bears and wildlife | Alberta BearSmart, Kananaskis and Parks Canada bear safety, Parks Canada wildlife distances (30 m from elk and moose, 100 m from bears and wolves) |
| Fire | Alberta Fire Bans, Alberta fire permits |
| Water | City of Calgary river safety, Alberta Parks cold water safety, Transport Canada lifejackets and boating licences |
| Winter | Avalanche Canada forecasts and AST 1 training, 511 Alberta, City of Calgary ice safety |

The emergency note on the home page is written for someone who doesn't speak English: 911 is free, you can say "interpreter" and the name of your language, and in Kananaskis you should say "Kananaskis Country" to reach the right dispatch.

## Design decisions

**Static, no build step.** Plain HTML, CSS and JavaScript on GitHub Pages. Each language is one JSON file. Anyone who can edit a text file can fix a translation, and a non-coder can describe a fix in an issue.

**Language picking without friction.** The site checks the URL, then the last choice, then the browser's language list, mapping Chinese locales for Taiwan, Hong Kong and Macau to Traditional characters. Otherwise it falls back to English.

**Works with no signal.** A service worker caches pages as you open them, network first, so the guide you read at home still opens at a trailhead with no coverage. Map tiles and official sites aren't cached and need a connection.

**No accounts, no analytics.** The only stored data is your language choice, in your own browser. The map uses Leaflet and OpenStreetMap tiles, which load from their own servers.

## Limits

- The translations haven't been reviewed by native speakers yet. The checker confirms structure, not accuracy of meaning.
- Prices and rules change. Facts were last checked on the date shown on every page, and anything after that may be out of date.
- Version 1 covers Calgary and southern Alberta only. The data model is built to add other provinces.
- It's an independent community project, not a government website. The official page always wins.

If you speak one of these languages and something reads wrong, an issue or a pull request is the most useful thing you can send.
