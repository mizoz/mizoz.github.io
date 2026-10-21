import { loadBrain } from './brain.js';

const $ = s => document.querySelector(s);
const LI = 'https://www.linkedin.com/in/ahmed-m-82ba28169/';
const GH = 'https://github.com/mizoz';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- what the site knows (from Ahmed's verified facts only) ----------
const TOOLS = {
  tool_image: { name: 'Social Image Sizer', url: '/social-image-sizer/', blurb: 'Drop one image, get every social media size as a zip.' },
  tool_post: { name: 'Post Preview', url: '/post-preview/', blurb: 'See your post on LinkedIn, X, Instagram, Threads, Facebook and Bluesky, with the "see more" cutoffs.' },
  tool_utm: { name: 'UTM Builder', url: '/utm-builder/', blurb: 'Clean UTM links, a GA4 channel check and QR codes.' },
  tool_og: { name: 'Link Preview Checker', url: '/og-preview/', blurb: 'See how a link looks when shared and get the tags to fix it.' },
  tool_alt: { name: 'Alt Text Checker', url: '/alt-text-checker/', blurb: 'Find images missing alt text on any page, plus a guide to writing it.' },
  tool_sig: { name: 'Email Signature Generator', url: '/email-signature/', blurb: 'Signatures for Gmail, Outlook and Apple Mail. No watermark.' },
  tool_ros: { name: 'Run of Show Builder', url: '/run-of-show/', blurb: 'Plan an event minute by minute, print the cue sheet, follow it live.' },
  tool_sponsor: { name: 'Sponsorship Builder', url: '/sponsorship-builder/', blurb: 'Price sponsor tiers with a formula you can see, then print the sponsor sheet.' },
  tool_stream: { name: 'Stream Calculator', url: '/stream-calc/', blurb: 'Live stream bitrate, upload bandwidth and video file size.' },
  open_trails: { name: 'Open Trails Canada', url: '/open-trails-canada/', blurb: 'A free multilingual guide to the outdoors around Calgary and Alberta for newcomers.' },
  open_fieldhacks: { name: 'Fieldhacks', url: '/fieldhacks/', blurb: 'Cheap hardware builds for hunters and backcountry people.' },
  open_neongrid: { name: 'NeonGrid', url: '/neongrid/', blurb: 'A cyberpunk city-builder you can play right in the browser.' },
  open_classfinder: { name: 'YYC Class Finder', url: 'https://city-picks.vercel.app', blurb: 'Every City of Calgary recreation program, searchable.' },
  open_atlas: { name: 'Alberta Atlas', url: GH + '/alberta-atlas', blurb: 'Maps of Alberta conservation land, wildlife units and Crown-land access.' },
  open_flights: { name: 'YYC Flight Radar', url: GH + '/yyc-flight-radar', blurb: 'Flight deals out of Calgary and Edmonton on one dashboard.' },
};

const A = {
  who: { t: "Ahmed Mahmoud is a founder, communications professional and tech wizard in Calgary. He started FirstShow, a sponsorship company for events, creators and venues across Canada. He makes websites, brands, photo, video and live streams, and builds free tools like the ones on this page. He's open to any role, anywhere.", a: [['Polished portfolio', '/pro/'], ['LinkedIn', LI]] },
  firstshow: { t: 'FirstShow is the sponsorship company Ahmed founded in Calgary. It builds and manages sponsorship programs for events, creators, venues and organizations across Canada.', a: [['firstshow.ca', 'https://firstshow.ca']] },
  experience: { t: "Ahmed is a communications professional and tech wizard. From 2022 to 2026 he worked in-house in communications and digital: video, photography, motion graphics, live streams, social, newsletters and website updates, plus a CMS across multiple websites and a Canto digital asset library. He led media pushes for major public launches, and his content passed 1 million impressions. He has also owned AMZD Media since 2020 (menu photography and corporate events).", a: [['Full experience', '/pro/#experience']] },
  skills: { t: 'Video and photo (Premiere Pro, After Effects, Photoshop, Lightroom, Illustrator, InDesign, Canva), live streaming (OBS, vMix, YouTube and Facebook Live, Zoom, Teams), web (WordPress, CMS, Canto DAM, Google Analytics, Google Ads, Meta Business Suite) and building things (HTML, CSS, JavaScript, Next.js, Python, Go, SQLite). This page included.', a: [['See the work', '/pro/#work']] },
  certs: { t: 'Google Ads Search Certification, plus HubSpot Academy certifications in Digital Marketing, Social Media Marketing I and II, Sales Management and Revenue Operations (all 2026).', a: [] },
  education: { t: "Ahmed studied in SAIT's Journalism Diploma program (2020 to 2022). Before that he was a registered electrical apprentice, which is where the \"make it work\" instinct comes from.", a: [] },
  location: { t: "He's based in Calgary, Alberta. Open to Calgary, Edmonton, remote, or relocating anywhere for the right role. He has a Class 5 licence.", a: [['Get in touch', LI]] },
  hire: { t: "Yes, Ahmed is open to work: communications, marketing, digital, content, events or something fun he hasn't thought of. Full-time, contract or part-time, in Calgary, Edmonton, remote or anywhere else.", a: [['Message him on LinkedIn', LI], ['Polished portfolio', '/pro/']] },
  contact: { t: 'The fastest way to reach Ahmed is a LinkedIn message. His code lives on GitHub.', a: [['LinkedIn', LI], ['GitHub', GH]] },
  resume: { t: "His experience, skills and certifications are on the polished portfolio. A lot of his client work is under NDA, so samples are shared on request.", a: [['Open the portfolio', '/pro/'], ['Ask for samples', LI]] },
  ventures: { t: 'Things Ahmed has launched: FirstShow (sponsorship), FRAME YYC (photo and video for Calgary businesses), Bite5 (local food deals), Wiredeo (brief-to-shoot planning), SteadyFile (private dated records), ZalaStack (business strategy) and YYC Class Finder.', a: [['See them all', '/pro/#work']] },
  tools_list: { t: 'Everything lives in the Lab below: nine free tools for marketers and event teams, an outdoors guide, hardware hacks and a game.', a: [['Jump to the Lab', '#lab']], go: '#lab' },
  salary: { t: "Depends on the role. Ahmed would rather talk about it than post a number on a website. Send him a message.", a: [['LinkedIn', LI]] },
  greet: { t: "Hey! Ask me anything about Ahmed, or tell me what you're trying to do, like \"resize a photo for LinkedIn\" or \"plan a gala run of show\".", a: [] },
  thanks: { t: 'Anytime. If you liked it, tell Ahmed. He built me.', a: [['Say hi on LinkedIn', LI]] },
  joke: { t: "Steve is our reference department. Steve is currently at lunch. Steve is always at lunch.", a: [['Visit the mayhem', '/mayhem/']] },
  help: { t: 'Try: "resize my photo for an Instagram story", "how much upload do I need for YouTube 1080p", "is Ahmed open to remote work", "what is FirstShow", or type "terminal".', a: [] },
  go_pro: { t: 'Taking you to the polished portfolio.', a: [['Open', '/pro/']], go: '/pro/' },
  go_mayhem: { t: 'You asked for it. Good luck in there.', a: [['Enter the mayhem', '/mayhem/']], go: '/mayhem/' },
  go_terminal: { t: 'Opening the terminal.', a: [], fn: () => openTerm() },
  go_github: { t: "Ahmed's public code is on GitHub.", a: [['GitHub', GH]] },
};

// ---------- slot filling so tools open pre-configured ----------
function slots(intent, q) {
  const s = q.toLowerCase();
  const T = TOOLS[intent];
  if (!T) return null;
  let url = T.url, note = '';
  if (intent === 'tool_image') {
    const map = [
      [/(insta|ig)\w*.*(story|stories|reel)|(story|stories|reel).*(insta|ig)/, 'instagram-story', 'Instagram story'],
      [/(insta|ig)\w*.*portrait|4:5/, 'instagram-portrait', 'Instagram portrait'],
      [/(insta|ig)/, 'instagram-post', 'Instagram post'],
      [/linkedin.*(banner|cover|header|background)/, 'linkedin-banner', 'LinkedIn banner'],
      [/linkedin/, 'linkedin-post', 'LinkedIn post'],
      [/youtube.*(banner|channel)/, 'youtube-banner', 'YouTube banner'],
      [/youtube|thumbnail/, 'youtube-thumbnail', 'YouTube thumbnail'],
      [/(twitter|\bx\b).*(header|banner)/, 'x-header', 'X header'],
      [/twitter|\bx\b/, 'x-post', 'X post'],
      [/facebook.*(cover|banner)/, 'facebook-cover', 'Facebook cover'],
      [/facebook|\bfb\b/, 'facebook-post', 'Facebook post'],
      [/tiktok/, 'tiktok', 'TikTok'],
      [/pinterest|\bpin\b/, 'pinterest-pin', 'Pinterest pin'],
      [/\bog\b|open graph|link preview/, 'og-image', 'link preview'],
    ];
    const hit = map.find(m => m[0].test(s));
    if (hit) { url += '#p=' + hit[1]; note = 'Pre-set for ' + hit[2] + '.'; }
  }
  if (intent === 'tool_stream') {
    if (/file size|how big|storage|gb|prores/.test(s) && !/upload/.test(s)) { url += '#t=file'; note = 'Opening the file size calculator.'; }
    else if (/upload time|how long.*upload|upload.*(file|gb)/.test(s)) { url += '#t=upload'; note = 'Opening the upload time calculator.'; }
    else {
      const p = ['youtube', 'facebook', 'twitch', 'linkedin', 'vimeo', 'teams', 'zoom'].find(x => s.includes(x)) || 'youtube';
      const res = /4k|2160/.test(s) ? '2160p' : /1440/.test(s) ? '1440p' : /720/.test(s) ? '720p' : '1080p';
      const fps = /60/.test(s) ? '60' : '30';
      url += '#t=live&r=' + p + '.' + res + fps + '.h264';
      note = 'Pre-set for ' + p.charAt(0).toUpperCase() + p.slice(1) + ' at ' + res + fps + '.';
    }
  }
  if (intent === 'tool_utm') {
    const src = [['linkedin', 'linkedin', 'social'], ['facebook', 'facebook', 'social'], ['instagram', 'instagram', 'social'], ['newsletter', 'newsletter', 'email'], ['email', 'newsletter', 'email'], ['google ads', 'google', 'cpc']].find(x => s.includes(x[0]));
    if (src) { url += '?s=' + src[1] + '&m=' + src[2]; note = 'Source and medium pre-filled for ' + src[1] + '.'; }
  }
  return { ...T, url, note };
}

// ---------- the brain ----------
let brain = null;
const readout = $('#readout');
loadBrain('/assets/brain.json').then(b => {
  brain = b;
  readout.querySelector('[data-k=size]').textContent = (b.size / 1024).toFixed(0) + ' KB';
  readout.querySelector('[data-k=intents]').textContent = b.intents;
  readout.classList.add('ready');
}).catch(() => { readout.querySelector('[data-k=status]').textContent = 'offline'; });

function think(q) {
  if (!brain) return null;
  const r = brain.predict(q);
  readout.querySelector('[data-k=intent]').textContent = r.top.intent;
  readout.querySelector('[data-k=conf]').textContent = Math.round(r.top.p * 100) + '%';
  readout.querySelector('[data-k=ms]').textContent = r.ms < 1 ? (r.ms * 1000).toFixed(0) + ' µs' : r.ms.toFixed(1) + ' ms';
  $('#confbar').style.setProperty('--c', r.top.p);
  return r;
}

const out = $('#answer');
function render(q, r, opts = {}) {
  const conf = r.top.p, intent = r.top.intent;
  if (conf < 0.32) {
    const alts = r.ranked.map(x => TOOLS[x.intent] ? TOOLS[x.intent].name : (x.intent.replace(/_/g, ' '))).slice(0, 3);
    out.innerHTML = `<div class="card unsure"><p class="lbl">Not sure (${Math.round(conf * 100)}% confident)</p><p>I'm a tiny model, so I only know about Ahmed and the Lab. Closest guesses: ${alts.map(esc).join(', ')}.</p>${bigBrainOffer()}</div>`;
    wireBig(q);
    return;
  }
  const tool = slots(intent, q);
  if (tool) {
    out.innerHTML = `<div class="card tool"><p class="lbl">${Math.round(conf * 100)}% sure you want</p><h3>${esc(tool.name)}</h3><p>${esc(tool.blurb)} ${tool.note ? '<b>' + esc(tool.note) + '</b>' : ''}</p><div class="acts"><a class="btn primary" href="${esc(tool.url)}">Open ${esc(tool.name)} ↵</a></div></div>`;
    lastGo = tool.url;
    return;
  }
  const a = A[intent];
  if (!a) return;
  out.innerHTML = `<div class="card"><p class="lbl">${Math.round(conf * 100)}% · ${esc(intent.replace(/_/g, ' '))}</p><p class="ans">${esc(a.t)}</p><div class="acts">${a.a.map(([l, u], i) => `<a class="btn${i ? '' : ' primary'}" href="${esc(u)}">${esc(l)}</a>`).join('')}</div>${['who', 'experience', 'firstshow', 'skills', 'hire'].includes(intent) ? bigBrainOffer('Ask a follow-up with the big brain') : ''}</div>`;
  wireBig(q);
  lastGo = a.a[0] ? a.a[0][1] : null;
  if (a.fn && !opts.quiet) a.fn();
  if (a.go && a.go.startsWith('#') && !opts.quiet) document.querySelector(a.go).scrollIntoView({ behavior: 'smooth' });
}
let lastGo = null;

// ---------- command bar ----------
const input = $('#ask');
let timer;
input.addEventListener('input', () => {
  clearTimeout(timer);
  const q = input.value.trim();
  if (!q) { out.innerHTML = ''; return; }
  timer = setTimeout(() => { const r = think(q); if (r) render(q, r, { quiet: true }); }, 90);
});
$('#askform').addEventListener('submit', e => {
  e.preventDefault();
  const q = input.value.trim(); if (!q) return;
  if (big.ready && (!brain || brain.predict(q).top.p < 0.5)) return askBig(q);
  const r = think(q); if (!r) return;
  render(q, r);
  const intent = r.top.intent;
  if (r.top.p >= 0.32 && (TOOLS[intent] || (A[intent] && A[intent].go && !A[intent].go.startsWith('#')))) {
    const u = TOOLS[intent] ? slots(intent, q).url : A[intent].go;
    setTimeout(() => { location.href = u; }, 350);
  }
});
document.querySelectorAll('[data-try]').forEach(b => b.addEventListener('click', () => {
  input.value = b.dataset.try; input.dispatchEvent(new Event('input')); input.focus();
}));
addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== input && !termOpen()) { e.preventDefault(); input.focus(); }
  if ((e.key === '`' || e.key === '~') && document.activeElement !== input && !termOpen()) { e.preventDefault(); openTerm(); }
});

