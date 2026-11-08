# Portfolio Rebuild Plan A: "The Cut"

(Plan B, a completely different concept, is in `plan-b.md`.)

## 1. Design Read

**Reading this as:** an experimental, cinematic portfolio for a multi-disciplinary creative (UI design, editing, videography, photography, graphics). It is for people who should feel the craft before they read about it: studios, product teams, brands and agencies. Every part of the site is a "scene" in one film, held together by a working editing timeline. Black and grey with one neon green highlight. Soft jazz soundtrack the visitor can switch on. Built with Vite, vanilla JS, GSAP + ScrollTrigger, Lenis and a small WebGL layer (OGL).

**Concept name: "The Cut"**
The whole site is a film you edit by scrolling. A real timeline docked at the bottom of the screen works like an editing app (Premiere / Resolve). Scrolling moves the playhead. Each section is a clip on a track. Clicking a clip jumps to that scene. The timecode in the corner is the real scroll position. All four skills appear in the main experience, each with its own cinematic scene:

| Skill | Scene idea |
|---|---|
| UI design | A screen builds itself from wireframe to final design as you scroll, like Figma layers flying into place |
| Editing | Video projects laid out as clips on a timeline that pans sideways, with hard cuts between previews |
| Videography | Showreel inside letterbox bars that open from 2.39:1 to full screen |
| Photography | A darkroom: photos "develop" from negative to positive as they enter, on a contact sheet with green grease-pencil picks |

**Mode:** Full overhaul (skill §11.A). New concept and visuals. The existing content stays: 50 video projects in 7 categories, 8 graphics, email, Instagram/YouTube links, the rotating roles idea.

**Dials** (set above the skill presets, because you asked for something new and highly animated):

| Dial | Value | Why |
|---|---|---|
| `DESIGN_VARIANCE` | 10 | Experimental. Every scene uses its own layout |
| `MOTION_INTENSITY` | 9 | Scroll-driven film. Pinned scenes, shader transitions, playhead |
| `VISUAL_DENSITY` | 3 | Cinematic. One idea per screen, lots of black |

**Skill defaults overridden on purpose (your instructions):**
- **Dark only.** No light mode. You asked for a black/grey theme.
- **Neon accent with light glow.** Allowed only on the accent (playhead, active clip, focus, picks). No glow anywhere else.
- **Monospace labels and timecodes** fit the editing-app look, so they are part of the concept, not decoration. They still get used with restraint.

## 2. What Stays From the Current Site

- `data.js` and `graphics-data.js` stay the source of content (moved to `src/data/`)
- All thumbnails and graphics in `Assets/`, every reel link, `ojhah10@gmail.com`
- Category slugs as anchors (`#healthcare`, `#creatives`, ...) so old links still work
- `index.html` and `graphics.html` URLs
- Bio voice ("make things look good, sound good and feel right"), rewritten to lead with UI design

Retired: Inter, plain white layout, 7 copy-pasted category sections, `nav-fit.js`, em-dashes and numbered section labels.

## 3. Visual System

**Colors**

| Token | Value | Use |
|---|---|---|
| `--black` | `#0a0a0b` | Page background (never pure black) |
| `--grey-900` | `#121214` | Timeline, panels |
| `--grey-800` | `#1c1c1f` | Clips, cards, hovers |
| `--grey-500` | `#5c5c63` | Lines, inactive tracks |
| `--grey-300` | `#a3a3aa` | Body text |
| `--white` | `#ececea` | Headlines |
| `--neon` | `#b4ff39` | The only accent: playhead, active clip, links, focus ring, photo picks, music bars |
| `--neon-dim` | `#b4ff39` at 15% | Selection fills, hover tints |

Contrast: neon on black is about 15:1, grey-300 on black about 8:1. Text on a neon button is `--black`.

**Type**
- Display and body: **Bricolage Grotesque** (Google Fonts, SIL OFL, variable with optical sizes). Closest free match to Tomato Grotesk
- (Satoshi and Clash Display were replaced by Bricolage)
- Interface: **JetBrains Mono** for timecode, track names, clip labels (the editing-app layer)
- No serif. Italic of the same family for emphasis

