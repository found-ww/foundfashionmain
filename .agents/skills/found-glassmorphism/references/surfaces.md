# Found Fashion glass surfaces

Starting points for the surfaces that come up most. Each one names the existing selector to extend, what sits behind it, and the values that have looked right for this brand. Adjust alpha to the imagery actually underneath; never copy blindly.

## Contents

1. Header over the hero (transparent header)
2. Sticky header after scroll
3. Mega menu dropdown
4. Mobile sticky bars (the house recipe)
5. Cart drawer and sidebar menu
6. Info cards, price chips and badges over product images
7. Text panel over a slideshow or background-video hero
8. Popup and newsletter modal

---

## 1. Header over the hero

Markup: `sections/header.liquid` renders `<header class="Header Header--transparent ...">` when the first section is a slideshow, image-with-text-overlay or background video (`use_transparent_header`). Base rule: `.Header` in `assets/theme.css` (around line 8149) sets `background: var(--header-background)` with a 0.3s background transition; `.supports-sticky .Search[aria-hidden=true] + .Header--transparent` clears it.

Treatment: keep the transparent state transparent (the hero should breathe) and frost only once the user scrolls, see §2. If the owner wants frost immediately over the hero, use a *light* frost so the photo still reads:

```css
.supports-sticky .Search[aria-hidden=true] + .Header--transparent {
  background: rgba(var(--background-rgb), 0.55);
  -webkit-backdrop-filter: blur(16px) saturate(115%);
  backdrop-filter: blur(16px) saturate(115%);
  box-shadow: 0 -1px rgba(0, 0, 0, 0.06) inset; /* the theme's hairline bottom edge */
}
```

Logo and icons swap to the transparent variants in this state; make sure the frost does not reintroduce the dark logo on a light frost or vice versa.

## 2. Sticky header after scroll

`section.settings.use_sticky_header` sets `--use-sticky-header: 1`. The header becomes `position: sticky` and product grids scroll under it.

```css
.Header {
  background: rgba(var(--background-rgb), 0.88);
  -webkit-backdrop-filter: blur(20px) saturate(120%);
  backdrop-filter: blur(20px) saturate(120%);
  box-shadow: 0 -1px var(--header-border-color) inset;
}
```

Keep `var(--header-background)` in the `prefers-reduced-transparency` fallback. Do not add a drop shadow; the inset hairline is the brand's separator.

This is CSS only. The header is sticky already, and over the white page top the frost is invisible, so no scroll listener or "stuck" class is needed. Scope by template with the body class `layout/theme.liquid` prints (`.template-collection`, `.template-product`, ...) when the owner asks for one page type. Put the rule inside the existing `{%- if section.settings.use_sticky_header -%}` style block in `sections/header.liquid`, ideally behind a new checkbox.

One thing to mention to the owner: on desktop collection pages `.CollectionToolbar--top` (filters and sort) is also sticky, directly under the header, with a solid `var(--background)`. Products pass behind that solid strip before they blur under the header. Frosting the toolbar with the same values makes one continuous glass band; say so and let them decide.

## 3. Mega menu dropdown

Markup: `.MegaMenu.FoundMegaMenu` inside `sections/header.liquid`, styles under the "Found Fashion — Mega Menu Dropdown" banner in that file. Base `.MegaMenu` in theme.css sets `background: var(--header-background)` and a bottom hairline. It is absolutely positioned under the header, so the page content scrolls behind it.

```css
.FoundMegaMenu {
  background: rgba(var(--background-rgb), 0.9);
  -webkit-backdrop-filter: blur(20px) saturate(120%);
  backdrop-filter: blur(20px) saturate(120%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
```

If the header is also frosted (§2), do not frost the menu as well: a blurred panel over a blurred panel doubles the cost and muddies both. Pick the header or the menu.

The product tiles inside the menu stay solid; the frost is the backdrop of the menu, not of each card.

## 4. Mobile sticky bars (the house recipe)

`.ppv1-sticky-bar` at the end of `sections/main-product.liquid` and `.cl-sticky-bar` in `sections/main-collection.liquid`, both `max-width: 999px` only. They are the reference implementation: white at 0.85 to 0.9, 20px blur, `border-top: 1px solid rgba(0,0,0,0.06)`, `padding-bottom: calc(14px + env(safe-area-inset-bottom))`, `z-index: 999`, hidden under `html.drawer-open`.

