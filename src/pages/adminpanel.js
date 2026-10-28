import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

/* ============================================================================
   ADMIN PANEL «Абітурієнт +» — A/B-тест, аналітика, відгуки
   ----------------------------------------------------------------------------
   Файл містить 2 частини:
   1) TRACKING  — track(), initTracking(), trackValuesBlock() — пишуть події в Supabase
   2) ADMIN     — default export <AdminPanel/> — читає events + reviews і рахує метрики

   ЯК ПІДКЛЮЧИТИ — див. інструкцію в кінці файлу (коментар INTEGRATION).

   SQL (виконати один раз в Supabase → SQL Editor):

   create table if not exists events (
     id bigint generated always as identity primary key,
     created_at timestamptz default now(),
     user_id text, session_id text, ab_variant text, event_name text,
     params jsonb default '{}'::jsonb,
     utm_source text, utm_medium text, utm_campaign text, utm_content text,
     device text, page text
   );
   alter table events enable row level security;
   create policy "anyone can insert events" on events for insert to anon, authenticated with check (true);
   create policy "only admins read events"  on events for select to authenticated using (true);

   -- щоб відгуки теж ділились по варіантах:
   alter table reviews add column if not exists ab_variant text;
   -- і щоб admin бачив ВСІ відгуки (вони вже читаються публічно на сайті):
   --   у reviews має бути select-policy (вона у вас, ймовірно, вже є).

   Адмін-користувача створіть у Supabase → Authentication → Users (email + пароль).
   ============================================================================ */

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://kecltjjcdobidhigmhfd.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_9mjyl5UWYQThAxr5gpO28g_Onhjp29N';
const supabase = createClient(supabaseUrl, supabaseKey);

/* ============================================================
   1. TRACKING (використовується на публічному сайті)
   Особисті дані (ім'я, текст відгуку, контакти) НЕ відправляються.
   ============================================================ */
const safe = (fn, fallback = null) => { try { return fn(); } catch { return fallback; } };

export function getVariant() {
  const forced = new URLSearchParams(window.location.search).get('v');
  if (forced === 'a' || forced === 'b') { safe(() => localStorage.setItem('ab_variant', forced)); return forced; }
  let v = safe(() => localStorage.getItem('ab_variant'));
  if (v !== 'a' && v !== 'b') { v = Math.random() < 0.5 ? 'a' : 'b'; safe(() => localStorage.setItem('ab_variant', v)); }
  return v;
}

const getUserId = () => {
  let id = safe(() => localStorage.getItem('ab_uid'));
  if (!id) { id = 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36); safe(() => localStorage.setItem('ab_uid', id)); }
  return id;
};
const getSessionId = () => {
  let id = safe(() => sessionStorage.getItem('ab_sid'));
  if (!id) { id = 's_' + Math.random().toString(36).slice(2) + Date.now().toString(36); safe(() => sessionStorage.setItem('ab_sid', id)); }
  return id;
};
const getUtm = () => {
  const q = new URLSearchParams(window.location.search);
  const saved = safe(() => JSON.parse(sessionStorage.getItem('ab_utm') || 'null'));
  if (saved) return saved;
  const utm = { utm_source: q.get('utm_source') || null, utm_medium: q.get('utm_medium') || null, utm_campaign: q.get('utm_campaign') || null, utm_content: q.get('utm_content') || null };
  safe(() => sessionStorage.setItem('ab_utm', JSON.stringify(utm)));
  return utm;
};

export function track(event_name, params = {}) {
  if (typeof window === 'undefined' || window.location.hash === '#admin') return;
  const row = {
    user_id: getUserId(), session_id: getSessionId(), ab_variant: getVariant(), event_name, params,
    ...getUtm(),
    device: window.matchMedia('(max-width: 768px)').matches ? 'mobile' : 'desktop',
    page: window.location.pathname + (window.location.hash || ''),
  };
  supabase.from('events').insert([row]).then(({ error }) => { if (error) console.warn('track error', error.message); });
}