// typewriter placeholder
const ideas = ['resize my photo for an instagram story', 'who is ahmed?', 'how much upload for youtube 1080p60', 'plan a gala run of show', 'is he open to remote work?', 'utm link for my newsletter', 'what is firstshow?', 'play a game'];
let ii = 0, ci = 0, del = false;
(function type() {
  if (document.activeElement === input || input.value) { input.placeholder = 'Ask anything, or tell me what you need to do…'; return setTimeout(type, 600); }
  const w = ideas[ii];
  input.placeholder = w.slice(0, ci) + (ci % 2 ? '▍' : '');
  if (!del && ci++ >= w.length) { del = true; return setTimeout(type, 1400); }
  if (del && ci-- <= 0) { del = false; ii = (ii + 1) % ideas.length; }
  setTimeout(type, del ? 25 : 55);
})();

// ---------- big brain: MiniLM-L6 semantic search on the visitor's device ----------
// It can only answer by quoting verified facts, so it can't make things up.
const KB = [
  ['Ahmed Mahmoud is a founder, communications professional and tech wizard based in Calgary, Alberta.', '/pro/'],
  ["He's open to any role, anywhere: communications, marketing, digital, content or events, full-time, contract or part-time.", LI],
  ['He will relocate for the right role, works remotely, and has a Class 5 licence.', LI],
  ['For a marketing or communications team he brings content production (video, photo, design), live streaming, websites, social media, Google Ads and HubSpot certifications, and he builds tools that save the team time.', '/pro/'],
  ['Before founding FirstShow, he worked in-house in communications and digital from 2022 to 2026, and he has owned AMZD Media since 2020.', '/pro/#experience'],
  ['He founded FirstShow, a sponsorship company that builds and manages sponsorship programs for events, creators, venues and organizations across Canada.', 'https://firstshow.ca'],
  ['From 2022 to 2026 he worked in-house in communications and digital, managing video, photography, motion graphics, live streams, social media, newsletters and website updates.', '/pro/#experience'],
  ['He managed a CMS across multiple websites and a Canto digital asset library, and trained staff across departments to use it.', '/pro/#experience'],
  ['He led media pushes for major public launches, and his content passed 1 million impressions.', '/pro/#experience'],
  ['He produces live streams on YouTube and Facebook Live with OBS and vMix, and runs virtual events on Zoom and Teams.', '/pro/'],
  ['He supervised freelance photographers, videographers and event AV crews, and tracked content and equipment budgets.', '/pro/#experience'],
  ['He has owned AMZD Media since 2020, doing menu photography for restaurants and photo and video coverage of corporate events.', '/pro/'],
  ['His video and design tools: Premiere Pro, After Effects, Photoshop, Lightroom, Illustrator, InDesign and Canva.', '/pro/'],
  ['His digital tools: WordPress, Canto, Google Analytics, Google Ads, Meta Business Suite, email and social media.', '/pro/'],
  ['He builds websites and web apps with HTML, CSS, JavaScript, Next.js, Python, Go and SQLite. He built this site and the model answering you.', GH],
  ['He holds the Google Ads Search Certification and HubSpot certifications in Digital Marketing, Social Media Marketing I and II, Sales Management and Revenue Operations.', '/pro/'],
  ["He studied in SAIT's Journalism Diploma program from 2020 to 2022, and was a registered electrical apprentice from 2017 to 2020.", '/pro/'],
  ['The best way to contact Ahmed is a LinkedIn message.', LI],
  ['A lot of his client work is under NDA, so samples are shared on request.', LI],
  ['He launched FRAME YYC, photo and video for Calgary businesses.', 'https://frameyyc.ca'],
  ['He launched Bite5, targeted local food deals for restaurants.', 'https://bite5.vercel.app'],
  ['He launched Wiredeo, which turns one offer into a storyboard, script and shot list.', 'https://www.wiredeo.com'],
  ['He launched SteadyFile, a private dated record you keep as things happen.', 'https://workvault-six.vercel.app'],
  ['He launched ZalaStack, business strategy for owner-led teams.', 'https://www.zalastack.com'],
  ['He built nine free tools for marketers and event teams, all in the Lab on this page.', '#lab'],
  ['Social Image Sizer resizes one image to every social media size and downloads them as a zip.', '/social-image-sizer/'],
  ['Post Preview shows a post on LinkedIn, X, Instagram, Threads, Facebook and Bluesky with character limits.', '/post-preview/'],
  ['UTM Builder makes tracking links with a GA4 channel check and QR codes.', '/utm-builder/'],
  ['Link Preview Checker shows how a link looks when shared and generates the meta tags.', '/og-preview/'],
  ['Alt Text Checker finds images missing alt text on any page.', '/alt-text-checker/'],
  ['Email Signature Generator makes signatures for Gmail, Outlook and Apple Mail with no watermark.', '/email-signature/'],
  ['Run of Show Builder plans an event schedule minute by minute (conferences, galas, weddings, launches, live streams), prints the cue sheet and runs a live countdown.', '/run-of-show/'],
  ['Sponsorship Builder prices sponsorship tiers and prints a one-page sponsor sheet.', '/sponsorship-builder/'],
  ['Stream Calculator works out live stream bitrate, upload bandwidth and video file size.', '/stream-calc/'],
  ['Open Trails Canada is a free multilingual guide to the outdoors around Calgary and Alberta for newcomers.', '/open-trails-canada/'],
  ['Fieldhacks is cheap hardware for hunters and backcountry people.', '/fieldhacks/'],
  ['NeonGrid is a cyberpunk city-builder game you can play in the browser.', '/neongrid/'],
];
const FACTS = KB.map(k => '- ' + k[0]).join('\n');
const big = { ready: false, loading: null, embed: null, vecs: null };
function bigBrainOffer(label) {
  return `<button class="btn ghost" data-big>🧠 ${esc(label || (big.ready ? 'Search the facts' : 'Wake the big brain'))} ${big.ready ? '' : '<small>23 MB · runs on your device</small>'}</button>`;
}
function wireBig(q) { const b = out.querySelector('[data-big]'); if (b) b.addEventListener('click', () => askBig(q)); }
async function loadBig(onProgress) {
  if (big.ready) return;
  if (!big.loading) big.loading = (async () => {
    const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1');
    const files = {};
    big.embed = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'q8',
      progress_callback: p => { if (p.status === 'progress' && p.total) { files[p.file] = [p.loaded, p.total]; let l = 0, t = 0; Object.values(files).forEach(([a, b]) => { l += a; t += b; }); onProgress && onProgress(l / t); } },
    });
    const v = await big.embed(KB.map(k => k[0]), { pooling: 'mean', normalize: true });
    big.vecs = v.tolist();
    big.ready = true;
    const st = $('#bigstat'); st.textContent = 'big brain: awake (MiniLM-L6)'; st.classList.add('on');
  })();
  try { await big.loading; } catch (e) { big.loading = null; throw e; }
}
async function search(q) {
  const t0 = performance.now();
  const qv = (await big.embed(q, { pooling: 'mean', normalize: true })).tolist()[0];
  const scored = big.vecs.map((v, i) => ({ i, s: v.reduce((a, x, j) => a + x * qv[j], 0) })).sort((a, b) => b.s - a.s);
  return { hits: scored.slice(0, 3), ms: performance.now() - t0 };
}
async function bigAnswer(q) {
  const { hits, ms } = await search(q);
  const best = hits[0];
  if (best.s < 0.42) return { text: "I don't know that one. I only know Ahmed's work, not his personal life. Ask him on LinkedIn.", link: LI, ms, score: best.s, n: 0 };
  const picks = hits.filter((h, k) => k === 0 || (h.s > 0.42 && best.s - h.s < 0.07)).slice(0, 2);
  return { text: picks.map(h => KB[h.i][0]).join(' '), link: KB[best.i][1], ms, score: best.s, n: picks.length };
}
async function askBig(q) {
  out.innerHTML = `<div class="card big"><p class="lbl">🧠 big brain · MiniLM-L6 semantic search · on your device</p><p class="ans" id="bigtxt">Waking up…</p><div class="meter"><i id="bigbar"></i></div></div>`;
  const txt = $('#bigtxt'), bar = $('#bigbar');
  try {
    await loadBig(f => { bar.style.width = (f * 100).toFixed(1) + '%'; txt.textContent = `Downloading a 23 MB model to your browser… ${(f * 100).toFixed(0)}% (one time, cached after)`; });
    bar.parentElement.remove();
    const r = await bigAnswer(q);
    txt.textContent = r.text;
    out.querySelector('.lbl').textContent += ` · similarity ${r.score.toFixed(2)} · ${r.ms.toFixed(0)} ms · quotes verified facts only`;
    out.querySelector('.card').insertAdjacentHTML('beforeend', `<div class="acts"><a class="btn primary" href="${esc(r.link)}">Go there →</a></div>`);
  } catch (e) {
    txt.textContent = "The big brain couldn't start on this device. The tiny brain still works for everything about Ahmed and the Lab.";
  }
}