Any new bottom bar copies this block, uses the section's own class prefix, and sets `--theme-sticky-bar-height` on `<html>` once measured so the chat launcher (`#ff`) lifts above it. The chat widget itself cannot be styled from this repo.

## 5. Cart drawer and sidebar menu

Markup: `snippets/cart-drawer.liquid` renders `#sidebar-cart.Drawer.Drawer--fromRight`; the sidebar menu uses the same `.Drawer` class. `z-index: 20`. The page is behind the panel, the scrim is behind the panel too.

```css
.Drawer {
  background: rgba(var(--background-rgb), 0.92);
  -webkit-backdrop-filter: blur(24px) saturate(115%);
  backdrop-filter: blur(24px) saturate(115%);
}
```

Keep the alpha high: the cart holds prices and the checkout button, and the page behind can be a bright product grid. Leave the scrim (`.PageOverlay` or equivalent) as a plain `rgba(0,0,0,0.x)` tint; frosting the scrim blurs the whole page and tanks scroll performance.

## 6. Info cards, price chips and badges over product images

Product media on the product page uses the `ppv1-` prefix; collection tiles come from `snippets/product-item.liquid`. These float over photography, which is where glass looks best in this theme.

```css
.ppv1-media__chip {
  position: absolute;
  left: 16px;
  bottom: 16px;
  padding: 8px 12px;
  background: rgba(var(--background-rgb), 0.78);
  -webkit-backdrop-filter: blur(16px) saturate(120%);
  backdrop-filter: blur(16px) saturate(120%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  font-family: var(--heading-font-family);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #171513;
}
```

Font inside the `ppv1-` block is `'Jost', sans-serif` (loaded site-wide); do not copy Figtree from `.ppv1-meta__key`, it never loads here. Square corners (max 2px). One chip per image. Give the chip `pointer-events: none` so taps still open the lightbox. For "sold" or "reserved" states use the same chip, never an opacity fade on the image (the mega menu once faded sold-out tiles and it was removed for looking broken).

Mobile gotcha: below the product page's `max-width: 900px` block, `.ppv1-hero__gallery` becomes a horizontal scroll-snap scroller, so a chip placed inside the first slide swipes away with it. That is usually fine for a condition label (it belongs to the main photo); say so in the note. If the owner wants it to persist across slides, it needs a `position: relative` wrapper around the scroller, which is a layout change worth calling out before doing.

## 7. Text panel over a slideshow or background-video hero

`sections/slideshow.liquid`, `sections/image-with-text-overlay.liquid`, `sections/background-video.liquid`. A heading and CTA sit over a full-bleed photo or video.

Light frost for bright, airy campaign images:

```css
.Slideshow__Content--glass {
  padding: 32px 40px;
  background: rgba(var(--background-rgb), 0.68);
  -webkit-backdrop-filter: blur(20px) saturate(120%);
  backdrop-filter: blur(20px) saturate(120%);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
```

Dark frost for moody, dark imagery, the one place dark glass fits:

```css
.Slideshow__Content--glassDark {
  background: rgba(23, 21, 19, 0.55);
  -webkit-backdrop-filter: blur(20px) saturate(110%);
  backdrop-filter: blur(20px) saturate(110%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
}
```

Expose the choice as a section `select` setting (`none / light / dark`) so merchandisers can match it to each campaign image. Video backdrops re-blur every frame; keep the panel small.

## 8. Popup and newsletter modal

`sections/popup.liquid`, tokens `--newsletter-popup-background` and `--newsletter-popup-text-color`. The modal sits over a dimmed page.

Frost the modal panel at 0.9+, keep the hairline border, square corners, and leave the overlay as a plain tint. A 0.3s opacity fade is the only motion.

## 9. White pages: FAQ, policies, contact, account, blog index

Nothing sits behind these but `var(--background)`. Glass here is a no-op with a paint cost, and a gradient wash painted behind the section to make it visible is a new design element on a brand that keeps its pages white. Recommend the solid treatment and show it:

```css
.ff-faq__item {
  background: var(--background);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
```

If the owner insists on glass, add an `image_picker` ("Image behind the cards") defaulting to none, apply the §7 light-frost values only when an image is set, and keep the current look as the default state.
