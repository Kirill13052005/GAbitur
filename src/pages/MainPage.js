import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import mascotPhoto from '../assets/mascot-photo.png';
import { createClient } from '@supabase/supabase-js';
import { Analytics } from '@vercel/analytics/react';

// Ініціалізація Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://kecltjjcdobidhigmhfd.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_9mjyl5UWYQThAxr5gpO28g_Onhjp29N';
const supabase = createClient(supabaseUrl, supabaseKey);

/* ============================================================
    ДАНІ ПЛАТФОРМИ «АБІТУРІЄНТ +»
    ============================================================ */
const CATS = { all: 'Всі напрямки', tech: 'IT / Tech', law: 'Право', med: 'Медицина', business: 'Бізнес', design: 'Креатив' };
const V = 'https://www.w3schools.com/html/mov_bbb.mp4';
const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=60`;

const PROFS = [
  { id: 'swe', cat: 'tech', icon: '💻', title: 'Software Engineer', short: 'Створює застосунки, сайти та складні IT-системи.', full: 'Інженер-програміст проєктує, розробляє, тестує й підтримує програмне забезпечення: від додатків до систем керування. Ідеально для старту після школи або переходу з іншої сфери (світчерів).', poster: U('1555066931-4365d14bab8c'), course: 'tech1', study: ['Youth Career Hub', 'Kharkiv IT Cluster', 'IT Academy'], opps: ['Робота в глобальних tech-компаніях', 'Віддалена робота', 'Шлях від Trainee до Team Lead'] },
  { id: 'cyber', cat: 'tech', icon: '🛡️', title: 'Фахівець з кібербезпеки', short: 'Захищає дані та системи від хакерських атак.', full: 'Експерт знаходить вразливості раніше за зловмисників. Попит на цю професію шалений серед банків, держави та приватного бізнесу.', poster: U('1526374965328-7f61d4dc18c5'), course: 'tech2', study: ['Youth Career Hub', 'Kharkiv IT Cluster'], opps: ['Банки, фінтех, blockchain', 'Кіберполіція', 'Bug Bounty програми'] },
  { id: 'law', cat: 'law', icon: '⚖️', title: 'Адвокат / Юрист', short: 'Захищає права людей і бізнесу, супроводжує угоди.', full: 'Юрист досконало знає закони й застосовує їх для захисту клієнта. Відмінний вибір для тих, хто має аналітичний склад розуму та ораторські здібності.', poster: U('1589829085413-56de8ae18c73'), course: 'law1', study: ['Youth Career Hub', 'LegalTech Incubator'], opps: ['Власна практика', 'Chief Legal Officer', 'Державна служба'] },
  { id: 'pub', cat: 'law', icon: '🏛️', title: 'Публічне управління', short: 'Оптимізує роботу інституцій і громад.', full: 'Для тих, хто хоче змінювати країну: керувати містами, працювати в міністерствах, впроваджувати реформи та розвивати громади.', poster: U('1541872703-74c5e44368f9'), course: 'law2', study: ['Youth Career Hub', 'Молодіжні ініціативи'], opps: ['Міністерства', 'Місцеве самоврядування', 'Міжнародні фонди'] },
  { id: 'doc', cat: 'med', icon: '🩺', title: 'Лікар-хірург', short: 'Рятує життя, виконує складні операції.', full: 'Одна з найвідповідальніших професій. Вимагає багаторічного навчання, стресостійкості та ідеального знання анатомії.', poster: U('1579684385127-1ef15d508118'), course: 'med1', study: ['Youth Career Hub', 'MedTech School'], opps: ['Провідні клініки', 'Місії «Лікарі без кордонів»', 'Приватна практика'] },
  { id: 'pm', cat: 'business', icon: '👔', title: 'Project Manager', short: 'Керує створення продуктів і веде команду до результату.', full: 'Диригент команди: не пише код і не малює дизайн, але робить так, щоб все працювало. Найкраща професія для світчерів з гуманітарною або управлінською базою.', poster: U('1522071820081-009f0129c71c'), course: 'bus1', study: ['Youth Career Hub', 'Kharkiv IT Cluster'], opps: ['IT-компанії', 'R&D хаби', 'Міжнародні агенції'] }
];

const COURSES = [
  { id: 'tech1', cat: 'tech', icon: '💻', title: 'Software Engineering', spec: 'Інженерія / ІТ', tags: ['Алгоритми', 'ООП', 'Python'], desc: 'Логіка програмування, структури даних. Підходить абітурієнтам та світчерам без досвіду.', mods: [['Алгоритмічне мислення', '2 тижні', 'Змінні, цикли, умови.'], ['ООП', '3 тижні', 'Класи, об\'єкти.'], ['Бази даних', '2 тижні', 'Основи SQL.'], ['Проєкт', '2 тижні', 'Власне портфоліо.']] },
  { id: 'tech2', cat: 'tech', icon: '🔐', title: 'Основи кібербезпеки', spec: 'Кібербезпека', tags: ['Мережі', 'Linux'], desc: 'Основи для майбутніх захисників даних.', mods: [['Архітектура мереж', '2 тижні', 'OSI, TCP/IP.'], ['Linux', '2 тижні', 'Права доступу, bash.'], ['WEB вразливості', '3 тижні', 'SQLi, XSS.']] },
  { id: 'law1', cat: 'law', icon: '⚖️', title: 'Основи юриспруденції', spec: 'Право', tags: ['Закони', 'Судочинство'], desc: 'База для вступу на юридичний або розширення кругозору.', mods: [['Теорія права', '2 тижні', 'Норми та закони.'], ['Цивільне право', '3 тижні', 'Договори.'], ['Кримінальний процес', '2 тижні', 'Суд.']] },
  { id: 'bus1', cat: 'business', icon: '🚀', title: 'Project Management', spec: 'Менеджмент', tags: ['Проєкти', 'Лідерство'], desc: 'Курс для майбутніх PM-ів. Ідеально для швидкого старту в ІТ нетехнічним фахівцям.', mods: [['Бізнес-моделі', '2 тижні', 'Canvas.'], ['Agile & Scrum', '3 тижні', 'Спринти, таски.'], ['Soft Skills', '2 тижні', 'Комунікація.']] },
];

const INITIAL_REVIEWS = [
  { name: 'Олександр Т.', uni: 'Youth Career Hub', prof: 'Software Engineering', text: 'Дуже допомогли з профорієнтацією. Консультанти сучасні, направили на правильні курси. Відгуки на цій платформі допомогли обрати саме цей кар\'єрний центр.', rating: 5, date: Date.now() - 1000000 },
  { name: 'Марія В.', uni: 'Youth Career Hub', prof: 'Право', text: 'Дуже важливо було знайти правильний шлях. Завдяки їхнім безкоштовним консультаціям обрала правильний напрямок.', rating: 5, date: Date.now() - 5000000 },
  { name: 'Денис К.', uni: 'Kharkiv IT Cluster', prof: 'Кібербезпека', text: 'Хороша база вакансій та курсів для старту. Добре, що я знав куди звернутися заздалегідь з рекомендацій на "Абітурієнт+".', rating: 4, date: Date.now() - 9000000 }
];

const ECOSYSTEM = [
  { icon: '🌐', title: 'Kharkiv IT Cluster', desc: 'Об\'єднання провідних ІТ-компаній. Можливість знайти ментора, потрапити на стажування та дізнатися про тренди.', link: 'Дізнатись більше' },
  { icon: '🎯', title: 'Профорієнтаційні хаби', desc: 'Спеціалізовані хаби міста для тестування здібностей та подолання невизначеності у виборі.', link: 'Записатись на тест' },
  { icon: '🤝', title: 'Youth Career Hub', desc: 'Сучасні молодіжні центри для підбору стажувань, курсів та кар\'єрного супроводу безкоштовно.', link: 'Долучитись' },
];

const FAQS = [
  { q: 'Як ви перевіряєте чесність відгуків?', a: 'Ми запровадили систему верифікації. Модеруємо відгуки, щоб висвітлювати реальний стан речей щодо якості допомоги у кар\'єрних хабах та університетах.' },
  { q: 'Для кого створена платформа «Абітурієнт +»?', a: 'Платформа об\'єднує школярів (подолання невизначеності), шукачів роботи та дорослих, які вирішили змінити професію (світчерів).' },
  { q: 'Чи безкоштовні відеовізитки та платформи?', a: 'Так! Наша мета — надати кожному рівний доступ до усвідомленого вибору професії. Усі матеріали безкоштовні.' }
];

const PARTNERS = ['Youth Career Hub', 'Kharkiv IT Cluster', 'Профорієнтаційні хаби Харкова', 'IT Academy', 'Молодіжні ініціативи'];
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
    КОМПОНЕНТИ ТА AI-ЛОГІКА
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

function askHarik(q) {
  const s = q.toLowerCase();
  const prof = PROFS.find((p) => s.includes(p.title.toLowerCase().split(' ')[0].slice(0, 5)) || s.includes(p.id));
  let course = COURSES.find((c) => c.tags.some((t) => s.includes(t.toLowerCase())));
  if (!course) {
    if (s.includes('управлін') || s.includes('держ')) course = COURSES.find(c => c.id === 'law2');
    else if (s.includes('медиц') || s.includes('лікар')) course = COURSES.find(c => c.id === 'med1');
    else if (s.includes('іт') || s.includes('програм')) course = COURSES.find(c => c.id === 'tech1');
    else if (s.includes('кібер') || s.includes('безпек')) course = COURSES.find(c => c.id === 'tech2');
    else if (s.includes('прав') || s.includes('юрист')) course = COURSES.find(c => c.id === 'law1');
    else if (s.includes('проєкт') || s.includes('pm')) course = COURSES.find(c => c.id === 'bus1');
  }
  if (/привіт|вітаю|hello/.test(s)) return { text: 'Привіт! Я Харік 🦝 Ментор платформи. Що шукаємо?' };
  if (/відгук|корупц/.test(s)) return { text: 'Наш пріоритет — прозорість. Користувачі залишають реальні відгуки. Який напрямок цікавить?' };
  if (/куди|звернут|центр/.test(s)) {
    if (prof) return { text: `Для «${prof.title}» рекомендуємо: ${prof.study.join(', ')}.`, open: ['prof', prof] };
    return { text: 'Назви професію — і я підберу хаб розвитку.' };
  }
  if (prof) return { text: `Чудовий вибір! ${prof.short} Показати деталі?`, open: ['prof', prof] };
  return { text: 'Спробуй запитати: «куди звернутись юристу?» або «курси з управління».' };
}

const BACK = { label: '⬅️ Головне меню', a: ['main'] };
const MAIN_MENU = [
  { label: '🎓 Напрямки', a: ['cats'] },
  { label: '💬 Підтримка', a: ['support'] },
];

function menuReply([t, v]) {
  if (t === 'cats') return { text: 'Обери напрямок:', kb: [...Object.entries(CATS).filter(([k]) => k !== 'all').map(([k, l]) => ({ label: l, a: ['cat', k] })), BACK] };
  if (t === 'cat') return { text: 'Доступні професії:', kb: [...PROFS.filter((p) => p.cat === v).map((p) => ({ label: `${p.icon} ${p.title}`, a: ['prof_chat', p.id] })), { label: '⬅️ Напрямки', a: ['cats'] }] };
  if (t === 'prof_chat') {
    const p = PROFS.find((x) => x.id === v);
    return { text: `«${p.title}» — ${p.short}`, kb: [{ label: '🔍 Переглянути деталі', a: ['open_prof', p.id] }, { label: '⬅️ Назад', a: ['cat', p.cat] }] };
  }
  if (t === 'support') return { text: 'Чим допомогти?', kb: [{ label: '🏢 Хаби розвитку', a: ['hubs'] }, { label: '📝 Написати нам', a: ['form', 'feedback'] }, BACK] };
  if (t === 'hubs') return { text: `Наші партнери: ${PARTNERS.slice(0, 3).join(', ')}.`, kb: [{ label: '📝 Написати нам', a: ['form', 'feedback'] }, BACK] };
  return { text: 'Що потрібно?', kb: MAIN_MENU };
}

const Assistant = React.memo(({ onOpen, onForm }) => {
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(false);
  const [msgs, setMsgs] = useState([{ from: 'bot', text: 'Привіт! Я Харік — AI-ментор. Обери, що потрібно 👇', kb: MAIN_MENU }]);
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
    if (t === 'open_prof') { const p = PROFS.find(item => item.id === x); onOpen('prof', p); return reply({ text: 'Відкрив деталі професії 🔍', kb: [BACK] }); }
    if (t === 'form') {
      if (window.matchMedia('(max-width: 600px)').matches) setOpen(false);
      onForm(x);
      return reply({ text: 'Форма внизу сторінки ⬇️', kb: [BACK] });
    }
    reply(menuReply(b.a));
  };

  const send = (q) => {
    if (!q.trim() || busy) return;
    setMsgs((m) => [...m, { from: 'me', text: q }]); setVal(''); setBusy(true);
    setTimeout(() => {
      const a = askHarik(q);
      setMsgs((m) => [...m, { from: 'bot', text: a.text, act: a.open, kb: a.open ? undefined : MAIN_MENU }]); setBusy(false);
    }, 800);
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
              {m.act && <button className="msg-act" onClick={() => onOpen(m.act[0], m.act[1])}>Переглянути деталі ↗</button>}
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
    СТИЛІ З ДИНАМІЧНИМИ ТЕМАМИ ДЛЯ А/В ТЕСТУВАННЯ
    ============================================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800;900&display=swap');

:root { 
  --primary: #19645E; 
  --primary-light: #248C84; 
  --primary-dark: #10403C; 
  --secondary: #F3B72F; 
  --secondary-hover: #FFD25A; 
  --bg-main: #EAF2F0; 
  --bg-card: #FFFFFF; 
  --bg-glass: rgba(255, 255, 255, 0.85); 
  --text-dark: #1D2D2A; 
  --text-mut: #546B67; 
  --border: rgba(25, 100, 94, 0.15); 
  --shadow-sm: 0 4px 15px rgba(16, 64, 60, 0.08); 
  --shadow-md: 0 12px 35px rgba(16, 64, 60, 0.12); 
  --shadow-lg: 0 25px 50px rgba(16, 64, 60, 0.2); 
  --shadow-neon: 0 0 20px rgba(243, 183, 47, 0.4); 
  --ease: cubic-bezier(0.25, 1, 0.2, 1); 
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); 
}

/* Кастомізація колірної палітри для Варіанта Б (Глибокий синій / Неоновий смарагд) */
body.variant-b {
  --primary: #00B4DB;
  --primary-light: #0083B0;
  --primary-dark: #0F2027;
  --secondary: #F3B72F;
  --secondary-hover: #FFD25A;
  --bg-main: #0F2027;
  --bg-card: #1C2E38;
  --bg-glass: rgba(28, 46, 56, 0.9);
  --text-dark: #FFFFFF;
  --text-mut: #A0B2C6;
  --border: rgba(0, 180, 219, 0.25);
  --shadow-sm: 0 4px 15px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 12px 35px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 25px 50px rgba(0, 0, 0, 0.5);
}

body.variant-b .nav.scrolled {
  background: rgba(15, 32, 39, 0.95);
  border-bottom: 1px solid rgba(0, 180, 219, 0.2);
}

body.variant-b .hero-toggle,
body.variant-b .nav-links,
body.variant-b .review-card,
body.variant-b .eco-card,
body.variant-b .acc-item,
body.variant-b .modal-content,
body.variant-b .ai-panel,
body.variant-b .ai-input,
body.variant-b .ai-dd,
body.variant-b .hero-assist,
body.variant-b .marquee-sec {
  background: #1C2E38;
  color: #fff;
}

body.variant-b .filter-btn {
  background: #1C2E38;
  color: var(--text-mut);
  border-color: var(--border);
}

body.variant-b .filter-btn.active {
  background: var(--primary);
  color: var(--primary-dark);
}

body.variant-b .prof-body {
  background: #1C2E38;
}

body.variant-b .ai-input input {
  background: #0F2027;
  color: #fff;
}

body.variant-b .tl-content {
  background: #1C2E38;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Montserrat', sans-serif; background: var(--bg-main); color: var(--text-dark); line-height: 1.6; overflow-x: hidden; overflow-x: clip; -webkit-tap-highlight-color: transparent; transition: background 0.3s ease, color 0.3s ease; }
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
.blobs-wrap { position: fixed; inset: 0; pointer-events: none; z-index: -1; background: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 0%, transparent 50%); }
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; transition: all 0.4s var(--ease); padding: 1.5rem 0; }
.nav.scrolled { padding: 0.8rem 0; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); box-shadow: var(--shadow-sm); border-bottom: 1px solid rgba(255,255,255,0.8); }
.nav-inner { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.logo { font-size: 1.6rem; font-weight: 900; color: var(--primary-dark); display: flex; align-items: center; gap: 0.5rem; letter-spacing: -0.5px; }
body.variant-b .logo { color: #fff; }
.logo span { color: var(--secondary); font-size: 1.8rem; }
.logo-icon { display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; background: var(--primary); color: #fff; border-radius: 12px; font-size: 1.3rem; transform: rotate(-8deg); transition: transform 0.4s; }
.logo:hover .logo-icon { transform: rotate(8deg) scale(1.15); }
.nav-links { display: flex; gap: 2rem; background: var(--bg-glass); padding: 0.8rem 2.5rem; border-radius: 50px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
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
.hero-toggle { display: inline-flex; background: #fff; border-radius: 50px; padding: 0.4rem; box-shadow: var(--shadow-sm); margin-bottom: 2rem; animation: rv-up 0.8s var(--ease); }
.ht-btn { padding: 1rem 2rem; font-weight: 800; font-size: 0.9rem; color: var(--text-mut); border-radius: 50px; text-transform: uppercase; transition: all 0.3s; }
.ht-btn.active { background: var(--primary); color: #fff; box-shadow: 0 4px 15px rgba(25, 100, 94, 0.3); }
.hero-slogan { display: inline-block; background: var(--secondary); color: var(--primary-dark); font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; font-size: 0.85rem; padding: 0.5rem 1.2rem; border-radius: 50px; margin-bottom: 1.5rem; display: table; }
.hero h1 { font-size: clamp(2.2rem, 3.6vw, 3.6rem); font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -1px; color: var(--text-dark); animation: rv-up 1s var(--ease); }
.hero h1 span { color: var(--primary-light); display: block; }
.hero p { font-size: 1.05rem; color: var(--text-mut); margin-bottom: 2rem; max-width: 620px; font-weight: 600; animation: rv-up 1.2s var(--ease); }
.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
.hero-right { position: relative; z-index: 2; display: flex; justify-content: center; align-items: flex-end; min-height: 560px; }
.hero-mascot { width: 100%; height: min(620px, 70vh); background-size: contain; background-position: center bottom; background-repeat: no-repeat; filter: drop-shadow(0 20px 25px rgba(0,0,0,0.25)); }
.hero-assist { position: absolute; top: 0; left: 0; background: #fff; padding: 1.3rem; border-radius: 20px; border: 2px solid var(--primary); box-shadow: var(--shadow-lg); width: 290px; z-index: 10; text-align: left; }
.hero-assist::after { content: ''; position: absolute; bottom: -12px; left: 60px; border-width: 12px 12px 0; border-style: solid; border-color: var(--primary) transparent transparent; }
.ha-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
.ha-head b { font-size: 0.9rem; font-weight: 900; color: var(--text-dark); text-transform: uppercase; letter-spacing: 1px; }
.hero-assist .badge { background: var(--primary); color: #fff; font-size: 0.7rem; padding: 3px 8px; border-radius: 50px; font-weight: 800; }
.hero-assist p { font-size: 0.9rem; color: var(--text-mut); margin: 0; line-height: 1.5; font-weight: 600; }
.skyline { position: absolute; bottom: 0; left: 0; width: 100%; height: 250px; display: flex; align-items: flex-end; gap: 4px; z-index: 1; justify-content: center; padding: 0 2vw; pointer-events: none; }
.sk-b { background: var(--primary); opacity: 0.85; width: calc(100% / 12); border-radius: 4px 4px 0 0; position: relative; animation: buildUp 1s var(--ease-spring) forwards; transform-origin: bottom; transform: scaleY(0); }
@keyframes buildUp { to { transform: scaleY(1); } }
.marquee-sec { padding: 4rem 0; overflow: hidden; background: #fff; border-bottom: 1px solid var(--border); position: relative; z-index: 5; }
.marquee-sub { text-align: center; font-size: 0.95rem; font-weight: 800; color: var(--text-mut); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 2.5rem; }
.marquee-wrap { display: flex; width: max-content; animation: scroll 40s linear infinite; will-change: transform; }
.marquee-wrap:hover { animation-play-state: paused; }
.marquee-item { font-size: 1.6rem; font-weight: 900; color: var(--text-dark); padding: 0 3.5rem; display: flex; align-items: center; opacity: 0.4; transition: all 0.3s; cursor: default; white-space: nowrap; }
.marquee-item:hover { opacity: 1; color: var(--primary); transform: scale(1.05); }
.marquee-item::after { content: '•'; color: var(--secondary); margin-left: 3.5rem; font-size: 2rem; }
@keyframes scroll { to { transform: translateX(-50%); } }
.sec { padding: 8rem 0; position: relative; z-index: 5; }
.sec-title { text-align: center; margin-bottom: 4rem; }
.sec-title h2 { font-size: clamp(2.2rem, 4vw, 3.5rem); font-weight: 900; color: var(--text-dark); margin-bottom: 1rem; letter-spacing: -1px; }
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
.tilt-card:hover .prof-thumb::after { opacity: 0.9; }
.play-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) translateZ(40px); width: 68px; height: 68px; background: rgba(255,255,255,0.25); backdrop-filter: blur(10px); border: 2px solid #fff; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 1.6rem; transition: all 0.4s; z-index: 2; }
.tilt-card:hover .play-btn { background: var(--secondary); border-color: var(--secondary); color: var(--primary-dark); transform: translate(-50%, -50%) translateZ(60px) scale(1.2); box-shadow: var(--shadow-neon); }
.prof-body { padding: 2.2rem; flex: 1; display: flex; flex-direction: column; transform: translateZ(25px); background: #fff; }
.prof-body h3 { font-size: 1.5rem; font-weight: 900; margin-bottom: 0.6rem; color: var(--text-dark); }
.prof-body p { color: var(--text-mut); font-size: 0.95rem; margin-bottom: 1.5rem; flex: 1; font-weight: 500; }
.prof-more { color: var(--primary); font-weight: 800; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; transition: gap 0.3s, color 0.3s; text-transform: uppercase; letter-spacing: 0.5px; }
.tilt-card:hover .prof-more { gap: 1rem; color: var(--secondary); }
.review-card { background: #fff; padding: 2.5rem; border-radius: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); transition: transform 0.3s, box-shadow 0.3s; height: 100%; display: flex; flex-direction: column; }
.review-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-md); border-color: var(--primary-light); }
.r-head { display: flex; justify-content: space-between; align-items: center; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 1.2rem; }
.r-name { font-weight: 900; color: var(--text-dark); font-size: 1.15rem; }
.r-uni { font-size: 0.8rem; background: var(--bg-main); padding: 0.4rem 0.8rem; border-radius: 50px; color: var(--primary); font-weight: 800; }
.r-text { color: var(--text-mut); font-weight: 500; font-size: 0.95rem; font-style: italic; flex: 1; line-height: 1.6; }
.r-stars { color: var(--secondary); margin-top: 1.5rem; font-size: 1.2rem; }
.eco-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 2.5rem; }
.eco-card { background: #fff; padding: 3rem 2.5rem; border-radius: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); text-align: center; transition: transform 0.3s; }
.eco-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-md); border-color: var(--primary-light); }
.eco-icon { font-size: 4rem; margin-bottom: 1.5rem; display: inline-block; }
.eco-card h3 { font-size: 1.4rem; font-weight: 900; color: var(--text-dark); margin-bottom: 1rem; }
.eco-card p { font-size: 1.05rem; color: var(--text-mut); margin-bottom: 2rem; font-weight: 500; }
.eco-link { display: inline-block; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; padding-bottom: 5px; border-bottom: 2px solid var(--secondary); transition: color 0.3s; }
.eco-card:hover .eco-link { color: var(--secondary); border-color: var(--primary); }
.accordion { max-width: 850px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.2rem; }
.acc-item { background: #fff; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all 0.3s; cursor: pointer; box-shadow: var(--shadow-sm); }
.acc-item:hover { border-color: var(--primary); box-shadow: var(--shadow-md); transform: translateX(5px); }
.acc-head { padding: 1.8rem 2.2rem; display: flex; justify-content: space-between; align-items: center; }
.acc-head h4 { font-size: 1.15rem; font-weight: 800; color: var(--text-dark); padding-right: 2rem; }
.acc-ico { font-size: 1.8rem; font-weight: 300; transition: transform 0.4s; color: var(--primary); background: var(--bg-main); width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
.acc-item.open .acc-ico { transform: rotate(45deg); background: var(--primary); color: #fff; }
.acc-body { max-height: 0; overflow: hidden; transition: max-height 0.5s, padding 0.5s, opacity 0.5s; padding: 0 2.2rem; opacity: 0; }
.acc-item.open .acc-body { max-height: 300px; padding: 0 2.2rem 1.8rem; opacity: 1; }
.acc-body p { color: var(--text-mut); font-size: 1.05rem; font-weight: 500; }
.cta-sec { margin-top: 5rem; padding: 7rem 2rem; border-radius: 32px; background: linear-gradient(135deg, var(--primary-dark), var(--primary)); text-align: center; color: #fff; position: relative; overflow: hidden; box-shadow: 0 30px 60px rgba(16, 64, 60, 0.4); }
.cta-sec::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(243, 183, 47, 0.15), transparent 50%), radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.1), transparent 50%); }
.cta-content { position: relative; z-index: 2; max-width: 700px; margin: 0 auto; }
.cta-sec h2 { font-size: clamp(2.4rem, 4.5vw, 3.8rem); font-weight: 900; margin-bottom: 1.5rem; letter-spacing: -1px; }
.cta-sec p { font-size: 1.2rem; margin-bottom: 3rem; opacity: 0.9; font-weight: 500; }
.fb-form { display: flex; flex-direction: column; gap: 1rem; text-align: left; }
.fb-form select, .fb-form textarea, .fb-form input { width: 100%; padding: 1rem 1.3rem; border-radius: 16px; border: 2px solid transparent; font-family: inherit; font-size: 1rem; font-weight: 600; outline: none; background: rgba(255,255,255,0.95); color: #1D2D2A; }
.fb-form select:focus, .fb-form textarea:focus, .fb-form input:focus { border-color: var(--secondary); }
.fb-done { background: rgba(255,255,255,0.15); padding: 1.5rem; border-radius: 16px; font-weight: 800; font-size: 1.1rem; }
.footer { padding: 5rem 2rem 3rem; text-align: center; color: var(--text-mut); font-size: 0.95rem; font-weight: 600; }
.footer-logo { font-size: 1.8rem; font-weight: 900; color: var(--text-dark); display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; letter-spacing: -0.5px; }
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
.ai-panel { position: absolute; bottom: 0; right: 0; width: 400px; height: 650px; max-height: 85vh; background: var(--bg-glass); backdrop-filter: blur(25px); border-radius: 24px; border: 1px solid var(--border); box-shadow: 0 35px 70px rgba(0,0,0,0.2); display: flex; flex-direction: column; overflow: hidden; transform: translateY(30px) scale(0.95); opacity: 0; pointer-events: none; visibility: hidden; transition: transform 0.5s var(--ease-spring), opacity 0.4s, visibility 0.4s; transform-origin: bottom right; }
.ai-panel.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: auto; visibility: visible; }
.ai-head { background: var(--primary); color: #fff; padding: 1.4rem; display: flex; align-items: center; gap: 1.2rem; border-bottom: 4px solid var(--secondary); }
.ai-ava { width: 50px; height: 50px; border-radius: 50%; background: #fff; overflow: hidden; position: relative; border: 2px solid var(--secondary); flex-shrink: 0; }
.ava-sprite { position: absolute; inset: -20%; background-size: 400% auto; background-position: 85% 10%; }
.ai-head b { font-size: 1.2rem; display: block; line-height: 1; font-weight: 900; text-transform: uppercase; }
.ai-head .badge { font-size: 0.75rem; background: rgba(255,255,255,0.2); color: #fff; padding: 3px 8px; border-radius: 6px; font-weight: 800; letter-spacing: 0.5px; }
.ai-close { margin-left: auto; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; justify-content: center; align-items: center; transition: background 0.3s, transform 0.3s; font-size: 1.1rem; flex-shrink: 0; }
.ai-close:hover { background: var(--secondary); color: var(--primary-dark); transform: rotate(90deg); }
.ai-body { flex: 1; padding: 1.5rem; overflow-y: auto; overscroll-behavior: contain; display: flex; flex-direction: column; gap: 1.2rem; background: rgba(0,0,0,0.03); }
.msg-wrap { display: flex; flex-direction: column; max-width: 85%; animation: rv-up 0.4s var(--ease-spring); }
.msg-wrap.bot { align-self: flex-start; }
.msg-wrap.me { align-self: flex-end; align-items: flex-end; }
.msg { padding: 1rem 1.4rem; font-size: 0.95rem; line-height: 1.5; border-radius: 16px; font-weight: 600; }
.bot .msg { background: var(--bg-card); color: var(--text-dark); border-bottom-left-radius: 6px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); }
.me .msg { background: var(--primary); color: #fff; border-bottom-right-radius: 6px; box-shadow: 0 5px 15px rgba(25, 100, 94, 0.3); }
.msg.dots { display: flex; gap: 5px; align-items: center; }
.msg.dots i { width: 8px; height: 8px; border-radius: 50%; background: var(--primary-light); animation: blink 1s infinite ease-in-out; }
.msg.dots i:nth-child(2) { animation-delay: 0.15s; }
.msg.dots i:nth-child(3) { animation-delay: 0.3s; }
@keyframes blink { 0%, 80%, 100% { opacity: 0.25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
.msg-act { margin-top: 0.6rem; background: var(--secondary); color: var(--primary-dark); font-weight: 900; font-size: 0.85rem; padding: 0.5rem 1.2rem; border-radius: 50px; align-self: flex-start; box-shadow: var(--shadow-sm); transition: transform 0.2s; text-transform: uppercase; }
.msg-act:hover { transform: scale(1.05); }
.kb { display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.6rem; width: 100%; min-width: 240px; }
.kb button { background: var(--bg-card); border: 1px solid var(--primary-light); color: var(--primary); font-weight: 800; font-size: 0.85rem; padding: 0.7rem 1rem; border-radius: 12px; text-align: center; transition: all 0.2s; }
.kb button:hover { background: var(--primary); color: #fff; }
.chips { padding: 0.5rem 1.2rem 1rem; display: flex; gap: 0.5rem; background: transparent; }
.chips button { flex: 1; white-space: normal; padding: 0.6rem 0.4rem; background: var(--bg-card); border: 1px solid var(--primary-light); border-radius: 12px; font-size: 0.78rem; font-weight: 800; color: var(--primary); transition: all 0.2s; box-shadow: var(--shadow-sm); }
.chips button:hover { background: var(--primary); color: #fff; }
.ai-input { position: relative; padding: 1.2rem; background: var(--bg-card); border-top: 1px solid var(--border); display: flex; gap: 0.8rem; align-items: center; }
.ai-input input { flex: 1; min-width: 0; padding: 0.9rem 1.4rem; border-radius: 50px; border: 2px solid var(--border); outline: none; font-family: inherit; font-size: 0.95rem; font-weight: 600; transition: border-color 0.3s, background 0.3s; background: var(--bg-main); color: var(--text-dark); }
.ai-input input:focus { border-color: var(--primary-light); }
.ai-input button { flex-shrink: 0; width: 48px; height: 48px; border-radius: 50%; background: var(--bg-main); color: var(--text-mut); display: flex; justify-content: center; align-items: center; transition: all 0.3s var(--ease-spring); pointer-events: none; }
.ai-input button.active { background: var(--primary); color: #fff; pointer-events: auto; box-shadow: 0 5px 15px rgba(25, 100, 94, 0.3); }
.ai-input button.active:hover { background: var(--secondary); color: var(--primary-dark); transform: scale(1.1); }
.ai-input svg { width: 22px; height: 22px; transform: translateX(-1px) translateY(1px); }
.ai-input .menu-btn { pointer-events: auto; font-size: 1.2rem; color: var(--primary); }
.ai-input .menu-btn:hover { background: var(--primary); color: #fff; }
.ai-dd { position: absolute; bottom: calc(100% - 4px); left: 1.2rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; box-shadow: var(--shadow-md); padding: 0.4rem; display: flex; flex-direction: column; min-width: 230px; z-index: 5; }
.ai-input .ai-dd button { width: 100%; height: auto; border-radius: 10px; padding: 0.8rem 1rem; text-align: left; font-weight: 800; font-size: 0.9rem; color: var(--text-dark); background: none; pointer-events: auto; justify-content: flex-start; }
.ai-input .ai-dd button:hover { background: var(--bg-main); }
.modal-overlay { position: fixed; inset: 0; background: rgba(15, 20, 25, 0.85); backdrop-filter: blur(10px); z-index: 1000; display: flex; justify-content: center; align-items: center; padding: 2rem; opacity: 0; animation: fadeIn 0.3s forwards; }
@keyframes fadeIn { to { opacity: 1; } }
.modal-content { background: var(--bg-card); width: 100%; max-width: 850px; max-height: 90vh; overflow-y: auto; overscroll-behavior: contain; border-radius: 24px; position: relative; transform: translateY(40px) scale(0.95); opacity: 0; animation: popIn 0.5s var(--ease-spring) forwards; box-shadow: 0 50px 100px rgba(0,0,0,0.4); color: var(--text-dark); }
@keyframes popIn { to { transform: translateY(0) scale(1); opacity: 1; } }
.modal-close { position: absolute; top: 1.5rem; right: 1.5rem; width: 44px; height: 44px; background: rgba(0,0,0,0.6); color: #fff; border-radius: 50%; display: flex; justify-content: center; align-items: center; z-index: 10; font-size: 1.2rem; transition: all 0.3s; backdrop-filter: blur(5px); border: 2px solid rgba(255,255,255,0.2); }
.modal-close:hover { background: var(--secondary); color: var(--primary-dark); transform: rotate(90deg) scale(1.1); border-color: var(--secondary); }
.m-video { width: 100%; aspect-ratio: 16/9; background: #000; object-fit: cover; display: block; border-radius: 24px 24px 0 0; }
.m-body { padding: 3.5rem; }
.m-body h2 { font-size: 2.2rem; font-weight: 900; color: var(--text-dark); margin-bottom: 1rem; }
.m-body h3 { font-size: 1.3rem; font-weight: 800; color: var(--primary); margin: 2.5rem 0 1rem; }
.m-body p { font-size: 1.1rem; color: var(--text-mut); margin-bottom: 1.5rem; font-weight: 500; }
.m-body ul { padding-left: 1.5rem; margin-bottom: 2rem; }
.m-body li { margin-bottom: 0.6rem; font-weight: 700; list-style-type: disc; color: var(--text-dark); }
.modal-content .btn { width: 100%; margin-top: 1.5rem; padding: 1.2rem; font-size: 1.1rem; }
.survey-wrap { margin-top: 1.5rem; }
.survey-progress { display: flex; gap: 5px; margin-bottom: 2rem; }
.survey-progress-bar { flex: 1; height: 6px; background: var(--border); border-radius: 3px; transition: background 0.3s; }
.survey-progress-bar.active { background: var(--primary); }
.survey-block { animation: fadeIn 0.4s; }
.s-q { font-weight: 800; color: var(--text-dark); font-size: 1.1rem; margin-bottom: 0.8rem; margin-top: 1.5rem; }
.s-radio-group { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }
.s-radio-group label { display: flex; align-items: center; gap: 0.8rem; font-weight: 600; font-size: 1rem; color: var(--text-dark); cursor: pointer; padding: 0.5rem; border-radius: 8px; transition: background 0.2s; }
.s-radio-group label:hover { background: var(--border); }
.s-radio-group input[type="radio"] { width: 1.2rem; height: 1.2rem; accent-color: var(--primary); cursor: pointer; }
.s-stars { display: flex; gap: 0.3rem; font-size: 2rem; cursor: pointer; user-select: none; margin-bottom: 1.5rem; }
.s-star { color: #e0e0e0; transition: color 0.2s, transform 0.1s; }
.s-star.active { color: var(--secondary); }
.s-star:hover { transform: scale(1.1); }
.s-input, .s-textarea { width: 100%; padding: 1rem 1.3rem; border-radius: 12px; border: 2px solid var(--border); font-family: inherit; font-size: 1rem; font-weight: 600; outline: none; background: var(--bg-main); margin-bottom: 1.5rem; color: var(--text-dark); transition: border-color 0.3s; }
.s-input:focus, .s-textarea:focus { border-color: var(--primary-light); }
.s-nav { display: flex; gap: 1rem; margin-top: 2rem; justify-content: flex-end; }
.s-nav .btn { width: auto; margin-top: 0; }

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
  .nav.scrolled { background: var(--bg-card); backdrop-filter: none; }
  .nav-links, .nav-fb { display: none; }
  .burger { display: flex; }
  .mobile-menu { display: flex; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: var(--bg-card); padding: 0 1rem; box-shadow: var(--shadow-md); max-height: 0; overflow: hidden; opacity: 0; visibility: hidden; transition: max-height 0.35s var(--ease), opacity 0.25s, visibility 0.25s; }
  .mobile-menu.open { max-height: 80vh; padding: 0.5rem 1rem 1rem; opacity: 1; visibility: visible; }
  .mobile-menu a { padding: 1rem 0.5rem; font-weight: 800; text-transform: uppercase; color: var(--text-dark); border-bottom: 1px solid var(--border); }
  .hero { padding: 6rem 1rem 120px; gap: 0; min-height: auto; }
  .hero-toggle { flex-direction: column; padding: 0.2rem; border-radius: 20px; width: 100%; }
  .hero h1 { font-size: 1.9rem; }
  .filters { flex-wrap: nowrap; justify-content: flex-start; overflow-x: auto; gap: 0.6rem; margin: 0 -1rem 2rem; padding: 0.3rem 1rem 0.8rem; scrollbar-width: none; }
  .ai-panel { position: fixed; inset: 0; width: 100%; height: 100vh; height: 100dvh; max-height: none; border-radius: 0; }
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
  const [activeTab, setActiveTab] = useState('video');
  const [fb, setFb] = useState({ type: 'feedback', text: '', contact: '', sent: false });
  const barRef = useRef(null);
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);
  
  // Стейт форми опитування
  const [surveyStep, setSurveyStep] = useState(1);
  const [surveyData, setSurveyData] = useState({
    time: '', device: '', impression: 0, functionality: 0, convenience: 0,
    readOthers: '', useful: '', visitAgain: '', integrityViewed: '', integrityImportant: '',
    watchedVideo: '', videoName: '', videoRating: 0, userName: '', reviewText: ''
  });
  const [surveySent, setSurveySent] = useState(false);

  // --- A/B ТЕСТУВАННЯ ТА АНАЛІТИКА ---
  const [variant, setVariant] = useState('a');
  const trackedForms = useRef(new Set());
  const trackedSections = useRef(new Set());

  useEffect(() => {
    document.title = "Абітурієнт+ | Усвідомлений вибір професії та чесний вступ";
    const setMetaTag = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    setMetaTag('description', "Платформа для абітурієнтів: обирай професію за допомогою відеовізиток, читай чесні відгуки про виші та будуй кар'єру без корупції.");
    setMetaTag('og:title', "Абітурієнт+ | Чесний вибір майбутнього", true);
    setMetaTag('og:description', "Відеовізитки професій, підготовчі курси та відгуки про університети без цензури.", true);
    setMetaTag('og:image', "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80", true);
    setMetaTag('og:type', "website", true);

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
    const urlParams = new URLSearchParams(window.location.search);
    const forceVariant = urlParams.get('v');
    let currentVariant = localStorage.getItem('ab_variant');
    
    if (forceVariant === 'a' || forceVariant === 'b') {
      currentVariant = forceVariant;
      localStorage.setItem('ab_variant', forceVariant);
    } else if (!currentVariant) {
      currentVariant = Math.random() < 0.5 ? 'a' : 'b';
      localStorage.setItem('ab_variant', currentVariant);
    }
    setVariant(currentVariant);

    // Додаємо клас варіанта до body для CSS-змін кольорів
    if (currentVariant === 'b') {
      document.body.classList.add('variant-b');
    } else {
      document.body.classList.remove('variant-b');
    }

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('set', 'user_properties', { ab_variant: currentVariant });
      window.gtag('event', 'page_view', { page_title: 'Головна', page_path: '/', ab_variant: currentVariant });
    }
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (data && !error) {
        const dbReviews = data.map(r => ({
          name: r.user_name, uni: 'Відгук про платформу', prof: r.time_spent || 'Користувач',
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
    if (id === 'professions') setActiveTab('video');
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
  const canSubmit = surveyData.userName.trim().length > 0 && surveyData.reviewText.trim().length > 0;

  const submitSurvey = async () => {
    trackEvent('feedback_rating', { rating: surveyData.impression });
    trackEvent('feedback_submit', { form_name: 'survey_form' });
    trackEvent('generate_lead', { form_name: 'survey_form' });

    const { error } = await supabase.from('reviews').insert([{
      user_name: surveyData.userName, review_text: surveyData.reviewText, rating: surveyData.impression,
      time_spent: surveyData.time, device: surveyData.device, functionality_rating: surveyData.functionality,
      convenience_rating: surveyData.convenience, read_others: surveyData.readOthers, useful: surveyData.useful,
      visit_again: surveyData.visitAgain, integrity_viewed: surveyData.integrityViewed, integrity_important: surveyData.integrityImportant,
      watched_video: surveyData.watchedVideo, video_name: surveyData.videoName, video_rating: surveyData.videoRating,
      ab_variant: variant
    }]);

    if (!error) {
      setReviewsList([{ name: surveyData.userName, uni: 'Відгук про платформу', prof: surveyData.time, text: surveyData.reviewText, rating: surveyData.impression, date: Date.now() }, ...reviewsList]);
      setSurveySent(true);
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

  // Оновлені тексти для Варіанта Б (Акцент на доброчесність, антикорупцію та безпеку вступу)
  const heroContent = variant === 'a' ? {
    title: "Обери професію без помилок та марних очікувань",
    subtitle: "Переглядай реальні відеовізитки спеціальностей та знаходь першу роботу чи стажування за допомогою сучасних кар'єрних хабів."
  } : {
    title: "Вступ без корупції: обирай доброчесні університети",
    subtitle: "Захисти своє майбутнє у цифрову епоху. Читай чесні відгуки про виші, повідомляй про порушення анонімно та отримуй рівний доступ до якісної освіти."
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
            <a href="#ecosystem" onClick={(e) => { e.preventDefault(); go('ecosystem', 'nav_ecosystem'); }}>Екосистема</a>
            <a href="#faq" onClick={(e) => { e.preventDefault(); go('faq', 'nav_faq'); }}>FAQ</a>
          </div>
          <button className="btn btn-outline nav-fb" onClick={() => go('cta', 'nav_feedback')}>ЗВОРОТНІЙ ЗВ'ЯЗОК</button>
          <button className={`burger ${menu ? 'open' : ''}`} onClick={() => setMenu((m) => !m)} aria-label="Меню"><i /><i /><i /></button>
        </div>
        <div className={`mobile-menu ${menu ? 'open' : ''}`}>
          <a href="#professions" onClick={(e) => { e.preventDefault(); go('professions', 'nav_mob_professions'); }}>Професії</a>
          <a href="#reviews" onClick={(e) => { e.preventDefault(); go('reviews', 'nav_mob_reviews'); }}>Відгуки</a>
          <a href="#ecosystem" onClick={(e) => { e.preventDefault(); go('ecosystem', 'nav_mob_ecosystem'); }}>Екосистема</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); go('faq', 'nav_mob_faq'); }}>FAQ</a>
          <a href="#cta" onClick={(e) => { e.preventDefault(); go('cta', 'nav_mob_feedback'); }}>Зворотній зв'язок</a>
        </div>
      </nav>

      <header id="top" className="hero">
        <div className="hero-left">
          <div className="hero-toggle">
            <button className={`ht-btn ${activeTab === 'video' ? 'active' : ''}`} onClick={() => go('professions', 'hero_tab_video')}>ВІДЕО ПРО ПРОФЕСІЇ</button>
            <button className={`ht-btn ${activeTab === 'ecosystem' ? 'active' : ''}`} onClick={() => go('ecosystem', 'hero_tab_eco')}>ХАБИ РОЗВИТКУ</button>
          </div>
          <div className="hero-slogan">Обирай свідоме майбутнє</div>
          
          <h1>{heroContent.title.split(':').map((part, i) => i === 1 ? <span key={i}>{part}</span> : part)}</h1>
          <p>{heroContent.subtitle}</p>
          
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => go('professions', 'hero_main_cta')}>Дивитись професії</button>
            <button className="btn btn-outline" onClick={() => go('reviews', 'hero_secondary_cta')}>Чесні відгуки</button>
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

      <section className="marquee-sec">
        <div className="marquee-sub">Нам довіряють провідні хаби та партнери</div>
        <div className="marquee-wrap">
          {[...PARTNERS, ...PARTNERS].map((p, i) => <div key={i} className="marquee-item">{p}</div>)}
        </div>
      </section>

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
        <Reveal className="sec-title"><h2>Чесні відгуки користувачів</h2><p>Дізнайся правду про університети та хаби. Ми формуємо рейтинг якості допомоги, захищаючи тебе від марної витрати часу та ілюзій.</p></Reveal>
        <div className="grid">
          {[...reviewsList].sort((a,b) => b.date - a.date).map((r, i) => (
            <Reveal key={i} delay={Math.min(i, 3) * 0.1} dir="up">
              <div className="review-card">
                <div className="r-head"><div className="r-name">{r.name}</div><div className="r-uni">{r.uni}</div></div>
                <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700' }}>{r.prof}</div>
                <div className="r-text">«{r.text}»</div>
                <div className="r-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div style={{ textAlign: 'center', marginTop: '3.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => {
                setSurveyStep(1); setSurveySent(false);
                setSurveyData({ time: '', device: '', impression: 0, functionality: 0, convenience: 0, readOthers: '', useful: '', visitAgain: '', integrityViewed: '', integrityImportant: '', watchedVideo: '', videoName: '', videoRating: 0, userName: '', reviewText: '' });
                openModal('survey', null);
              }}>
              Пройти опитування та залишити відгук
            </button>
          </div>
        </Reveal>
      </section>

      <section id="ecosystem" className="sec container">
        <Reveal className="sec-title"><h2>Екосистема Розвитку</h2><p>Окрім навчання, місто та онлайн-простір пропонують потужну інфраструктуру: профорієнтаційні центри, ІТ-кластери та молодіжні хаби.</p></Reveal>
        <div className="eco-grid">
          {ECOSYSTEM.map((eco, i) => (
            <Reveal key={i} delay={Math.min(i, 3) * 0.08} dir="up"><div className="eco-card"><div className="eco-icon">{eco.icon}</div><h3>{eco.title}</h3><p>{eco.desc}</p><a href="#top" className="eco-link">{eco.link}</a></div></Reveal>
          ))}
        </div>
      </section>

      <section id="faq" className="sec container">
        <Reveal className="sec-title"><h2>Часті Питання</h2><p>Все, що потрібно знати про відгуки, платформу та професії.</p></Reveal>
        <Reveal delay={0.1}><Accordion faqs={FAQS} /></Reveal>
      </section>

      <section id="cta" className="container">
        <Reveal dir="scale">
          <div className="cta-sec">
            <div className="cta-content">
              <h2>Зворотній зв'язок!</h2>
              <p>Маєш питання або хочеш залишити відгук? Повідомлення про доброчесність та корупцію приймаються анонімно.</p>
              {fb.sent ? (
                <div className="fb-done">✅ Дякуємо! Ми отримали твоє повідомлення.</div>
              ) : (
                <div className="fb-form">
                  <select value={fb.type} onFocus={() => handleFormStart('footer_feedback')} onChange={(e) => setFb({ ...fb, type: e.target.value })}>
                    <option value="feedback">Питання / зворотній зв'язок</option>
                    <option value="corruption">Анонімний відгук про доброчесність в ЗВО</option>
                    <option value="center">Відгук про кар'єрний хаб</option>
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
                  <h3>🏢 Де отримати підтримку (Хаби та центри)</h3><ul>{modal[1].study.map(s => <li key={s}>{s}</li>)}</ul>
                  <h3>🚀 Кар’єрні можливості</h3><ul>{modal[1].opps.map(s => <li key={s}>{s}</li>)}</ul>
                </div>
              </>
            )}

            {modal[0] === 'survey' && (
              <div className="m-body">
                <h2>Опитування користувачів</h2>
                <p>Ваша думка надзвичайно важлива! Дайте відповіді на кілька питань, щоб опублікувати свій відгук.</p>
                {surveySent ? (
                  <div className="fb-done" style={{ background: 'rgba(25, 100, 94, 0.1)', color: 'var(--primary-dark)', marginTop: '2rem' }}>
                      ✅ Дякуємо! Опитування завершено. Ваш відгук успішно збережено в базі та опубліковано на сайті.
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
                        <div className="s-q">Оцініть за шкалою від 1 до 5 враження від платформи *</div>
                        {renderStars('impression', surveyData.impression)}
                        <div className="s-q">Оцініть за шкалою від 1 до 5 функціонал платформи *</div>
                        {renderStars('functionality', surveyData.functionality)}
                        <div className="s-q">Оцініть за шкалою від 1 до 5 зручність платформи *</div>
                        {renderStars('convenience', surveyData.convenience)}
                        <div className="s-nav">
                          <button className="btn btn-primary" disabled={!canGoNext1} onClick={() => setSurveyStep(2)}>Наступний блок →</button>
                        </div>
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
                        <div className="s-q">Чи важлива Вам доброчесність та не корумпованість ЗВО? *</div>
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
                            <div className="s-q">Оцініть враження від 1 до 5 від відео</div>
                            {renderStars('videoRating', surveyData.videoRating)}
                          </>
                        )}
                        <div style={{ borderTop: '1px solid var(--border)', marginTop: '2rem', paddingTop: '1.5rem' }}>
                          <div className="s-q">Публікація відгуку на сайті</div>
                          <input className="s-input" placeholder="Ваше ім'я (можна анонімно) *" value={surveyData.userName} onChange={e => setSurveyData({...surveyData, userName: e.target.value})} />
                          <textarea className="s-textarea" rows="3" placeholder="Напишіть Ваш відгук... *" value={surveyData.reviewText} onChange={e => setSurveyData({...surveyData, reviewText: e.target.value})} />
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