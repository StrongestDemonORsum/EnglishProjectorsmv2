// Schema Deck — App (React Bits via CDN, no build step)
// React Bits components: glass buttons, cards, backgrounds — copy-paste style
(function () {
  const { useState, useEffect, useRef, useCallback } = React;

  // Tiny hyperscript helper so we write React without JSX/Babel
  const h = (type, props = {}, ...children) =>
    React.createElement(type, props, ...children.flat(2).filter(Boolean));

  const SLIDES = ['home', 'schema', 'deck', 'about'];

  const BUTTONS = [
    {
      id: 'schema',
      label: 'Type Schema',
      cap: 'Blank type schema sheet',
      icon: 'T',
      target: 'schema',
      previewTitle: 'Type Schema',
      previewBody: 'Open a blank sheet to define your types — interfaces, enums, unions, and object shapes. Fully editable, right inside the deck.',
    },
    {
      id: 'deck',
      label: 'Slide Deck',
      cap: 'Presentation overview',
      icon: 'S',
      target: 'deck',
      previewTitle: 'Slide Deck',
      previewBody: 'Browse every slide in the deck. Navigate with the arrow keys or click anywhere to advance.',
    },
    {
      id: 'about',
      label: 'About',
      cap: 'How this deck works',
      icon: 'A',
      target: 'about',
      previewTitle: 'About',
      previewBody: 'A single-file HTML presentation built with React Bits components. Glass morphic buttons, hover previews, click animations, and arrow-key navigation.',
    },
  ];

  const DEFAULT_SCHEMA = `// Blank type schema sheet
//
// Define your types here. Fully editable — this is the presentation's core slide.
//
// Example:
//
// type User = {
//   id: string;
//   name: string;
//   email: string;
//   role: 'admin' | 'editor' | 'viewer';
//   createdAt: Date;
//   profile?: Profile;
// };
//
// type Profile = {
//   avatar: string | null;
//   bio: string;
// };
//
// export type { User, Profile };
`;

  // ---- Icon (React Bits: Components) ----
  function Icon({ name }) {
    let d = '';
    if (name === 'T') d = '<path d="M12 3 L12 21"/><path d="M8 7 L16 7 L12 13"/>';
    if (name === 'S') d = '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 12 L15 12"/>';
    if (name === 'A') d = '<circle cx="12" cy="10" r="3"/><path d="M9.5 14.5 L12 17 L14.5 14.5"/>';
    if (name === 'P') d = '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 8 L16 8 L12 13"/>';
    if (name === 'C') d = '<path d="M20 10 C20 15 10 21 4 21 S2 15 2 10 C2 5 8 -1 16 -1 S22 5 22 10"/>';
    if (name === 'G') d = '<path d="M12 2 C6.48 2 2 6.48 2 12 S6.48 22 12 22 S22 17.52 22 12 S17.52 2 12 2 Z"/><path d="M12 7 L12 12 L17 12"/>';
    return h('svg', {
      width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none',
      stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
      'aria-hidden': 'true', dangerouslySetInnerHTML: { __html: d },
    });
  }

  // ---- GlassButton (React Bits: Components) ----
  function GlassButton({ btn, onClick, isPressed, isHovered, onHoverChange }) {
    const ref = useRef(null);
    const handleClick = useCallback(() => {
      if (!ref.current) return;
      ref.current.classList.remove('pressed');
      void ref.current.offsetWidth; // force reflow to restart animation
      ref.current.classList.add('pressed');
      onClick(btn.target);
    }, [btn.target, onClick]);

    return h(
      'div',
      {
        ref: ref,
        className: 'glass-btn glass ' + (isPressed ? 'pressed ' : '') + (isHovered ? 'hovered' : ''),
        onMouseEnter: () => onHoverChange(btn.id, true),
        onMouseLeave: () => onHoverChange(btn.id, false),
        onClick: handleClick,
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }
      },
      h('div', { className: 'glass-icon' }, h(Icon, { name: btn.icon })),
      h('div', { className: 'glass-label' }, btn.label),
      h('div', { className: 'glass-cap' }, btn.cap)
    );
  }

  // ---- PreviewPanel (React Bits: Components / Micro) ----
  function PreviewPanel({ btn, open }) {
    return h(
      'div', { className: 'preview-wrap ' + (open ? 'open' : '') },
      h('div', { className: 'preview-panel glass glass-panel' },
        h('div', { className: 'preview-thumb' }, btn.icon),
        h('h4', null, btn.previewTitle),
        h('p', null, btn.previewBody)
      )
    );
  }

  // ---- HomeSlide ----
  function HomeSlide({ navigate, pressedButton }) {
    const [hoveredId, setHoveredId] = useState(null);
    const btnEls = BUTTONS.map((btn) =>
      h(React.Fragment, { key: btn.id },
        h(GlassButton, {
          btn, navigate,
          isPressed: pressedButton === btn.id,
          isHovered: hoveredId === btn.id,
          onHoverChange: (id, on) => setHoveredId(on ? id : null),
        }),
        h(PreviewPanel, { btn, open: hoveredId === btn.id })
      )
    );
    return h('div', { className: 'slide-body' },
      h('div', { className: 'reveal stagger-1', style: { textAlign: 'center' } },
        h('div', { className: 'home-chip' }, 'Blank Type Schema · Presentation'),
        h('h1', null, 'Schema Deck'),
        h('p', { className: 'muted', style: { maxWidth: '680px', margin: '14px auto 0' } },
          'A presentation with no friction — just glass buttons, hover previews, animated clicks,', h('br', null),
          'arrow-key navigation, and a blank type schema sheet you can edit in place.'
        )
      ),
      h('div', { className: 'reveal stagger-3 home-card glass glass-panel' },
        h('h3', null, 'Pick a section to open'),
        h('p', null, 'Hover a button to see what it will open. Click to animate in.')
      ),
      h('div', { className: 'reveal stagger-4 buttons', style: { marginTop: '2px' } }, btnEls)
    );
  }

  // ---- SchemaSlide ----
  function SchemaSlide() {
    const [value, setValue] = useState(DEFAULT_SCHEMA);
    const textareaRef = useRef(null);
    useEffect(() => { if (textareaRef.current) textareaRef.current.focus(); }, []);
    return h('div', { className: 'slide-body' },
      h('div', { className: 'schema-head reveal stagger-1' },
        h('div', { className: 'home-chip' }, 'Editable · TypeScript'),
        h('h2', null, 'Type Schema'),
        h('p', null, 'Blank sheet — define your types below. Tab indents; click anywhere else to advance the deck.')
      ),
      h('div', { className: 'editor-wrap reveal stagger-2' },
        h('div', { className: 'editor-bar' },
          h('span', { className: 'lang' }, 'TypeScript'),
          h('div', { className: 'dots' },
            h('span', { className: 'dot red' }),
            h('span', { className: 'dot yel' }),
            h('span', { className: 'dot grn' })
          )
        ),
        h('textarea', {
          ref: textareaRef, className: 'schema', value: value,
          onChange: (e) => setValue(e.target.value),
          placeholder: DEFAULT_SCHEMA, spellCheck: false, autoComplete: 'off', autoCorrect: 'off',
        })
      ),
      h('div', { className: 'schema-foot reveal stagger-3' },
        h('span', null, 'Editable · ' + value.trim().length + ' chars'),
        h('span', { className: 'muted' }, 'Tab indents · ← returns to home · click to advance')
      )
    );
  }

  // ---- Card (React Bits: Components) ----
  function Card({ icon, title, desc }) {
    return h('div', { className: 'glass-card glass glass-panel' },
      h('div', { className: 'card-icon' }, icon),
      h('div', { className: 'card-title' }, title),
      h('p', { className: 'card-desc' }, desc)
    );
  }

  // ---- DeckSlide ----
  function DeckSlide() {
    const cards = [
      { icon: 'T', title: 'Type Schema', desc: 'Blank editable sheet for interfaces, enums, unions, and object shapes.' },
      { icon: 'S', title: 'Slide Deck', desc: 'Every slide in this deck is right here in one HTML file.' },
      { icon: 'A', title: 'About', desc: 'Glass morphic buttons, hover previews, click animations, arrow-key nav.' },
      { icon: 'P', title: 'PowerPoint Style', desc: 'Click anywhere to advance, or use the arrow keys like a real deck.' },
      { icon: 'C', title: 'Cards', desc: 'React Bits–inspired glass cards with hover lift and soft borders.' },
      { icon: 'G', title: 'Glass Morphism', desc: 'Backdrop blur, gradient borders, floating mesh background.' },
    ];
    return h('div', { className: 'slide-body' },
      h('div', { className: 'reveal stagger-1' },
        h('h2', null, 'Slide Deck'),
        h('p', { className: 'muted' }, 'This HTML file ', h('b', null, 'is'), ' the presentation. Every section above is a slide.')
      ),
      h('div', { className: 'reveal stagger-2' },
        h('div', { className: 'card-grid' }, cards.map((c, i) =>
          h(Card, { key: i, icon: c.icon, title: c.title, desc: c.desc })
        ))
      ),
      h('div', { className: 'reveal stagger-3', style: { marginTop: '10px', color: '#94a3b8', fontSize: '13px' } },
        'Navigate with ', h('b', null, '← →'), ', ', h('b', null, 'Space'), ', or ', h('b', null, 'Page Up / Down'), '. Click anywhere to advance.'
      )
    );
  }

  // ---- AboutSlide ----
  function AboutSlide() {
    return h('div', { className: 'slide-body' },
      h('div', { className: 'reveal stagger-1', style: { textAlign: 'center' } },
        h('div', { className: 'home-chip' }, 'How it works'),
        h('h1', null, 'About'),
        h('p', { className: 'muted', style: { maxWidth: '680px', margin: '14px auto 0' } },
          'Built with React Bits components + plain CSS in a single HTML file — no build step, no server, no internet needed.', h('br', null),
          'Glass morphism, micro-interactions, and PowerPoint-style deck navigation.'
        )
      ),
      h('div', { className: 'reveal stagger-3 home-card glass glass-panel', style: { maxWidth: '620px', margin: '0 auto' } },
        h('h3', null, 'Stack'),
        h('p', { style: { margin: 0, color: '#cbd5e1' } }, 'React 18 · React Bits · CSS3 · single HTML file · works offline')
      )
    );
  }

  // ---- App ----
  function App() {
    const [index, setIndex] = useState(0);
    const [pressedButton, setPressedButton] = useState(null);

    const go = useCallback((targetId) => {
      setPressedButton(targetId);
      setTimeout(() => { setPressedButton(null); setIndex(SLIDES.indexOf(targetId)); }, 260);
    }, []);

    const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
    const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

    useEffect(() => {
      const onClick = (e) => {
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.isContentEditable || e.target.closest('.glass-btn') || e.target.closest('.preview-wrap')) return;
        next();
      };
      document.addEventListener('mousedown', onClick);
      return () => document.removeEventListener('mousedown', onClick);
    }, [next]);

    useEffect(() => {
      const onKey = (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); next(); }
        else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
        else if (e.key === 'Escape') { setIndex(0); }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [next, prev]);

    const id = SLIDES[index];
    let slide;
    if (id === 'home') slide = h(HomeSlide, { navigate: go, pressedButton });
    else if (id === 'schema') slide = h(SchemaSlide);
    else if (id === 'deck') slide = h(DeckSlide);
    else slide = h(AboutSlide);

    return h('div', { className: 'deck' },
      h('div', { className: 'progress' }, h('span', { id: 'progressBar' })),
      h('div', { className: 'counter' }, index + 1 + ' / ' + SLIDES.length),
      h('div', { className: 'slide', id: 'slide-' + id }, slide),
      h('div', { className: 'hint' }, '← → navigate · click to advance · Esc home')
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(h(App));
})();
