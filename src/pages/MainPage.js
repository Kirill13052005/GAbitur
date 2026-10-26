import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import mascotPhoto from '../assets/mascot-photo.png';

/* ============================================================
   ДАНІ ПЛАТФОРМИ «АБІТУРІЄНТ +»
   ============================================================ */
const CATS = { all: 'Всі напрямки', tech: 'IT / Tech', law: 'Право', med: 'Медицина', business: 'Бізнес', design: 'Креатив' };
const V = 'https://www.w3schools.com/html/mov_bbb.mp4';
const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=60`;

const PROFS = [
  { id: 'swe', cat: 'tech', icon: '💻', title: 'Software Engineer', short: 'Створює застосунки, сайти та складні IT-системи.', full: 'Інженер-програміст проєктує, розробляє, тестує й підтримує програмне забезпечення: від додатків до систем керування. Ідеально для старту після школи або переходу з іншої сфери (світчерів).', poster: U('1555066931-4365d14bab8c'), course: 'tech1', study: ['Харківський обласний центр зайнятості', 'Харківський міський центр зайнятості', 'Youth Career Hub'], opps: ['Робота в глобальних tech-компаніях', 'Віддалена робота', 'Шлях від Trainee до Team Lead'] },
  { id: 'cyber', cat: 'tech', icon: '🛡️', title: 'Фахівець з кібербезпеки', short: 'Захищає дані та системи від хакерських атак.', full: 'Експерт знаходить вразливості раніше за зловмисників. Попит на цю професію шалений серед банків, держави та приватного бізнесу.', poster: U('1526374965328-7f61d4dc18c5'), course: 'tech2', study: ['Харківський обласний центр зайнятості', 'Харківський міський центр зайнятості', 'Youth Career Hub'], opps: ['Банки, фінтех, blockchain', 'Кіберполіція', 'Bug Bounty програми'] },
  { id: 'law', cat: 'law', icon: '⚖️', title: 'Адвокат / Юрист', short: 'Захищає права людей і бізнесу, супроводжує угоди.', full: 'Юрист досконало знає закони й застосовує їх для захисту клієнта. Відмінний вибір для тих, хто має аналітичний склад розуму та ораторські здібності.', poster: U('1589829085413-56de8ae18c73'), course: 'law1', study: ['Харківський обласний центр зайнятості', 'Youth Career Hub'], opps: ['Власна практика', 'Chief Legal Officer', 'Державна служба'] },
  { id: 'pub', cat: 'law', icon: '🏛️', title: 'Публічне управління', short: 'Оптимізує роботу інституцій і громад.', full: 'Для тих, хто хоче змінювати країну: керувати містами, працювати в міністерствах, впроваджувати реформи та розвивати громади.', poster: U('1541872703-74c5e44368f9'), course: 'law2', study: ['Харківський обласний центр зайнятості', 'Харківський міський центр зайнятості'], opps: ['Міністерства', 'Місцеве самоврядування', 'Міжнародні фонди'] },
  { id: 'doc', cat: 'med', icon: '🩺', title: 'Лікар-хірург', short: 'Рятує життя, виконує складні операції.', full: 'Одна з найвідповідальніших професій. Вимагає багаторічного навчання, стресостійкості та ідеального знання анатомії.', poster: U('1579684385127-1ef15d508118'), course: 'med1', study: ['Харківський обласний центр зайнятості', 'Youth Career Hub'], opps: ['Провідні клініки', 'Місії «Лікарі без кордонів»', 'Приватна практика'] },
  { id: 'pm', cat: 'business', icon: '👔', title: 'Project Manager', short: 'Керує створенням продуктів і веде команду до результату.', full: 'Диригент команди: не пише код і не малює дизайн, але робить так, щоб все працювало. Найкраща професія для світчерів з гуманітарною або управлінською базою.', poster: U('1522071820081-009f0129c71c'), course: 'bus1', study: ['Харківський обласний центр зайнятості', 'Харківський міський центр зайнятості', 'Youth Career Hub'], opps: ['IT-компанії', 'R&D хаби', 'Міжнародні агенції'] },
  { id: 'arch', cat: 'design', icon: '🏙️', title: 'Архітектор-урбаніст', short: 'Проєктує будівлі, міські простори та смарт-інфраструктуру.', full: 'Архітектор продумує, як люди житимуть у просторі, як відбудувати міста та зробити їх енергоефективними.', poster: U('1486406146926-c627a92ad1ab'), course: null, study: ['Харківський обласний центр зайнятості', 'Youth Career Hub'], opps: ['Відбудова міст', 'Власне архітектурне бюро', 'Грантові проєкти'] },
  { id: 'data', cat: 'tech', icon: '📊', title: 'Data Scientist', short: 'Аналізує великі дані та навчає штучний інтелект.', full: 'Перетворює хаос даних у бізнес-рішення. Навчає нейромережі. Актуально як для студентів, так і для аналітиків, що хочуть підвищити кваліфікацію.', poster: U('1551288049-bebda4e38f71'), course: 'tech1', study: ['Харківський обласний центр зайнятості', 'Youth Career Hub'], opps: ['Machine Learning', 'FinTech', 'Аналітика'] }
];

const COURSES = [
  { id: 'tech1', cat: 'tech', icon: '💻', title: 'Software Engineering', spec: 'Інженерія / ІТ', tags: ['Алгоритми', 'ООП', 'Python'], desc: 'Логіка програмування, структури даних. Підходить абітурієнтам та світчерам без досвіду.', mods: [['Алгоритмічне мислення', '2 тижні', 'Змінні, цикли, умови.'], ['ООП', '3 тижні', 'Класи, об\'єкти.'], ['Бази даних', '2 тижні', 'Основи SQL.'], ['Проєкт', '2 тижні', 'Власне портфоліо.']] },
  { id: 'tech2', cat: 'tech', icon: '🔐', title: 'Основи кібербезпеки', spec: 'Кібербезпека', tags: ['Мережі', 'Linux'], desc: 'Основи для майбутніх захисників даних.', mods: [['Архітектура мереж', '2 тижні', 'OSI, TCP/IP.'], ['Linux', '2 тижні', 'Права доступу, bash.'], ['WEB вразливості', '3 тижні', 'SQLi, XSS.']] },
  { id: 'law1', cat: 'law', icon: '⚖️', title: 'Основи юриспруденції', spec: 'Право', tags: ['Закони', 'Судочинство'], desc: 'База для вступу на юридичний або розширення кругозору.', mods: [['Теорія права', '2 тижні', 'Норми та закони.'], ['Цивільне право', '3 тижні', 'Договори.'], ['Кримінальний процес', '2 тижні', 'Суд.']] },
  { id: 'law2', cat: 'law', icon: '🏛️', title: 'Публічне управління', spec: 'Держ. управління', tags: ['Влада', 'Громади'], desc: 'Місцеве самоврядування та електронна демократія.', mods: [['Система влади', '2 тижні', 'Повноваження.'], ['Децентралізація', '2 тижні', 'Бюджети.'], ['Лідерство', '1 тиждень', 'Управління.']] },
  { id: 'med1', cat: 'med', icon: '🫀', title: 'Анатомія та біологія', spec: 'Медицина', tags: ['Анатомія', 'Біологія'], desc: 'Обов’язкова база перед вступом до медуніверситету.', mods: [['Опорно-руховий', '3 тижні', 'Скелет, м’язи.'], ['Серцево-судинна', '2 тижні', 'Кров, серце.'], ['Нервова система', '3 тижні', 'Мозок.']] },
  { id: 'bus1', cat: 'business', icon: '🚀', title: 'Project Management', spec: 'Менеджмент', tags: ['Проєкти', 'Лідерство'], desc: 'Курс для майбутніх PM-ів. Ідеально для швидкого старту в ІТ нетехнічним фахівцям.', mods: [['Бізнес-моделі', '2 тижні', 'Canvas.'], ['Agile & Scrum', '3 тижні', 'Спринти, таски.'], ['Soft Skills', '2 тижні', 'Комунікація.']] },
];

const REVIEWS = [
  { name: 'Олександр Т.', uni: 'Youth Career Hub', prof: 'Software Engineering', text: 'Дуже допомогли з профорієнтацією. Консультанти сучасні, направили на правильні курси. Відгуки на цій платформі допомогли обрати саме цей кар\'єрний центр.', rating: 5 },
  { name: 'Марія В.', uni: 'Харківський обласний центр зайнятості', prof: 'Право', text: 'Дуже важливо було знайти правильний шлях. Завдяки їхнім безкоштовним консультаціям обрала правильний напрямок.', rating: 5 },
  { name: 'Денис К.', uni: 'Харківський міський центр зайнятості', prof: 'Кібербезпека', text: 'Хороша база вакансій та курсів для старту. Добре, що я знав куди звернутися заздалегідь з рекомендацій на "Абітурієнт+".', rating: 4 }
];

const TIMELINE = [
  { step: '01', title: 'Подолання невизначеності', desc: 'Перегляд відеовізиток спеціальностей. Свідомий вибір напрямку без завищених очікувань.' },
  { step: '02', title: 'Консультація в Центрі Зайнятості', desc: 'Звернення до центрів зайнятості Харкова. Отримання фахової допомоги у виборі напрямку та підтримки.' },
  { step: '03', title: 'Підготовка', desc: 'Проходження базових онлайн-курсів на платформі для набуття перших навичок.' },
  { step: '04', title: 'Працевлаштування та Розвиток', desc: 'Пошук роботи та стажування. Долучення до екосистеми кар\'єрних хабів міста.' }
];

const ECOSYSTEM = [
  { icon: '🌐', title: 'Kharkiv IT Cluster', desc: 'Об\'єднання провідних ІТ-компаній. Можливість знайти ментора, потрапити на стажування та дізнатися про тренди.', link: 'Дізнатись більше' },
  { icon: '🎯', title: 'Профорієнтаційні центри', desc: 'Спеціалізовані хаби міста для тестування здібностей та подолання невизначеності у виборі.', link: 'Записатись на тест' },
  { icon: '🤝', title: 'Центри зайнятості', desc: 'Офіційні установи Харкова для підбору вакансій, курсів та кар\'єрного супроводу безкоштовно.', link: 'Долучитись' },
];

const FAQS = [
  { q: 'Як ви перевіряєте чесність відгуків?', a: 'Ми запровадили систему верифікації. Модеруємо відгуки, щоб висвітлювати реальний стан речей щодо якості консультацій у центрах зайнятості та кар\'єрних хабах.' },
  { q: 'Для кого створена платформа «Абітурієнт +»?', a: 'Платформа об\'єднує школярів (подолання невизначеності), шукачів роботи та дорослих, які вирішили змінити професію (світчерів).' },
  { q: 'Чи безкоштовні відеовізитки та курси?', a: 'Так! Наша мета — надати кожному рівний доступ до усвідомленого вибору професії. Усі матеріали безкоштовні.' },
  { q: 'Які організації є партнерами?', a: 'Ми співпрацюємо з: Харківським обласним центром зайнятості, міськими центрами, Youth Career Hub та Kharkiv IT Cluster.' }
];

const PARTNERS = ['Харківський обласний центр зайнятості', 'Харківський міський центр зайнятості', 'Youth Career Hub', 'Kharkiv IT Cluster', 'Профорієнтаційні центри Харкова'];

const NAV_LINKS = [['professions', 'Професії'], ['courses', 'Курси'], ['timeline', 'План дій'], ['analytics', 'Аналітика'], ['faq', 'FAQ']];
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

// 3D-tilt лише для пристроїв з мишею; на тачах вимкнено (економія ресурсів)
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
   КОМПОНЕНТИ
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

/* ============================================================
   БЛОК ПСЕВДО-АНАЛІТИКИ MVP (ІНТЕРАКТИВНИЙ A/B ТЕСТ)
   ============================================================ */
const AB_DATA = {
  A: [
    { label: 'Переходів на демо', val: '28', icon: '🖱️' },
    { label: 'Середній час', val: '1 хв 45 с', icon: '⏱️' },
    { label: 'Конверсія', val: '14%', icon: '📉' },
    { label: 'Соціальний імпакт', val: '45%', icon: '🌱' }
  ],
  B: [
    { label: 'Переходів на демо', val: '43', icon: '🖱️' },
    { label: 'Середній час', val: '4 хв 20 с', icon: '⏱️' },
    { label: 'Конверсія', val: '38% (+24%)', icon: '📈' },
    { label: 'Соціальний імпакт', val: '87%', icon: '🔥' }
  ]
};

const MVP_STEPS = [
  { num: '1', text: 'Запустили свій MVP у контрольованому середовищі (лендінг, демо-версія, тестова сторінка) та провели A/B тести, щоб порівняти різні варіанти продукту або повідомлення.' },
  { num: '2', text: 'Зібрали аналітику користувацької поведінки — кількість переходів, кліків, часу взаємодії, запитів тощо.' },
  { num: '3', text: 'Оформили результати у таблицях або коротких звітах, де показали кількісні та якісні докази потенціалу product-market fit. Обов’язково додали сталу змінну — реакцію на соціальні чи етичні елементи.' }
];

const AnalyticsDashboard = React.memo(() => {
  const [variant, setVariant] = useState('B');

  return (
    <section id="analytics" className="container sec">
      <Reveal dir="scale">
        <div className="analytics-wrap">
          <div className="a-header">
            <h2>Інтерактивний A/B Тест</h2>
            <p>Натисніть на кнопки нижче, щоб побачити, як стала змінна (соціальний імпакт та етичність) вплинула на поведінку користувачів та Product-Market Fit.</p>
          </div>

          <div className="ab-toggle">
            <button className={variant === 'A' ? 'active' : ''} onClick={() => setVariant('A')}>
              Варіант A <small>(Базовий MVP)</small>
            </button>
            <button className={variant === 'B' ? 'active' : ''} onClick={() => setVariant('B')}>
              Варіант B <small>(З етичною змінною)</small>
            </button>
          </div>

          <div className="stat-grid">
            {AB_DATA[variant].map((s, i) => (
              <div key={`${variant}-${i}`} className="stat-box ab-anim">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-val" style={{ color: variant === 'B' && i >= 2 ? '#50E3C2' : '#fff' }}>{s.val}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="a-divider"><span>Методологія тестування</span></div>

          <div className="steps-container">
            {MVP_STEPS.map((step, i) => (
              <div key={i} className="m-step-card">
                <div className="m-step-num">{step.num}</div>
                <div className="m-step-text">{step.text}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
});

/* ============================================================
   AI-ЛОГІКА
   ============================================================ */
function askHarik(q) {
  const s = q.toLowerCase();
  const prof = PROFS.find((p) => s.includes(p.title.toLowerCase().split(' ')[0].slice(0, 5)) || s.includes(p.id));
  let course = COURSES.find((c) => c.tags.some((t) => s.includes(t.toLowerCase())));

  if (!course) {
    if (s.includes('управлін') || s.includes('держ') || s.includes('менеджмент')) {
      course = COURSES.find(c => c.id === 'law2');
    } else if (s.includes('медиц') || s.includes('лікар') || s.includes('біолог') || s.includes('анатом')) {
      course = COURSES.find(c => c.id === 'med1');
    } else if (s.includes('іт') || s.includes('it') || s.includes('програм') || s.includes('розроб')) {
      course = COURSES.find(c => c.id === 'tech1');
    } else if (s.includes('кібер') || s.includes('безпек') || s.includes('хакер')) {
      course = COURSES.find(c => c.id === 'tech2');
    } else if (s.includes('прав') || s.includes('юрист') || s.includes('адвокат') || s.includes('закон')) {
      course = COURSES.find(c => c.id === 'law1');
    } else if (s.includes('проєкт') || s.includes('pm') || s.includes('бізнес')) {
      course = COURSES.find(c => c.id === 'bus1');
    }
  }

  if (/привіт|вітаю|hello|hi\b/.test(s)) return { text: 'Привіт! Я Харік 🦝 Ментор платформи "Абітурієнт +". Допомагаю свідомо обрати професію та знайти свій центр зайнятості. Що шукаємо?' };
  if (/відгук|корупц|хабар|чесн/.test(s)) return { text: 'Наш пріоритет — прозорість. Користувачі залишають реальні відгуки про кар\'єрні центри Харкова. Який напрямок тебе цікавить?' };
  if (/змін|світч|нову|перейти|доросл/.test(s)) return { text: 'Змінювати професію ніколи не пізно! Багато хто звертається в центри зайнятості за консультацією. Хочеш подивитись базовий курс?', open: ['course', COURSES.find(c => c.id === 'bus1')] };
  if (/куди|звернут|допомог|центр|зайнят/.test(s)) {
    if (prof) return { text: `Для «${prof.title}» рекомендуємо звернутися до: ${prof.study.join(', ')}. Там допоможуть з працевлаштуванням!`, open: ['prof', prof] };
    return { text: 'Назви професію — і я підберу для тебе найближчий центр зайнятості у Харкові.' };
  }
  if (/курс|підготов|рекомендац/.test(s)) {
    const c = course || (prof && COURSES.find((x) => x.id === prof.course)) || COURSES[0];
    return { text: `Кожен курс має силабус з модулями та тривалістю. Рекомендую «${c.title}». Тисни «СИЛАБУС»! 📚`, open: ['course', c] };
  }
  if (prof) return { text: `Чудовий вибір! ${prof.short} Показати відео-огляд очікування/реальність?`, open: ['prof', prof] };

  return { text: 'Спробуй запитати: «куди звернутись юристу?», «курси з управління» або «центри зайнятості».' };
}

/* ---------- Меню чатбота (як у Telegram-боті) ---------- */
const BACK = { label: '⬅️ Головне меню', a: ['main'] };
const MAIN_MENU = [
  { label: '🎓 Знайти курс', a: ['cats'] },
  { label: '💬 Підтримка', a: ['support'] },
  { label: '✍️ Залишити відгук', a: ['review'] },
];

function menuReply([t, v]) {
  if (t === 'cats') return { text: 'Обери напрямок:', kb: [...Object.entries(CATS).filter(([k]) => k !== 'all').map(([k, l]) => ({ label: l, a: ['cat', k] })), BACK] };
  if (t === 'cat') return { text: 'Доступні курси:', kb: [...COURSES.filter((c) => c.cat === v).map((c) => ({ label: `${c.icon} ${c.title}`, a: ['course', c.id] })), { label: '⬅️ Напрямки', a: ['cats'] }] };
  if (t === 'course') {
    const c = COURSES.find((x) => x.id === v);
    return { text: `«${c.title}» — ${c.desc}`, kb: [{ label: '📚 Відкрити силабус', a: ['open', c.id] }, { label: '⬅️ Назад', a: ['cat', c.cat] }] };
  }
  if (t === 'support') return { text: 'Чим допомогти?', kb: [{ label: '🏢 Центри зайнятості', a: ['centers'] }, { label: '📝 Написати нам', a: ['form', 'feedback'] }, BACK] };
  if (t === 'centers') return { text: `Наші партнери в Харкові: ${PARTNERS.slice(0, 3).join(', ')}. Безкоштовні консультації та допомога з працевлаштуванням.`, kb: [{ label: '📝 Написати нам', a: ['form', 'feedback'] }, BACK] };
  if (t === 'review') return { text: 'Відгуки про корупцію приймаються анонімно: з авторизацією та фільтрацією контенту. Про що відгук?', kb: [{ label: '🏛️ Корупція в ЗВО (анонімно)', a: ['form', 'corruption'] }, { label: '🏢 Центр зайнятості', a: ['form', 'center'] }, BACK] };
  return { text: 'Що потрібно?', kb: MAIN_MENU };
}

const Assistant = React.memo(({ onOpen, onForm }) => {
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState(false);
  const [msgs, setMsgs] = useState([{ from: 'bot', text: 'Привіт! Я Харік — AI-ментор "Абітурієнт +". Обери, що потрібно 👇', kb: MAIN_MENU }]);
  const [val, setVal] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef(null);

  useEffect(() => { if (open) end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, busy, open]);

  // На телефоні чат — на весь екран: блокуємо скрол сторінки під ним
  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 600px)').matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const reply = (r) => {
    setBusy(true);
    setTimeout(() => { setMsgs((m) => [...m, { from: 'bot', ...r }]); setBusy(false); }, 500);
  };

  const press = (b) => {
    if (busy) return;
    setDd(false);
    setMsgs((m) => [...m, { from: 'me', text: b.label }]);
    const [t, x] = b.a;
    if (t === 'open') { onOpen('course', COURSES.find((c) => c.id === x)); return reply({ text: 'Відкрив силабус 📚', kb: [BACK] }); }
    if (t === 'form') {
      if (window.matchMedia('(max-width: 600px)').matches) setOpen(false);
      onForm(x);
      return reply({ text: 'Форма внизу сторінки, я прокрутив до неї ⬇️', kb: [BACK] });
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
   СТИЛІ (CSS-in-JS String)
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

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Montserrat', sans-serif; background: var(--bg-main); color: var(--text-dark); line-height: 1.6; overflow-x: hidden; overflow-x: clip; -webkit-tap-highlight-color: transparent; }
button { font-family: inherit; cursor: pointer; border: 0; background: none; color: inherit; outline: none; }
a { text-decoration: none; color: inherit; }
ul, ol { list-style: none; }

::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: var(--bg-main); }
::-webkit-scrollbar-thumb { background: var(--primary-light); border-radius: 5px; }

@keyframes rv-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }
.glass { background: var(--bg-glass); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.7); }

.progress-bar { position: fixed; top: 0; left: 0; right: 0; height: 4px; background: var(--secondary); transform: scaleX(0); transform-origin: left; z-index: 300; will-change: transform; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 1.1rem 2.6rem; border-radius: 50px; font-weight: 800; font-size: 0.95rem; text-transform: uppercase; transition: all 0.3s var(--ease-spring); overflow: hidden; position: relative; z-index: 1; letter-spacing: 0.5px; }
.btn::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); transform: skewX(-20deg); transition: 0.5s; z-index: -1; }
.btn:hover::after { left: 150%; transition: 0.7s ease-in-out; }
.btn-primary { background: var(--primary); color: #fff; box-shadow: 0 8px 25px rgba(25, 100, 94, 0.3); }
.btn-primary:hover { background: var(--primary-dark); transform: translateY(-4px); box-shadow: 0 12px 30px rgba(16, 64, 60, 0.4); }
.btn-yellow { background: var(--secondary); color: var(--primary-dark); box-shadow: 0 8px 25px rgba(243, 183, 47, 0.3); }
.btn-yellow:hover { background: var(--secondary-hover); transform: translateY(-4px); box-shadow: 0 12px 30px rgba(243, 183, 47, 0.4); }
.btn-outline { border: 2px solid var(--primary); color: var(--primary); font-weight: 800; }
.btn-outline:hover { background: var(--primary); color: #fff; }

.blobs-wrap { position: fixed; inset: 0; pointer-events: none; z-index: -1; overflow: hidden; background: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(179, 219, 214, 0.4) 0%, transparent 50%); }
.blob { position: absolute; border-radius: 50%; background: #fff; box-shadow: 0 0 40px rgba(255,255,255,0.8); }
.c1 { width: 60px; height: 60px; top: 10%; left: 5%; animation: floatSlow 15s ease-in-out infinite alternate; }
.c2 { width: 80px; height: 80px; top: 30%; right: 15%; animation: floatSlow 20s ease-in-out infinite alternate-reverse; }

@keyframes floatSlow { 0% { transform: scale(1) translate(0, 0); } 100% { transform: scale(1.1) translate(40px, 30px); } }

.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; transition: all 0.4s var(--ease); padding: 1.5rem 0; }
.nav.scrolled { padding: 0.8rem 0; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); box-shadow: var(--shadow-sm); border-bottom: 1px solid rgba(255,255,255,0.8); animation: slideDown 0.5s ease; }
@keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }
.nav-inner { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.logo { font-size: 1.6rem; font-weight: 900; color: var(--primary-dark); display: flex; align-items: center; gap: 0.5rem; letter-spacing: -0.5px; }
.logo span { color: var(--secondary); font-size: 1.8rem; }
.logo-icon { display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; background: var(--primary); color: #fff; border-radius: 12px; font-size: 1.3rem; transform: rotate(-8deg); transition: transform 0.4s var(--ease-spring); }
.logo:hover .logo-icon { transform: rotate(8deg) scale(1.15); }
.nav-links { display: flex; gap: 2rem; background: var(--bg-glass); padding: 0.8rem 2.5rem; border-radius: 50px; border: 1px solid rgba(25, 100, 94, 0.1); box-shadow: var(--shadow-sm); }
.nav-links a { font-weight: 700; font-size: 0.9rem; color: var(--text-mut); transition: color 0.3s, transform 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
.nav-links a:hover { color: var(--primary); transform: translateY(-2px); }

/* ---------- Бургер і мобільне меню ---------- */
.burger { display: none; width: 46px; height: 46px; border-radius: 14px; background: var(--primary); flex-direction: column; justify-content: center; align-items: center; gap: 5px; flex-shrink: 0; }
.burger i { display: block; width: 22px; height: 2.5px; background: #fff; border-radius: 2px; transition: transform 0.3s, opacity 0.3s; }
.burger.open i:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
.burger.open i:nth-child(2) { opacity: 0; }
.burger.open i:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }
.mobile-menu { display: none; }

/* ---------- HERO 50/50 ---------- */
.hero { min-height: 100vh; min-height: 100svh; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 2rem; padding: 8rem 5vw 200px; position: relative; overflow: hidden; text-align: left; }
.hero-left { position: relative; z-index: 2; }
.hero-toggle { display: inline-flex; background: #fff; border-radius: 50px; padding: 0.4rem; box-shadow: var(--shadow-sm); margin-bottom: 2rem; animation: rv-up 0.8s var(--ease); }
.ht-btn { padding: 1rem 2rem; font-weight: 800; font-size: 0.9rem; color: var(--text-mut); border-radius: 50px; text-transform: uppercase; transition: all 0.3s; }
.ht-btn.active { background: var(--primary); color: #fff; box-shadow: 0 4px 15px rgba(25, 100, 94, 0.3); }
.hero-slogan { display: inline-block; background: var(--secondary); color: var(--primary-dark); font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; font-size: 0.85rem; padding: 0.5rem 1.2rem; border-radius: 50px; margin-bottom: 1.5rem; display: table; }
.hero h1 { font-size: clamp(2.2rem, 3.6vw, 3.6rem); font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -1px; color: var(--primary-dark); animation: rv-up 1s var(--ease); }
.hero h1 span { color: var(--primary-light); display: block; }
.hero p { font-size: 1.05rem; color: var(--text-mut); margin-bottom: 2rem; max-width: 620px; font-weight: 600; animation: rv-up 1.2s var(--ease); }
.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
.hero-right { position: relative; z-index: 2; display: flex; justify-content: center; align-items: flex-end; min-height: 560px; }
.hero-mascot { width: 100%; height: min(620px, 70vh); background-size: contain; background-position: center bottom; background-repeat: no-repeat; filter: drop-shadow(0 20px 25px rgba(0,0,0,0.25)); animation: floatSlow 6s ease-in-out infinite alternate; }
.hero-assist { position: absolute; top: 0; left: 0; background: #fff; padding: 1.3rem; border-radius: 20px; border: 2px solid var(--primary); box-shadow: var(--shadow-lg); width: 290px; z-index: 10; text-align: left; }
.hero-assist::after { content: ''; position: absolute; bottom: -12px; left: 60px; border-width: 12px 12px 0; border-style: solid; border-color: var(--primary) transparent transparent; }
.ha-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
.ha-head b { font-size: 0.9rem; font-weight: 900; color: var(--primary-dark); text-transform: uppercase; letter-spacing: 1px; }
.hero-assist .badge { background: var(--primary); color: #fff; font-size: 0.7rem; padding: 3px 8px; border-radius: 50px; font-weight: 800; }
.hero-assist p { font-size: 0.9rem; color: var(--text-dark); margin: 0; line-height: 1.5; font-weight: 600; max-width: none; animation: none; }

.skyline { position: absolute; bottom: 0; left: 0; width: 100%; height: 250px; display: flex; align-items: flex-end; gap: 4px; z-index: 1; justify-content: center; padding: 0 2vw; pointer-events: none; }
.sk-b { background: var(--primary); opacity: 0.85; width: calc(100% / 12); border-radius: 4px 4px 0 0; position: relative; animation: buildUp 1s var(--ease-spring) forwards; transform-origin: bottom; transform: scaleY(0); }
.sk-b::after { content: ''; position: absolute; top: 10%; left: -20%; width: 140%; height: 100%; background: var(--primary-light); opacity: 0.4; border-radius: 4px 4px 0 0; z-index: -1; }
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
.sec-title h2 { font-size: clamp(2.2rem, 4vw, 3.5rem); font-weight: 900; color: var(--primary-dark); margin-bottom: 1rem; letter-spacing: -1px; }
.sec-title p { color: var(--text-mut); font-size: 1.15rem; max-width: 650px; margin: 0 auto; font-weight: 500; }

.filters { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-bottom: 4rem; }
.filter-btn { padding: 0.9rem 2rem; background: var(--bg-card); border: 2px solid var(--border); border-radius: 50px; font-weight: 800; color: var(--text-mut); transition: all 0.3s var(--ease-spring); box-shadow: var(--shadow-sm); font-size: 0.95rem; }
.filter-btn:hover { border-color: var(--primary-light); color: var(--primary); transform: translateY(-3px); box-shadow: var(--shadow-md); }
.filter-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); box-shadow: 0 10px 20px rgba(25, 100, 94, 0.3); transform: scale(1.05); }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr)); gap: 2.5rem; }
.tilt-card { background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 0.1s, box-shadow 0.3s, border-color 0.3s; display: flex; flex-direction: column; cursor: pointer; height: 100%; transform-style: preserve-3d; position: relative; }
.tilt-card:hover { box-shadow: var(--shadow-lg); z-index: 2; border-color: var(--primary-light); }

.prof-thumb { height: 240px; background-size: cover; background-position: center; position: relative; border-bottom: 1px solid var(--border); }
.prof-thumb::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(16, 64, 60, 0.8), transparent); opacity: 0.7; transition: opacity 0.3s; }
.tilt-card:hover .prof-thumb::after { opacity: 0.9; }
.play-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) translateZ(40px); width: 68px; height: 68px; background: rgba(255,255,255,0.25); backdrop-filter: blur(10px); border: 2px solid #fff; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 1.6rem; transition: all 0.4s var(--ease-spring); z-index: 2; }
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
.r-stars { color: var(--secondary); margin-top: 1.5rem; font-size: 1.2rem; }

.course-card { padding: 2.5rem; display: flex; flex-direction: column; height: 100%; position: relative; overflow: hidden; background: #fff; }
.course-card::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: linear-gradient(90deg, var(--primary), var(--secondary)); transform: scaleX(0); transform-origin: left; transition: transform 0.4s var(--ease); }
.tilt-card:hover.course-card::after { transform: scaleX(1); }
.c-head { display: flex; gap: 1.5rem; align-items: flex-start; margin-bottom: 1.5rem; transform: translateZ(30px); }
.c-icon { font-size: 2.5rem; background: var(--bg-main); width: 75px; height: 75px; display: flex; align-items: center; justify-content: center; border-radius: 20px; border: 1px solid var(--border); transition: transform 0.5s var(--ease-spring), box-shadow 0.3s; color: var(--primary-dark); flex-shrink: 0; }
.tilt-card:hover .c-icon { transform: rotate(-10deg) scale(1.15) translateZ(20px); box-shadow: 0 10px 20px rgba(25, 100, 94, 0.15); }
.c-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.c-tags span { background: rgba(25, 100, 94, 0.08); color: var(--primary-dark); font-size: 0.75rem; font-weight: 800; padding: 0.4rem 0.8rem; border-radius: 8px; text-transform: uppercase; }
.course-card h3 { font-size: 1.45rem; font-weight: 900; margin-bottom: 0.5rem; transform: translateZ(20px); color: var(--text-dark); }
.course-card p { color: var(--text-mut); font-size: 0.95rem; margin-bottom: 1.5rem; flex: 1; transform: translateZ(20px); font-weight: 500; }
.course-card ul { background: var(--bg-main); padding: 1.5rem; border-radius: 16px; font-size: 0.95rem; transform: translateZ(20px); border: 1px solid var(--border); }
.course-card li { display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.6rem; color: var(--text-dark); font-weight: 700; line-height: 1.4; }
.course-card li::before { content: '✓'; color: var(--secondary); font-weight: 900; font-size: 1.1rem; }
.course-card li.mut { color: var(--text-mut); font-weight: 600; font-style: italic; }
.course-card li.mut::before { content: '+'; color: var(--primary); }

.timeline { position: relative; max-width: 900px; margin: 0 auto; }
.timeline::before { content: ''; position: absolute; top: 0; bottom: 0; left: 30px; width: 4px; background: var(--border); border-radius: 4px; }
.tl-item { position: relative; padding-left: 90px; margin-bottom: 4rem; cursor: default; }
.tl-item:last-child { margin-bottom: 0; }
.tl-dot { position: absolute; left: 16px; top: 0; width: 32px; height: 32px; border-radius: 50%; background: var(--bg-main); border: 4px solid var(--primary-light); box-shadow: 0 0 0 6px #fff; transition: all 0.4s var(--ease-spring); z-index: 2; }
.tl-item:hover .tl-dot { transform: scale(1.3); background: var(--secondary); border-color: var(--secondary); box-shadow: 0 0 15px rgba(243, 183, 47, 0.5), 0 0 0 6px #fff; }
.tl-item::after { content: ''; position: absolute; left: 30px; top: 32px; width: 4px; height: 0; background: linear-gradient(to bottom, var(--secondary), var(--primary)); transition: height 0.5s ease; z-index: 1; }
.tl-item:hover::after { height: calc(100% + 4rem - 32px); }
.tl-content { background: #fff; padding: 2.5rem; border-radius: 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); transition: transform 0.4s var(--ease-spring), box-shadow 0.4s; position: relative; }
.tl-item:hover .tl-content { transform: translateX(15px); box-shadow: var(--shadow-md); border-color: var(--primary-light); }
.tl-step { position: absolute; top: -15px; right: 2.5rem; background: var(--primary-dark); color: #fff; font-weight: 900; font-size: 1.2rem; padding: 0.5rem 1.2rem; border-radius: 12px; box-shadow: 0 5px 15px rgba(16, 64, 60, 0.3); }
.tl-content h3 { font-size: 1.5rem; font-weight: 900; margin-bottom: 0.5rem; color: var(--primary-dark); }
.tl-content p { color: var(--text-mut); font-size: 1.05rem; font-weight: 600; }

.eco-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 2.5rem; }
.eco-card { background: #fff; padding: 3rem 2.5rem; border-radius: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); position: relative; transition: transform 0.4s var(--ease-spring), box-shadow 0.4s; text-align: center; }
.eco-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-md); border-color: var(--primary-light); }
.eco-icon { font-size: 4rem; margin-bottom: 1.5rem; display: inline-block; animation: floatSlow 4s ease-in-out infinite alternate; }
.eco-card h3 { font-size: 1.4rem; font-weight: 900; color: var(--primary-dark); margin-bottom: 1rem; }
.eco-card p { font-size: 1.05rem; color: var(--text-mut); margin-bottom: 2rem; font-weight: 500; }
.eco-link { display: inline-block; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; padding-bottom: 5px; border-bottom: 2px solid var(--secondary); transition: color 0.3s, border-color 0.3s; }
.eco-card:hover .eco-link { color: var(--secondary); border-color: var(--primary); }

.accordion { max-width: 850px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.2rem; }
.acc-item { background: #fff; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all 0.3s; cursor: pointer; box-shadow: var(--shadow-sm); }
.acc-item:hover { border-color: var(--primary); box-shadow: var(--shadow-md); transform: translateX(5px); }
.acc-head { padding: 1.8rem 2.2rem; display: flex; justify-content: space-between; align-items: center; }
.acc-head h4 { font-size: 1.15rem; font-weight: 800; color: var(--primary-dark); padding-right: 2rem; }
.acc-ico { font-size: 1.8rem; font-weight: 300; transition: transform 0.4s var(--ease-spring); color: var(--primary); background: var(--bg-main); width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
.acc-item.open .acc-ico { transform: rotate(45deg); background: var(--primary); color: #fff; }
.acc-body { max-height: 0; overflow: hidden; transition: max-height 0.5s var(--ease), padding 0.5s var(--ease), opacity 0.5s; padding: 0 2.2rem; opacity: 0; }
.acc-item.open .acc-body { max-height: 300px; padding: 0 2.2rem 1.8rem; opacity: 1; }
.acc-body p { color: var(--text-mut); font-size: 1.05rem; font-weight: 500; }

.cta-sec { margin-top: 5rem; padding: 7rem 2rem; border-radius: 32px; background: linear-gradient(135deg, var(--primary-dark), var(--primary)); text-align: center; color: #fff; position: relative; overflow: hidden; box-shadow: 0 30px 60px rgba(16, 64, 60, 0.4); }
.cta-sec::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(243, 183, 47, 0.15), transparent 50%), radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.1), transparent 50%); }
.cta-content { position: relative; z-index: 2; max-width: 700px; margin: 0 auto; }
.cta-sec h2 { font-size: clamp(2.4rem, 4.5vw, 3.8rem); font-weight: 900; margin-bottom: 1.5rem; letter-spacing: -1px; }
.cta-sec p { font-size: 1.2rem; margin-bottom: 3rem; opacity: 0.9; font-weight: 500; }

.fb-form { display: flex; flex-direction: column; gap: 1rem; text-align: left; }
.fb-form select, .fb-form textarea, .fb-form input { width: 100%; padding: 1rem 1.3rem; border-radius: 16px; border: 2px solid transparent; font-family: inherit; font-size: 1rem; font-weight: 600; outline: none; background: rgba(255,255,255,0.95); color: var(--text-dark); }
.fb-form select:focus, .fb-form textarea:focus, .fb-form input:focus { border-color: var(--secondary); }
.fb-form .btn:disabled { opacity: 0.5; pointer-events: none; }
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

/* ---------- ЧАТБОТ ---------- */
.ai { position: fixed; right: 30px; bottom: 30px; z-index: 200; display: flex; flex-direction: column; align-items: flex-end; gap: 1.2rem; }
.ai-fab { width: 75px; height: 75px; border-radius: 50%; background: #fff; border: 3px solid var(--primary); box-shadow: var(--shadow-lg); cursor: pointer; position: relative; overflow: hidden; transition: transform 0.3s var(--ease-spring), opacity 0.3s; }
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

.m-mods { display: flex; flex-direction: column; gap: 1.2rem; counter-reset: mod; margin-top: 2rem; }
.m-mod { background: var(--bg-main); border: 1px solid var(--border); border-radius: 16px; padding: 1.8rem; position: relative; padding-left: 4.5rem; opacity: 0; animation: slideInRight 0.5s var(--ease-spring) forwards; }
.m-mod:nth-child(1) { animation-delay: 0.1s; }
.m-mod:nth-child(2) { animation-delay: 0.2s; }
.m-mod:nth-child(3) { animation-delay: 0.3s; }
.m-mod:nth-child(4) { animation-delay: 0.4s; }
@keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }

.m-mod::before { counter-increment: mod; content: '0' counter(mod); position: absolute; left: 1.5rem; top: 1.8rem; font-weight: 900; font-size: 1.2rem; color: var(--primary-light); opacity: 0.6; }
.m-mod-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.m-mod-head h4 { font-size: 1.2rem; font-weight: 900; color: var(--text-dark); }
.m-mod-head span { background: rgba(25, 100, 94, 0.1); color: var(--primary-dark); font-weight: 800; font-size: 0.85rem; padding: 0.4rem 1rem; border-radius: 50px; text-transform: uppercase; }
.m-mod p { color: var(--text-mut); font-size: 1rem; font-weight: 500; margin: 0; }

/* ---------- ПСЕВДО-АНАЛІТИКА (DARK DASHBOARD) ---------- */
.analytics-wrap { background: linear-gradient(145deg, #0f2027, #203a43, #2c5364); border-radius: 40px; padding: 5rem 3rem; color: #fff; box-shadow: 0 30px 60px rgba(0,0,0,0.3); position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
.analytics-wrap::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(80, 227, 194, 0.05) 0%, transparent 50%); animation: rotateBg 20s linear infinite; pointer-events: none; }
@keyframes rotateBg { to { transform: rotate(360deg); } }
.a-header { text-align: center; margin-bottom: 4rem; position: relative; z-index: 2; }
.a-header h2 { font-size: clamp(2rem, 3vw, 2.8rem); font-weight: 900; margin-bottom: 1rem; background: linear-gradient(90deg, #fff, #50E3C2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.a-header p { color: rgba(255,255,255,0.7); font-size: 1.1rem; font-weight: 500; }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 4rem; position: relative; z-index: 2; }
.stat-box { background: rgba(255,255,255,0.03); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 2rem 1.5rem; text-align: center; transition: transform 0.3s, background 0.3s, border-color 0.3s; }
.stat-box:hover { transform: translateY(-8px); background: rgba(255,255,255,0.06); border-color: #50E3C2; box-shadow: 0 15px 30px rgba(0,0,0,0.2); }
.stat-icon { font-size: 2.2rem; margin-bottom: 1rem; filter: drop-shadow(0 0 10px rgba(255,255,255,0.2)); }
.stat-val { font-size: 2.5rem; font-weight: 900; color: #fff; margin-bottom: 0.3rem; letter-spacing: 1px; transition: color 0.3s; }
.stat-lbl { font-size: 0.85rem; font-weight: 700; color: #50E3C2; text-transform: uppercase; letter-spacing: 1.5px; }
.a-divider { text-align: center; margin-bottom: 3rem; position: relative; z-index: 2; }
.a-divider span { display: inline-block; background: rgba(0,0,0,0.3); padding: 0.8rem 1.5rem; border-radius: 50px; font-size: 0.9rem; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 2px; border: 1px solid rgba(255,255,255,0.05); }
.steps-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 2rem; position: relative; z-index: 2; }
.m-step-card { background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(80, 227, 194, 0.15); border-radius: 20px; padding: 2.5rem 2rem; transition: all 0.4s cubic-bezier(0.25, 1, 0.2, 1); }
.m-step-card:hover { border-color: #50E3C2; box-shadow: 0 0 25px rgba(80, 227, 194, 0.15); background: rgba(0, 0, 0, 0.4); }
.m-step-num { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #50E3C2; color: #000; font-weight: 900; border-radius: 10px; margin-bottom: 1.5rem; font-size: 1.2rem; box-shadow: 0 0 15px rgba(80, 227, 194, 0.4); }
.m-step-text { color: #d1d5db; font-size: 0.95rem; line-height: 1.6; font-weight: 500; }

/* Перемикач A/B тесту */
.ab-toggle { display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 3.5rem; position: relative; z-index: 2; flex-wrap: wrap; }
.ab-toggle button { background: rgba(255,255,255,0.03); border: 2px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); padding: 1rem 2.5rem; border-radius: 50px; font-weight: 900; font-size: 1.1rem; transition: all 0.4s var(--ease-spring); display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
.ab-toggle button small { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; }
.ab-toggle button:hover { background: rgba(255,255,255,0.08); border-color: rgba(80, 227, 194, 0.5); color: #fff; transform: translateY(-3px); }
.ab-toggle button.active { background: #50E3C2; color: #0f2027; border-color: #50E3C2; box-shadow: 0 10px 30px rgba(80, 227, 194, 0.4); transform: scale(1.05); }
.ab-toggle button.active small { color: #0f2027; opacity: 0.8; }
.ab-anim { animation: popInAb 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
@keyframes popInAb { 0% { transform: scale(0.8) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }

/* ============================================================
   АДАПТИВ ТА ОПТИМІЗАЦІЯ
   ============================================================ */

/* Тач-пристрої: без 3D-tilt та «залипаючих» hover-ефектів */
@media (hover: none) {
  .tilt-card, .tilt-card:hover { transform: none !important; }
  .prof-body, .c-head, .course-card h3, .course-card p, .course-card ul { transform: none; }
  .play-btn, .tilt-card:hover .play-btn { transform: translate(-50%, -50%) !important; }
  .tl-item:hover .tl-content, .acc-item:hover, .review-card:hover, .eco-card:hover, .stat-box:hover { transform: none; }
  .tl-item:hover::after { height: 0; }
  .btn:hover, .filter-btn:hover, .marquee-item:hover { transform: none; }
}

@media (max-width: 1024px) {
  .skyline { height: 180px; }
  .ai-panel { width: calc(100vw - 40px); right: 0; bottom: 0; height: 600px; }
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

  /* важкі ефекти вимкнено */
  .blobs-wrap, .analytics-wrap::before { display: none; }
  .glass, .stat-box, .play-btn, .modal-overlay, .modal-close, .ai-panel { backdrop-filter: none; -webkit-backdrop-filter: none; }
  .ai-panel { background: #fff; }
  .modal-overlay { background: rgba(29, 45, 42, 0.92); }
  .marquee-wrap { animation-duration: 30s; }
  .skyline .sk-b:nth-child(n+9) { display: none; }
  .skyline .sk-b { width: calc(100% / 8); animation-duration: 0.6s; }
  .eco-icon, .hero-mascot { animation: none; }

  /* поява тільки по вертикалі (без горизонтального overflow) */
  .rv-left, .rv-right { transform: translateY(30px); }
  .rv { transition-duration: 0.5s; }

  .hero { padding: 6rem 1rem 120px; gap: 0; min-height: auto; }
  .hero-toggle { flex-direction: column; padding: 0.2rem; border-radius: 20px; width: 100%; }
  .ht-btn { padding: 0.8rem 1.5rem; font-size: 0.8rem; }
  .hero h1 { font-size: 1.9rem; letter-spacing: -0.5px; }
  .hero p { font-size: 0.95rem; }
  .hero-actions .btn { width: 100%; }
  .hero-right { min-height: 300px; }
  .hero-mascot { height: 300px; }
  .skyline { height: 120px; }

  .btn { padding: 1rem 1.6rem; font-size: 0.85rem; }
  .sec { padding: 3.5rem 0; }
  .sec-title { margin-bottom: 2rem; }
  .sec-title p { font-size: 1rem; }
  .marquee-sec { padding: 2.5rem 0; }
  .marquee-sub { font-size: 0.75rem; letter-spacing: 1.5px; padding: 0 1rem; }
  .marquee-item { font-size: 1.2rem; padding: 0 2rem; }
  .marquee-item::after { margin-left: 2rem; font-size: 1.5rem; }
  .filters { flex-wrap: nowrap; justify-content: flex-start; overflow-x: auto; gap: 0.6rem; margin: 0 -1rem 2rem; padding: 0.3rem 1rem 0.8rem; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
  .filters::-webkit-scrollbar { display: none; }
  .filter-btn { flex-shrink: 0; padding: 0.7rem 1.3rem; font-size: 0.85rem; }
  .filter-btn.active { transform: none; }
  .grid { gap: 1.2rem; }
  .prof-thumb { height: 190px; }
  .prof-body, .review-card, .course-card { padding: 1.5rem; }
  .prof-body h3, .course-card h3 { font-size: 1.25rem; }
  .c-icon { width: 60px; height: 60px; font-size: 2rem; }
  .c-head { gap: 1rem; }

  .timeline::before { left: 14px; }
  .tl-item { padding-left: 52px; margin-bottom: 2.5rem; }
  .tl-item::after { left: 14px; }
  .tl-dot { left: 0; width: 28px; height: 28px; }
  .tl-content { padding: 1.4rem; }
  .tl-content h3 { font-size: 1.2rem; }
  .tl-content p { font-size: 0.95rem; }
  .tl-step { right: 1rem; top: -12px; font-size: 1rem; }

  .eco-grid { gap: 1.2rem; }
  .eco-card { padding: 2rem 1.5rem; }
  .eco-icon { font-size: 3rem; }
  .accordion { gap: 0.8rem; }
  .acc-head { padding: 1.2rem; }
  .acc-head h4 { font-size: 1rem; padding-right: 1rem; }
  .acc-body, .acc-item.open .acc-body { padding-left: 1.2rem; padding-right: 1.2rem; }
  .acc-body p { font-size: 0.95rem; }

  .cta-sec { padding: 3rem 1.2rem; border-radius: 24px; margin-top: 2rem; }
  .cta-sec p { font-size: 1rem; margin-bottom: 2rem; }
  .footer { padding: 3rem 1rem 6rem; }
  .footer-logo { font-size: 1.5rem; }

  .analytics-wrap { padding: 2rem 1rem; border-radius: 24px; }
  .a-header { margin-bottom: 2rem; }
  .a-header p { font-size: 0.95rem; }
  .ab-toggle { gap: 0.8rem; margin-bottom: 2rem; }
  .ab-toggle button { padding: 0.8rem 1.5rem; width: 100%; }
  .ab-toggle button.active { transform: none; }
  .stat-grid { grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 2.5rem; }
  .stat-box { padding: 1.2rem 0.6rem; border-radius: 18px; }
  .stat-icon { font-size: 1.8rem; margin-bottom: 0.5rem; }
  .stat-val { font-size: 1.4rem; }
  .stat-lbl { font-size: 0.65rem; letter-spacing: 0.5px; }
  .m-step-card { padding: 1.5rem 1.2rem; }

  /* модалка як bottom-sheet */
  .modal-overlay { padding: 0; align-items: flex-end; }
  .modal-content { max-height: 92vh; max-height: 92dvh; border-radius: 24px 24px 0 0; }
  .m-video { border-radius: 24px 24px 0 0; }
  .modal-close { top: 0.8rem; right: 0.8rem; width: 40px; height: 40px; }
  .m-body { padding: 1.5rem 1.2rem 2rem; }
  .m-body h2 { font-size: 1.5rem; }
  .m-body h3 { font-size: 1.1rem; margin: 1.5rem 0 0.8rem; }
  .m-body p { font-size: 1rem; }
  .m-mod { padding: 1.2rem 1rem 1.2rem 3.2rem; }
  .m-mod::before { left: 1rem; top: 1.2rem; }
  .m-mod-head { flex-direction: column; align-items: flex-start; gap: 0.4rem; }
  .modal-content .btn { padding: 1rem; font-size: 1rem; }

  /* 16px у полях — інакше iOS зумить сторінку при фокусі */
  .ai-input input, .fb-form select, .fb-form textarea, .fb-form input { font-size: 16px; }
}

/* чат на весь екран */
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
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  .rv { opacity: 1; transform: none; }
}
`;

