# Changes: case studies rebuilt as one premium series

Date: 1 Nov 2026. Branch: `redesign`. Nothing is committed.

## What changed and why

The first versions dressed each case study up as the client's own site. They now read as pages of this portfolio: the portfolio's dark ground, Inter, JetBrains Mono labels and the neon accent, with each client's identity shown on fixed-colour brand plates. Every page has a full brand guidelines section and ends with a Next case link, so the four read as one series.

| Page | Removed | Signature sections now |
|---|---|---|
| `aafreenn.html` | Old bento of palette and type | Four questions from the order chats, sticky browser walkthrough, working size and height demo, brand guidelines |
| `bakhoor-al-barkaah.html` | "Light it" smoke toy, light paper and sand theme, the Cocoa #2E2424 swatch (not a brand colour) | Draggable rail of the five occasions, logo film on a white plate, brand guidelines with live shop components |
| `the-dale.html` | Clock in the top bar, dawn-to-night gradients, section colour transitions | Nainital or The Dale switch, estate photographs, voice block from the brand sheet, pinned pan of screens |
| `ftn-world.html` | Tracing-paper theme, dimension-line frames | Old site's gaps, five-step pinned drawing on the night sheet, logo spacing diagram, drawing-set picker, service accordion |
| `the-dale-logo.html` | Drawing-board theme | Wipe sliders, rejected directions, anatomy |

## Files

**New**
- `css/study.css`, `js/study.js`: the shared template (hero, cover, statement, plates, chapters, brand guidelines, phones, change log, contact, next case, rails, motion).
- `css/study-aafreenn.css`, `js/study-aafreenn.js`
- `css/study-bakhoor.css`
- `css/study-dale.css`, `js/study-dale.js`
- `css/study-ftn.css`, `js/study-ftn.js`, `js/study-ftn-data.js`
- `css/study-dale-logo.css`, `js/study-dale-logo.js`

**Edited**
- The five HTML pages above, rebuilt.
- `css/main.css`: removed the Aafreenn-only "Case study pages" block and its responsive rules (now in the study files).
- `site-data.js`: The Dale card summary no longer mentions "one day from dawn to night".
- `Assets/case-studies/bakhoor/logo-poster.jpg`: was a blank white frame; now the last frame of the logo film.
- `UI page.md`: new rule (portfolio first), build notes and registry.

**Retired** (moved out of the project, not referenced anywhere): `css/case-base.css`, `case-bakhoor.css`, `case-dale.css`, `case-dale-logo.css`, `case-ftn.css`, `js/case-base.js`, `case-bakhoor.js`, `case-dale.js`, `case-dale-logo.js`, `case-ftn.js`, `case-ftn-data.js`, `case.js`.

## Brand guideline data, and where it came from

- Colours, type sizes, weights, tracking and components: each client's own stylesheet (`S:\Afreenn\frontend\public\css\style.css`, `S:\bakhoor-live-wt\css\style.css` and `pages.css`, `S:\The Dale\css\site.css`, `S:\FTN\frontend\css\app.css`).
- The Dale colour names, the 60 / 25 / 10 balance and the "words we use / avoid" lists: `S:\The Dale\brand.html`.
- Contrast ratios: computed from the hex values (WCAG formula).

## Motion (each has one job; all transform and opacity, all off with reduced motion)

- Title words rise from their own line on load; section headings do the same as they arrive.
- The cover opens from an inset frame to full width as you scroll.
- The opening statement lights up word by word at scrolling speed.
- Phones drift at slightly different speeds; change-log rules draw left to right.
- The Dale's screens pan sideways in a pinned scene; FTN's elevation draws itself in five steps (SVG stroke drawing).

## Checks run

- 1440 and 390 wide, reduced motion on and off, light and dark.
- No horizontal overflow, no console errors (the home page's missing `jazz-loop.mp3` is older and unrelated).
- No en or em dashes in visible text.
- Clicked through: fit demo, copy colour value, occasion rail, Dale switch and enquiry choices, FTN picker and accordion, logo wipe with the keyboard.

## Open items

- **Light mode accent.** The portfolio's light theme uses aubergine (#4A1442), so the study pages show a purple accent in light mode. Change site-wide if purple is unwanted.
- **The Dale logo page** is not linked from the home page yet.
- **Logo originality.** The Dale emblem was built from a third-party reference lockup's layout. Resolve before publishing.
- **FTN security issues** stay off every public page. Tell the client.
- **Bakhoor screens** come from the local copy; confirm the Rs 149 price matches the live shop.
- **The Dale** has no live URL and its enquiry form is not connected.

## Written for these pages, to check

- Customer lines: Aafreenn buyers "mostly arrive from the link in the Instagram bio"; Bakhoor buyers "mostly from a link shared on a phone"; Dale guests "who have done Nainital once and did not enjoy the crowd".
- Section headings and short captions (for example "One row, one button", "Square, thin and slow", "The page, end to end").
- "What I'd add next" lists on every page, and the Dale "Where it stands" note.
- Plate captions such as "On black, for social posts" and "Clear space around the seal".
