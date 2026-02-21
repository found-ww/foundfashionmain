# Product Page Redesign Prompt — V1 Layout

## Overview

Redesign the Shopify product page (`sections/main-product.liquid`) for **Found Fashion** to match the V1 design. The new layout is editorial, minimal, and luxury-focused — structured in clear vertical sections rather than a single stacked product block.

The existing live product page can be seen here:
**https://found-fashion.com/products/hermes-lindy-26-bag-in-etoupe-with-gold-hardware**

The target design is the V1 layout described in full below.

---

## Design System

**Typography**
- Headings: Uppercase, wide letter-spacing (`letter-spacing: 0.1em`), serif or light sans-serif
- Body: Small, clean sans-serif, `font-size: 13–14px`
- All caps labels and section titles

**Colours**
- Background: White (`#ffffff`)
- Accent / CTA primary: Warm taupe/mocha (`#8B7355` or similar)
- Accent secondary: Beige/sand (`#F5F0E8`) — used for "Discover the Story" section background
- Text: Near-black (`#1a1a1a`)
- Borders/dividers: Light grey (`#e5e5e5`)

**Spacing**
- Generous padding between sections (`80px` top/bottom on desktop)
- Inner content max-width: `1200px`, centred

**Buttons**
- Primary (Add to Cart): Filled taupe background, white text, no border radius (square edges)
- Secondary (Make an Offer): White background, dark border, dark text, square edges
- Tertiary (Chat to Our Team, Read More): White background, thin dark border, uppercase small text

---

## Page Layout — Section by Section

### 1. Hero Section (Product Info + Main Image)

**Layout:** Two-column grid on desktop (60% image / 40% info). Single column on mobile (image on top, info below).

**Left column — Main product image:**
- Large, full-bleed image within the column
- Light grey background (`#f5f5f5`) behind the image
- Image fills the column height

**Right column — Product details:**
- Brand name (e.g. `HERMÈS`) in small uppercase, muted colour, above the title
- Product title in large uppercase with wide letter-spacing
- Metadata list (no bullet points, just key: value lines):
  - Material
  - Stamp
  - Condition
  - Location
- Horizontal rule (`<hr>`) below metadata
- Price displayed prominently
- Two CTA buttons side by side:
  1. **ADD TO CART — £X,XXX** (primary filled taupe button)
  2. **MAKE AN OFFER** (secondary outlined button)

---

### 2. Image Carousel Strip

**Layout:** Horizontal scrollable row of images below the hero, full width.

- Shows 3 images visible at once on desktop, scroll left/right
- Left arrow navigation button (`←`) visible on the left edge
- Images have a light grey background, equal height (~300px on desktop)
- No image captions
- On mobile: swipeable, shows 1.2 images (peek at next)

---

### 3. All Details Section

**Layout:** Two-column on desktop. Left column (~40%) has description + CTA. Right column (~60%) has accordion.

**Left column:**
- Section heading: `ALL DETAILS` in uppercase
- Short paragraph description of the product (pulled from product description metafield or body)
- `CHAT TO OUR TEAM` button (tertiary outlined style, uppercase)

**Right column — Accordion (collapsed by default, expand on click):**
- **Product Details** `+`
  - Brand, Colour, Material, Hardware, Stamp, Dimensions, Condition (all from product metafields/tags)
- **Delivery** `+`
  - DHL delivery info (1–2 working days, receipt via email)
- **Payment Methods** `+`
  - Visa, Mastercard, Maestro, Amex, Apple Pay, PayPal. WeChat/Alipay via contact.

Each accordion row has a thin bottom border. The `+` icon rotates to `−` when open.

---

### 4. Discover the Story Section

**Layout:** Two-column, full-width, on a beige/sand background (`#F5F0E8`).

**Left column (~50%):**
- Large editorial image (can use the second product image or a lifestyle image)
- Image is full height of the section, no padding

**Right column (~50%):**
- Section heading: `DISCOVER THE STORY` in uppercase
- 3–4 sentences of editorial copy about the product/brand story (from product description or a metafield)
- `READ MORE` button (tertiary outlined style) — links to the relevant magazine/blog article if available

---

### 5. You May Also Like

**Layout:** 4-column product grid on desktop, 2-column on mobile.

- Section heading: `YOU MAY ALSO LIKE` in uppercase, centred
- Pull from Shopify's `product_recommendations` API (or the collection the product belongs to)
- Each product card shows:
  - Square product image (white/grey background)
  - Brand name in small uppercase
  - Product title in small uppercase
  - Price
- No "Add to Cart" on the cards — clicking the card goes to the product page

---

## Implementation Notes

- The file to modify is `sections/main-product.liquid`
- Additional sections (All Details accordion, Discover the Story, You May Also Like) can be added as separate section files and rendered in `templates/product.json` if preferred, or embedded directly in `main-product.liquid`
- New CSS should be scoped to this section using a `.product-page-v1` wrapper class to avoid affecting other pages
- All existing Shopify schema settings and metafields should be preserved — only the HTML/CSS structure and visual layout is being changed
- The `product-recommendations.liquid` section can be reused for the "You May Also Like" grid
- The WhatsApp contact link (`https://wa.me/85293476168`) should be preserved and used as the `CHAT TO OUR TEAM` button href
- Accordion functionality should be implemented in vanilla JS (no jQuery dependency)
- The image carousel should use CSS scroll-snap for performance, with a JS-powered prev/next arrow

---

## Reference

- **Live product page:** https://found-fashion.com/products/hermes-lindy-26-bag-in-etoupe-with-gold-hardware
- **Target design:** V1.png (uploaded separately)
- **Theme repo:** https://github.com/found-ww/foundfashionmain
- **Key file:** `sections/main-product.liquid`
