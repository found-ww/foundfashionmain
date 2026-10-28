/*
 * GA4 purchase event — Shopify custom pixel
 *
 * The order confirmation (thank-you) page is rendered by Shopify checkout, not
 * by this theme, so this code cannot live in a .liquid file. Install it in:
 *   Shopify admin → Settings → Customer events → Add custom pixel
 * Paste this file in, then Save and Connect.
 *
 * Custom pixels run in a sandbox, so gtag has to be loaded here even though
 * the storefront already loads it.
 *
 * If the Google & YouTube app is connected with conversion tracking on, it
 * already sends `purchase` to GA4 — don't run both or revenue is doubled.
 */

const GA4_MEASUREMENT_ID = 'G-M18B4H7096';

const script = document.createElement('script');
script.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=' + GA4_MEASUREMENT_ID);
script.setAttribute('async', '');
document.head.appendChild(script);

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', GA4_MEASUREMENT_ID, { send_page_view: false });

analytics.subscribe('checkout_completed', (event) => {
  const checkout = event.data.checkout;
  const amount = (money) => (money && money.amount != null ? Number(money.amount) : 0);

  const coupon = (checkout.discountApplications || [])
    .filter((d) => d.type === 'DISCOUNT_CODE')
    .map((d) => d.title)
    .join(',');

  /* item_id matches the product.id used by view_item_list / select_item in the theme */
  const items = (checkout.lineItems || []).map((line, index) => {
    const variant = line.variant || {};
    const product = variant.product || {};
    return {
      item_id: product.id,
      item_name: product.title || line.title,
      item_brand: product.vendor,
      item_category: product.type,
      item_variant: variant.title,
      price: amount(variant.price),
      quantity: line.quantity,
      index: index
    };
  });

  gtag('event', 'purchase', {
    transaction_id: (checkout.order && checkout.order.id) || checkout.token,
    value: amount(checkout.totalPrice),
    tax: amount(checkout.totalTax),
    shipping: amount(checkout.shippingLine && checkout.shippingLine.price),
    currency: checkout.currencyCode,
    coupon: coupon || undefined,
    items: items
  });
});
