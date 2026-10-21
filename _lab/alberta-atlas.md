---
title: "Alberta Atlas"
order: 14
kind: "projects"
size: "wide"
summary: "Alberta conservation land, WMUs, PLUZs and Crown-land research on one honest map."
link: "https://github.com/mizoz/alberta-atlas"
repo: "https://github.com/mizoz/alberta-atlas"
cover: "/assets/lab/alberta-atlas.jpg"
gallery: ["/assets/lab/alberta-atlas-2.jpg", "/assets/lab/alberta-atlas-3.jpg"]
stack: ["Rust", "Axum", "Leaflet", "GIS"]
status: "beta"
---

If you want to hunt, scout or simply walk somewhere in Alberta, the information you need is spread across a conservation-site directory, an annual pheasant release list, provincial wildlife management unit (WMU) pages, public land use zone (PLUZ) maps and land-classification services. Each answers a different question, and none of them answers the one people actually ask: *can I go there?*

Alberta Atlas puts those sources on one map so you can find a property, read its published details and restrictions, click a location to see every overlapping feature, and follow each fact back to its source. The harder design problem wasn't the map. It was making sure a map full of polygons never implies a permission it can't prove.

A boundary, a Crown classification, a trail line or a species mention does not establish permission to enter, hunt or drive. Most of the work in this project goes into keeping that distinction visible.

## What's in the snapshot

The local data was checked on 1 and 2 October 2026:

| Layer | Source | Coverage |
|---|---|---|
| Conservation properties | Alberta Discover Guide | 689 hunting-listed records, 296,938 published property acres, 2 with unknown acreage |
| Pheasant releases | Alberta Conservation Association 2026 release directory | All 39 listings, as a dated snapshot |
| Wildlife management units | Government of Alberta | Unit boundaries for context |
| Public land use zones | Government of Alberta | Zones plus access research for Ghost, McLean Creek, Kananaskis, Sibbald and Cataract |
| Crown classification | Government-hosted service | Partial southern Alberta extract, excludes the City of Calgary |
| Basemap | OpenStreetMap | © OpenStreetMap contributors, ODbL |

Property records can be searched by published description, restrictions, habitat and wildlife mentions, and filtered by WMU, acreage and distance. Up to six sites can be compared side by side, and any filtered set exports as JSON, CSV or GeoJSON. Favourites and personal notes stay in the browser. Property records work offline; basemap tiles and refreshes need a connection.

## How access is represented

The rule I built around is that **ownership, permission to enter, hunting permission and vehicle access are four separate facts**, and the atlas keeps them apart. Concretely:

- **Acres are property area, not huntable area.** The 296,938-acre total is labelled as published property acreage. It says nothing about which parts are open, or to whom.
- **Points say what they are.** Each property's representative point is the midpoint of its bounding box, documented as such, never as an entrance. Any coordinate must declare whether it is property geometry, an approximate reference or a documented entrance.
- **Unverified stays unverified.** The local research includes 11 mapped access references across three properties. All 11 are flagged as unverified and none is presented as legal entry.
- **Blank means unknown.** The Crown layer is a partial extract. An empty area on the map means ownership is unknown, not private and not public. The extract isn't provincewide and isn't proof of current title.
- **Annual data is dated.** Pheasant listings are a 2026 snapshot, not a live release schedule.
- **Wildlife mentions are quotations.** A species named in a property profile is source wording, not a population estimate or a promised sighting.

The click-to-inspect panel shows every enabled feature under a point, with its source attributes and coverage limits, so a WMU, a PLUZ and a Crown parcel can be read together without one implying the others. The Calgary-area research pages go further: they list the official sources, what was found, and what is still missing, including a draft advocacy brief.

## Status: in development, not yet released

The working application is a Rust/Axum server with plain JavaScript and Leaflet 1.9.4, and it runs locally. The public repository is the showcase and contribution hub: the screenshots are of the real application, but the application source and data snapshots are not published there, and cloning it does not install anything. There is no public hosted demo.

The reason is redistribution, not readiness. The conservation profiles are the Alberta Conservation Association's text, and ACA reserves rights to its website content. Government layers carry their own terms. I'm not going to republish scraped descriptions or geospatial datasets until those terms are clear, and the project itself has no open-source licence assigned yet.

## What I chose not to do

- **Infer access from adjacency.** A road next to a parcel, a trail crossing it or a Crown label on it is not treated as evidence of lawful entry.
- **Fill gaps with guesses.** Unknown acreage stays unknown; unclassified land stays blank.
- **Accept unsourced corrections.** The contribution templates ask for an official source URL, the date it was checked, and whether a fact is a published rule or a personal observation. A photo of a gate is not proof of access, and photos need documented reuse permission.

## Limits

- The Crown classification covers part of southern Alberta only.
- Vehicle restrictions, seasons and closures are not yet reconciled at route level against PLUZ maps.
- Entrances, parking and staging areas are not yet documented from authoritative records or field work.
- Map performance with larger layers and on mobile hasn't been measured.
- Data refreshes are not yet fully reproducible.

## What's next

The roadmap covers real site photos with credit and permission, easier-to-scan profiles, better mobile browsing, authoritative provincewide ownership coverage, agricultural disposition and recreation-access conditions with source dates, route-level vehicle rules, reproducible refreshes, and resolving licensing so a runnable public release and hosting can follow. These are priorities, not dates.

The repository has the screenshots, source list and roadmap. If you have a sourced correction or a photo you can share, the issue templates are the place to start.
