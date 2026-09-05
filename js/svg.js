/* ── SVG GENERATORS ── */

function pouchSVG(id, label, opts = {}) {
  const {
    labelBg = '#F5F0E8',
    labelText = '#1C1714',
    labelSub = '#8B7D70',
    accent = false
  } = opts;

  const accentGrad = accent ? `<linearGradient id="la-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1C4A32"/><stop offset="100%" stop-color="#0E2C1C"/></linearGradient>` : '';
  const labelFill = accent ? `url(#la-${id})` : labelBg;
  const circleStroke = accent ? 'rgba(245,240,232,0.3)' : 'rgba(28,23,20,0.15)';
  const leafFill = accent ? 'rgba(245,240,232,0.35)' : 'rgba(28,23,20,0.2)';
  const lineSep = accent ? 'rgba(245,240,232,0.2)' : 'rgba(28,23,20,0.15)';
  const chocolateColor = accent ? 'rgba(245,240,232,0.55)' : labelSub;
  const premiumColor = accent ? 'rgba(245,240,232,0.3)' : '#B0A090';

  return `<svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <defs>
      <linearGradient id="pg-${id}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#2E2420"/><stop offset="40%" stop-color="#1C1714"/><stop offset="100%" stop-color="#26201C"/>
      </linearGradient>
      ${accentGrad}
      <filter id="ps-${id}"><feDropShadow dx="4" dy="8" stdDeviation="12" flood-color="rgba(0,0,0,0.6)"/></filter>
    </defs>
    <path d="M22 28 Q22 18 32 18 L168 18 Q178 18 178 28 L186 268 Q186 282 172 282 L28 282 Q14 282 14 268 Z" fill="url(#pg-${id})" filter="url(#ps-${id})"/>
    <rect x="18" y="18" width="164" height="14" rx="4" fill="#2A2018"/>
    <rect x="22" y="30" width="156" height="4" rx="2" fill="#3A3028"/>
    <line x1="22" y1="42" x2="14" y2="268" stroke="#252018" stroke-width="1.5"/>
    <line x1="178" y1="42" x2="186" y2="268" stroke="#252018" stroke-width="1.5"/>
    <rect x="32" y="90" width="136" height="120" rx="2" fill="${labelFill}"/>
    <circle cx="100" cy="117" r="10" fill="none" stroke="${circleStroke}" stroke-width="0.8"/>
    <path d="M96 117 q4-6 8 0 q-4 4 -8 0z" fill="${leafFill}"/>
    <text x="100" y="143" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="7.5" letter-spacing="4" fill="${labelText}" font-weight="500">${label}</text>
    <line x1="52" y1="152" x2="148" y2="152" stroke="${lineSep}" stroke-width="0.5"/>
    <text x="100" y="167" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="6" letter-spacing="3" fill="${chocolateColor}">CHOCOLATE</text>
    <text x="100" y="182" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="5.5" letter-spacing="2" fill="${premiumColor}">PREMIUM · 1 KG</text>
  </svg>`;
}

function rawPouchSVG() {
  return `<svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <defs>
      <linearGradient id="pg-raw" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#2E2420"/><stop offset="40%" stop-color="#1C1714"/><stop offset="100%" stop-color="#26201C"/></linearGradient>
      <filter id="ps-raw"><feDropShadow dx="4" dy="8" stdDeviation="12" flood-color="rgba(0,0,0,0.6)"/></filter>
    </defs>
    <path d="M22 28 Q22 18 32 18 L168 18 Q178 18 178 28 L186 268 Q186 282 172 282 L28 282 Q14 282 14 268 Z" fill="url(#pg-raw)" filter="url(#ps-raw)"/>
    <rect x="18" y="18" width="164" height="14" rx="4" fill="#2A2018"/>
    <rect x="22" y="30" width="156" height="4" rx="2" fill="#3A3028"/>
    <line x1="22" y1="42" x2="14" y2="268" stroke="#252018" stroke-width="1.5"/>
    <line x1="178" y1="42" x2="186" y2="268" stroke="#252018" stroke-width="1.5"/>
    <rect x="32" y="90" width="136" height="120" rx="2" fill="none" stroke="rgba(245,240,232,0.12)" stroke-width="1" stroke-dasharray="4 3"/>
    <text x="100" y="156" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="7" letter-spacing="3" fill="rgba(245,240,232,0.2)">READY PRODUCT</text>
  </svg>`;
}

function labelSVG() {
  return `<svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <filter id="lshadow"><feDropShadow dx="0" dy="6" stdDeviation="14" flood-color="rgba(0,0,0,0.4)"/></filter>
    <rect x="20" y="80" width="160" height="140" rx="3" fill="#F5F0E8" filter="url(#lshadow)"/>
    <circle cx="100" cy="120" r="18" fill="none" stroke="rgba(28,23,20,0.15)" stroke-width="1"/>
    <path d="M92 120 q8-12 16 0 q-8 8 -16 0z" fill="rgba(196,154,74,0.4)"/>
    <text x="100" y="152" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="8.5" letter-spacing="4" fill="#1C1714" font-weight="500">YOUR BRAND</text>
    <line x1="44" y1="161" x2="156" y2="161" stroke="rgba(28,23,20,0.12)" stroke-width="0.5"/>
    <text x="100" y="175" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="6" letter-spacing="3" fill="#8B7D70">CHOCOLATE</text>
    <text x="100" y="190" text-anchor="middle" font-family="'DM Sans',sans-serif" font-size="5.5" letter-spacing="2" fill="#B0A090">PREMIUM · 1 KG</text>
    <rect x="20" y="80" width="160" height="140" rx="3" fill="none" stroke="rgba(196,154,74,0.3)" stroke-width="0.8" stroke-dasharray="5 3"/>
  </svg>`;
}

/* ── INJECT POUCHES ON LOAD ── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-pouch]').forEach(el => {
    const label = el.dataset.pouch;
    const id = el.dataset.pouchId || label.toLowerCase().replace(/\s/g, '-');
    const accent = el.dataset.accent === 'true';
    const labelBg = el.dataset.labelBg;
    const labelText = el.dataset.labelText;
    const labelSub = el.dataset.labelSub;
    el.innerHTML = pouchSVG(id, label, { accent, labelBg, labelText, labelSub });
  });
  document.querySelectorAll('[data-raw-pouch]').forEach(el => {
    el.innerHTML = rawPouchSVG();
  });
  document.querySelectorAll('[data-label-svg]').forEach(el => {
    el.innerHTML = labelSVG();
  });
});
