/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import mascotPhoto from '../assets/mascot-photo.png';
import { createClient } from '@supabase/supabase-js';
import { Analytics } from '@vercel/analytics/react';

// Инициализация Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://kecltjjcdobidhigmhfd.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_9mjyl5UWYQThAxr5gpO28g_Onhjp29N';
const supabase = createClient(supabaseUrl, supabaseKey);

/* ============================================================
   A/B: ВАРІАНТ ВИЗНАЧАЄТЬСЯ ДО ПЕРШОГО РЕНДЕРУ
   ============================================================ */
const getVariant = () => {
  let v;
  try {
    const forced = new URLSearchParams(window.location.search).get('v');
    if (forced === 'a' || forced === 'b') {
      localStorage.setItem('ab_variant', forced);
      v = forced;
    } else {
      v = localStorage.getItem('ab_variant');
      if (v !== 'a' && v !== 'b') {
        v = Math.random() < 0.5 ? 'a' : 'b';
        localStorage.setItem('ab_variant', v);
      }
    }
  } catch {
    v = Math.random() < 0.5 ? 'a' : 'b';
  }
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-variant', v);
  return v;
};

/* ============================================================
   ДАНІ ПЛАТФОРМИ «АБІТУРІЄНТ +»
   ============================================================ */
const CATS = { all: 'Всі напрямки', tech: 'IT / Tech', law: 'Право', med: 'Медицина', business: 'Бізнес', design: 'Креатив' };
const V = 'https://www.w3schools.com/html/mov_bbb.mp4';
const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=60`;

const PROFS = [
  { id: 'swe', cat: 'tech', icon: '💻', title: 'Software Engineer', short: 'Створює застосунки, сайти та складні IT-системи.', full: 'Інженер-програміст проєктує, розробляє, тестує й підтримує програмне забезпечення.', poster: U('1555066931-4365d14bab8c'), course: 'tech1', opps: ['Робота в глобальних tech-компаніях', 'Віддалена робота', 'Шлях від Trainee до Team Lead'] },
  { id: 'cyber', cat: 'tech', icon: '🛡️', title: 'Фахівець з кібербезпеки', short: 'Захищає дані та системи від хакерських атак.', full: 'Експерт знаходить вразливості раніше за зловмисників.', poster: U('1526374965328-7f61d4dc18c5'), course: 'tech2', opps: ['Банки, фінтех, blockchain', 'Кіберполіція', 'Bug Bounty програми'] },
  { id: 'law', cat: 'law', icon: '⚖️', title: 'Адвокат / Юрист', short: 'Захищає права людей і бізнесу, супроводжує угоди.', full: 'Юрист досконало знає закони й застосовує їх для захисту клієнта.', poster: U('1589829085413-56de8ae18c73'), course: 'law1', opps: ['Власна практика', 'Chief Legal Officer', 'Державна служба'] },
  { id: 'pub', cat: 'law', icon: '🏛️', title: 'Публічне управління', short: 'Оптимізує роботу інституцій і громад.', full: 'Для тих, хто хоче змінювати країну: керувати містами, працювати в міністерствах.', poster: U('1541872703-74c5e44368f9'), course: 'law2', opps: ['Міністерства', 'Місцеве самоврядування', 'Міжнародні фонди'] },
  { id: 'doc', cat: 'med', icon: '🩺', title: 'Лікар-хірург', short: 'Рятує життя, виконує складні операції.', full: 'Одна з найвідповідальніших професій. Вимагає багаторічного навчання.', poster: U('1579684385127-1ef15d508118'), course: 'med1', opps: ['Провідні клініки', 'Місії «Лікарі без кордонів»', 'Приватна практика'] },
  { id: 'pm', cat: 'business', icon: '👔', title: 'Project Manager', short: 'Керує створення продуктів і веде команду до результату.', full: 'Диригент команди: не пише код і не малює дизайн, але робить так, щоб все працювало.', poster: U('1522071820081-009f0129c71c'), course: 'bus1', opps: ['IT-компанії', 'R&D хаби', 'Міжнародні агенції'] }
];

const INITIAL_REVIEWS = [
  { demo: true, name: 'Олександр', uni: 'Технічний університет', faculty: 'Факультет комп\'ютерних наук', course: '4 курс', text: 'Жодного натяку на побори, оцінювання суворо за проєктами. Всі лабораторні здаються через GitHub.', rating: 5, date: Date.now() - 1000000 },
  { demo: true, name: 'Марія', uni: 'Юридичний університет', faculty: 'Інститут права', course: '3 курс', text: 'Прозора рейтингова система, боялася корупції, але тут все чесно.', rating: 5, date: Date.now() - 5000000 }
];

const FAQS = [
  { q: 'Як ви перевіряєте чесність відгуків?', a: 'Ми запровадили систему верифікації. Модеруємо відгуки, щоб висвітлювати реальний стан речей щодо якості освіти.' },
  { q: 'Для кого створена платформа «Абітурієнт +»?', a: 'Платформа об\'єднує школярів, шукачів роботи та дорослих, які вирішили змінити професію (світчерів).' },
  { q: 'Чи безкоштовні відеовізитки?', a: 'Так! Наша мета — надати кожному рівний доступ до усвідомленого вибору професії.' }
];

const SKY_HEIGHTS = [30, 50, 40, 70, 50, 80, 45, 60, 90, 55, 75, 40, 65, 35];

/* ============================================================
   ХУКИ ТА УТИЛІТИ
   ============================================================ */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.unobserve(el); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

const Reveal = React.memo(({ children, delay = 0, dir = 'up', className = '', threshold }) => {
  const ref = useReveal(threshold);
  return <div ref={ref} className={`rv rv-${dir} ${className}`} style={{ '--d': delay }}>{children}</div>;
});

const CAN_HOVER = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function useTilt() {
  const ref = useRef(null);
  const raf = useRef(0);
  const onMouseMove = useCallback((e) => {
    if (!CAN_HOVER || !ref.current) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${y * -12}deg) translateY(-10px) scale3d(1.02, 1.02, 1.02)`;
    });
  }, []);
  const onMouseLeave = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (ref.current) ref.current.style.transform = '';
  }, []);
  return { ref, onMouseMove, onMouseLeave };
}

/* ============================================================
   ШІ-АСИСТЕНТ (ПОВНІСТЮ ОНОВЛЕНИЙ)
   ============================================================ */
const Mascot = ({ className = '' }) => (
  <div className={`mascot-sprite ${className}`} style={{ backgroundImage: `url(${mascotPhoto})` }} role="img" aria-label="Маскот Харік" />
);

const Accordion = React.memo(({ faqs }) => {
  const [act, setAct] = useState(null);
  return (
    <div className="accordion">
      {faqs.map((f, i) => (
        <div key={i} className={`acc-item ${act === i ? 'open' : ''}`} onClick={() => setAct(act === i ? null : i)}>
          <div className="acc-head"><h4>{f.q}</h4><span className="acc-ico">+</span></div>
          <div className="acc-body"><p>{f.a}</p></div>
        </div>
      ))}
    </div>
  );
});

const TiltCard = ({ children, className, onClick }) => {
  const { ref, onMouseMove, onMouseLeave } = useTilt();
  return (
    <div ref={ref} className={`tilt-card ${className}`} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} onClick={onClick}>
      {children}
    </div>
  );
};

const BACK = { label: '⬅️ Головне меню', a: ['main'] };
const MAIN_MENU = [
  { label: '💬 Підтримка', a: ['support'] },
];

function menuReply([t, v]) {
  if (t === 'support') return { text: 'Чим допомогти?', kb: [{ label: '📝 Написати нам', a: ['form', 'feedback'] }, BACK] };
  return { text: 'Що потрібно?', kb: MAIN_MENU };
}

