---
name: found-glassmorphism
description: Apply frosted-glass (glassmorphism) treatments to the Found Fashion Shopify theme in this repo, on-brand and in the theme's own conventions. Use this whenever the user wants anything on found-fashion.com to look frosted, translucent, blurred, see-through, "glass", "Apple-style", or to float over imagery — a frosted header or mega menu, a glass sticky bar, a translucent cart drawer, a glass info card or price panel over a product or hero image, a blurred overlay behind a modal or popup — even if they don't say "glassmorphism". Prefer this over the generic glassmorphism skill when the target is this theme; defer to that skill only for a standalone demo or the full liquid-glass refraction look.
version: 0.1.0
---

# Glassmorphism for Found Fashion

Found Fashion is a luxury resale store (Hermès, Chanel, watches, jewellery). Its theme is white, editorial and quiet: hairline grey borders, square corners, uppercase labels with wide letter-spacing, warm taupe accents. Glass here is a *material for chrome*, not a showpiece. The aim is a surface that reads as frosted white glass over product photography, so legible and restrained that a customer never notices it as an effect, only that the page feels layered and calm.

The generic glassmorphism skill (installed beside this one at `.agents/skills/glassmorphism/`) describes dark, low-alpha, rim-lit "2026 liquid glass" with specular sweeps and SVG refraction. Almost none of that suits this store. Read `references/glass-recipes.md` from that skill only if the user explicitly asks for a liquid/refracting hero or a standalone HTML demo.

## First decide whether glass will even show

`backdrop-filter` blurs only what sits *behind* the element. Nearly every Found page is `#ffffff`, so a glass panel over plain page background is an invisible no-op that still costs paint time. Before styling, name what the surface overlaps:

| Surface | What is behind it | Glass earns its place? |
|---|---|---|
| Header when `Header--transparent` over the slideshow / background video | Hero imagery | Yes |
| Header on ordinary pages, not sticky | White page | No. Keep it solid `var(--header-background)` |
| Sticky header after scroll | Product grid, article images | Yes, lightly |
| Mega menu dropdown (`.FoundMegaMenu`) | The page below, usually product imagery | Yes, lightly |
| Mobile sticky bars (`.ppv1-sticky-bar`, `.cl-sticky-bar`) | Scrolling product images | Yes. These are already frosted and set the house recipe |
| Cart drawer / sidebar menu (`.Drawer`) | Page content | Yes, on the drawer panel itself, never on the scrim |
| Badges, price chips, info cards over product or hero images | Photography | Yes |
| Popup / newsletter modal | Page | Yes, on the modal; the scrim stays a plain tint |
| Chat widget `#ff` | Anything | Not from this repo. Its markup and CSS are served by the admin app; the theme can only position or hide it |

If the answer is "no", say so and offer the solid treatment instead: `var(--background)`, the 1px `rgba(0,0,0,0.06)` hairline, at most a `0 1px 2px rgba(0,0,0,0.04)` shadow. A translucent panel over white that doesn't frost anything looks like a bug.

Do not manufacture a backdrop to rescue the effect. Painting a gradient or colour wash behind a section so the blur has something to show invents a design element nobody asked for and tints a page this brand keeps white. The owner asked for glass because they like how it looks over imagery; the honest answer on a white page is that the look comes from the photo, not the panel. If they still want glass there, the one acceptable route is a merchant-chosen image behind the section via an `image_picker` setting that defaults to none, so the live page is unchanged until they pick one. Pages this applies to: FAQ, policies, contact, account, blog index, any `main-page` template.

## The Found glass recipe

Match the two bars the theme already frosts. The brand wants a white frost at high alpha, a hairline dark edge, and almost no shadow. Everything is tuned to keep taupe-on-white text at full contrast.

```css
.found-glass {
  background: rgba(var(--background-rgb), 0.82);      /* white frost, never below ~0.72 */
  -webkit-backdrop-filter: blur(20px) saturate(120%); /* Safari and iOS still need the prefix */
  backdrop-filter: blur(20px) saturate(120%);
  border: 1px solid rgba(0, 0, 0, 0.06);              /* the hairline the whole theme uses */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);          /* a whisper, or nothing at all */
  color: var(--text-color);
}
```

Tuning:

- **Alpha by job.** Chrome that must stay readable while images scroll under it (header, sticky bars, mega menu): 0.82 to 0.92. Decorative panels over a single hero image where you *want* the photo to glow through: 0.60 to 0.75, and only when the text on it is short and large.
- **Blur** 16 to 24px. The theme uses 20px. Larger radii over a full-width bar are the most expensive thing on the page.
- **Saturate** 110 to 130%, never the 160 to 180% in generic recipes. Oversaturated Hermès leather through a blur looks like a filter, not a shop.
- **Corners** stay square. Buttons in this theme have no radius. A glass card may take at most 2px.
- **Edge** is dark, not white. Use `border-top: 1px solid rgba(0,0,0,0.06)` on bars and a full hairline on cards. Skip white rim gradients, inset highlights, specular sweeps and noise grain: on white frost they read as smudges.
- **Type on glass** follows the brand: labels uppercase, 9 to 11px, `letter-spacing: 0.08em` to `0.2em`; body 11 to 13px. Text colour `#171513` or `var(--text-color)`; muted copy `#57534c` or `var(--text-color-light)`. Taupe CTA text `#806f64` is fine for links, not for 11px body copy on a busy photo.
- **Which font.** Match the font the surrounding block actually loads. Inside the product page's `ppv1-` block and the header's `FoundMegaMenu__` block that is `'Jost', sans-serif` (loaded site-wide by a `<link>` in `sections/header.liquid`). Everywhere else use `var(--heading-font-family)` and `var(--text-font-family)` (Avenir Next from theme settings). Never copy `'Figtree'` from `.ppv1-meta__key`: Figtree is only `@import`ed in `sections/main-collection.liquid`, so that declaration silently falls back to system sans on the product page. A matching-looking rule is not a loaded font; check the import.
- **Dark glass** is for one case only: text over a dark hero image where white frost would wash the photo out. Then `rgba(23, 21, 19, 0.55)` with `color: #fff` and a `rgba(255,255,255,0.12)` hairline.

