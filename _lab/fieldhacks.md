---
title: "Fieldhacks"
order: 11
kind: "projects"
size: "normal"
summary: "Open-source hunting tools under $10: ballistics, trail counts, wind and legal light."
link: "/fieldhacks/"
repo: "https://github.com/mizoz/fieldhacks"
cover: "/assets/lab/fieldhacks.jpg"
gallery: ["/assets/lab/fieldhacks-2.jpg"]
stack: ["Arduino", "C++", "Python", "JavaScript"]
status: "live"
---

Fieldhacks is a set of small open-source tools for hunters, built around one rule: if the hardware costs more than about $10, the idea isn't clever enough yet. Each build is an ATmega328P board, a sensor that costs a dollar or two, and software doing the heavy lifting.

Commercial gear answers hunting questions with bigger hardware. Usually a hunter needs one number: where to hold, what hour a trail gets used, when the morning wind turns. Those numbers can come from physics and careful firmware on a $2 chip.

Every build says exactly how it was tested: against reference software or in a chip simulator. **None of the firmware has run on a physical board yet.**

## HoldPoint: a $5 ballistics calculator

*Full write-up: [HoldPoint in depth](/fieldhacks/holdpoint/)*

An Arduino Nano clone, a 0.96" OLED and three buttons. Enter your load once, thumb to a range, and it shows the hold in MIL and MOA, wind drift, velocity and energy.

**The model.** It's a 2-D point-mass solver, the same basic model commercial hunting solvers build on. Only gravity and drag act on the bullet:

```
dv/dt = -(drag decel) * v_hat + g
drag decel = K * (rho/rho0) * Cd(M) * v^2 / BC
K = rho0 * pi / (8 * 144) = 2.08551e-4
```

`Cd(M)` comes from the standard G1 or G7 drag tables (79 and 84 points of Mach number vs drag coefficient), generated from py-ballisticcalc and stored in flash. G1 is the old flat-based standard most boxes print. G7 is a long boat-tail shape whose BC stays nearly constant through the flight, so it's better when the maker publishes it.

Air is treated as a dry ideal gas, using **station** pressure (what a barometer reads where you stand, not the sea-level figure in a weather app):

```
rho/rho0 = (P / 29.92 inHg) * (518.67 / T_R),   T_R = degF + 459.67
speed of sound = 49.0223 * sqrt(T_R) ft/s
```

**Integration.** Every 3 ft along the line of sight it takes a midpoint (second-order Runge-Kutta) step, and records drop, drift, velocity and time of flight as the bullet crosses each 25 yd mark, interpolating between steps. It stops below 300 fps or after 6 s, well before the transonic zone where both drag curves jump.

**Zeroing** is a shooting method: fire a test trajectory, measure the miss at the zero distance, correct the bore angle by miss ÷ range, repeat until the miss is under 0.006 in. It zeroes in the air you recorded on zero day, then flies the trajectory in today's air, so a summer zero carries over to a cold November hunt.

**Wind** uses Didion's lag rule, `drift = W * (t - x / V0)`: crosswind multiplied by how much longer the bullet took than it would in a vacuum. **Uphill and downhill** shots rotate gravity into the line-of-sight frame instead of using the rifleman's cosine rule.

**Fitting it on the chip.** The ATmega328P has 2 KB of RAM and no floating-point hardware. The solver streams rows to a callback instead of storing the path and builds the 25–1000 yd table once per settings change, so scrolling just reads it. The firmware uses about 24 KB of flash and 1.2 KB of RAM.

### How it was validated

The same C++ builds on a PC, and the test suite runs six loads through it and through py-ballisticcalc, an independent open-source solver: G1 and G7, 100 and 200 yd zeros, −10 °F, 26.8 inHg thin air, 20° uphill and 15° downhill. CI fails if drop differs by more than the larger of 0.5 in or 2%, wind by more than 0.5 in or 5%, or velocity by more than 1%.

The actual results sit far inside those limits:

| Case | Range | Reference | HoldPoint |
|---|--:|--:|--:|
| .308 168 gr, G1, 100 yd zero | 800 yd | −223.96 in | −223.94 in |
| 6.5 CM 143 gr, G7, 26.8 inHg | 800 yd | −174.45 in | −174.44 in |
| .270 130 gr, −10 °F | 500 yd | −43.76 in | −43.75 in |
| .243 95 gr, 20° uphill | 500 yd | −42.70 in | −42.88 in |

