# UI case study pages: brief for any new chat

Read this first. It explains what the owner (Hardik Ojha) wants, the shared template every case study now uses, and what is unique to each page.

## The one rule: a case study is a page of this portfolio first

Changed on 1 Nov 2026 after the owner's review. The first set of pages each dressed up as its client's site (paper grounds, the client's fonts on every heading, a clock that followed the scroll, gradients between sections, a "light it" toy). The owner rejected that: "make it for our website, not for The Dale", "make it a premium case study". Aafreenn, which already wore the portfolio's dark shell, was the one they liked best.

So every case study now uses one shared template in the portfolio's own system:

- Ground, type, top bar, buttons, theme toggle and grain come from `css/main.css`. Inter for display and text, JetBrains Mono for labels, the neon as the only accent on the page.
- The client's identity appears only on **brand plates** (`.plate`, colours fixed in both themes) and in its real screenshots and photographs.
- Every page has a full **brand guidelines** section: quick reference row, logo plates, colour swatches with HEX, RGB, usage and copy-on-click, contrast pairs (ratios computed from the real hex values), typefaces, a type scale with real sizes from the client's CSS, and live components rebuilt in the client's CSS.
- Every page ends with contact and a full-width **Next case** link, so the five read as one series (Aafreenn, Bakhoor, The Dale, FTN World, Evelyn Dew, then back to Aafreenn). The hero carries "Case 0X / 05" with previous and next arrows.
- No gradients, no section-to-section colour transitions, no gimmicks that are not taken from the product.

What still varies per brand: one or two **signature sections** taken from the product itself (see the registry), the cover image, the screens and the plates. Do not copy a signature section from one page to another.

## What the owner asked for (original brief)

"I need new pages with the case study of the brands UI I made." Brand 1 was Aafreenn: a clean-aesthetic website selling Indian dresses. Instructions:

1. Go through the site code and the real live site, then make the case study.
2. Invent the things that should be there (story, research framing, decisions, next steps). Invented content is allowed, but list it for the owner at the end so they can check it.
3. Use the skills listed in `S:\Claude-Skills.md`. They are manual-only, so read their `SKILL.md` files in `C:\Users\jerry\.claude\skills\<name>\` directly. Used so far: `design-taste-frontend`, `ui-design`, `practical-typography`, `redesign-existing-projects`, `brand`. Also available: `ui-ux-pro-max`, `design-system`, `web-design-guidelines`, `apple-design`.
4. New pages are linked from "Selected UI projects" on the home page.

Brands done so far: Aafreenn, Bakhoor Al Barkaah, The Dale (plus its logo page), FTN World, Evelyn Dew. Brands still to do: ask the owner which projects and where the code and live URL are. Folders on `S:\` that might be candidates (unverified, do not assume): Bakhoor, Charu Meds, EdBoard, EvelynDew, Global MDs, HouseOfPrachar, LOGZONE, LSPS, Organica, The Dale, Eclat Narrative, FTN. Ask, don't guess.

## Workflow for each brand

1. Read this file, `S:\Claude-Skills.md`, and the skills you will use.
2. Get the source folder and live URL from the owner if not given.
3. Audit the code: design tokens (CSS variables), fonts, page list, shared components, backend and integrations, `git log` (dates and post-launch changes), any handover or invoice docs.
4. Study the live site: screenshots at 1440 and 390 wide, and computed styles for the brand's real colours and type. Look at the brand's photography and logo too. (Same principle as the Figma fidelity memory: study the live site before building.)
5. Check the client documents for permission to show the project. The Aafreenn handover allowed name, screenshots and non-sensitive details, and pricing was left out. Do the same: no prices paid, no keys, no admin data, no customer data.
6. Pick one or two signature sections taken from the product itself, and check the registry so they are not repeats. Pull the brand guideline data (colours, type sizes, components) from the client's own CSS and brand sheet.
7. Build `<slug>.html` in the portfolio root on the shared template, copying the structure of an existing study page, with its own `study-<slug>` CSS and JS (see "How to build").
8. Verify in a real browser: desktop, 390px phone, light and dark where relevant, `prefers-reduced-motion`, console errors, keyboard focus.
9. Add the project to `UI_PROJECTS` in `site-data.js`, with `caseStudy: '<slug>.html'`.
10. Final message: what was built, which files, and a plain list of everything invented.

## How to build

- Shared: `css/study.css` and `js/study.js` (hero, cover, statement, plates, chapters, brand guidelines, phones, change log, close, contact, next case, rails, reveal and word-mask motion). Exposes `window.ST`.
- Per page: `css/study-<slug>.css` and `js/study-<slug>.js` only for that page's signature pieces and its brand fonts and tokens. Slugs in use: `aafreenn`, `bakhoor`, `dale`, `dale-logo`, `ftn` (plus `js/study-ftn-data.js`), `evelyn`.
- `css/main.css` still holds the portfolio tokens, `.wrap`, buttons, `.topbar`, `.footer`, `.link-arrow`, `.contact-title`, `.mail-link`. Its old Aafreenn-only "Case study pages" block was removed.
- `js/icons.js` (Phosphor, hydrate with `data-icon`), `vendor/` GSAP, ScrollTrigger, Lenis, `js/theme.js` for light and dark. Brand fonts self-hosted in `fonts/` and declared only in the page's own CSS.
- Images in `Assets/case-studies/<slug>/`, with `width`, `height` and real `alt`.
- Avoid class names that exist in `main.css` (it has `.chapter`, `.chapter-copy` and more for the home page; the study template uses `st-` prefixes for that reason).

## Rules from the skills that must hold

- Zero em dashes or en dashes anywhere visible. Use a hyphen, comma, colon or two sentences.
- One accent colour, locked across the page. One corner-radius rule, stated and followed.
- No div-built fake screenshots. Use real screenshots, or real photos.
- No AI tells: purple gradients, three identical cards, "Elevate / Seamless", invented startup names, fake-precise numbers. Numbers must come from the code, git history or docs, or be clearly labelled as an example.
- Eyebrow labels sparingly (about one per three sections). No section-number labels, no scroll cues, no decorative dots, no pills over images.
- Every animation has a one-sentence reason. Only animate `transform` and `opacity`. Honour `prefers-reduced-motion`. No `window` scroll listeners: use ScrollTrigger, Lenis or IntersectionObserver.
- Hero fits the first screen, one clear primary action, buttons do not wrap.
- Typography: body 16-18px, line length 45-90 characters, line-height 1.4-1.6, real curly quotes and apostrophes, `text-wrap: balance` on headings and `pretty` on paragraphs.
- Mobile collapses to one column with explicit rules. Touch targets at least 44px. No horizontal scroll.
- Copy self-audit: read every visible string once more before finishing; replace anything cute, vague or wrong with plain sentences.

## What a case study must still answer

Style is free; the reader still needs these answers (in any order and under any heading):

- What was the brand, who were its customers, and what problem did the site solve?
- What did you design and build, and what was your role?
- The two or three decisions that mattered, each tied to a real feature of the site.
- The visuals: key screens (desktop and phone), the brand system, anything interactive.
- What changed after launch (the git history is the source for this).
- What you would do next, and a way to get in touch.

## Registry of case studies built

All pages share the template above. The table lists what is unique to each, so the next page picks something else.

| Page | Cover | Signature sections (unique to this page) |
|---|---|---|
| `aafreenn.html` (Aafreenn, Indian suits store) | Courtyard photograph | The four questions from the order chats; sticky browser walkthrough that changes page per step; working size and height demo; phones drifting at different speeds |
| `bakhoor-al-barkaah.html` (Bakhoor Al Barkaah, one-product bakhoor shop) | Product on sunlit stone | Draggable rail of the five occasions with the shop's own lines; the 12 second logo film on a white plate; live shop components (gold hover button, underlined field) |
| `the-dale.html` (The Dale, boutique farmstay) | Valley mist | Working Nainital or The Dale switch built from the site's table; mosaic of the estate's own photographs; voice block (words we use and avoid, colour balance) from the brand sheet; pinned sideways pan of desktop and phone screens |
| `the-dale-logo.html` (The Dale mark, companion page) | The lockup on deodar | Wipe sliders between a photograph and the mark over it; four rejected directions; anatomy diagram. Not linked from the home page yet: it goes in the Designing section |
| `evelyn-dew.html` (Evelyn Dew, skin and hair care range; source `S:\EvelynDew`, live at https://evelyndew.com) | Packaging lineup render on night | Label proof: prototype front panel against the carton, six numbered changes with reasons; Evelyn or Dew switch circling the letter in the mark; product colour cards (gradient, accent, glow); the Figma file rebuilt by a plugin from the site's CSS (cover board exported via the TalkToFigma bridge) |
| `ftn-world.html` (FTN World, architecture practice) | The site's hero drawing | Old site's gaps as rows; the elevation drawn in five steps in a pinned scene on the practice's night sheet; logo spacing diagram (49 unit gaps); drawing-set picker from the real catalogue; working service accordion |

## Tooling notes (this Windows machine, check before relying on them)

- Playwright library: `C:\Users\jerry\AppData\Roaming\npm\node_modules\@playwright\cli\node_modules\playwright\index.mjs`. Its expected browser build is not installed, so launch with `executablePath: 'C:/Users/jerry/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'`.
- Lazy-loaded product images can be half-loaded in screenshots. Set `loading` to eager and wait until every image is `complete` before shooting.
- Serve the portfolio locally with `python -m http.server <port> --bind 127.0.0.1` from the portfolio folder. Stop it afterwards.
- Pillow is available for resizing and converting images. Set `PYTHONIOENCODING=utf8` for Python scripts that print non-ASCII text.
- Put scratch scripts and raw screenshots in the session scratchpad, not in the project.
- Home page (`index.html`) uses a pinned film-style layout; screenshot it with reduced motion on to get stable shots.

## State of the repo

Branch `redesign`. Nothing from the case study work is committed yet. Do not commit unless the owner asks.