/** Викликати один раз при старті сайту (useEffect у App). */
export function initTracking() {
  track('session_start');
  track('page_view');

  // скрол-глибина 25/50/75/100
  const fired = new Set();
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    const p = (window.scrollY / h) * 100;
    [25, 50, 75, 100].forEach((t) => { if (p >= t - 1 && !fired.has(t)) { fired.add(t); track('scroll_depth', { percent: t }); } });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // час взаємодії (тільки коли вкладка активна)
  let seconds = 0;
  const tick = setInterval(() => { if (document.visibilityState === 'visible') seconds += 1; }, 1000);
  let sent = 0;
  const flush = () => { if (seconds > sent) { track('user_engagement', { seconds: seconds - sent }); sent = seconds; } };
  const onHide = () => { if (document.visibilityState === 'hidden') flush(); };
  document.addEventListener('visibilitychange', onHide);
  window.addEventListener('pagehide', flush);

  // перший фокус у полі форми
  const started = new Set();
  const onFocus = (e) => {
    const el = e.target;
    if (!/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
    const name = el.closest('.fb-form') ? 'feedback' : el.closest('.survey-wrap') ? 'survey' : el.closest('.ai-input') ? 'chat' : 'other';
    if (!started.has(name)) { started.add(name); track('form_start', { form_name: name }); }
  };
  document.addEventListener('focusin', onFocus);

  // кліки по кнопках/меню
  const onClick = (e) => {
    const el = e.target.closest('button, a');
    if (!el) return;
    const label = (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 60);
    if (label) track('cta_click', { cta_name: label });
  };
  document.addEventListener('click', onClick);

  return () => {
    clearInterval(tick); flush();
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onHide);
    window.removeEventListener('pagehide', flush);
    document.removeEventListener('focusin', onFocus);
    document.removeEventListener('click', onClick);
  };
}

/** Соціальний/етичний блок: ≥50% видимості → values_block_view; ≥5 с → values_block_engaged.
 *  Викликати з useEffect, передавши DOM-елемент блоку. Повертає cleanup. */
export function trackValuesBlock(el, blockName = 'integrity_reviews') {
  if (!el || !('IntersectionObserver' in window)) return () => {};
  let viewed = false, engaged = false, timer = null;
  const io = new IntersectionObserver(([e]) => {
    if (e.intersectionRatio >= 0.5) {
      if (!viewed) { viewed = true; track('values_block_view', { block: blockName }); }
      if (!engaged && !timer) timer = setTimeout(() => { engaged = true; track('values_block_engaged', { block: blockName }); }, 5000);
    } else if (timer) { clearTimeout(timer); timer = null; }
  }, { threshold: [0, 0.5, 1] });
  io.observe(el);
  return () => { io.disconnect(); if (timer) clearTimeout(timer); };
}

/* ============================================================
   2. СТАТИСТИКА
   ============================================================ */
const VARIANTS = ['a', 'b'];
const pct = (x, n) => (n ? (x / n) * 100 : null);
const fmt = (v, d = 1, suf = '') => (v === null || v === undefined || Number.isNaN(v) ? '—' : `${v.toFixed(d)}${suf}`);

function normCdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
/** Двосторонній z-тест для двох пропорцій. Повертає p-value або null. */
function zTest(x1, n1, x2, n2) {
  if (!n1 || !n2) return null;
  const p = (x1 + x2) / (n1 + n2);
  const se = Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2));
  if (!se) return null;
  const z = (x1 / n1 - x2 / n2) / se;
  return 2 * (1 - normCdf(Math.abs(z)));
}

function computeStats(events) {
  const out = {};
  VARIANTS.forEach((v) => {
    const ev = events.filter((e) => e.ab_variant === v);
    const users = new Set(ev.map((e) => e.user_id));
    const sessions = new Set(ev.map((e) => e.session_id));
    const sessWith = (names, pred = () => true) => new Set(ev.filter((e) => names.includes(e.event_name) && pred(e)).map((e) => e.session_id));
    const count = (name) => ev.filter((e) => e.event_name === name).length;

    // час взаємодії на сесію
    const secBySess = {};
    ev.filter((e) => e.event_name === 'user_engagement').forEach((e) => { secBySess[e.session_id] = (secBySess[e.session_id] || 0) + (Number(e.params?.seconds) || 0); });
    const secVals = [...sessions].map((s) => secBySess[s] || 0);
    const avgSec = secVals.length ? secVals.reduce((a, b) => a + b, 0) / secVals.length : null;

    const scroll = {};
    [25, 50, 75, 100].forEach((t) => { scroll[t] = sessWith(['scroll_depth'], (e) => Number(e.params?.percent) >= t).size; });

    const cta = sessWith(['cta_click']).size;
    const feature = sessWith(['feature_use']).size;
    const formStart = sessWith(['form_start']).size;
    const leads = sessWith(['generate_lead', 'feedback_submit']).size;
    const vView = sessWith(['values_block_view']).size;
    const vEng = sessWith(['values_block_engaged']).size;

    out[v] = { sc50: scroll[50], users: users.size, sessions: sessions.size, avgSec, scroll, cta, feature, formStart, leads, vView, vEng, events: ev.length, count };
  });
  return out;
}

