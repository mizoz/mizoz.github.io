---
title: "Post Preview"
order: 2
kind: "social"
size: "wide"
summary: "Six networks side by side, with real character counts and where 'see more' cuts."
link: "/post-preview/"
repo: "https://github.com/mizoz/post-preview"
cover: "/assets/lab/post-preview.jpg"
gallery: []
stack: ["HTML", "CSS", "JavaScript"]
status: "live"
---

A social post has two lengths that matter. One is the hard limit, the point where the network refuses to publish. The other is the fold, the point where the feed cuts your text and adds "…more". The fold matters more, because most readers never tap it, so whatever you put after it is effectively unpublished. None of the networks document where their fold is.

Post Preview lets you write once and see the post as LinkedIn, X, Instagram, Threads, Facebook and Bluesky mockups side by side, at mobile or desktop width. Each one shows the count against that network's limit with the overflow in red, and a marker where the fold lands. A hook checker prints the exact text people see before the cut on each network.

I built it because I kept writing LinkedIn posts where the actual point landed right after "…more", and kept pasting the same draft into three counters that disagreed about how long an emoji is. They disagree because "a character" means something different on each network, and that turned out to be the interesting part.

## How it works

### Four ways to count a character

The family emoji 👨‍👩‍👧‍👦 is one symbol on screen. Underneath it is 7 Unicode code points joined by zero-width joiners, 11 UTF-16 units (what JavaScript's `.length` reports) and 25 bytes of UTF-8. Every network picks a different one of those, or its own rule:

| Network | Limit | What counts as one |
|---|---|---|
| X | 280 (25,000 with Premium) | Weighted: most Latin text is 1, emoji and CJK are 2, every link is 23 |
| Bluesky | 300 graphemes and 3,000 bytes | Visible characters, plus a byte cap |
| Threads | 500 | Characters, but each emoji counts as its UTF-8 bytes (usually 4) |
| Instagram | 2,200 | Visible characters |
| LinkedIn | 3,000 | Visible characters |
| Facebook | 63,206 | Visible characters |

For "visible characters" the tool splits text with the browser's `Intl.Segmenter` at grapheme granularity, so a skin-toned thumbs-up, a family or a flag counts as 1.

**X** gets its own implementation of the twitter-text v3 weighting that X publishes. Text is NFC-normalized first. Code points in four ranges (U+0000 to U+10FF, plus three small punctuation ranges like curly quotes and dashes) weigh 100; everything else weighs 200; a link weighs `23 × 100` regardless of its real length; the total is divided by 100 and rounded up. Emoji are detected as whole graphemes and charged 200 once, not once per code point. The test suite checks results against twitter-text's own `parseTweet()`:

- `visit example.com today` is 35: 6 + 23 + 6.
- `👍🏽 family 👨‍👩‍👧‍👦 flag 🇨🇦 keycap 1️⃣` is 30, each emoji costing 2.
- `𝗕𝗼𝗹𝗱 text` is 13, not 9. Unicode "bold" letters live outside the cheap range, so they cost double on X.

**Bluesky** is the case where two limits disagree. Its post schema caps text at 300 graphemes *and* 3,000 bytes. Three hundred family emoji pass the first check at exactly 300 and fail the second at 7,500 bytes. The tool tracks both and flags whichever you break.

**Threads** follows its developer docs, which count emoji by UTF-8 byte length, so `hi 👋` is 7, not 4.

### Modelling the fold

Because the folds aren't published, I model each one as two budgets, a character budget and a line budget, with a rough characters-per-line figure for each width. Whichever runs out first sets the cut, which then backs up to the previous space or line break if one is within 25 characters, since feeds don't cut mid-word.

| Network | Mobile | Desktop |
|---|---|---|
| LinkedIn | ~140 chars or 3 lines (~44 per line) | ~210 chars or 3 lines (~72 per line) |
| Instagram | ~125 chars or 2 lines (~44 per line) | ~125 chars or 2 lines (~56 per line) |
| Facebook | ~125 chars or 5 lines (~44 per line) | ~477 chars or 6 lines (~78 per line) |
| X Premium long posts | ~280 chars | ~280 chars |
| X, Threads, Bluesky | no fold | no fold |

The two budgets interact in ways a single number hides. For a continuous paragraph of short words, Instagram on mobile cuts at 84 characters, not 125: two lines of about 44 run out first. On Facebook desktop the six-line budget (about 468 characters) beats the 477 figure, and the cut lands at 464. And blank lines between paragraphs, the standard LinkedIn style, each spend a whole line of the three, so a post that opens with a one-line hook and a gap has only one more line left before the fold.

### The rest

Hashtag, mention, link and emoji counts appear under each preview, with network-specific warnings: Instagram's 5-hashtag cap (rolling out since late 2025), Threads linking only one topic tag, and every link costing 23 on X. Bare domains like `firstshow.ca` count as links; emails and @handles don't.

A formatter turns selected text into Unicode bold, italic or bold italic, the trick people use on LinkedIn, and converts it back. Whenever styled letters are present, the page warns that they are really maths symbols: screen readers can read them letter by letter or skip them, and search won't match them.

## Design decisions

**Everything stays in the browser.** No accounts, analytics or cookies. Drafts, name and photo live in local storage. The share link puts the text after the `#`, which browsers never send to a server.

**Counting is separate from the interface.** All the rules live in one pure-function file with no DOM, so they run under Node and are covered by tests.

**Mockups, not screenshots.** The previews look like the networks without pretending to be them, and the page says so.

## Limits

- The fold figures come from observed behaviour reported by third-party guides, not from the platforms. They shift with screen width, font size and app version. Treat them as close, not exact.
- Line wrapping is estimated by character count, not by measuring rendered text, so a post full of wide letters or emoji wraps sooner in the real app.
- Bare-link detection for X checks a list of 46 common domain endings, where twitter-text uses the full IANA list. Links starting with `https://` always count correctly.
- Limits and rules were checked in October 2026 and will drift.

Paste a real draft and start with the hook checker: it shows exactly what survives the fold on each network.