const Assistant = React.memo(({ onOpen, onForm }) => {
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(false);
  const [msgs, setMsgs] = useState([{ from: 'bot', text: 'Привіт! Я Харік — AI-ментор. Розкажи, які предмети тобі подобаються або ким хочеш стати? 👇', kb: MAIN_MENU }]);
  const [val, setVal] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef(null);

  useEffect(() => { if (open) end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, busy, open]);

  const reply = (r) => {
    setBusy(true);
    setTimeout(() => { setMsgs((m) => [...m, { from: 'bot', ...r }]); setBusy(false); }, 500);
  };

  const press = (b) => {
    if (busy) return;
    setDd(false);
    setMsgs((m) => [...m, { from: 'me', text: b.label }]);
    const [t, x] = b.a;
    if (t === 'form') {
      if (window.matchMedia('(max-width: 600px)').matches) setOpen(false);
      onForm(x);
      return reply({ text: 'Форма внизу сторінки ⬇️', kb: [BACK] });
    }
    reply(menuReply(b.a));
  };

  const send = async (q) => {
    if (!q.trim() || busy) return;
    const userMsg = { from: 'me', text: q };
    setMsgs((m) => [...m, userMsg]);
    setVal('');
    setBusy(true);

    try {
      // Формуємо історію чату (виключаємо системні кнопки)
      const history = msgs
        .filter(m => m.from === 'me' || m.from === 'bot')
        .map(m => ({
          role: m.from === 'me' ? 'user' : 'assistant',
          content: m.text
        })).concat({ role: 'user', content: q });

      // Запит до вашого нового бекенду
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      
      const data = await response.json();
      let aiText = data.reply || "Ой, я трохи замислився. Спробуй ще раз!";

      // Перевіряємо чи ШІ вирішив показати відео
      let action = null;
      const videoMatch = aiText.match(/\[VIDEO:([a-zA-Z0-9_]+)\]/);
      
      if (videoMatch) {
        const profId = videoMatch[1];
        const prof = PROFS.find((p) => p.id === profId);
        if (prof) {
          action = ['prof', prof];
        }
        // Вирізаємо тег з тексту, щоб юзер його не бачив
        aiText = aiText.replace(videoMatch[0], '').trim();
      }

      setMsgs((m) => [...m, { 
        from: 'bot', 
        text: aiText, 
        act: action,
        kb: action ? undefined : MAIN_MENU 
      }]);

    } catch (error) {
      console.error('Помилка чату:', error);
      setMsgs((m) => [...m, { from: 'bot', text: 'Ой, мої нейромережі трохи втомились 🦝 Спробуй ще раз пізніше.', kb: MAIN_MENU }]);
    }
    setBusy(false);
  };

  return (
    <div className="ai">
      <div className={`ai-panel ${open ? 'open' : ''}`}>
        <div className="ai-head">
          <div className="ai-ava"><Mascot className="ava-sprite" /></div>
          <div><b>Харік</b><span className="badge">AI Ментор</span></div>
          <button className="ai-close" onClick={() => setOpen(false)} aria-label="Закрити">✕</button>
        </div>
        <div className="ai-body">
          {msgs.map((m, i) => (
            <div key={i} className={`msg-wrap ${m.from}`}>
              <div className="msg">{m.text}</div>
              {m.act && <button className="msg-act" onClick={() => onOpen(m.act[0], m.act[1])}>Переглянути відео ↗</button>}
              {m.kb && i === msgs.length - 1 && (
                <div className="kb">{m.kb.map((b) => <button key={b.label} onClick={() => press(b)}>{b.label}</button>)}</div>
              )}
            </div>
          ))}
          {busy && <div className="msg-wrap bot"><div className="msg dots"><i /><i /><i /></div></div>}
          <div ref={end} />
        </div>
        <div className="chips">
          {MAIN_MENU.map((b) => <button key={b.label} onClick={() => press(b)}>{b.label}</button>)}
        </div>
        <div className="ai-input">
          {dd && <div className="ai-dd">{MAIN_MENU.map((b) => <button key={b.label} onClick={() => press(b)}>{b.label}</button>)}</div>}
          <button className="menu-btn" onClick={() => setDd((d) => !d)} aria-label="Меню">☰</button>
          <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send(val)} placeholder="Напиши Харіку…" />
          <button className={val.trim() ? 'active' : ''} onClick={() => send(val)} aria-label="Надіслати">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          </button>
        </div>
      </div>
      <button className={`ai-fab ${open ? 'hidden' : ''}`} onClick={() => setOpen(true)} aria-label="Відкрити чат">
        <Mascot className="fab-sprite" />
        <span className="ping" />
      </button>
    </div>
  );
});

/* ============================================================
   СТИЛІ
   ============================================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800;900&display=swap');
:root { --primary: #19645E; --primary-light: #248C84; --primary-dark: #10403C; --secondary: #F3B72F; --secondary-hover: #FFD25A; --bg-main: #EAF2F0; --bg-card: #FFFFFF; --bg-glass: rgba(255, 255, 255, 0.85); --text-dark: #1D2D2A; --text-mut: #546B67; --border: rgba(25, 100, 94, 0.15); --shadow-sm: 0 4px 15px rgba(16, 64, 60, 0.08); --shadow-md: 0 12px 35px rgba(16, 64, 60, 0.12); --shadow-lg: 0 25px 50px rgba(16, 64, 60, 0.2); --shadow-neon: 0 0 20px rgba(243, 183, 47, 0.4); --ease: cubic-bezier(0.25, 1, 0.2, 1); --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); }

/* ===== ВАРІАНТ B: індиго + кораловий акцент ===== */
:root[data-variant="b"] { --primary: #4A3AA7; --primary-light: #6A5BD0; --primary-dark: #2A1F6B; --secondary: #FF7A59; --secondary-hover: #FF9478; --bg-main: #F1EFFB; --text-dark: #25203F; --text-mut: #625C80; --border: rgba(74, 58, 167, 0.15); --shadow-sm: 0 4px 15px rgba(42, 31, 107, 0.08); --shadow-md: 0 12px 35px rgba(42, 31, 107, 0.12); --shadow-lg: 0 25px 50px rgba(42, 31, 107, 0.2); --shadow-neon: 0 0 20px rgba(255, 122, 89, 0.4); }
:root[data-variant="b"] .btn-primary { box-shadow: 0 8px 25px rgba(74, 58, 167, 0.3); }
:root[data-variant="b"] .btn-primary:hover:not(:disabled) { box-shadow: 0 12px 30px rgba(42, 31, 107, 0.4); }
:root[data-variant="b"] .btn-yellow { box-shadow: 0 8px 25px rgba(255, 122, 89, 0.3); }
:root[data-variant="b"] .ht-btn.active { box-shadow: 0 4px 15px rgba(74, 58, 167, 0.3); }
:root[data-variant="b"] .filter-btn.active { box-shadow: 0 10px 20px rgba(74, 58, 167, 0.3); }
:root[data-variant="b"] .me .msg { box-shadow: 0 5px 15px rgba(74, 58, 167, 0.3); }
:root[data-variant="b"] .ai-input button.active { box-shadow: 0 5px 15px rgba(74, 58, 167, 0.3); }
:root[data-variant="b"] .c-tags span, :root[data-variant="b"] .m-mod-head span { background: rgba(74, 58, 167, 0.1); }
:root[data-variant="b"] .blobs-wrap { background: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 0%, transparent 50%), radial-gradient(circle at 85% 70%, rgba(255, 122, 89, 0.08) 0%, transparent 45%); }
:root[data-variant="b"] .cta-sec { box-shadow: 0 30px 60px rgba(42, 31, 107, 0.4); }
:root[data-variant="b"] .sk-b { opacity: 0.8; }

- { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Montserrat', sans-serif; background: var(--bg-main); color: var(--text-dark); line-height: 1.6; overflow-x: hidden; overflow-x: clip; -webkit-tap-highlight-color: transparent; }
button { font-family: inherit; cursor: pointer; border: 0; background: none; color: inherit; outline: none; }
a { text-decoration: none; color: inherit; }
ul, ol { list-style: none; }
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: var(--bg-main); }
::-webkit-scrollbar-thumb { background: var(--primary-light); border-radius: 5px; }
@keyframes rv-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }
.progress-bar { position: fixed; top: 0; left: 0; right: 0; height: 4px; background: var(--secondary); transform: scaleX(0); transform-origin: left; z-index: 300; will-change: transform; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 1.1rem 2.6rem; border-radius: 50px; font-weight: 800; font-size: 0.95rem; text-transform: uppercase; transition: all 0.3s var(--ease-spring); position: relative; z-index: 1; letter-spacing: 0.5px; }
.btn-primary { background: var(--primary); color: #fff; box-shadow: 0 8px 25px rgba(25, 100, 94, 0.3); }
.btn-primary:hover:not(:disabled) { background: var(--primary-dark); transform: translateY(-4px); box-shadow: 0 12px 30px rgba(16, 64, 60, 0.4); }
.btn-primary:disabled { background: #ccc; cursor: not-allowed; box-shadow: none; color: #666; }
.btn-yellow { background: var(--secondary); color: var(--primary-dark); box-shadow: 0 8px 25px rgba(243, 183, 47, 0.3); }
.btn-yellow:hover:not(:disabled) { background: var(--secondary-hover); transform: translateY(-4px); }
.btn-outline { border: 2px solid var(--primary); color: var(--primary); font-weight: 800; }
.btn-outline:hover { background: var(--primary); color: #fff; }
.blobs-wrap { position: fixed; inset: 0; pointer-events: none; z-index: -1; background: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 0%, transparent 50%); }
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; transition: all 0.4s var(--ease); padding: 1.5rem 0; }
.nav.scrolled { padding: 0.8rem 0; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); box-shadow: var(--shadow-sm); border-bottom: 1px solid rgba(255,255,255,0.8); }
.nav-inner { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.logo { font-size: 1.6rem; font-weight: 900; color: var(--primary-dark); display: flex; align-items: center; gap: 0.5rem; letter-spacing: -0.5px; }
.logo span { color: var(--secondary); font-size: 1.8rem; }
.logo-icon { display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; background: var(--primary); color: #fff; border-radius: 12px; font-size: 1.3rem; transform: rotate(-8deg); transition: transform 0.4s; }
.logo:hover .logo-icon { transform: rotate(8deg) scale(1.15); }
.nav-links { display: flex; gap: 2rem; background: var(--bg-glass); padding: 0.8rem 2.5rem; border-radius: 50px; border: 1px solid rgba(25, 100, 94, 0.1); box-shadow: var(--shadow-sm); }
.nav-links a { font-weight: 700; font-size: 0.9rem; color: var(--text-mut); transition: color 0.3s, transform 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
.nav-links a:hover { color: var(--primary); transform: translateY(-2px); }
.burger { display: none; width: 46px; height: 46px; border-radius: 14px; background: var(--primary); flex-direction: column; justify-content: center; align-items: center; gap: 5px; flex-shrink: 0; }
.burger i { display: block; width: 22px; height: 2.5px; background: #fff; border-radius: 2px; transition: transform 0.3s, opacity 0.3s; }
.burger.open i:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
.burger.open i:nth-child(2) { opacity: 0; }
.burger.open i:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }
.mobile-menu { display: none; }
.hero { min-height: 100vh; min-height: 100svh; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 2rem; padding: 8rem 5vw 200px; position: relative; overflow: hidden; text-align: left; }
.hero-left { position: relative; z-index: 2; }
.ht-btn { padding: 1rem 2rem; font-weight: 800; font-size: 0.9rem; color: var(--text-mut); border-radius: 50px; text-transform: uppercase; transition: all 0.3s; }
.ht-btn.active { background: var(--primary); color: #fff; box-shadow: 0 4px 15px rgba(25, 100, 94, 0.3); }
.hero-slogan { display: inline-block; background: var(--secondary); color: var(--primary-dark); font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; font-size: 0.85rem; padding: 0.5rem 1.2rem; border-radius: 50px; margin-bottom: 1.5rem; display: table; }
.hero h1 { font-size: clamp(2.2rem, 3.6vw, 3.6rem); font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -1px; color: var(--primary-dark); animation: rv-up 1s var(--ease); }
.hero h1 span { color: var(--primary-light); display: block; }
.hero p { font-size: 1.05rem; color: var(--text-mut); margin-bottom: 2rem; max-width: 620px; font-weight: 600; animation: rv-up 1.2s var(--ease); }
.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
.hero-right { position: relative; z-index: 2; display: flex; justify-content: center; align-items: flex-end; min-height: 560px; }
.hero-mascot { width: 100%; height: min(620px, 70vh); background-size: contain; background-position: center bottom; background-repeat: no-repeat; filter: drop-shadow(0 20px 25px rgba(0,0,0,0.25)); }
.hero-assist { position: absolute; top: 0; left: 0; background: #fff; padding: 1.3rem; border-radius: 20px; border: 2px solid var(--primary); box-shadow: var(--shadow-lg); width: 290px; z-index: 10; text-align: left; }
.hero-assist::after { content: ''; position: absolute; bottom: -12px; left: 60px; border-width: 12px 12px 0; border-style: solid; border-color: var(--primary) transparent transparent; }
.ha-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
.ha-head b { font-size: 0.9rem; font-weight: 900; color: var(--primary-dark); text-transform: uppercase; letter-spacing: 1px; }
.hero-assist .badge { background: var(--primary); color: #fff; font-size: 0.7rem; padding: 3px 8px; border-radius: 50px; font-weight: 800; }
.hero-assist p { font-size: 0.9rem; color: var(--text-dark); margin: 0; line-height: 1.5; font-weight: 600; }
.skyline { position: absolute; bottom: 0; left: 0; width: 100%; height: 250px; display: flex; align-items: flex-end; gap: 4px; z-index: 1; justify-content: center; padding: 0 2vw; pointer-events: none; }
.sk-b { background: var(--primary); opacity: 0.85; width: calc(100% / 12); border-radius: 4px 4px 0 0; position: relative; animation: buildUp 1s var(--ease-spring) forwards; transform-origin: bottom; transform: scaleY(0); }
@keyframes buildUp { to { transform: scaleY(1); } }
.sec { padding: 8rem 0; position: relative; z-index: 5; }
.sec-title { text-align: center; margin-bottom: 4rem; }
.sec-title h2 { font-size: clamp(2.2rem, 4vw, 3.5rem); font-weight: 900; color: var(--primary-dark); margin-bottom: 1rem; letter-spacing: -1px; }
.sec-title p { color: var(--text-mut); font-size: 1.15rem; max-width: 650px; margin: 0 auto; font-weight: 500; }
.filters { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-bottom: 4rem; }
.filter-btn { padding: 0.9rem 2rem; background: var(--bg-card); border: 2px solid var(--border); border-radius: 50px; font-weight: 800; color: var(--text-mut); transition: all 0.3s; box-shadow: var(--shadow-sm); font-size: 0.95rem; }
.filter-btn:hover { border-color: var(--primary-light); color: var(--primary); transform: translateY(-3px); box-shadow: var(--shadow-md); }
.filter-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); box-shadow: 0 10px 20px rgba(25, 100, 94, 0.3); transform: scale(1.05); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr)); gap: 2.5rem; }
.tilt-card { background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 0.1s, box-shadow 0.3s, border-color 0.3s; display: flex; flex-direction: column; cursor: pointer; height: 100%; transform-style: preserve-3d; }
.tilt-card:hover { box-shadow: var(--shadow-lg); z-index: 2; border-color: var(--primary-light); }
.prof-thumb { height: 240px; background-size: cover; background-position: center; position: relative; border-bottom: 1px solid var(--border); }
.prof-thumb::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(16, 64, 60, 0.8), transparent); opacity: 0.7; transition: opacity 0.3s; }
:root[data-variant="b"] .prof-thumb::after { background: linear-gradient(to top, rgba(42, 31, 107, 0.8), transparent); }
.tilt-card:hover .prof-thumb::after { opacity: 0.9; }
.play-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) translateZ(40px); width: 68px; height: 68px; background: rgba(255,255,255,0.25); backdrop-filter: blur(10px); border: 2px solid #fff; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 1.6rem; transition: all 0.4s; z-index: 2; }
.tilt-card:hover .play-btn { background: var(--secondary); border-color: var(--secondary); color: var(--primary-dark); transform: translate(-50%, -50%) translateZ(60px) scale(1.2); box-shadow: var(--shadow-neon); }
.prof-body { padding: 2.2rem; flex: 1; display: flex; flex-direction: column; transform: translateZ(25px); background: #fff; }
.prof-body h3 { font-size: 1.5rem; font-weight: 900; margin-bottom: 0.6rem; color: var(--primary-dark); }
.prof-body p { color: var(--text-mut); font-size: 0.95rem; margin-bottom: 1.5rem; flex: 1; font-weight: 500; }
.prof-more { color: var(--primary); font-weight: 800; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; transition: gap 0.3s, color 0.3s; text-transform: uppercase; letter-spacing: 0.5px; }
.tilt-card:hover .prof-more { gap: 1rem; color: var(--secondary); }
.review-card { background: #fff; padding: 2.5rem; border-radius: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); transition: transform 0.3s, box-shadow 0.3s; height: 100%; display: flex; flex-direction: column; }
.review-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-md); border-color: var(--primary-light); }
.r-head { display: flex; justify-content: space-between; align-items: center; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 1.2rem; }
.r-name { font-weight: 900; color: var(--primary-dark); font-size: 1.15rem; }
.r-uni { font-size: 0.8rem; background: var(--bg-main); padding: 0.4rem 0.8rem; border-radius: 50px; color: var(--primary); font-weight: 800; }
.r-text { color: var(--text-mut); font-weight: 500; font-size: 0.95rem; font-style: italic; flex: 1; line-height: 1.6; }
.r-stars { color: var(--secondary); font-size: 1.2rem; letter-spacing: 1px; }
.r-top { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.2rem; }
.r-ico { width: 52px; height: 52px; border-radius: 50%; background: var(--bg-main); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; }
.r-ut { flex: 1; min-width: 0; }
.r-fac { font-size: 0.85rem; color: var(--text-mut); font-weight: 600; }
.r-rating { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; flex-wrap: wrap; }
.r-rating b { font-weight: 900; color: var(--primary-dark); }
.r-date { font-size: 0.8rem; color: var(--text-mut); font-weight: 600; }
.r-author { display: flex; align-items: center; gap: 0.8rem; margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid var(--border); }
.r-ava { width: 40px; height: 40px; border-radius: 50%; background: var(--bg-main); color: var(--primary-dark); font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.r-who { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.3; }
.r-who b { font-weight: 800; color: var(--text-dark); }
.r-who span { font-size: 0.8rem; color: var(--text-mut); font-weight: 600; }
.r-role { font-size: 0.8rem; font-weight: 800; padding: 0.4rem 0.9rem; border-radius: 50px; background: var(--bg-main); color: var(--primary); flex-shrink: 0; }
.accordion { max-width: 850px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.2rem; }
.acc-item { background: #fff; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all 0.3s; cursor: pointer; box-shadow: var(--shadow-sm); }
.acc-item:hover { border-color: var(--primary); box-shadow: var(--shadow-md); transform: translateX(5px); }
.acc-head { padding: 1.8rem 2.2rem; display: flex; justify-content: space-between; align-items: center; }
.acc-head h4 { font-size: 1.15rem; font-weight: 800; color: var(--primary-dark); padding-right: 2rem; }
.acc-ico { font-size: 1.8rem; font-weight: 300; transition: transform 0.4s; color: var(--primary); background: var(--bg-main); width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
.acc-item.open .acc-ico { transform: rotate(45deg); background: var(--primary); color: #fff; }
.acc-body { max-height: 0; overflow: hidden; transition: max-height 0.5s, padding 0.5s, opacity 0.5s; padding: 0 2.2rem; opacity: 0; }
.acc-item.open .acc-body { max-height: 300px; padding: 0 2.2rem 1.8rem; opacity: 1; }
.acc-body p { color: var(--text-mut); font-size: 1.05rem; font-weight: 500; }
.cta-sec { margin-top: 5rem; padding: 7rem 2rem; border-radius: 32px; background: linear-gradient(135deg, var(--primary-dark), var(--primary)); text-align: center; color: #fff; position: relative; overflow: hidden; box-shadow: 0 30px 60px rgba(16, 64, 60, 0.4); }
.cta-sec::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(243, 183, 47, 0.15), transparent 50%), radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.1), transparent 50%); }
:root[data-variant="b"] .cta-sec::before { background: radial-gradient(circle at top right, rgba(255, 122, 89, 0.2), transparent 50%), radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.1), transparent 50%); }
.cta-content { position: relative; z-index: 2; max-width: 700px; margin: 0 auto; }
.cta-sec h2 { font-size: clamp(2.4rem, 4.5vw, 3.8rem); font-weight: 900; margin-bottom: 1.5rem; letter-spacing: -1px; }
.cta-sec p { font-size: 1.2rem; margin-bottom: 3rem; opacity: 0.9; font-weight: 500; }
.fb-form { display: flex; flex-direction: column; gap: 1rem; text-align: left; }
.fb-form select, .fb-form textarea, .fb-form input { width: 100%; padding: 1rem 1.3rem; border-radius: 16px; border: 2px solid transparent; font-family: inherit; font-size: 1rem; font-weight: 600; outline: none; background: rgba(255,255,255,0.95); color: var(--text-dark); }
.fb-form select:focus, .fb-form textarea:focus, .fb-form input:focus { border-color: var(--secondary); }
.fb-done { background: rgba(255,255,255,0.15); padding: 1.5rem; border-radius: 16px; font-weight: 800; font-size: 1.1rem; }
.footer { padding: 5rem 2rem 3rem; text-align: center; color: var(--text-mut); font-size: 0.95rem; font-weight: 600; }
.footer-logo { font-size: 1.8rem; font-weight: 900; color: var(--primary-dark); display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; letter-spacing: -0.5px; }
.footer-logo span { color: var(--secondary); font-size: 2rem; }
.footer p { margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 2.5rem; display: inline-block; width: 100%; max-width: 900px; }
.rv { opacity: 0; transition: opacity 0.8s var(--ease), transform 0.8s var(--ease); transition-delay: calc(var(--d) * 1s); will-change: opacity, transform; }
.rv-up { transform: translateY(50px); }
.rv-left { transform: translateX(-50px); }
.rv-right { transform: translateX(50px); }
.rv-scale { transform: scale(0.9); }
.rv.in { opacity: 1; transform: translate(0) scale(1); will-change: auto; }
.ai { position: fixed; right: 30px; bottom: 30px; z-index: 200; display: flex; flex-direction: column; align-items: flex-end; gap: 1.2rem; }
.ai-fab { width: 75px; height: 75px; border-radius: 50%; background: #fff; border: 3px solid var(--primary); box-shadow: var(--shadow-lg); cursor: pointer; position: relative; overflow: hidden; transition: transform 0.3s; }
.ai-fab:hover { transform: scale(1.15) rotate(-8deg); box-shadow: 0 20px 40px rgba(16, 64, 60, 0.3); }
.ai-fab.hidden { opacity: 0; pointer-events: none; transform: scale(0.5); }
.fab-sprite { position: absolute; inset: -15%; background-size: 400% auto; background-position: 84% 15%; pointer-events: none; }
.ping { position: absolute; top: 4px; right: 4px; width: 16px; height: 16px; background: var(--secondary); border-radius: 50%; box-shadow: 0 0 0 0 rgba(243, 183, 47, 0.7); animation: ping 2s infinite; }
@keyframes ping { 70% { box-shadow: 0 0 0 15px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
.ai-panel { position: absolute; bottom: 0; right: 0; width: 400px; height: 650px; max-height: 85vh; background: var(--bg-glass); backdrop-filter: blur(25px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.8); box-shadow: 0 35px 70px rgba(0,0,0,0.2); display: flex; flex-direction: column; overflow: hidden; transform: translateY(30px) scale(0.95); opacity: 0; pointer-events: none; visibility: hidden; transition: transform 0.5s var(--ease-spring), opacity 0.4s, visibility 0.4s; transform-origin: bottom right; }
.ai-panel.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: auto; visibility: visible; }
.ai-head { background: var(--primary); color: #fff; padding: 1.4rem; display: flex; align-items: center; gap: 1.2rem; border-bottom: 4px solid var(--secondary); }
.ai-ava { width: 50px; height: 50px; border-radius: 50%; background: #fff; overflow: hidden; position: relative; border: 2px solid var(--secondary); flex-shrink: 0; }
.ava-sprite { position: absolute; inset: -20%; background-size: 400% auto; background-position: 85% 10%; }
.ai-head b { font-size: 1.2rem; display: block; line-height: 1; font-weight: 900; text-transform: uppercase; }
.ai-head .badge { font-size: 0.75rem; background: rgba(255,255,255,0.2); color: #fff; padding: 3px 8px; border-radius: 6px; font-weight: 800; letter-spacing: 0.5px; }
.ai-close { margin-left: auto; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; justify-content: center; align-items: center; transition: background 0.3s, transform 0.3s; font-size: 1.1rem; flex-shrink: 0; }
.ai-close:hover { background: var(--secondary); color: var(--primary-dark); transform: rotate(90deg); }
.ai-body { flex: 1; padding: 1.5rem; overflow-y: auto; overscroll-behavior: contain; display: flex; flex-direction: column; gap: 1.2rem; background: rgba(255,255,255,0.5); }
.msg-wrap { display: flex; flex-direction: column; max-width: 85%; animation: rv-up 0.4s var(--ease-spring); }
.msg-wrap.bot { align-self: flex-start; }
.msg-wrap.me { align-self: flex-end; align-items: flex-end; }
.msg { padding: 1rem 1.4rem; font-size: 0.95rem; line-height: 1.5; border-radius: 16px; font-weight: 600; }
.bot .msg { background: #fff; color: var(--text-dark); border-bottom-left-radius: 6px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); }
.me .msg { background: var(--primary); color: #fff; border-bottom-right-radius: 6px; box-shadow: 0 5px 15px rgba(25, 100, 94, 0.3); }
.msg.dots { display: flex; gap: 5px; align-items: center; }
.msg.dots i { width: 8px; height: 8px; border-radius: 50%; background: var(--primary-light); animation: blink 1s infinite ease-in-out; }
.msg.dots i:nth-child(2) { animation-delay: 0.15s; }
.msg.dots i:nth-child(3) { animation-delay: 0.3s; }
@keyframes blink { 0%, 80%, 100% { opacity: 0.25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
.msg-act { margin-top: 0.6rem; background: var(--secondary); color: var(--primary-dark); font-weight: 900; font-size: 0.85rem; padding: 0.5rem 1.2rem; border-radius: 50px; align-self: flex-start; box-shadow: var(--shadow-sm); transition: transform 0.2s; text-transform: uppercase; }
.msg-act:hover { transform: scale(1.05); }
.kb { display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.6rem; width: 100%; min-width: 240px; }
.kb button { background: #fff; border: 1px solid var(--primary-light); color: var(--primary); font-weight: 800; font-size: 0.85rem; padding: 0.7rem 1rem; border-radius: 12px; text-align: center; transition: all 0.2s; }
.kb button:hover { background: var(--primary); color: #fff; }
.chips { padding: 0.5rem 1.2rem 1rem; display: flex; gap: 0.5rem; background: rgba(255,255,255,0.5); }
.chips button { flex: 1; white-space: normal; padding: 0.6rem 0.4rem; background: #fff; border: 1px solid var(--primary-light); border-radius: 12px; font-size: 0.78rem; font-weight: 800; color: var(--primary); transition: all 0.2s; box-shadow: var(--shadow-sm); }
.chips button:hover { background: var(--primary); color: #fff; }
.ai-input { position: relative; padding: 1.2rem; background: #fff; border-top: 1px solid var(--border); display: flex; gap: 0.8rem; align-items: center; }
.ai-input input { flex: 1; min-width: 0; padding: 0.9rem 1.4rem; border-radius: 50px; border: 2px solid var(--bg-main); outline: none; font-family: inherit; font-size: 0.95rem; font-weight: 600; transition: border-color 0.3s, background 0.3s; background: var(--bg-main); }
.ai-input input:focus { border-color: var(--primary-light); background: #fff; }
.ai-input button { flex-shrink: 0; width: 48px; height: 48px; border-radius: 50%; background: var(--bg-main); color: var(--text-mut); display: flex; justify-content: center; align-items: center; transition: all 0.3s var(--ease-spring); pointer-events: none; }
.ai-input button.active { background: var(--primary); color: #fff; pointer-events: auto; box-shadow: 0 5px 15px rgba(25, 100, 94, 0.3); }
.ai-input button.active:hover { background: var(--secondary); color: var(--primary-dark); transform: scale(1.1); }
.ai-input svg { width: 22px; height: 22px; transform: translateX(-1px) translateY(1px); }
.ai-input .menu-btn { pointer-events: auto; font-size: 1.2rem; color: var(--primary); }
.ai-input .menu-btn:hover { background: var(--primary); color: #fff; }
.ai-dd { position: absolute; bottom: calc(100% - 4px); left: 1.2rem; background: #fff; border: 1px solid var(--border); border-radius: 16px; box-shadow: var(--shadow-md); padding: 0.4rem; display: flex; flex-direction: column; min-width: 230px; z-index: 5; }
.ai-input .ai-dd button { width: 100%; height: auto; border-radius: 10px; padding: 0.8rem 1rem; text-align: left; font-weight: 800; font-size: 0.9rem; color: var(--primary-dark); background: none; pointer-events: auto; justify-content: flex-start; }
.ai-input .ai-dd button:hover { background: var(--bg-main); color: var(--primary-dark); }
.modal-overlay { position: fixed; inset: 0; background: rgba(29, 45, 42, 0.85); backdrop-filter: blur(10px); z-index: 1000; display: flex; justify-content: center; align-items: center; padding: 2rem; opacity: 0; animation: fadeIn 0.3s forwards; }
:root[data-variant="b"] .modal-overlay { background: rgba(37, 32, 63, 0.85); }
@keyframes fadeIn { to { opacity: 1; } }
.modal-content { background: #fff; width: 100%; max-width: 850px; max-height: 90vh; overflow-y: auto; overscroll-behavior: contain; border-radius: 24px; position: relative; transform: translateY(40px) scale(0.95); opacity: 0; animation: popIn 0.5s var(--ease-spring) forwards; box-shadow: 0 50px 100px rgba(0,0,0,0.4); }
@keyframes popIn { to { transform: translateY(0) scale(1); opacity: 1; } }
.modal-close { position: absolute; top: 1.5rem; right: 1.5rem; width: 44px; height: 44px; background: rgba(0,0,0,0.6); color: #fff; border-radius: 50%; display: flex; justify-content: center; align-items: center; z-index: 10; font-size: 1.2rem; transition: all 0.3s; backdrop-filter: blur(5px); border: 2px solid rgba(255,255,255,0.2); }
.modal-close:hover { background: var(--secondary); color: var(--primary-dark); transform: rotate(90deg) scale(1.1); border-color: var(--secondary); }
.m-video { width: 100%; aspect-ratio: 16/9; background: #000; object-fit: cover; display: block; border-radius: 24px 24px 0 0; }
.m-body { padding: 3.5rem; }
.m-body h2 { font-size: 2.2rem; font-weight: 900; color: var(--primary-dark); margin-bottom: 1rem; }
.m-body h3 { font-size: 1.3rem; font-weight: 800; color: var(--primary); margin: 2.5rem 0 1rem; }
.m-body p { font-size: 1.1rem; color: var(--text-mut); margin-bottom: 1.5rem; font-weight: 500; }
.m-body ul { padding-left: 1.5rem; margin-bottom: 2rem; }
.m-body li { margin-bottom: 0.6rem; font-weight: 700; list-style-type: disc; color: var(--text-dark); }
.modal-content .btn { width: 100%; margin-top: 1.5rem; padding: 1.2rem; font-size: 1.1rem; }
.survey-wrap { margin-top: 1.5rem; }
.survey-progress { display: flex; gap: 5px; margin-bottom: 2rem; }
.survey-progress-bar { flex: 1; height: 6px; background: var(--bg-main); border-radius: 3px; transition: background 0.3s; }
.survey-progress-bar.active { background: var(--primary); }
.survey-block { animation: fadeIn 0.4s; }
.s-q { font-weight: 800; color: var(--primary-dark); font-size: 1.1rem; margin-bottom: 0.8rem; margin-top: 1.5rem; }
.s-radio-group { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }
.s-radio-group label { display: flex; align-items: center; gap: 0.8rem; font-weight: 600; font-size: 1rem; color: var(--text-dark); cursor: pointer; padding: 0.5rem; border-radius: 8px; transition: background 0.2s; }
.s-radio-group label:hover { background: var(--bg-main); }
.s-radio-group input[type="radio"] { width: 1.2rem; height: 1.2rem; accent-color: var(--primary); cursor: pointer; }
.s-stars { display: flex; gap: 0.3rem; font-size: 2rem; cursor: pointer; user-select: none; margin-bottom: 1.5rem; }
.s-star { color: #e0e0e0; transition: color 0.2s, transform 0.1s; }
.s-star.active { color: var(--secondary); }
.s-star:hover { transform: scale(1.1); }
.s-input, .s-textarea { width: 100%; padding: 1rem 1.3rem; border-radius: 12px; border: 2px solid var(--border); font-family: inherit; font-size: 1rem; font-weight: 600; outline: none; background: #fff; margin-bottom: 1.5rem; color: var(--text-dark); transition: border-color 0.3s; }
.s-input:focus, .s-textarea:focus { border-color: var(--primary-light); }
.s-nav { display: flex; gap: 1rem; margin-top: 2rem; justify-content: flex-end; }
.s-nav .btn { width: auto; margin-top: 0; }
@media (hover: none) {
  .tilt-card, .tilt-card:hover { transform: none !important; }
  .prof-body, .c-head { transform: none; }
  .play-btn, .tilt-card:hover .play-btn { transform: translate(-50%, -50%) !important; }
  .acc-item:hover, .review-card:hover, .eco-card:hover { transform: none; }
  .btn:hover, .filter-btn:hover, .marquee-item:hover { transform: none; }
}
@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; padding: 7rem 1.5rem 140px; text-align: center; }
  .hero-slogan { margin-left: auto; margin-right: auto; }
  .hero p { margin-left: auto; margin-right: auto; }
  .hero-actions { justify-content: center; }
  .hero-right { min-height: 380px; }
  .hero-mascot { height: 360px; }
  .hero-assist { display: none; }
}
@media (max-width: 768px) {
  .container { padding: 0 1rem; }
  .nav { padding: 0.8rem 0; }
  .nav.scrolled { background: #fff; backdrop-filter: none; -webkit-backdrop-filter: none; }
  .nav-links, .nav-fb { display: none; }
  .logo { font-size: 1.3rem; }
  .logo span { font-size: 1.5rem; }
  .logo-icon { width: 36px; height: 36px; font-size: 1.1rem; }
  .burger { display: flex; }
  .mobile-menu { display: flex; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: #fff; padding: 0 1rem; box-shadow: var(--shadow-md); max-height: 0; overflow: hidden; opacity: 0; visibility: hidden; transition: max-height 0.35s var(--ease), opacity 0.25s, visibility 0.25s; }
  .mobile-menu.open { max-height: 80vh; padding: 0.5rem 1rem 1rem; opacity: 1; visibility: visible; }
  .mobile-menu a { padding: 1rem 0.5rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: var(--primary-dark); border-bottom: 1px solid var(--border); }
  .mobile-menu a:last-child { border-bottom: 0; }
  .blobs-wrap { display: none; }
  .glass, .play-btn, .modal-overlay, .modal-close, .ai-panel { backdrop-filter: none; -webkit-backdrop-filter: none; }
  .ai-panel { background: #fff; }
  .modal-overlay { background: rgba(29, 45, 42, 0.92); padding: 0; align-items: flex-end; }
  :root[data-variant="b"] .modal-overlay { background: rgba(37, 32, 63, 0.92); }
  .modal-content { max-height: 92vh; max-height: 92dvh; border-radius: 24px 24px 0 0; }
  .hero { padding: 6rem 1rem 120px; gap: 0; min-height: auto; }
  .ht-btn { padding: 0.8rem 1.5rem; font-size: 0.8rem; }
  .hero h1 { font-size: 1.9rem; letter-spacing: -0.5px; }
  .hero p { font-size: 0.95rem; }
  .hero-actions .btn { width: 100%; }
  .hero-right { min-height: 300px; }
  .hero-mascot { height: 300px; }
  .skyline { height: 120px; }
  .sec { padding: 3.5rem 0; }
  .sec-title { margin-bottom: 2rem; }
  .sec-title p { font-size: 1rem; }
  .filters { flex-wrap: nowrap; justify-content: flex-start; overflow-x: auto; gap: 0.6rem; margin: 0 -1rem 2rem; padding: 0.3rem 1rem 0.8rem; scrollbar-width: none; }
  .filters::-webkit-scrollbar { display: none; }
  .filter-btn { flex-shrink: 0; padding: 0.7rem 1.3rem; font-size: 0.85rem; }
  .grid { gap: 1.2rem; }
  .prof-thumb { height: 190px; }
  .prof-body, .review-card { padding: 1.5rem; }
  .prof-body h3 { font-size: 1.25rem; }
  .cta-sec { padding: 3rem 1.2rem; border-radius: 24px; margin-top: 2rem; }
  .cta-sec p { font-size: 1rem; margin-bottom: 2rem; }
  .footer { padding: 3rem 1rem 6rem; }
  .footer-logo { font-size: 1.5rem; }
  .m-video { border-radius: 24px 24px 0 0; }
  .modal-close { top: 0.8rem; right: 0.8rem; width: 40px; height: 40px; }
  .m-body { padding: 1.5rem 1.2rem 2rem; }
  .m-body h2 { font-size: 1.5rem; }
  .m-body h3 { font-size: 1.1rem; margin: 1.5rem 0 0.8rem; }
  .m-body p { font-size: 1rem; }
  .ai-input input, .fb-form select, .fb-form textarea, .fb-form input, .s-input, .s-textarea { font-size: 16px; }
}
@media (max-width: 600px) {
  .ai { right: 14px; bottom: calc(14px + env(safe-area-inset-bottom)); }
  .ai-fab { width: 62px; height: 62px; }
  .ai-panel { position: fixed; inset: 0; width: 100%; height: 100vh; height: 100dvh; max-height: none; border-radius: 0; border: 0; }
  .ai-head { padding: 1rem; padding-top: calc(1rem + env(safe-area-inset-top)); }
  .ai-body { padding: 1rem; }
  .msg-wrap { max-width: 92%; }
  .kb { min-width: 0; }
  .ai-input { padding: 0.8rem; padding-bottom: calc(0.8rem + env(safe-area-inset-bottom)); }
  .chips { padding: 0.4rem 0.8rem 0.6rem; overflow-x: auto; }
  .chips button { flex: 0 0 auto; padding: 0.6rem 0.9rem; }
  .s-nav { flex-direction: column; }
  .s-nav .btn { width: 100%; }
}
`;

/* ============================================================
   ГОЛОВНИЙ КОМПОНЕНТ СТОРІНКИ
   ============================================================ */
const MainPage = () => {
  const [cat, setCat] = useState('all');
  const [modal, setModal] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [fb, setFb] = useState({ type: 'feedback', text: '', contact: '', sent: false });
  const barRef = useRef(null);
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);

  // Стейт форми опитування (3 блоки)
  const [surveyStep, setSurveyStep] = useState(1);
  const [surveyData, setSurveyData] = useState({
    time: '', device: '', impression: 0, functionality: 0, convenience: 0,
    readOthers: '', useful: '', visitAgain: '', integrityViewed: '', integrityImportant: '',
    watchedVideo: '', videoName: '', videoRating: 0, userName: '', reviewText: '', uniName: '', faculty: '', course: ''
  });
  const [surveySent, setSurveySent] = useState(false);

  const [variant] = useState(getVariant);
  const trackedForms = useRef(new Set());
  const trackedSections = useRef(new Set());

  // 1. ІНІЦІАЛІЗАЦІЯ GA4 ТА SEO
  useEffect(() => {
    document.title = "Абітурієнт+ | Усвідомлений вибір професії та чесний вступ";
    const measurementId = 'G-CEBFEDC0W2';
    if (!document.getElementById('ga-script')) {
      const script1 = document.createElement('script');
      script1.id = 'ga-script';
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script1);
      const script2 = document.createElement('script');
      script2.id = 'ga-config';
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}', { send_page_view: false });
      `;
      document.head.appendChild(script2);
    }
  }, []);

  const trackEvent = useCallback((eventName, params = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, { ...params, ab_variant: variant });
    }
  }, [variant]);

  useEffect(() => {
    document.documentElement.setAttribute('data-variant', variant);
    if (window.gtag) {
      window.gtag('set', 'user_properties', { ab_variant: variant });
      window.gtag('event', 'page_view', { page_title: 'Головна', page_path: '/', ab_variant: variant });
    }
  }, [variant]);

  useEffect(() => {
    const thresholds = [25, 50, 75, 100];
    const trackedScrolls = new Set();
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) return;
      const scrollPercent = (window.scrollY / docHeight) * 100;
      thresholds.forEach(t => {
        if (scrollPercent >= t && !trackedScrolls.has(t)) {
          trackedScrolls.add(t);
          trackEvent('scroll_depth', { percent_scrolled: t });
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [trackEvent]);

  const handleFormStart = (formName) => {
    if (!trackedForms.current.has(formName)) {
      trackedForms.current.add(formName);
      trackEvent('form_start', { form_name: formName });
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase.from('reviews').select('*').not('university', 'is', null).order('created_at', { ascending: false });
      if (data && !error) {
        const dbReviews = data.map(r => ({
          name: r.user_name, uni: r.university || 'ЗВО не вказано', faculty: r.faculty || '', course: r.course || '', tags: [],
          text: r.review_text, rating: r.rating, date: new Date(r.created_at).getTime()
        }));
        setReviewsList([...dbReviews, ...INITIAL_REVIEWS]);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    let ticking = false;
    let last = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
      const s = y > 50;
      if (s !== last) { last = s; setScrolled(s); }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modal || menu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modal, menu]);

  const profs = useMemo(() => (cat === 'all' ? PROFS : PROFS.filter((p) => p.cat === cat)), [cat]);
  const skylineBlocks = useMemo(() => SKY_HEIGHTS.map((h, i) => (
    <div key={i} className="sk-b" style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }} />
  )), []);

  const go = useCallback((id, ctaName = null) => {
    if (ctaName) trackEvent('cta_click', { cta_name: ctaName });
    setMenu(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 30);
  }, [trackEvent]);

  const openModal = useCallback((type, item) => {
    trackEvent('feature_use', { feature_name: `open_modal_${type}` });
    setModal([type, item]);
  }, [trackEvent]);

  const openForm = useCallback((type) => {
    setFb((f) => ({ ...f, type, sent: false }));
    setTimeout(() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }), 30);
  }, []);

  const canGoNext1 = surveyData.time && surveyData.device && surveyData.impression > 0 && surveyData.functionality > 0 && surveyData.convenience > 0;
  const canGoNext2 = surveyData.readOthers && surveyData.useful && surveyData.visitAgain && surveyData.integrityViewed && surveyData.integrityImportant;
  const canSubmit = surveyData.uniName.trim().length > 0 && surveyData.userName.trim().length > 0 && surveyData.reviewText.trim().length > 0;

  const submitSurvey = async () => {
    trackEvent('feedback_submit', { form_name: 'survey_form' });
    const row = {
      user_name: surveyData.userName,
      review_text: surveyData.reviewText,
      rating: surveyData.impression,
      time_spent: surveyData.time,
      device: surveyData.device,
      functionality_rating: surveyData.functionality,
      convenience_rating: surveyData.convenience,
      read_others: surveyData.readOthers,
      useful: surveyData.useful,
      visit_again: surveyData.visitAgain,
      integrity_viewed: surveyData.integrityViewed,
      integrity_important: surveyData.integrityImportant,
      watched_video: surveyData.watchedVideo,
      video_name: surveyData.videoName,
      video_rating: surveyData.videoRating
    };
    
    let { error } = await supabase.from('reviews').insert([{ ...row, university: surveyData.uniName, faculty: surveyData.faculty, course: surveyData.course }]);
    if (error) ({ error } = await supabase.from('reviews').insert([row]));

    if (!error) {
      setReviewsList([{ name: surveyData.userName, uni: surveyData.uniName, faculty: surveyData.faculty, course: surveyData.course, tags: [], prof: surveyData.time, text: surveyData.reviewText, rating: surveyData.impression, date: Date.now() }, ...reviewsList]);
      setSurveySent(true);
    } else {
      alert('Сталася помилка при відправці відгуку.');
    }
  };

  const handleFeedbackSubmit = () => {
    trackEvent('generate_lead', { form_name: 'footer_feedback_form' });
    setFb({ ...fb, sent: true });
  };

  const renderStars = (field, currentVal) => (
    <div className="s-stars">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={`s-star ${star <= currentVal ? 'active' : ''}`} onClick={() => setSurveyData({ ...surveyData, [field]: star })}>★</span>
      ))}
    </div>
  );

  const heroContent = variant === 'a' ? {
    slogan: 'Обирай свідоме майбутнє',
    title: 'Обери професію без помилок та марних очікувань',
    subtitle: 'Переглядай реальні відеовізитки спеціальностей та читай чесні відгуки користувачів.',
    cta1: 'Дивитись професії', cta1Id: 'professions',
    cta2: 'Чесні відгуки', cta2Id: 'reviews'
  } : {
    slogan: 'Вступай чесно',
    title: 'Вступ без хабарів: обирай доброчесні університети',
    subtitle: 'Читай правдиві відгуки про виші, повідомляй про корупцію анонімно та обирай професію з упевненістю.',
    cta1: 'Читати відгуки', cta1Id: 'reviews',
    cta2: 'Дивитись професії', cta2Id: 'professions'
  };

  return (
    <>
      <style>{CSS}</style>
      <div ref={barRef} className="progress-bar" />
      <div className="blobs-wrap"><div className="blob c1" /><div className="blob c2" /></div>

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <a href="#top" className="logo" onClick={(e) => { e.preventDefault(); go('top', 'nav_logo'); }}>
            <div className="logo-icon">🚀</div> Абітурієнт<span>+</span>
          </a>
          <div className="nav-links">
            <a href="#professions" onClick={(e) => { e.preventDefault(); go('professions', 'nav_professions'); }}>Професії</a>
            <a href="#reviews" onClick={(e) => { e.preventDefault(); go('reviews', 'nav_reviews'); }}>Відгуки</a>
            <a href="#faq" onClick={(e) => { e.preventDefault(); go('faq', 'nav_faq'); }}>FAQ</a>
          </div>
          <button className="btn btn-outline nav-fb" onClick={() => go('cta', 'nav_feedback')}>ЗВОРОТНІЙ ЗВ'ЯЗОК</button>
          <button className={`burger ${menu ? 'open' : ''}`} onClick={() => setMenu((m) => !m)} aria-label="Меню"><i /><i /><i /></button>
        </div>
        <div className={`mobile-menu ${menu ? 'open' : ''}`}>
          <a href="#professions" onClick={(e) => { e.preventDefault(); go('professions', 'nav_mob_professions'); }}>Професії</a>
          <a href="#reviews" onClick={(e) => { e.preventDefault(); go('reviews', 'nav_mob_reviews'); }}>Відгуки</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); go('faq', 'nav_mob_faq'); }}>FAQ</a>
          <a href="#cta" onClick={(e) => { e.preventDefault(); go('cta', 'nav_mob_feedback'); }}>Зворотній зв'язок</a>
        </div>
      </nav>

      <header id="top" className="hero">
        <div className="hero-left">
          <div className="hero-slogan">{heroContent.slogan}</div>
          <h1>{heroContent.title.split(':').map((part, i) => i === 1 ? <span key={i}>{part}</span> : part)}</h1>
          <p>{heroContent.subtitle}</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => go(heroContent.cta1Id, 'hero_main_cta')}>{heroContent.cta1}</button>
            <button className="btn btn-outline" onClick={() => go(heroContent.cta2Id, 'hero_secondary_cta')}>{heroContent.cta2}</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-assist">
            <div className="ha-head"><b>Харік</b><span className="badge">AI</span></div>
            <p><b>Хочеш дізнатися більше про професії?</b><br />Залишай запитання, і ми зв'яжемось з тобою!</p>
          </div>
          <div className="hero-mascot" style={{ backgroundImage: `url(${mascotPhoto})` }} role="img" aria-label="Маскот Харік" />
        </div>
        <div className="skyline">{skylineBlocks}</div>
      </header>

      <section id="professions" className="sec container">
        <Reveal className="sec-title"><h2>Навігація Професіями</h2><p>Подолай невизначеність! Дізнайся реалії спеціальностей через відеовізитки без "рожевих окулярів" і марних очікувань.</p></Reveal>
        <Reveal delay={0.1}>
          <div className="filters">
            {Object.entries(CATS).map(([k, v]) => <button key={k} className={`filter-btn ${cat === k ? 'active' : ''}`} onClick={() => { setCat(k); trackEvent('feature_use', { feature_name: `filter_${k}` }); }}>{v}</button>)}
          </div>
        </Reveal>
        <div className="grid">
          {profs.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 3) * 0.08} dir="up">
              <TiltCard className="prof-card" onClick={() => openModal('prof', p)}>
                <div className="prof-thumb" style={{ backgroundImage: `url(${p.poster})` }}><div className="play-btn">▶</div></div>
                <div className="prof-body"><h3>{p.icon} {p.title}</h3><p>{p.short}</p><div className="prof-more">Відео та кар'єра →</div></div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="reviews" className="sec container">
        <Reveal className="sec-title"><h2>Чесні відгуки користувачів</h2><p>Відгуки студентів про університети: чи прозоре оцінювання, чи є побори, як працює доброчесність.</p></Reveal>
        <div className="grid">
          {[...reviewsList].sort((a,b) => b.date - a.date).map((r, i) => (
            <Reveal key={i} delay={Math.min(i, 3) * 0.1} dir="up">
              <div className="review-card">
                <div className="r-top">
                  <div className="r-ico">🏛️</div>
                  <div className="r-ut"><div className="r-name">{r.uni}</div>{r.faculty && <div className="r-fac">{r.faculty}</div>}</div>
                </div>
                <div className="r-rating"><span className="r-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span><b>{r.rating}.0</b><span className="r-date">• {new Date(r.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                <div className="r-text">«{r.text}»</div>
                <div className="r-author">
                  <div className="r-ava">{(r.name || '?').charAt(0).toUpperCase()}</div>
                  <div className="r-who"><b>{r.name}</b>{r.course && <span>{r.course}</span>}</div>
                  <span className="r-role">Студент</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div style={{ textAlign: 'center', marginTop: '3.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => {
                setSurveyStep(1); setSurveySent(false);
                setSurveyData({ time: '', device: '', impression: 0, functionality: 0, convenience: 0, readOthers: '', useful: '', visitAgain: '', integrityViewed: '', integrityImportant: '', watchedVideo: '', videoName: '', videoRating: 0, userName: '', reviewText: '', uniName: '', faculty: '', course: '' });
                openModal('survey', null);
              }}>
              Пройти опитування та залишити відгук
            </button>
          </div>
        </Reveal>
      </section>

      <section id="faq" className="sec container">
        <Reveal className="sec-title"><h2>Часті Питання</h2><p>Все, що потрібно знати про відгуки та платформу.</p></Reveal>
        <Reveal delay={0.1}><Accordion faqs={FAQS} /></Reveal>
      </section>

      <section id="cta" className="container">
        <Reveal dir="scale">
          <div className="cta-sec">
            <div className="cta-content">
              <h2>Зворотній зв'язок!</h2>
              <p>Маєш питання або хочеш залишити відгук? Відгуки про корупцію приймаються анонімно.</p>
              {fb.sent ? (
                <div className="fb-done">✅ Дякуємо! Ми отримали твоє повідомлення.</div>
              ) : (
                <div className="fb-form">
                  <select value={fb.type} onFocus={() => handleFormStart('footer_feedback')} onChange={(e) => setFb({ ...fb, type: e.target.value })}>
                    <option value="feedback">Питання / зворотній зв'язок</option>
                    <option value="corruption">Анонімний відгук про корупцію в ЗВО</option>
                  </select>
                  <textarea rows="4" placeholder="Твоє повідомлення…" value={fb.text} onFocus={() => handleFormStart('footer_feedback')} onChange={(e) => setFb({ ...fb, text: e.target.value })} />
                  {fb.type !== 'corruption' && <input placeholder="Email або Telegram (необов'язково)" onFocus={() => handleFormStart('footer_feedback')} value={fb.contact} onChange={(e) => setFb({ ...fb, contact: e.target.value })} />}
                  <button className="btn btn-yellow" disabled={!fb.text.trim()} onClick={handleFeedbackSubmit}>Надіслати</button>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="footer container"><div className="footer-logo">🚀 Абітурієнт<span>+</span></div><p>© {new Date().getFullYear()} Офіційна платформа профорієнтації для абітурієнтів, студентів та світчерів.</p></footer>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)} aria-label="Закрити">✕</button>

            {modal[0] === 'prof' && (
              <>
                <video controls playsInline preload="metadata" poster={modal[1].poster} className="m-video" autoPlay muted loop><source src={V} type="video/mp4" /></video>
                <div className="m-body">
                  <h2>{modal[1].icon} {modal[1].title}</h2><p>{modal[1].full}</p>
                  <h3>🚀 Кар’єрні можливості</h3><ul>{modal[1].opps.map(s => <li key={s}>{s}</li>)}</ul>
                  <button className="btn btn-primary" onClick={() => setModal(null)}>Зрозуміло</button>
                </div>
              </>
            )}

            {modal[0] === 'survey' && (
              <div className="m-body">
                <h2>Опитування користувачів</h2>
                {surveySent ? (
                  <div className="fb-done" style={{ background: 'rgba(25, 100, 94, 0.1)', color: 'var(--primary-dark)', marginTop: '2rem' }}>
                      ✅ Дякуємо! Опитування завершено. Ваш відгук успішно збережено.
                  </div>
                ) : (
                  <div className="survey-wrap">
                    <div className="survey-progress">
                      <div className={`survey-progress-bar ${surveyStep >= 1 ? 'active' : ''}`} />
                      <div className={`survey-progress-bar ${surveyStep >= 2 ? 'active' : ''}`} />
                      <div className={`survey-progress-bar ${surveyStep >= 3 ? 'active' : ''}`} />
                    </div>

                    {surveyStep === 1 && (
                      <div className="survey-block" onFocus={() => handleFormStart('survey_form')}>
                        <div className="s-q">Скільки часу ви провели на платформі? *</div>
                        <div className="s-radio-group">
                          {['До 5 хв', 'До 10 хв', 'До 20 хв', 'Більше 20 хв'].map(opt => (
                            <label key={opt}><input type="radio" name="time" checked={surveyData.time === opt} onChange={() => setSurveyData({...surveyData, time: opt})} /> {opt}</label>
                          ))}
                        </div>
                        <div className="s-q">Вкажіть з якого ви пристрою: *</div>
                        <div className="s-radio-group">
                          {['Ноутбук/комп\'ютер', 'Телефон/планшет'].map(opt => (
                            <label key={opt}><input type="radio" name="device" checked={surveyData.device === opt} onChange={() => setSurveyData({...surveyData, device: opt})} /> {opt}</label>
                          ))}
                        </div>
                        <div className="s-q">Оцініть враження від платформи *</div>
                        {renderStars('impression', surveyData.impression)}
                        <div className="s-q">Оцініть функціонал платформи *</div>
                        {renderStars('functionality', surveyData.functionality)}
                        <div className="s-q">Оцініть зручність платформи *</div>
                        {renderStars('convenience', surveyData.convenience)}
                        <div className="s-nav"><button className="btn btn-primary" disabled={!canGoNext1} onClick={() => setSurveyStep(2)}>Наступний блок →</button></div>
                      </div>
                    )}

                    {surveyStep === 2 && (
                      <div className="survey-block">
                        <div className="s-q">Чи читали ви відгуки про ЗВО інших користувачів? *</div>
                        <div className="s-radio-group">
                          {['Так', 'Ні'].map(opt => <label key={opt}><input type="radio" checked={surveyData.readOthers === opt} onChange={() => setSurveyData({...surveyData, readOthers: opt})} /> {opt}</label>)}
                        </div>
                        <div className="s-q">Чи були відгуки корисними для Вас? *</div>
                        <div className="s-radio-group">
                          {['Так', 'Ні'].map(opt => <label key={opt}><input type="radio" checked={surveyData.useful === opt} onChange={() => setSurveyData({...surveyData, useful: opt})} /> {opt}</label>)}
                        </div>
                        <div className="s-q">Чи Ви відвідаєте платформу ще раз? *</div>
                        <div className="s-radio-group">
                          {['Так', 'Ні'].map(opt => <label key={opt}><input type="radio" checked={surveyData.visitAgain === opt} onChange={() => setSurveyData({...surveyData, visitAgain: opt})} /> {opt}</label>)}
                        </div>
                        <div className="s-q">Чи переглядали ви відгуки пов'язані з доброчесністю ЗВО? *</div>
                        <div className="s-radio-group">
                          {['Так', 'Ні'].map(opt => <label key={opt}><input type="radio" checked={surveyData.integrityViewed === opt} onChange={() => setSurveyData({...surveyData, integrityViewed: opt})} /> {opt}</label>)}
                        </div>
                        <div className="s-q">Чи важливо Вам доброчесність та не корумпованість ЗВО? *</div>
                        <div className="s-radio-group">
                          {['Так', 'Ні'].map(opt => <label key={opt}><input type="radio" checked={surveyData.integrityImportant === opt} onChange={() => setSurveyData({...surveyData, integrityImportant: opt})} /> {opt}</label>)}
                        </div>
                        <div className="s-nav">
                          <button className="btn btn-outline" onClick={() => setSurveyStep(1)}>← Назад</button>
                          <button className="btn btn-primary" disabled={!canGoNext2} onClick={() => setSurveyStep(3)}>Наступний блок →</button>
                        </div>
                      </div>
                    )}

                    {surveyStep === 3 && (
                      <div className="survey-block">
                        <div className="s-q">Чи переглядали Ви відео про спеціальності?</div>
                        <div className="s-radio-group">
                          {['Так', 'Ні'].map(opt => <label key={opt}><input type="radio" checked={surveyData.watchedVideo === opt} onChange={() => setSurveyData({...surveyData, watchedVideo: opt})} /> {opt}</label>)}
                        </div>
                        {surveyData.watchedVideo === 'Так' && (
                          <>
                            <div className="s-q">Якщо так, скажіть які саме відео ви переглядали?</div>
                            <input className="s-input" placeholder="Наприклад: Кібербезпека" value={surveyData.videoName} onChange={e => setSurveyData({...surveyData, videoName: e.target.value})} />
                            <div className="s-q">Оцініть враження від відео</div>
                            {renderStars('videoRating', surveyData.videoRating)}
                          </>
                        )}
                        <div style={{ borderTop: '1px solid var(--border)', marginTop: '2rem', paddingTop: '1.5rem' }}>
                          <div className="s-q">Відгук про ваш ЗВО</div>
                          <input className="s-input" placeholder="Назва ЗВО (наприклад: ХНУРЕ) *" value={surveyData.uniName} onChange={e => setSurveyData({...surveyData, uniName: e.target.value})} />
                          <input className="s-input" placeholder="Факультет / інститут" value={surveyData.faculty} onChange={e => setSurveyData({...surveyData, faculty: e.target.value})} />
                          <input className="s-input" placeholder="Курс (наприклад: 3 курс)" value={surveyData.course} onChange={e => setSurveyData({...surveyData, course: e.target.value})} />
                          <input className="s-input" placeholder="Ваше ім'я (можна анонімно) *" value={surveyData.userName} onChange={e => setSurveyData({...surveyData, userName: e.target.value})} />
                          <textarea className="s-textarea" rows="3" placeholder="Розкажіть про оцінювання, викладачів... *" value={surveyData.reviewText} onChange={e => setSurveyData({...surveyData, reviewText: e.target.value})} />
                        </div>
                        <div className="s-nav">
                          <button className="btn btn-outline" onClick={() => setSurveyStep(2)}>← Назад</button>
                          <button className="btn btn-yellow" disabled={!canSubmit} onClick={submitSurvey}>Завершити та опублікувати</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <Assistant onOpen={openModal} onForm={openForm} />
      <Analytics />
    </>
  );
};

export default MainPage;