function significance(sA, sB, key, base = 'sessions') {
  const nA = sA[base], nB = sB[base];
  if (!nA || !nB) return { label: 'немає даних', tone: 'mut' };
  const small = nA < 100 || nB < 100;
  const p = zTest(sA[key], nA, sB[key], nB);
  const diff = pct(sA[key], nA) - pct(sB[key], nB);
  if (p === null) return { label: 'немає різниці для тесту', tone: 'mut' };
  const sig = p < 0.05;
  const lead = diff > 0 ? 'A вище' : diff < 0 ? 'B вище' : 'однаково';
  const text = `${lead} на ${Math.abs(diff).toFixed(1)} п.п., p=${p.toFixed(3)}${sig ? ' — суттєво' : ' — не суттєво'}`;
  return { label: small ? `${text}. Вибірка <100 на варіант — це лише орієнтир` : text, tone: small ? 'warn' : sig ? 'ok' : 'mut' };
}

const THEMES = [
  ['Доброчесність і корупція', /доброчес|корупц|чесн|прозор/i],
  ['Відеовізитки професій', /відео|візитк|професі/i],
  ['Курси', /курс|навчан|силабус/i],
  ['Центри зайнятості й профорієнтація', /центр|консульт|профорієнт|зайнят/i],
  ['Зручність і дизайн', /зручн|дизайн|інтерфейс|функціонал|швидк|сайт|платформ/i],
];
function groupReviews(reviews) {
  const groups = THEMES.map(([name]) => ({ name, items: [] }));
  const other = { name: 'Інше', items: [] };
  reviews.forEach((r) => {
    const idx = THEMES.findIndex(([, re]) => re.test(r.review_text || ''));
    (idx >= 0 ? groups[idx] : other).items.push(r);
  });
  return [...groups, other].filter((g) => g.items.length);
}

/* ============================================================
   3. СТИЛІ
   ============================================================ */
const CSS = `
.adm { --g: #19645E; --gd: #10403C; --y: #F3B72F; --bg: #EEF3F1; --ink: #1D2D2A; --mut: #5A6E6A; --line: rgba(25,100,94,.16); --a: #19645E; --b: #E09A0B; font-family: 'Montserrat', system-ui, sans-serif; background: var(--bg); color: var(--ink); min-height: 100vh; }
.adm *, .adm *::before, .adm *::after { box-sizing: border-box; }
.adm button { font-family: inherit; cursor: pointer; }
.adm-top { background: var(--gd); color: #fff; padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; position: sticky; top: 0; z-index: 10; }
.adm-top h1 { font-size: 1.15rem; font-weight: 800; margin-right: auto; }
.adm-top select, .adm-top button { background: rgba(255,255,255,.12); color: #fff; border: 1px solid rgba(255,255,255,.25); border-radius: 8px; padding: .5rem .9rem; font-size: .85rem; font-weight: 600; font-family: inherit; }
.adm-top select option { color: #000; }
.adm-top button:hover { background: var(--y); color: var(--gd); border-color: var(--y); }
.adm-tabs { display: flex; gap: .3rem; padding: 0 1.5rem; background: #fff; border-bottom: 1px solid var(--line); overflow-x: auto; }
.adm-tabs button { background: none; border: 0; padding: 1rem 1.1rem; font-weight: 700; font-size: .9rem; color: var(--mut); border-bottom: 3px solid transparent; white-space: nowrap; }
.adm-tabs button.on { color: var(--g); border-color: var(--g); }
.adm-wrap { max-width: 1250px; margin: 0 auto; padding: 1.5rem; display: grid; gap: 1.5rem; }
.adm-card { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 1.4rem; overflow-x: auto; }
.adm-card h2 { font-size: 1.05rem; font-weight: 800; margin-bottom: .25rem; }
.adm-card .sub { color: var(--mut); font-size: .85rem; margin-bottom: 1rem; }
.adm-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1rem; }
.adm-kpi { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 1.1rem 1.3rem; }
.adm-kpi small { color: var(--mut); font-size: .8rem; font-weight: 600; }
.adm-kpi b { display: block; font-size: 1.9rem; font-weight: 900; line-height: 1.15; margin: .2rem 0; }
.adm-kpi .vs { font-size: .8rem; color: var(--mut); }
.adm-kpi .vs i { font-style: normal; font-weight: 800; }
.adm table { width: 100%; border-collapse: collapse; font-size: .9rem; min-width: 640px; }
.adm th, .adm td { text-align: left; padding: .65rem .7rem; border-bottom: 1px solid var(--line); vertical-align: top; }
.adm th { font-size: .8rem; color: var(--mut); font-weight: 700; }
.adm td.n, .adm th.n { text-align: right; font-variant-numeric: tabular-nums; }
.adm .ca { color: var(--a); font-weight: 800; } .adm .cb { color: var(--b); font-weight: 800; }
.adm .tag { display: inline-block; font-size: .78rem; font-weight: 700; padding: .2rem .6rem; border-radius: 6px; }
.adm .tag.ok { background: #DDF3E4; color: #1B6B3A; } .adm .tag.warn { background: #FFF1CC; color: #8A5F00; } .adm .tag.mut { background: #EDEFEE; color: var(--mut); }
.bar-row { display: grid; grid-template-columns: 120px 1fr 70px; gap: .8rem; align-items: center; margin: .45rem 0; font-size: .85rem; }
.bar { height: 14px; background: #EDF1F0; border-radius: 7px; overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 7px; transition: width .5s; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.theme { border-top: 1px solid var(--line); padding: 1rem 0; }
.theme h3 { font-size: .95rem; font-weight: 800; } .theme h3 span { color: var(--mut); font-weight: 600; font-size: .85rem; }
.theme blockquote { margin: .5rem 0 0; padding-left: .9rem; border-left: 3px solid var(--y); color: var(--mut); font-size: .9rem; font-style: italic; }
.rev { display: grid; grid-template-columns: 1fr auto; gap: .2rem 1rem; padding: .9rem 0; border-top: 1px solid var(--line); font-size: .9rem; }
.rev .st { color: var(--y); white-space: nowrap; }
.rev p { grid-column: 1 / -1; color: var(--mut); }
.adm-note { background: #FFF6DB; border: 1px solid #F0D58A; color: #6B4E00; border-radius: 10px; padding: .8rem 1rem; font-size: .88rem; }
.adm-empty { text-align: center; color: var(--mut); padding: 2.5rem 1rem; }
.adm-login { max-width: 380px; margin: 12vh auto; background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 2rem; display: grid; gap: .9rem; }
.adm-login h1 { font-size: 1.3rem; font-weight: 900; }
.adm-login input { padding: .8rem 1rem; border: 2px solid var(--line); border-radius: 10px; font: inherit; font-size: 1rem; }
.adm-login input:focus { border-color: var(--g); outline: none; }
.adm-login button { background: var(--g); color: #fff; border: 0; border-radius: 10px; padding: .85rem; font-weight: 800; font-size: 1rem; }
.adm-login .err { color: #B3261E; font-size: .88rem; }
@media (max-width: 800px) { .two { grid-template-columns: 1fr; } .bar-row { grid-template-columns: 90px 1fr 56px; } .adm-wrap { padding: 1rem; } }
`;