/* ============================================================
   ГОЛОВНИЙ КОМПОНЕНТ СТОРІНКИ
   ============================================================ */
const KharkivCorporatePortal = () => {
  const [cat, setCat] = useState('all');
  const [modal, setModal] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('video');
  const [fb, setFb] = useState({ type: 'feedback', text: '', contact: '', sent: false });
  const barRef = useRef(null);

  // Скрол: прогрес-бар оновлюється напряму (без ререндеру), state — лише при зміні значення
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

  // Блокування скролу сторінки під модалкою / відкритим меню
  useEffect(() => {
    document.body.style.overflow = modal || menu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modal, menu]);

  const profs = useMemo(() => (cat === 'all' ? PROFS : PROFS.filter((p) => p.cat === cat)), [cat]);
  const courses = useMemo(() => (cat === 'all' ? COURSES : COURSES.filter((c) => c.cat === cat)), [cat]);
  const skylineBlocks = useMemo(() => SKY_HEIGHTS.map((h, i) => (
    <div key={i} className="sk-b" style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }} />
  )), []);

  const go = useCallback((id) => {
    setMenu(false);
    if (id === 'professions') setActiveTab('video');
    if (id === 'courses') setActiveTab('courses');
    // невелика затримка, щоб скрол не «збивався» при закритті меню/розблокуванні body
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 30);
  }, []);

  const openModal = useCallback((type, item) => setModal([type, item]), []);

  const openForm = useCallback((type) => {
    setFb((f) => ({ ...f, type, sent: false }));
    setTimeout(() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }), 30);
  }, []);

  const goCourse = (courseId) => {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;
    setModal(null);
    setCat(course.cat);
    setActiveTab('courses');
    setTimeout(() => {
      go('courses');
      setTimeout(() => openModal('course', course), 800);
    }, 150);
  };

  return (
    <>
      <style>{CSS}</style>
      <div ref={barRef} className="progress-bar" />

      <div className="blobs-wrap">
        <div className="blob c1" />
        <div className="blob c2" />
      </div>

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <a href="#top" className="logo" onClick={(e) => { e.preventDefault(); go('top'); }}>
            <div className="logo-icon">🚀</div>
            Абітурієнт<span>+</span>
          </a>
          <div className="nav-links">
            {NAV_LINKS.map(([id, l]) => (
              <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); go(id); }}>{l}</a>
            ))}
          </div>
          <button className="btn btn-outline nav-fb" onClick={() => go('cta')}>ЗВОРОТНІЙ ЗВ'ЯЗОК</button>
          <button className={`burger ${menu ? 'open' : ''}`} onClick={() => setMenu((m) => !m)} aria-label="Меню" aria-expanded={menu}>
            <i /><i /><i />
          </button>
        </div>
        <div className={`mobile-menu ${menu ? 'open' : ''}`}>
          {[...NAV_LINKS, ['cta', 'Зворотній зв\'язок']].map(([id, l]) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); go(id); }}>{l}</a>
          ))}
        </div>
      </nav>

      <header id="top" className="hero">
        <div className="hero-left">
          <div className="hero-toggle">
            <button className={`ht-btn ${activeTab === 'video' ? 'active' : ''}`} onClick={() => go('professions')}>ВІДЕО ПРО ПРОФЕСІЇ</button>
            <button className={`ht-btn ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => go('courses')}>ПІДГОТОВЧІ КУРСИ</button>
          </div>

          <div className="hero-slogan">Обирай свідоме майбутнє</div>
          <h1>Усвідомлений вибір професії <span>і вступ до доброчесного ЗВО</span></h1>
          <p>Платформа допомагає випускникам шкіл та коледжів усвідомлено обрати професію за допомогою наочних відеовізиток спеціальностей і вступити до доброчесного університету на основі відкритих відгуків студентів, захищаючи від корупційних ризиків, застарілої освіти та марної витрати часу.</p>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => go('professions')}>Дивитись професії</button>
            <button className="btn btn-outline" onClick={() => go('reviews')}>Чесні відгуки</button>
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
        <div className="marquee-sub">Нам довіряють кар'єрні центри та хаби міста</div>
        <div className="marquee-wrap">
          {[...PARTNERS, ...PARTNERS].map((p, i) => (
            <div key={i} className="marquee-item">{p}</div>
          ))}
        </div>
      </section>

      <section id="professions" className="sec container">
        <Reveal className="sec-title">
          <h2>Навігація Професіями</h2>
          <p>Подолай невизначеність! Дізнайся реалії спеціальностей через відеовізитки без "рожевих окулярів" і марних очікувань.</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="filters">
            {Object.entries(CATS).map(([k, v]) => (
              <button key={k} className={`filter-btn ${cat === k ? 'active' : ''}`} onClick={() => setCat(k)}>{v}</button>
            ))}
          </div>
        </Reveal>

        <div className="grid">
          {profs.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 3) * 0.08} dir="up">
              <TiltCard className="prof-card" onClick={() => openModal('prof', p)}>
                <div className="prof-thumb" style={{ backgroundImage: `url(${p.poster})` }}>
                  <div className="play-btn">▶</div>
                </div>
                <div className="prof-body">
                  <h3>{p.icon} {p.title}</h3>
                  <p>{p.short}</p>
                  <div className="prof-more">Відео та кар'єра →</div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="reviews" className="sec container">
        <Reveal className="sec-title">
          <h2>Чесні відгуки користувачів</h2>
          <p>Дізнайся правду про кар'єрні центри Харкова. Ми формуємо рейтинг якості допомоги, захищаючи тебе від марної витрати часу та ілюзій.</p>
        </Reveal>

        <div className="grid">
          {REVIEWS.map((r, i) => (
            <Reveal key={i} delay={Math.min(i, 3) * 0.1} dir="up">
              <div className="review-card">
                <div className="r-head">
                  <div className="r-name">{r.name}</div>
                  <div className="r-uni">{r.uni}</div>
                </div>
                <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700' }}>{r.prof}</div>
                <div className="r-text">«{r.text}»</div>
                <div className="r-stars">
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div style={{ textAlign: 'center', marginTop: '3.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => alert('Форма залишення відгуку буде відкрита після авторизації')}>Залишити відгук</button>
            <button className="btn btn-outline" onClick={() => alert('Перехід до повного каталогу відгуків')}>Читати всі відгуки</button>
          </div>
        </Reveal>
      </section>

      <section id="courses" className="sec container">
        <Reveal className="sec-title">
          <h2>Підготовчі Курси</h2>
          <p>Від підготовки до вступу до старту в новій професії з нуля. Практичні знання для легкого старту.</p>
        </Reveal>

        <div className="grid">
          {courses.map((c, i) => (
            <Reveal key={c.id} delay={Math.min(i, 3) * 0.08} dir="up">
              <TiltCard className="course-card" onClick={() => openModal('course', c)}>
                <div className="c-head">
                  <div className="c-icon">{c.icon}</div>
                  <div>
                    <div className="c-tags">{c.tags.map(t => <span key={t}>{t}</span>)}</div>
                  </div>
                </div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <ul>
                  {c.mods.slice(0, 3).map(m => <li key={m[0]}>{m[0]}</li>)}
                  {c.mods.length > 3 && <li className="mut">ще {c.mods.length - 3} модулі</li>}
                </ul>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="timeline" className="sec container">
        <Reveal className="sec-title">
          <h2>Твій План Дій</h2>
          <p>Покроковий шлях від подолання сумнівів до успішного старту в прозорому середовищі.</p>
        </Reveal>

        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <Reveal key={i} delay={0.05} dir={i % 2 === 0 ? 'left' : 'right'}>
              <div className="tl-item">
                <div className="tl-dot" />
                <div className="tl-content">
                  <span className="tl-step">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <AnalyticsDashboard />

      <section id="ecosystem" className="sec container">
        <Reveal className="sec-title">
          <h2>Екосистема Розвитку Харкова</h2>
          <p>Окрім навчання, місто пропонує потужну інфраструктуру: профорієнтаційні центри, ІТ-кластери та кар'єрні хаби.</p>
        </Reveal>

        <div className="eco-grid">
          {ECOSYSTEM.map((eco, i) => (
            <Reveal key={i} delay={Math.min(i, 3) * 0.08} dir="up">
              <div className="eco-card">
                <div className="eco-icon">{eco.icon}</div>
                <h3>{eco.title}</h3>
                <p>{eco.desc}</p>
                <a href="#top" className="eco-link">{eco.link}</a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="faq" className="sec container">
        <Reveal className="sec-title">
          <h2>Часті Питання</h2>
          <p>Все, що потрібно знати про відгуки, платформу та курси.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion faqs={FAQS} />
        </Reveal>
      </section>

      <section id="cta" className="container">
        <Reveal dir="scale">
          <div className="cta-sec">
            <div className="cta-content">
              <h2>Зворотній зв'язок!</h2>
              <p>Маєш питання або хочеш залишити відгук? Відгуки про корупцію приймаються анонімно, після авторизації та модерації.</p>
              {fb.sent ? (
                <div className="fb-done">✅ Дякуємо! Ми отримали твоє повідомлення.</div>
              ) : (
                <div className="fb-form">
                  <select value={fb.type} onChange={(e) => setFb({ ...fb, type: e.target.value })}>
                    <option value="feedback">Питання / зворотній зв'язок</option>
                    <option value="corruption">Анонімний відгук про корупцію в ЗВО</option>
                    <option value="center">Відгук про центр зайнятості</option>
                  </select>
                  <textarea rows="4" placeholder="Твоє повідомлення…" value={fb.text} onChange={(e) => setFb({ ...fb, text: e.target.value })} />
                  {fb.type !== 'corruption' && (
                    <input placeholder="Email або Telegram (необов'язково)" value={fb.contact} onChange={(e) => setFb({ ...fb, contact: e.target.value })} />
                  )}
                  <button className="btn btn-yellow" disabled={!fb.text.trim()} onClick={() => setFb({ ...fb, sent: true })}>Надіслати</button>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="footer container">
        <div className="footer-logo">🚀 Абітурієнт<span>+</span></div>
        <p>© {new Date().getFullYear()} Офіційна платформа профорієнтації для абітурієнтів, студентів та світчерів.</p>
      </footer>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)} aria-label="Закрити">✕</button>

            {modal[0] === 'prof' ? (
              <>
                <video controls playsInline preload="metadata" poster={modal[1].poster} className="m-video" autoPlay muted loop>
                  <source src={V} type="video/mp4" />
                </video>
                <div className="m-body">
                  <h2>{modal[1].icon} {modal[1].title}</h2>
                  <p>{modal[1].full}</p>

                  <h3>🏢 Де отримати підтримку (Центри зайнятості)</h3>
                  <ul>{modal[1].study.map(s => <li key={s}>{s}</li>)}</ul>

                  <h3>🚀 Кар’єрні можливості</h3>
                  <ul>{modal[1].opps.map(s => <li key={s}>{s}</li>)}</ul>

                  {modal[1].course && (
                    <button className="btn btn-primary" onClick={() => goCourse(modal[1].course)}>
                      Почати підготовчий курс
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="m-body">
                <h2>{modal[1].icon} {modal[1].title}</h2>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{modal[1].spec}</p>
                <p>{modal[1].desc}</p>

                <h3>Силабус (Програма курсу)</h3>
                <div className="m-mods">
                  {modal[1].mods.map(([t, d, x]) => (
                    <div className="m-mod" key={t}>
                      <div className="m-mod-head">
                        <h4>{t}</h4>
                        <span>{d}</span>
                      </div>
                      <p>{x}</p>
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary" onClick={() => setModal(null)}>Зрозуміло</button>
              </div>
            )}
          </div>
        </div>
      )}

      <Assistant onOpen={openModal} onForm={openForm} />
    </>
  );
};

export default KharkivCorporatePortal;