// ---------- terminal ----------
const term = $('#term'), tout = $('#tout'), tin = $('#tin');
const termOpen = () => !term.hidden;
let hist = [], hi = 0;
function openTerm() {
  term.hidden = false; document.body.classList.add('term-on');
  if (!tout.dataset.booted) { tout.dataset.booted = 1; boot(); }
  setTimeout(() => tin.focus(), 50);
}
function closeTerm() { term.hidden = true; document.body.classList.remove('term-on'); }
$('#termclose').addEventListener('click', closeTerm);
document.querySelectorAll('[data-open-term]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openTerm(); }));
term.addEventListener('click', e => { if (e.target === term) closeTerm(); });
function line(html, cls = '') { const d = document.createElement('div'); d.className = 'tl ' + cls; d.innerHTML = html; tout.appendChild(d); tout.scrollTop = tout.scrollHeight; }
const link = (l, u) => `<a href="${esc(u)}">${esc(l)}</a>`;
function boot() {
  const msgs = ['AHMED-OS 26.10 (calgary build)', 'loading tiny brain… ' + (brain ? (brain.size / 1024).toFixed(0) + ' KB, ' + brain.intents + ' intents ✓' : 'ok'), 'mounting /lab … 15 experiments ✓', '', 'type <b>help</b> to see commands, or just ask a question in plain english.', ''];
  msgs.forEach((m, i) => setTimeout(() => line(m, 'dim'), i * 120));
}
const FS = {
  ventures: ['firstshow', 'frame-yyc', 'bite5', 'wiredeo', 'steadyfile', 'zalastack', 'yyc-class-finder'],
  tools: ['social-image-sizer', 'post-preview', 'utm-builder', 'og-preview', 'alt-text-checker', 'email-signature', 'run-of-show', 'sponsorship-builder', 'stream-calc'],
  projects: ['open-trails-canada', 'fieldhacks', 'neongrid', 'alberta-atlas', 'yyc-flight-radar'],
  files: ['about.txt', 'resume.txt', 'contact.txt', 'skills.txt'],
};
const URLS = { firstshow: 'https://firstshow.ca', 'frame-yyc': 'https://frameyyc.ca', bite5: 'https://bite5.vercel.app', wiredeo: 'https://www.wiredeo.com', steadyfile: 'https://workvault-six.vercel.app', zalastack: 'https://www.zalastack.com', 'yyc-class-finder': 'https://city-picks.vercel.app', 'alberta-atlas': GH + '/alberta-atlas', 'yyc-flight-radar': GH + '/yyc-flight-radar', linkedin: LI, github: GH, pro: '/pro/', mayhem: '/mayhem/', lab: '/lab/' };
const urlFor = n => URLS[n] || (FS.tools.concat(['open-trails-canada', 'fieldhacks', 'neongrid']).includes(n) ? '/' + n + '/' : null);
const CMDS = {
  help: () => line(`<b>commands</b>
  whoami · about · ls [ventures|tools|projects] · open &lt;name&gt; · cat &lt;file&gt;
  neofetch · skills · certs · hire ahmed · contact · pro · mayhem · lab
  brain · bigbrain · ask &lt;question&gt; · history · clear · exit
  <span class="dim">or just type a question in plain english. tab completes, ↑ ↓ for history.</span>`),
  whoami: () => line('Ahmed Mahmoud. Founder of FirstShow. Builder. Calgary, Alberta. Open to any role, anywhere.'),
  about: () => line(esc(A.who.t)),
  ls: a => { const d = (a[0] || '').replace(/\/$/, ''); if (FS[d]) return line(FS[d].map(n => `<span class="f">${link(n, urlFor(n) || '#')}</span>`).join('  ')); line(Object.keys(FS).filter(k => k !== 'files').map(k => `<span class="d">${k}/</span>`).join('  ') + '  ' + FS.files.map(f => `<span class="f">${f}</span>`).join('  ')); },
  cd: a => CMDS.open(a),
  open: a => { const n = (a[0] || '').replace(/\/$/, ''); const u = urlFor(n); if (!u) return line(`open: ${esc(n || '?')}: no such thing. try <b>ls tools</b>`, 'err'); line('opening ' + link(n, u) + ' …'); setTimeout(() => location.href = u, 400); },
  cat: a => { const f = a[0] || ''; const m = { 'about.txt': A.who.t, 'resume.txt': A.experience.t + ' ' + A.certs.t, 'contact.txt': 'LinkedIn: ' + LI + '\nGitHub: ' + GH, 'skills.txt': A.skills.t }; if (!m[f]) return line(`cat: ${esc(f || '?')}: no such file. try <b>ls</b>`, 'err'); line(esc(m[f]).replace(/https?:\/\/\S+/g, u => link(u, u))); },
  neofetch: () => line(`<pre class="neo"><span class="acc">   ▄▀▀▄   </span>  <b>ahmed</b>@<b>calgary</b>
<span class="acc">  █ ▄▄ █  </span>  ---------------
<span class="acc">  █▀  ▀█  </span>  <b>role</b>: founder, FirstShow
<span class="acc">  ▀    ▀  </span>  <b>class</b>: comms pro + tech wizard
            <b>shell</b>: zsh, coffee
            <b>uptime</b>: open to work
            <b>packages</b>: 9 tools, 7 sites, 1 game
            <b>brain</b>: ${brain ? (brain.size / 1024).toFixed(0) + ' KB on-device' : 'loading'}</pre>`),
  skills: () => line(esc(A.skills.t)),
  certs: () => line(esc(A.certs.t)),
  hire: a => { if ((a[0] || '').toLowerCase() !== 'ahmed') return line('usage: hire ahmed', 'err'); line('excellent choice. opening LinkedIn… 🚀'); setTimeout(() => window.open(LI, '_blank', 'noopener'), 500); },
  contact: () => CMDS.cat(['contact.txt']),
  pro: () => CMDS.open(['pro']), mayhem: () => CMDS.open(['mayhem']), lab: () => CMDS.open(['lab']),
  linkedin: () => CMDS.open(['linkedin']), github: () => CMDS.open(['github']),
  brain: () => line(brain ? `tiny brain: ${(brain.size / 1024).toFixed(0)} KB int8 weights · ${brain.intents} intents · ${brain.dim} hashed features · runs on your device, no server, no tracking.<br>big brain: ${big.ready ? 'awake' : 'asleep'} (MiniLM-L6 semantic search, 23 MB, quotes verified facts only). type <b>bigbrain</b> to wake it.` : 'loading…'),
  bigbrain: async () => { if (big.ready) return line('big brain is already awake. use <b>ask &lt;question&gt;</b>.'); const l = document.createElement('div'); l.className = 'tl dim'; tout.appendChild(l); try { await loadBig(f => { l.textContent = 'downloading MiniLM-L6 (23 MB) to your browser… ' + (f * 100).toFixed(0) + '%'; }); l.textContent = 'big brain awake ✓ ' + KB.length + ' verified facts embedded (cached for next time)'; } catch (e) { l.textContent = 'could not start the big brain on this device.'; } },
  ask: async a => { const q = a.join(' '); if (!q) return line('usage: ask &lt;question&gt;', 'err'); if (!big.ready) return natural(q); const r = await bigAnswer(q); line(`<span class="dim">[similarity ${r.score.toFixed(2)} · ${r.ms.toFixed(0)} ms]</span> ${esc(r.text)} → ${link('go', r.link)}`); },
  history: () => line(hist.map((h, i) => `${String(i + 1).padStart(3)}  ${esc(h)}`).join('<br>')),
  clear: () => { tout.innerHTML = ''; },
  exit: () => closeTerm(),
  date: () => line(new Date().toString()),
  pwd: () => line('/home/ahmed/lab'),
  echo: a => line(esc(a.join(' '))),
  uname: () => line('AHMED-OS 26.10 calgary x86_64 coffee/2.0'),
  sudo: a => line(a.join(' ') === 'make coffee' || a.join(' ') === 'make me a sandwich' ? 'nice try.' : 'ahmed is not in the sudoers file. this incident will be reported to Steve.', 'err'),
  rm: () => line("let's not.", 'err'),
  steve: () => line('Steve is at lunch.'),
  coffee: () => line('☕ brewing… done. fuel for the next build.'),
};
function natural(q) {
  const r = think(q);
  if (!r || r.top.p < 0.32) return line(`command not found: ${esc(q.split(' ')[0])}. type <b>help</b>${big.ready ? ', or <b>ask ' + esc(q) + '</b>' : ''}.`, 'err');
  const t = slots(r.top.intent, q);
  if (t) return line(`<span class="dim">[${r.top.intent} ${Math.round(r.top.p * 100)}%]</span> ${esc(t.blurb)} ${t.note ? esc(t.note) : ''} → ${link('open ' + t.name, t.url)}`);
  const a = A[r.top.intent];
  if (a) { line(`<span class="dim">[${r.top.intent} ${Math.round(r.top.p * 100)}%]</span> ${esc(a.t)}`); if (a.fn) a.fn(); }
}
async function run(raw) {
  const s = raw.trim(); if (!s) return;
  line(`<span class="ps">ahmed@calgary:~$</span> ${esc(s)}`);
  hist.push(s); hi = hist.length;
  const [c, ...a] = s.split(/\s+/);
  const fn = CMDS[c.toLowerCase()];
  if (fn) await fn(a); else natural(s);
}
tin.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); const v = tin.value; tin.value = ''; run(v); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) tin.value = hist[--hi]; }
  else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < hist.length - 1) tin.value = hist[++hi]; else { hi = hist.length; tin.value = ''; } }
  else if (e.key === 'Tab') {
    e.preventDefault();
    const parts = tin.value.split(' '), last = parts[parts.length - 1];
    const pool = parts.length === 1 ? Object.keys(CMDS) : [...FS.ventures, ...FS.tools, ...FS.projects, ...FS.files, ...Object.keys(FS), 'ahmed'];
    const m = pool.filter(x => x.startsWith(last));
    if (m.length === 1) { parts[parts.length - 1] = m[0]; tin.value = parts.join(' ') + ' '; }
    else if (m.length > 1) line(m.join('  '), 'dim');
  } else if (e.key === 'Escape') closeTerm();
  else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); CMDS.clear(); }
});
document.querySelectorAll('[data-cmd]').forEach(b => b.addEventListener('click', () => { run(b.dataset.cmd); tin.focus(); }));

// ---------- lab filters ----------
const fb = document.querySelectorAll('.lf button'), exps = document.querySelectorAll('.exp');
fb.forEach(x => x.addEventListener('click', () => {
  fb.forEach(y => y.setAttribute('aria-pressed', y === x));
  exps.forEach(c => { c.hidden = !(x.dataset.f === 'all' || c.dataset.kind === x.dataset.f); });
}));

// ---------- spotlight that follows the cursor ----------
if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  addEventListener('pointermove', e => { document.documentElement.style.setProperty('--mx', e.clientX + 'px'); document.documentElement.style.setProperty('--my', e.clientY + 'px'); }, { passive: true });
}
if (location.hash === '#terminal') openTerm();