/* ============================================================
   4. UI-КОМПОНЕНТИ
   ============================================================ */
function Login({ onDone }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setBusy(false);
    if (error) setErr('Невірний email або пароль.'); else onDone();
  };
  return (
    <form className="adm-login" onSubmit={submit}>
      <h1>Кабінет адміністратора</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Пароль" value={pass} onChange={(e) => setPass(e.target.value)} required />
      {err && <div className="err">{err}</div>}
      <button disabled={busy}>{busy ? 'Входимо…' : 'Увійти'}</button>
    </form>
  );
}

const Kpi = ({ label, a, b, suffix = '', digits = 0 }) => (
  <div className="adm-kpi">
    <small>{label}</small>
    <b>{fmt((a ?? 0) + (b ?? 0) || null, digits, suffix)}</b>
    <div className="vs"><i className="ca">A {fmt(a, digits, suffix)}</i> · <i className="cb">B {fmt(b, digits, suffix)}</i></div>
  </div>
);

const Row = ({ label, a, b, na, nb, digits = 1, suffix = '%', sig }) => (
  <tr>
    <td>{label}</td>
    <td className="n">{na !== undefined ? `${na} (${fmt(a, digits, suffix)})` : fmt(a, digits, suffix)}</td>
    <td className="n">{nb !== undefined ? `${nb} (${fmt(b, digits, suffix)})` : fmt(b, digits, suffix)}</td>
    <td>{sig ? <span className={`tag ${sig.tone}`}>{sig.label}</span> : <span className="tag mut">—</span>}</td>
  </tr>
);

const Bars = ({ rows }) => {
  const max = Math.max(1, ...rows.flatMap((r) => [r.a || 0, r.b || 0]));
  return rows.map((r) => (
    <div key={r.label}>
      {['a', 'b'].map((v) => (
        <div className="bar-row" key={v}>
          <span>{v === 'a' ? r.label : ''} <b className={v === 'a' ? 'ca' : 'cb'}>{v.toUpperCase()}</b></span>
          <div className="bar"><i style={{ width: `${((r[v] || 0) / max) * 100}%`, background: `var(--${v})` }} /></div>
          <span>{fmt(r[v], 1, '%')}</span>
        </div>
      ))}
    </div>
  ));
};

