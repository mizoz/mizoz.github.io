---
title: "NeonGrid"
order: 12
kind: "projects"
size: "normal"
summary: "A small cyberpunk city-builder in plain HTML, CSS and JavaScript."
link: "/neongrid/"
repo: "https://github.com/mizoz/neongrid"
cover: "/assets/lab/neongrid.jpg"
gallery: []
stack: ["HTML", "CSS", "JavaScript", "Web Audio API"]
status: "live"
---

NeonGrid is a small city-builder that runs in a browser tab: a 20 × 15 grid, 16 building types, a three-branch tech tree, random events and a terminal-style neon look. It's written in plain HTML, CSS and JavaScript with no framework, no build step and no install. There's also a single-file version, `neongrid.html`, with the stylesheet and script inlined, so the whole game can be sent as one file.

Underneath the neon, a city-builder is a set of resource stocks, a table of buildings that push those stocks up or down, and a clock. Everything else is presentation.

## How it works

**The economy is a table.** Each building is one row of numbers: cost, plus per-second effects on credits, energy, population capacity, happiness and tech. A Power Plant costs 500 and gives +50 energy, −10 credits and −5 happiness. A Commercial Zone costs 300 and gives +50 credits, −10 energy and +5 happiness. Balancing the game means editing that table, not code.

**The tick loop.** A one-second `setInterval` sums every building's row and applies it:

- credits rise by the net credit rate, with no floor
- energy rises by the net rate, clamped between 0 and the cap (100 at the start)
- happiness rises by the net rate, clamped between 0 and 100
- population grows by one with a 10% chance each tick, if it's under total housing capacity and at least one Water Treatment plant exists

Research multiplies the sums: Solar Panels add 25% to energy, Fusion raises the cap to 200, Teleporters add 50% to credits and energy.

A worked example from the starting 1,000 credits: build a Power Plant and a Commercial Zone, leaving 200. Each second after that the city nets +40 credits, +40 energy (until it hits the cap) and zero happiness, because the plant's −5 cancels the shop's +5. Add an Industrial Zone for +80 credits and happiness starts falling by 10 every second, so it's empty in about five seconds unless you pay for a Police Station or Hospital. That's the core tension: the buildings that earn the most cost the most happiness.

**Placement** has one rule beyond cost: you can't place a building whose energy draw would push the current stock below zero. There's no zoning or adjacency. Any building can go on any cell.

**Events.** Once the city has three buildings, a random event fires roughly every 30 seconds, from a pool of 12: outages, riots, meteor showers, trade deals, an alien invasion. Each offers two choices, and some outcomes depend on what you've built: fighting off the aliens needs two Defense Towers, and a disease outbreak without a Hospital cuts population by 30%.

**Rendering.** The grid is a CSS grid of 300 `div` cells. Buildings draw as small box-drawing ASCII art. A wall-clock day/night overlay cycles every five minutes, and weather particles are DOM elements animated with CSS. Sound effects are square and sawtooth tones generated with the Web Audio API, so there are no audio files. Saving downloads the city as a JSON file, and loading reads it back with the File API.

## Design decisions

Plain JavaScript and the DOM instead of a canvas or game engine. At 300 cells and a one-second tick, the DOM is fast enough and every tile can be inspected in dev tools. Save files are plain JSON you can read and edit.

## Limits

The code is smaller than the feature list it describes, and I'd rather say so:

- **Buildings don't generate tech.** Research Labs and Data Centers list tech output, but the tick loop never adds it. Tech currently comes only from two random events.
- **Storms and snow never happen.** The weather picker's weights reach 100% before those entries, so the storm penalty never applies.
- **Auto-save only records a timestamp.** Saving is manual.
- Several building descriptions (Transit Hub's 20% boost, the Hospital as a growth requirement) aren't implemented, and population has no effect on income.
- Number keys select by position in the full building list, which can pick a building that hasn't been researched yet.

It's playable as a small sandbox, and the source is short enough to read in one sitting.