On level shots, drop agrees within 0.02 in and velocity within 1 fps at every 100 yd point. Angled shots differ by up to 0.18 in, mainly because the two solvers sample the slant path differently. CI also runs the solver on a simulated ATmega328P: the same numbers in 32-bit float, a full table in about 1.1 s at 16 MHz.

Not modelled: spin drift, Coriolis, aerodynamic jump and humidity. Inside 500 yd they add up to a few inches at most. The bigger error is the input: box velocities often read 50–150 fps high, and 50 fps moves a 600 yd hold by about 4.7 in.

## Trail Tally: when animals use a trail

*Full write-up: [Trail Tally in depth](/fieldhacks/trail-tally/)*

A Pro Mini 3.3 V and an AM312 PIR sensor, about $3, strapped to a tree. Each trigger adds one to the hour's count, then ignores motion for 60 s so a browsing deer counts once.

The hard part is keeping time without a clock chip. The chip sleeps in power-down and wakes every 8 s on its watchdog, whose oscillator is often 5–15% off. Once an hour the firmware times one watchdog period against the 8 MHz resonator with Timer1, and uses that measured length for the next hour. Counts go one byte per hour into the 1 KB EEPROM: a 42-day ring, written immediately so a dead battery loses nothing.

The **power budget is on paper, not measured**: about 4–5 µA for the sleeping chip, up to 100 µA for the AM312 at its datasheet maximum, under 1 µA averaged for wake-ups. Even at the worst case, 2,000 mAh of AA lasts over a year.

In a 41.5-day simulation with the watchdog 9% slow and swinging ±4% daily, it counted 366 of 366 passes once, got 984 of 996 hourly bins exact, and ended 2 minutes off (3.4 days off without calibration). The compiled firmware also passes a harness in the simavr chip simulator.

## Trail Finder: trails in drone images

*Full write-up: [Trail Finder in depth](/fieldhacks/trail-finder/)*

Software that turns a drone orthomosaic into GeoJSON trail lines, with no machine learning: Excess Green (`2G − R − B`) to separate packed dirt from plants, a Sato ridge filter at 0.3, 0.6 and 1 m widths, hysteresis thresholds at the 97.5th and 93rd percentiles, then skeletonisation. A Hough transform removes anything that runs 20 m without straying more than 15 cm, because fences and ATV tracks are straight and game trails are not. Confidence is `0.55·strength + 0.25·length + 0.2·meeting points`, a ranking rather than a probability.

On synthetic scenes it scores 0.94 precision and 0.91 recall across 12 unseen seeds. I wrote both the scene generator and the detector, so those numbers show the pipeline works, not that it works on real flights. **No real drone imagery has gone through it yet.**

## Wind Scout: when the thermal switches

*Full write-up: [Wind Scout in depth](/fieldhacks/wind-scout/)*

A homemade vane and cup anemometer that logs 16-point direction and speed once a minute for about 20 days, one byte per record. A DS3231 clock earns its $1.50 here, because a drifting clock would smear an 08:30 switch across most of an hour. The switch finder takes the 03:00–06:00 wind as a baseline and reports the first 20-minute window more than 90° away that the next 40 minutes agree with. With no clear baseline, such as during a front, it reports nothing. The firmware logic passes 103 unit checks on a PC and compiles for the Pro Mini. **It has not been built.**

## Legal Light: legal shooting hours for your exact stand

Sunrise moves about 4 minutes for every degree of longitude, so the newspaper's sunrise for the nearest city can be wrong for your stand. Edmonton to Lloydminster is 3.5° east, which puts legal light there about 14 minutes earlier on the same clock. Legal Light computes sunrise, sunset and civil twilight for your coordinates, applies your local legal offsets, and prints a whole season as a table. It's software only, one dependency-free file, and it agrees with an independent sunrise/sunset library to within a minute between the polar circles. Like the regulations, it assumes a flat horizon.

*Full write-up: [Legal Light in depth](/fieldhacks/legal-light/)*

## Limits

- No build has run on real hardware. Sleep current, false triggers and field battery life are untested.
- HoldPoint is a holdover aid. Confirm on paper at real distances and carry the printed range card.
- Trail Finder drops straight trails along with fences, and loses trails under canopy.
- Electronic aids and drone scouting are regulated in many places. Check your local rules.

The source, build guides and a browser version of the HoldPoint solver are all open.