**Texture and frame**
- Film grain: one fixed, `pointer-events-none` canvas overlay, very low opacity
- Letterbox bars that open and close between scenes
- Viewfinder corner marks only in the hero (part of the camera scene, removed after it)
- Shape: media and panels are sharp (radius 0). Timeline clips have 2px radius like real NLE clips. Buttons are full pill. Those three rules only.

## 4. Scenes (index.html)

Each scene is a clip on the timeline. Each uses a different layout family.

| # | Scene | What happens | Layout |
|---|---|---|---|
| 0 | **Slate (loader)** | A film clapper/slate with name, "Scene 1, Take 1". Claps shut when assets are ready, then a cut to black. Under 1.5s, skipped on repeat visits | Full screen |
| 0b | **Sound prompt** | Small choice on first visit: **Play with sound** / **Silent**. Music never starts on its own (browser rules and good manners) | Overlay, bottom corner |
| 1 | **Cold open (hero)** | Camera viewfinder. The frame starts blurred and out of focus, then "pulls focus" to sharp: `Hardik Ojha` with the rotating role (UI Designer / Editor / Cinematographer / Photographer). Background: slow-motion stock clip, dark graded. One line of subtext, CTAs **View work** and **Contact** | Asymmetric, text bottom-left over full-bleed video |
| 2 | **Interface (UI design)** | Pinned. As you scroll, a desktop and phone screen build up: grey wireframe boxes, then type, then images, then color, then a neon cursor clicks a button and the screen comes alive. Then 3 case study cards slide in with **Read case study** | Pinned build-up, then stacked cards |
| 3 | **The Edit (editing)** | Horizontal pan. Video projects sit as clips on V1/V2 tracks with an audio waveform on A1. Hover a clip: the preview plays in a "program monitor" above. Each category is a grey marker on the timeline that turns neon when active | Horizontal scroll pinned |
| 4 | **Rolling (videography)** | Showreel. Letterbox bars open from 2.39:1 to full screen as the section enters. Plays on click with sound (music fades down automatically) | Full-bleed media |
| 5 | **Darkroom (photography)** | A contact sheet. Photos start as color negatives (inverted) and develop to positive as they scroll into view. Hover shows a loupe zoom. Best shots get a neon grease-pencil circle that draws itself | Contact-sheet grid |
| 6 | **All work** | Every video project, filterable by category chips (All, Healthcare, Creatives, Restaurant, Beauty, Education, Short Films, Real Estate). Masonry mixes 9:16 and 16:9 | Filter + masonry |
| 7 | **Graphics** | Drag-to-scroll strip of the 8 posters/covers, link to `graphics.html` | Drag strip |
| 8 | **Credits (about)** | End credits roll: "Directed, designed and edited by Hardik Ojha", then real info (tools, disciplines, short bio) scrolling like film credits, beside a portrait. Tool logos roll inside the credits (no separate marquee) | Credits roll + portrait |
| 9 | **Fade out (contact)** | Screen fades to black, then a single line "Let's work together." and the email, big. Social links. Music fades down | Centered manifesto |

**Always on screen**
- **Top bar (56px):** `HARDIK OJHA` · Work · About · Contact · music toggle
- **Timeline dock (bottom, 64px):** tracks with one clip per scene, neon playhead, timecode `00:01:24:12` mapped to scroll. Click a clip to jump to it. Keyboard: Tab to clips, Enter to jump. This is the main navigation, not decoration
- The dock hides while you scroll down quickly and comes back when you stop or scroll up, so it never covers content for long

## 5. Music