function download(name, text) {
  const blob = new Blob(['\ufeff' + text], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
  URL.revokeObjectURL(a.href);
}
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

/* ============================================================
   5. ГОЛОВНИЙ КОМПОНЕНТ
   ============================================================ */
export default function AdminPanel() {
  const [session, setSession] = useState(undefined);
  const [tab, setTab] = useState('overview');
  const [range, setRange] = useState('all');
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    let all = [];
    for (let from = 0; from < 50000; from += 1000) {
      const { data, error: err } = await supabase.from('events').select('*').order('created_at', { ascending: false }).range(from, from + 999);
      if (err) { setError('Не вдалося завантажити події: ' + err.message); break; }
      all = all.concat(data); if (data.length < 1000) break;
    }
    setEvents(all);
    const { data: rv } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    setReviews(rv || []);
    setLoading(false);
  }, []);

  useEffect(() => { if (session) load(); }, [session, load]);

  const since = useMemo(() => (range === 'all' ? 0 : Date.now() - Number(range) * 864e5), [range]);
  const ev = useMemo(() => events.filter((e) => new Date(e.created_at).getTime() >= since), [events, since]);
  const rv = useMemo(() => reviews.filter((r) => new Date(r.created_at).getTime() >= since), [reviews, since]);
  const S = useMemo(() => computeStats(ev), [ev]);
  const A = S.a, B = S.b;

  const reviewStats = useMemo(() => {
    const o = {};
    VARIANTS.forEach((v) => {
      const list = rv.filter((r) => r.ab_variant === v);
      o[v] = { n: list.length, avg: list.length ? list.reduce((s, r) => s + (r.rating || 0), 0) / list.length : null };
    });
    const all = rv.length ? rv.reduce((s, r) => s + (r.rating || 0), 0) / rv.length : null;
    return { ...o, all, total: rv.length };
  }, [rv]);

  const sources = useMemo(() => {
    const m = {};
    ev.filter((e) => e.event_name === 'session_start').forEach((e) => {
      const k = `${e.utm_source || 'direct'} / ${e.utm_medium || '—'}`;
      m[k] = m[k] || { a: 0, b: 0 }; m[k][e.ab_variant] = (m[k][e.ab_variant] || 0) + 1;
    });
    return Object.entries(m).sort((x, y) => y[1].a + y[1].b - (x[1].a + x[1].b));
  }, [ev]);

  const ctaTop = useMemo(() => {
    const m = {};
    ev.filter((e) => e.event_name === 'cta_click').forEach((e) => {
      const k = e.params?.cta_name || '—'; m[k] = m[k] || { a: 0, b: 0 }; m[k][e.ab_variant] = (m[k][e.ab_variant] || 0) + 1;
    });
    return Object.entries(m).sort((x, y) => y[1].a + y[1].b - (x[1].a + x[1].b)).slice(0, 12);
  }, [ev]);

  const themes = useMemo(() => groupReviews(rv), [rv]);

  const exportSummary = () => {
    const rows = [
      ['Метрика', 'Варіант A', 'Варіант B'],
      ['Користувачі', A.users, B.users], ['Сесії', A.sessions, B.sessions],
      ['Сер. час взаємодії, с', fmt(A.avgSec, 1, ''), fmt(B.avgSec, 1, '')],
      ...[25, 50, 75, 100].map((t) => [`Скрол ≥${t}%, % сесій`, fmt(pct(A.scroll[t], A.sessions)), fmt(pct(B.scroll[t], B.sessions))]),
      ['CTR (сесії з кліком CTA), %', fmt(pct(A.cta, A.sessions)), fmt(pct(B.cta, B.sessions))],
      ['Використання функцій, %', fmt(pct(A.feature, A.sessions)), fmt(pct(B.feature, B.sessions))],
      ['Старти форм, %', fmt(pct(A.formStart, A.sessions)), fmt(pct(B.formStart, B.sessions))],
      ['Заявки/відгуки (конверсія), %', fmt(pct(A.leads, A.sessions)), fmt(pct(B.leads, B.sessions))],
      ['Переглянули соц. блок, %', fmt(pct(A.vView, A.sessions)), fmt(pct(B.vView, B.sessions))],
      ['Затрималися на соц. блоці ≥5с, %', fmt(pct(A.vEng, A.sessions)), fmt(pct(B.vEng, B.sessions))],
      ['К-сть відгуків', reviewStats.a.n, reviewStats.b.n], ['Сер. оцінка', fmt(reviewStats.a.avg, 2, ''), fmt(reviewStats.b.avg, 2, '')],
    ];
    download('ab_results.csv', rows.map((r) => r.map(csvCell).join(',')).join('\n'));
  };
  const exportEvents = () => {
    const cols = ['created_at', 'user_id', 'session_id', 'ab_variant', 'event_name', 'params', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'device', 'page'];
    download('events.csv', [cols.join(','), ...ev.map((e) => cols.map((c) => csvCell(c === 'params' ? JSON.stringify(e[c]) : e[c])).join(','))].join('\n'));
  };
  const exportReviews = () => {
    const cols = ['created_at', 'ab_variant', 'user_name', 'rating', 'functionality_rating', 'convenience_rating', 'time_spent', 'device', 'read_others', 'useful', 'visit_again', 'integrity_viewed', 'integrity_important', 'watched_video', 'video_name', 'video_rating', 'review_text'];
    download('reviews.csv', [cols.join(','), ...rv.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\n'));
  };

  const survey = useMemo(() => {
    const yes = (k) => { const n = rv.filter((r) => r[k]).length; return n ? pct(rv.filter((r) => r[k] === 'Так').length, n) : null; };
    const avg = (k) => { const l = rv.filter((r) => r[k]); return l.length ? l.reduce((s, r) => s + r[k], 0) / l.length : null; };
    return { integrityImportant: yes('integrity_important'), integrityViewed: yes('integrity_viewed'), useful: yes('useful'), visitAgain: yes('visit_again'), impression: avg('rating'), functionality: avg('functionality_rating'), convenience: avg('convenience_rating'), videoRating: avg('video_rating') };
  }, [rv]);

  if (session === undefined) return <div className="adm"><style>{CSS}</style></div>;
  if (!session) return <div className="adm"><style>{CSS}</style><Login onDone={() => {}} /></div>;

  const small = (A.sessions || 0) < 100 || (B.sessions || 0) < 100;
  const tabs = [['overview', 'Огляд A/B'], ['funnel', 'Поведінка і функції'], ['values', 'Соціальний блок'], ['reviews', 'Відгуки й теми'], ['sources', 'Джерела трафіку'], ['export', 'Експорт']];

  return (
    <div className="adm">
      <style>{CSS}</style>
      <div className="adm-top">
        <h1>Кабінет адміністратора · Абітурієнт +</h1>
        <select value={range} onChange={(e) => setRange(e.target.value)} aria-label="Період">
          <option value="all">Увесь час</option><option value="1">Останні 24 год</option><option value="7">7 днів</option><option value="30">30 днів</option>
        </select>
        <button onClick={load}>{loading ? 'Оновлюємо…' : 'Оновити'}</button>
        <button onClick={() => supabase.auth.signOut()}>Вийти</button>
      </div>
      <div className="adm-tabs">{tabs.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}</div>

      <div className="adm-wrap">
        {error && <div className="adm-note">{error}. Перевірте, що таблиця events створена і є policy для читання (SQL — на початку файлу).</div>}
        {small && !error && <div className="adm-note">Вибірка замала: менше 100 сесій на варіант (A: {A.sessions}, B: {B.sessions}). Різниці нижче — орієнтир, а не статистично значущий висновок.</div>}

        {tab === 'overview' && (<>
          <div className="adm-kpis">
            <Kpi label="Користувачі" a={A.users} b={B.users} />
            <Kpi label="Сесії" a={A.sessions} b={B.sessions} />
            <Kpi label="Сер. час взаємодії, с" a={A.avgSec} b={B.avgSec} digits={1} />
            <Kpi label="Конверсія у відгук/заявку" a={pct(A.leads, A.sessions)} b={pct(B.leads, B.sessions)} digits={1} suffix="%" />
          </div>
          <div className="adm-card">
            <h2>Порівняння варіантів</h2>
            <div className="sub">A — функціональна вигода, B — соціальна/етична цінність. Частки рахуються від кількості сесій варіанта. Колонка «висновок» — z-тест двох пропорцій.</div>
            <table>
              <thead><tr><th>Метрика</th><th className="n">Варіант A</th><th className="n">Варіант B</th><th>Висновок</th></tr></thead>
              <tbody>
                <Row label="Користувачі" a={A.users} b={B.users} digits={0} suffix="" />
                <Row label="Сесії" a={A.sessions} b={B.sessions} digits={0} suffix="" />
                <Row label="Сер. час взаємодії, с" a={A.avgSec} b={B.avgSec} digits={1} suffix="" />
                <Row label="Скрол ≥ 50%" a={pct(A.scroll[50], A.sessions)} b={pct(B.scroll[50], B.sessions)} na={A.scroll[50]} nb={B.scroll[50]} sig={significance(A, B, 'sc50')} />
                <Row label="CTR головної CTA" a={pct(A.cta, A.sessions)} b={pct(B.cta, B.sessions)} na={A.cta} nb={B.cta} sig={significance(A, B, 'cta')} />
                <Row label="Використали ключову функцію" a={pct(A.feature, A.sessions)} b={pct(B.feature, B.sessions)} na={A.feature} nb={B.feature} sig={significance(A, B, 'feature')} />
                <Row label="Почали форму" a={pct(A.formStart, A.sessions)} b={pct(B.formStart, B.sessions)} na={A.formStart} nb={B.formStart} sig={significance(A, B, 'formStart')} />
                <Row label="Конверсія у відгук/заявку" a={pct(A.leads, A.sessions)} b={pct(B.leads, B.sessions)} na={A.leads} nb={B.leads} sig={significance(A, B, 'leads')} />
              </tbody>
            </table>
          </div>
        </>)}

        {tab === 'funnel' && (<>
          <div className="two">
            <div className="adm-card">
              <h2>Глибина скролу</h2><div className="sub">% сесій, що дійшли до позначки</div>
              <Bars rows={[25, 50, 75, 100].map((t) => ({ label: `${t}%`, a: pct(A.scroll[t], A.sessions), b: pct(B.scroll[t], B.sessions) }))} />
            </div>
            <div className="adm-card">
              <h2>Воронка</h2><div className="sub">% сесій, що дійшли до кроку</div>
              <Bars rows={[
                { label: 'Клік по CTA', a: pct(A.cta, A.sessions), b: pct(B.cta, B.sessions) },
                { label: 'Ключова функція', a: pct(A.feature, A.sessions), b: pct(B.feature, B.sessions) },
                { label: 'Старт форми', a: pct(A.formStart, A.sessions), b: pct(B.formStart, B.sessions) },
                { label: 'Відгук/заявка', a: pct(A.leads, A.sessions), b: pct(B.leads, B.sessions) },
              ]} />
            </div>
          </div>
          <div className="adm-card">
            <h2>Найпопулярніші кліки (cta_name)</h2><div className="sub">Кількість кліків по варіантах</div>
            {ctaTop.length ? (
              <table><thead><tr><th>Елемент</th><th className="n">A</th><th className="n">B</th></tr></thead>
                <tbody>{ctaTop.map(([k, v]) => <tr key={k}><td>{k}</td><td className="n">{v.a}</td><td className="n">{v.b}</td></tr>)}</tbody></table>
            ) : <div className="adm-empty">Кліків поки немає.</div>}
          </div>
        </>)}

        {tab === 'values' && (<>
          <div className="adm-note">Стала змінна для звіту: реакція на соціальний/етичний елемент (доброчесність ЗВО, відгуки про корупцію). Вона рахується в обох варіантах однаково — так видно, чи залежить інтерес до цінності від того, як сформульовано головне повідомлення.</div>
          <div className="two">
            <div className="adm-card">
              <h2>Поведінка на блоці</h2><div className="sub">% сесій від усіх сесій варіанта</div>
              <Bars rows={[
                { label: 'Побачили блок', a: pct(A.vView, A.sessions), b: pct(B.vView, B.sessions) },
                { label: 'Затрималися ≥5 с', a: pct(A.vEng, A.sessions), b: pct(B.vEng, B.sessions) },
              ]} />
              <p className="sub" style={{ marginTop: '.8rem' }}>
                Затримка серед тих, хто побачив: A {fmt(pct(A.vEng, A.vView), 1, '%')} · B {fmt(pct(B.vEng, B.vView), 1, '%')}
              </p>
              <span className={`tag ${significance(A, B, 'vEng').tone}`}>{significance(A, B, 'vEng').label}</span>
            </div>
            <div className="adm-card">
              <h2>Відповіді з опитування</h2><div className="sub">На основі {reviewStats.total} відгуків</div>
              <table><tbody>
                <tr><td>Важлива доброчесність ЗВО («Так»)</td><td className="n">{fmt(survey.integrityImportant, 0, '%')}</td></tr>
                <tr><td>Переглядали відгуки про доброчесність</td><td className="n">{fmt(survey.integrityViewed, 0, '%')}</td></tr>
                <tr><td>Відгуки були корисні</td><td className="n">{fmt(survey.useful, 0, '%')}</td></tr>
                <tr><td>Повернуться на платформу</td><td className="n">{fmt(survey.visitAgain, 0, '%')}</td></tr>
              </tbody></table>
            </div>
          </div>
        </>)}

        {tab === 'reviews' && (<>
          <div className="adm-kpis">
            <div className="adm-kpi"><small>Усього відгуків</small><b>{reviewStats.total}</b><div className="vs">A {reviewStats.a.n} · B {reviewStats.b.n}</div></div>
            <div className="adm-kpi"><small>Сер. оцінка враження</small><b>{fmt(reviewStats.all, 2)}</b><div className="vs">A {fmt(reviewStats.a.avg, 2)} · B {fmt(reviewStats.b.avg, 2)}</div></div>
            <div className="adm-kpi"><small>Функціонал</small><b>{fmt(survey.functionality, 2)}</b><div className="vs">з 5</div></div>
            <div className="adm-kpi"><small>Зручність</small><b>{fmt(survey.convenience, 2)}</b><div className="vs">з 5</div></div>
            <div className="adm-kpi"><small>Відео про професії</small><b>{fmt(survey.videoRating, 2)}</b><div className="vs">з 5</div></div>
          </div>
          <div className="adm-card">
            <h2>Якісний аналіз: теми</h2>
            <div className="sub">Групування за ключовими словами, до двох цитат на тему. Перевірте вручну перед вставкою у звіт.</div>
            {themes.length ? themes.map((g) => (
              <div className="theme" key={g.name}>
                <h3>{g.name} <span>· {g.items.length}</span></h3>
                {g.items.slice(0, 2).map((r) => <blockquote key={r.id || r.created_at}>«{r.review_text}» — {r.user_name}</blockquote>)}
              </div>
            )) : <div className="adm-empty">Відгуків за цей період ще немає.</div>}
          </div>
          <div className="adm-card">
            <h2>Усі відгуки</h2>
            {rv.map((r) => (
              <div className="rev" key={r.id || r.created_at}>
                <b>{r.user_name} <span className="tag mut">{r.ab_variant ? r.ab_variant.toUpperCase() : 'без варіанта'}</span></b>
                <span className="st">{'★'.repeat(r.rating || 0)}{'☆'.repeat(5 - (r.rating || 0))}</span>
                <p>{r.review_text}</p>
              </div>
            ))}
          </div>
        </>)}

        {tab === 'sources' && (
          <div className="adm-card">
            <h2>Джерела трафіку</h2><div className="sub">Кількість сесій за utm_source / utm_medium</div>
            {sources.length ? (
              <table><thead><tr><th>Джерело / тип</th><th className="n">A</th><th className="n">B</th><th className="n">Разом</th></tr></thead>
                <tbody>{sources.map(([k, v]) => <tr key={k}><td>{k}</td><td className="n">{v.a}</td><td className="n">{v.b}</td><td className="n">{v.a + v.b}</td></tr>)}</tbody></table>
            ) : <div className="adm-empty">Даних про джерела ще немає. Розішліть посилання з UTM-мітками.</div>}
          </div>
        )}

        {tab === 'export' && (
          <div className="adm-card">
            <h2>Експорт для звіту</h2>
            <div className="sub">CSV відкривається в Excel / Google Sheets. Дані беруться за обраний період.</div>
            <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
              <button style={btn} onClick={exportSummary}>Підсумкова таблиця A vs B</button>
              <button style={btn} onClick={exportEvents}>Усі події (events.csv)</button>
              <button style={btn} onClick={exportReviews}>Усі відгуки (reviews.csv)</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const btn = { background: '#19645E', color: '#fff', border: 0, borderRadius: 10, padding: '.8rem 1.2rem', fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' };

/* ============================================================================
   INTEGRATION
   ----------------------------------------------------------------------------
   1) Покласти файл у src/components/AdminPanel.jsx

   2) src/index.js — відкривати адмінку за адресою  https://g-abitur.vercel.app/#admin
        import AdminPanel from './components/AdminPanel';
        const isAdmin = () => window.location.hash === '#admin';
        root.render(isAdmin() ? <AdminPanel /> : <App />);
        window.addEventListener('hashchange', () => window.location.reload());

   3) На публічному сайті (KharkivCorporatePortal):
        import { initTracking, trackValuesBlock, track } from './AdminPanel';

        useEffect(() => initTracking(), []);                         // скрол, час, кліки, форми
        // блок відгуків про доброчесність (секція #reviews):
        useEffect(() => trackValuesBlock(document.getElementById('reviews')), []);
        // ключові функції:
        //   openModal('prof')  → track('feature_use', { feature_name: 'profession_video' })
        //   openModal('course')→ track('feature_use', { feature_name: 'course_syllabus' })
        //   Assistant send()   → track('feature_use', { feature_name: 'ai_chat' })
        // успішна відправка опитування у submitSurvey():
        //   track('feedback_rating', { rating: surveyData.impression });
        //   track('feedback_submit');
        //   та додати  ab_variant: getVariant()  в insert у таблицю reviews.

   4) A/B-повідомлення: const v = getVariant();  і в hero показувати заголовок A або B.
      ?v=a / ?v=b примусово вмикає варіант (для скриншотів).
   ============================================================================ */