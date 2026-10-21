// tiny on-device intent model. hashed word + char features, softmax over intents.
// trained offline, ~100 KB of int8 weights, runs in well under a millisecond.
export async function loadBrain(url) {
  const m = await (await fetch(url)).json();
  const raw = Uint8Array.from(atob(m.w), c => c.charCodeAt(0));
  const W = new Int8Array(raw.buffer);
  const D = m.dim, K = m.labels.length, enc = new TextEncoder();
  const fnv = s => { let h = 0x811c9dc5; for (const b of enc.encode(s)) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; };
  function feats(text) {
    const t = text.toLowerCase().replace(/[^a-z0-9']+/g, ' ').trim();
    const w = t ? t.split(' ') : [];
    const f = new Map();
    const add = (k, v) => { const i = fnv(k) % D; f.set(i, (f.get(i) || 0) + v); };
    w.forEach(x => add('w:' + x, 1));
    for (let i = 0; i + 1 < w.length; i++) add('b:' + w[i] + '_' + w[i + 1], 0.8);
    w.forEach(x => { const p = ' ' + x + ' '; for (let j = 0; j + 2 < p.length; j++) add('c:' + p.slice(j, j + 3), 0.35); });
    let n = 0; f.forEach(v => n += v * v); n = Math.sqrt(n) || 1;
    f.forEach((v, k) => f.set(k, v / n));
    return f;
  }
  function predict(text) {
    const t0 = performance.now();
    const f = feats(text), z = new Float32Array(K);
    for (let k = 0; k < K; k++) {
      let s = m.bias[k]; const off = k * D, sc = m.scale[k];
      f.forEach((v, i) => { s += W[off + i] * sc * v; });
      z[k] = s;
    }
    const mx = Math.max(...z); let sum = 0;
    const p = Array.from(z, x => { const e = Math.exp(x - mx); sum += e; return e; }).map(e => e / sum);
    const ranked = p.map((pr, k) => ({ intent: m.labels[k], p: pr })).sort((a, b) => b.p - a.p);
    return { top: ranked[0], ranked: ranked.slice(0, 3), ms: performance.now() - t0, features: f.size };
  }
  return { predict, size: raw.length, intents: K, dim: D };
}