- **Track (chosen from Pixabay):**
  - **Main pick:** [Mellow Smooth Jazz Relaxing Acoustic Guitar](https://pixabay.com/music/smooth-jazz-mellow-smooth-jazz-relaxing-acoustic-guitar-197646/) by Denis-Pavlov-Music, 9:44. Acoustic guitar, gentle piano chords, upright bass. Trim to a 2-3 min seamless loop.
  - **Backup 1:** [Jazz Ballad Slow Cozy Smooth Soothing Music](https://pixabay.com/music/traditional-jazz-jazz-ballad-slow-cozy-smooth-soothing-music-438548/), 5:00. Tagged piano, guitar, acoustic, brushes.
  - **Backup 2:** [Jazz Late Night Cozy Calm Relaxing Mellow](https://pixabay.com/music/traditional-jazz-jazz-late-night-cozy-calm-relaxing-mellow-463808/), 5:39. Piano led, no guitar in the description.
  - **License:** Pixabay Content License, no attribution required. The artist adds that the music may only be used as a supporting part of a project, which a website background is. Not legal advice; the binding text is [pixabay.com/service/terms](https://pixabay.com/service/terms/).
  - **Download:** Pixabay doesn't show a direct file link to scripts, so download the MP3 from the track page (free account) and drop it in `Assets/audio/`.
- **Off by default.** Starts only after the visitor taps **Play with sound** or the music toggle
- Fades in over 2s, fades out over 1s. Volume 35%
- Ducks (gets quieter) when the showreel or a clip preview plays, comes back after
- Pauses when the tab is hidden
- The choice is remembered on the next visit (localStorage, with try/catch)
- **Music toggle:** 4 small neon bars that move with the real audio (Web Audio analyser). Flat grey when off. Has an accessible label ("Music on" / "Music off")
- Small optional sound cues (soft projector click on cut, shutter on photo pick) only when sound is on. Decide in Phase 6

## 6. Animation Plan

Each animation has a reason. All use transform/opacity or WebGL. No `window.addEventListener('scroll')`; everything runs through ScrollTrigger + Lenis.

| Animation | Reason |
|---|---|
| Slate clap and cut to black | Sets the film concept in the first second |
| Focus pull on the hero (blur to sharp) | Draws attention to the name and fits the camera theme |
| Timeline playhead and timecode follow scroll | Shows where you are and lets you jump around |
| UI screen builds from wireframe to final | Tells the story of how a design is made |
| Horizontal clip pan with program-monitor previews | Lets people browse many videos without a long list |
| Letterbox open | Marks the move into "cinema" for the showreel |
| Negative-to-positive develop on photos | Tells the darkroom story and reveals each photo in turn |
| Grease-pencil circle draws around picks | Highlights the best shots |
| Hover on clips: slight RGB split + zoom (WebGL on desktop) | Feedback that it is clickable, in a video-glitch style |
| Credits roll | Ending of the film; holds the about info |
| Button press scale 0.98 | Tactile feedback |

## 7. Mobile, Accessibility, Performance

**Mobile (under 768px)**
- Timeline dock becomes a slim bar with scene dots and timecode, tap a dot to jump
- Horizontal pan becomes a vertical list of clips with swipe previews
- UI build-up plays as a short sequence instead of a long pin
- WebGL hover effects turned off; scene transitions become simple fades
- All layouts single column

**Reduced motion** (`prefers-reduced-motion: reduce`)
- No loader, no pins, no pan, no shaders, no grain movement
- Photos show positive straight away; the credits are a normal list
- Timeline navigation still works

**Accessibility**
- Music never autoplays, toggle always reachable by keyboard
- Every clip and photo has alt text; videos have a pause control
- Neon focus ring on everything focusable
- Semantic headings per scene, skip link to main content

**Performance targets:** LCP under 2.5s, CLS under 0.1
- Hero video under 3 MB, with poster image; other videos only load on hover/click
- WebGL and audio loaded after first paint
- Images in WebP/AVIF with set width/height

## 8. Tech Stack

> **As built (v1):** plain HTML, CSS and JS, no build step. Libraries are downloaded into `vendor/` (GSAP 3.15.0 + ScrollTrigger, Lenis 1.3.27), fonts into `fonts/` (Bricolage Grotesque variable, chosen as the closest free match to Tomato Grotesk, plus JetBrains Mono), Phosphor icons into `js/icons.js`. A WebGL film-burn transition was tried and removed at your request. Music: `Assets/audio/jazz-loop.mp3`, a 3.5 min, 128 kbps cut of the Pixabay track. Not used: Tailwind, Vite, Web Audio analyser (music bars animate with CSS while the track plays). The table below was the original proposal.

| Layer | Choice |
|---|---|
| Build | Vite, multi-page (`index.html`, `graphics.html`, `ui/<slug>.html`) |
| Styling | Tailwind v4 (`@tailwindcss/vite`) + CSS variables for tokens |
| Scroll and motion | GSAP + ScrollTrigger, Lenis smooth scroll |
| WebGL | OGL (small library) for scene transitions and hover effects |
| Audio | Web Audio API (gain for fades, analyser for the music bars) |
| Icons | Phosphor Icons (web) |
| Fonts | Self-hosted Clash Display, Satoshi, JetBrains Mono |
| Tool logos | Simple Icons (Figma, Framer, Premiere Pro, After Effects, DaVinci Resolve, Photoshop, Lightroom, Illustrator) |

```bash
npm create vite@latest . -- --template vanilla
npm i -D tailwindcss @tailwindcss/vite
npm i gsap lenis ogl @phosphor-icons/web
```

## 9. Other Pages

**`ui/<slug>.html` (UI case studies):** same dark theme, timeline dock reused as the page's progress bar. Cover mockup, problem, process (wireframes to final), final screens, outcome, "Next project". One template, filled from `src/data/ui-data.js`.

**`graphics.html`:** dark gallery, category chips, full-screen viewer with keyboard arrows and Esc.

## 10. Placeholders (to replace later)

Images: Canva `generate-image` first (dark, cinematic, graded), then Picsum / Pexels stock. Every placeholder has a `<!-- REPLACE: ... -->` comment.

| Slot | Size / format | File |
|---|---|---|
| Hero background clip | 1920×1080, MP4/WebM, under 3 MB, muted | `Assets/site/hero.mp4` + `hero-poster.jpg` |
| Showreel | YouTube/Vimeo link or MP4 + 1920×1080 poster | `Assets/site/reel.mp4` |
| UI build-up layers (wireframe, type, images, final) | 1600×1000 desktop + 1170×2532 phone | `Assets/ui/hero-build/*.png` |
| UI case study covers (3) | 1600×1000 | `Assets/ui/<slug>/cover.jpg` |
| Photography (8-12 shots) | 1600 long side | `Assets/photo/*.jpg` (you shoot these, see the shot list below) |
| Portrait | 1200×1500 | `Assets/site/portrait.jpg` |
| Music loop | MP3 + OGG, 128 kbps, 2-3 min | `Assets/audio/jazz-loop.mp3` |
| Social preview (OG) | 1200×630 | `Assets/site/og.jpg` |

### Photo shot list (for you to shoot)

Reference images to recreate with your camera. Stock photos (Unsplash, free license, 1600px) are in `Assets/photo-references/stock/`; they also serve as site placeholders until your shots are ready. AI previews (small) are in `Assets/photo-references/`, full size on Canva.

| # | Shot | Ratio | Stock reference (best pick first) | AI reference |
|---|---|---|---|---|
| 1 | Night street: one figure under a single street lamp, wet road after rain, low angle | 3:2 | `1a-night-street.jpg` ([Severin Demchuk](https://unsplash.com/photos/a-lone-figure-walks-down-a-dark-lit-road-EYyOLi77JXo)), `1b` ([Joshua Lawrence](https://unsplash.com/photos/person-walking-on-wet-road-during-night-time-ssaorPf8_RI)) | [Canva](https://www.canva.com/M/MAHYum_cmRY) |
| 2 | Low-key self portrait: one hard side light, black background, looking off camera | 4:5 | `2b-portrait.jpg` ([Ruslan Zaplatin](https://unsplash.com/photos/a-black-and-white-photo-of-a-man-3Yxyp7MZU0s)), `2a` ([Sasha Yudaev](https://unsplash.com/photos/silhouette-of-man-face---4wlp3Js4Q)) | [Canva](https://www.canva.com/M/MAHYuhliucg) |
| 3 | Desk at night: hands on camera, black coffee, vinyl record, one desk lamp | 3:2 | `3a-desk-camera.jpg` for subject ([Devin Avery](https://unsplash.com/photos/black-dslr-camera-beside-ceramic-cup-filled-with-coffee-Uaxw_pI6jos)), `3b-desk-lamp.jpg` for lighting ([X F](https://unsplash.com/photos/desk-lamp-illuminates-candle-jar-on-a-dimly-lit-workspace-CCu-16eRBOs)) | [Canva](https://www.canva.com/M/MAHYukGPPVg) |
| 4 | Rain on a window at night, city bokeh, silhouette with headphones | 2:3 | `4b-city-bokeh.jpg` ([Zi Nguyen](https://unsplash.com/photos/bokeh-photography-of-city-lights-U5lYNUcKVy4)), `4a` ([John Murphey](https://unsplash.com/photos/a-view-of-a-city-from-a-window-at-night-9H2QTYnF62A)) | [Canva](https://www.canva.com/M/MAHYunXjvW8) |
| 5 | Concrete stairs in hard sun, strong diagonal shadows, tiny figure at the top | 4:5 | `5b-shadow.jpg` ([Tim Mossholder](https://unsplash.com/photos/shadow-of-person-on-gray-concrete-pavement--HNWAndKAX0)), `5a` ([Jan Antonin Kolar](https://unsplash.com/photos/shadow-of-stair-PsCef7kqMfw)). Neither has a figure; add one when you shoot | none |
| 6 | Chai stall at blue hour, steam lit by one bare bulb, vendor silhouette | 16:9 | `6a-chai-stall.jpg` ([Rudra Gupta](https://unsplash.com/photos/man-preparing-tea-at-street-stall-03p5R9-lXEs)), `6b` ([Piyanshu Sharma](https://unsplash.com/photos/a-dark-street-at-night-with-a-food-stand-lit-up-shy8t8qmBxo)) | none |

Unsplash license: free for commercial use, no attribution required (credit appreciated).

Shooting tips for the look: expose for the highlights and let shadows go black, one light source per shot, shoot RAW, grade toward grey with a slight green tint in highlights (Plan A) or clean neutral (Plan B).

## 11. Workflow

All work on a new branch `redesign`. The current site stays on `main` until you approve.

| Phase | Work | Skills / tools |
|---|---|---|
| **0. Audit** | Current site read, keep/retire list (section 2) | `redesign-existing-projects`, `design-taste-frontend` §11 |
| **1. Plan** | This file, your sign-off on section 12 | `design-taste-frontend` §0-2 |
| **2. Prototype the hero + timeline first** | Build slate, cold open, timeline dock and music toggle only. You review the feel before the rest is built | `design-taste-frontend`, `playwright-cli` for screenshots |
| **3. Setup** | Vite, Tailwind, fonts, tokens, data moved to `src/data/` | `design-taste-frontend` §3 |
| **4. Assets** | Placeholder images, stock clips, jazz loop. Pull UI screens from Figma if you have them | Canva `generate-image`, Picsum/Pexels/Pixabay, TalkToFigma (`export_node_as_image`), `find-skills` (look for GSAP/WebGL skills) |
| **5. Build scenes** | Interface, The Edit, Rolling, Darkroom, All work, Graphics, Credits, Fade out | `design-taste-frontend` §4, §5, §10 |
| **6. Motion + sound** | ScrollTrigger pins, Lenis, OGL transitions, Web Audio fades/ducking | `design-taste-frontend` §5-6 |
| **7. Sub-pages** | UI case study template, graphics page | `design-taste-frontend` |
| **8. Browser QA** | Screenshots at 375 / 768 / 1280 / 1440 px, reduced motion on, check frame rate, overflow, timeline jumps, music behavior | `playwright-cli`, `run` |
| **9. Guidelines audit** | Accessibility and UX: focus, keyboard, contrast, alt text, tap sizes | `web-design-guidelines` |
| **10. Pre-flight** | Full checklist in `design-taste-frontend` §14 (except the overrides in section 1) | `design-taste-frontend` §14 |
| **11. Cleanup** | Review for bugs, simplify | `code-review`, `simplify` |
| **12. Ship** | Commit, push, deploy after your approval | git |

## 12. Questions Before Building

1. **Concept:** Plan A ("The Cut", this file) or Plan B ("Zoom", `plan-b.md`)?
2. **UI projects:** Web searches for "Hardik Ojha" on Dribbble, Behance and general search found no public UI work (only other people named Hardik). So the UI case studies need either your files (Figma link or images) or I write 3 clearly marked placeholder concept projects for now.
3. **Photography:** Settled. You shoot from the shot list above; stock placeholders until then.
4. **Music:** Settled. Pixabay guitar + piano jazz (section 5).
5. **Hosting and socials:** Where is the site hosted, and your Dribbble / Behance / LinkedIn / Instagram / YouTube links?