Contrast is non-negotiable. Check the text against the *brightest* region of whatever can scroll underneath, not the average. If a white product shot can slide behind 11px grey text, either raise the alpha or add a small solid scrim behind the text block.

## Motion

CSS before JavaScript. When the sticky header setting is on, `.Header` is already `position: sticky`, and at the top of a page it sits over white, so a frost rule on it is invisible until content scrolls underneath and then appears on its own. Do not add a scroll listener or an `is-stuck` class to produce what the cascade already gives. Reach for JS only when a state truly has no CSS expression.

Keep motion to what the theme already does: `transform` and `opacity` transitions of about 0.3s `ease`. The sticky bar slides up with `transform: translateY(100%)` to `0`; the header fades its background with `transition: background 0.3s ease-in-out`. Do not animate the blur radius (the backdrop is re-blurred every frame) and do not add hover lifts, sweeps or churning refraction. On this store, motion that draws attention to the chrome is a defect.

## Fallbacks, every time

```css
@media (prefers-reduced-transparency: reduce) {
  .found-glass {
    background: var(--background);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}
@supports not (backdrop-filter: blur(1px)) {
  .found-glass { background: rgba(var(--background-rgb), 0.96); }
}
@media (prefers-reduced-motion: reduce) {
  .found-glass { transition: none; }
}
```

The `@supports` fallback uses 0.96 rather than fully opaque so the panel still hints at depth without blurring.

## How the theme is built, and where the CSS goes

- **Tokens** come from `snippets/css-variables.liquid`: `--background`, `--background-rgb`, `--text-color`, `--text-color-light`, `--header-background`, `--header-border-color`, `--navigation-background-rgb`, `--heading-font-family`, `--text-font-family`, `--border-color`. Prefer these to hard-coded hex so a settings change in the Shopify editor still flows through. Current values: background `#ffffff`, text `#494949`, headings `#190d04`, light text `#6e6e6e`, taupe button `#806f64`, sale red `#9c2f39`.
- **Section-scoped styles** live in a `<style>` block at the bottom of the section file, under a comment banner (see `.ppv1-sticky-bar` near the end of `sections/main-product.liquid` and `.cl-sticky-bar` in `sections/main-collection.liquid`). Put a glass rule there when it belongs to one section. Put it in `assets/theme.css` only when it applies site-wide (header, drawers).
- **Theme-wide overrides** that must beat app or widget CSS go in the `<style>` block near the end of `<head>` in `layout/theme.liquid`, where the sticky-bar and chat-widget rules already sit.
- **Class naming** follows the file's own prefix: `ppv1-` on the product page, `cl-` on collection, `FoundMegaMenu__` in the header, BEM-style `Block__Element--modifier` in theme.css. Add glass as a modifier or a new element, not a global `.glass` class.
- **Breakpoints.** Mobile chrome switches at `max-width: 999px`. The chat widget has its own 768px breakpoint. Fixed bottom bars pad with `env(safe-area-inset-bottom)`.
- **Stacking.** Drawer `z-index: 20`; mobile sticky bars `999`; chat widget `2147483000`. Anything fixed to the bottom must also hide under `html.drawer-open` (rule in `layout/theme.liquid`) and may need `--theme-sticky-bar-height` updated so the chat launcher lifts above it.
- **Liquid settings.** If the effect is a design choice the store owner might want to toggle, expose it as a section `checkbox`, `select` or `range` setting in the schema and read it in the style block, rather than hard-coding. Default a toggle to the state the user asked for; default an optional asset (an image behind a section) to none so the live page is unchanged until the merchant chooses. Keep the schema change minimal and give the setting a plain-English label.
- **Known rough edges, leave them alone.** The `main-product.liquid` schema has a trailing comma after its last block (Shopify tolerates it, strict JSON parsers do not); don't fix it in passing, and don't let it stop you validating the part you edited. Two `.ppv1-` rules declare Figtree that never loads (see fonts above).
- **Avoid nesting glass.** A frosted mega menu inside a frosted header blurs a blur; pick one layer.

Surface-by-surface starting points (header, mega menu, drawers, overlays on images) are in `references/surfaces.md`. Read it when the request names one of those surfaces.

## Workflow

1. **Branch first.** `main` is the live theme. Create or switch to a feature branch before editing, and do not commit to `main` unless asked.
2. **Find the existing rule** for the surface before adding one. Most chrome already has a background, border and transition; extend it rather than stacking a second class.
3. **Edit, then explain.** Name the file and selector you changed, what overlaps the surface so the frost is visible, and the alpha/blur chosen and why.
4. **Preview** with `shopify theme dev` (the Shopify CLI is installed) or the theme's preview link, and check: desktop header over the hero, a mobile product page with the sticky bar, the cart drawer open, and once with "Reduce transparency" enabled in the OS. The chat launcher must still clear any bar you added or changed.
5. Report plainly if something could not be verified.

## Output

The deliverable is edited theme files, not a standalone HTML demo. Finish with a short note: files and selectors touched, the glass values used, what to look at in preview, and anything still unverified.
