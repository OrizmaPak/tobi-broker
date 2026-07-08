# [APP_NAME] Static Front-Facing Website

This project is a patched static frontend website based on a downloaded BullPort template. It is intended to serve as the public-facing broker and investment website, not the client portal and not an admin dashboard.

## How to open locally

Open [index.html](C:/Users/Oreva/Desktop/oreva/PERSONAL/TOBI/BROKER/The%20front-facing%20website/index.html) directly in a browser, or serve the folder with any simple static server.

## Main file structure

- `index.html`
- `pages/`
- `assets/js/static-data.js`
- `assets/js/static-site.js`
- `assets/css/static-site.css`
- template assets under `wp-content/` and `wp-includes/`

## Where to edit brand data

Edit `brand` inside [assets/js/static-data.js](C:/Users/Oreva/Desktop/oreva/PERSONAL/TOBI/BROKER/The%20front-facing%20website/assets/js/static-data.js).

## Where to edit navigation

Edit `navigation` and `footerNavigation` inside [assets/js/static-data.js](C:/Users/Oreva/Desktop/oreva/PERSONAL/TOBI/BROKER/The%20front-facing%20website/assets/js/static-data.js). Shared rendering is handled in [assets/js/static-site.js](C:/Users/Oreva/Desktop/oreva/PERSONAL/TOBI/BROKER/The%20front-facing%20website/assets/js/static-site.js).

## Where to edit portfolios

Edit the `portfolios` array in [assets/js/static-data.js](C:/Users/Oreva/Desktop/oreva/PERSONAL/TOBI/BROKER/The%20front-facing%20website/assets/js/static-data.js).

## Where to edit market data

Edit the `instruments` array in [assets/js/static-data.js](C:/Users/Oreva/Desktop/oreva/PERSONAL/TOBI/BROKER/The%20front-facing%20website/assets/js/static-data.js).

## Where to edit fees

Edit the `fees` array in [assets/js/static-data.js](C:/Users/Oreva/Desktop/oreva/PERSONAL/TOBI/BROKER/The%20front-facing%20website/assets/js/static-data.js).

## Where to edit FAQs

Edit the `faqs` array in [assets/js/static-data.js](C:/Users/Oreva/Desktop/oreva/PERSONAL/TOBI/BROKER/The%20front-facing%20website/assets/js/static-data.js).

## How the demo market feed works

The demo feed is implemented in [assets/js/static-site.js](C:/Users/Oreva/Desktop/oreva/PERSONAL/TOBI/BROKER/The%20front-facing%20website/assets/js/static-site.js). It:

- updates only tables rendered with `data-market-table`
- applies small random price and percentage changes every 7 seconds
- updates the mini sparkline inline
- uses local static data only
- does not call any live financial API

## Pages included

- `index.html`
- `pages/portfolios.html`
- `pages/portfolio-conservative-income.html`
- `pages/portfolio-balanced-growth.html`
- `pages/portfolio-commodity-opportunity.html`
- `pages/portfolio-dividend-income.html`
- `pages/portfolio-equity-growth.html`
- `pages/portfolio-premium-managed.html`
- `pages/markets.html`
- `pages/stocks-etfs.html`
- `pages/commodities.html`
- `pages/options.html`
- `pages/how-it-works.html`
- `pages/pricing-fees.html`
- `pages/education.html`
- `pages/education-detail.html`
- `pages/risk-disclosure.html`
- `pages/faqs.html`
- `pages/about.html`
- `pages/contact.html`
- `pages/login.html`
- `pages/register.html`
- `pages/terms.html`
- `pages/privacy.html`

## Known limitations

- Static frontend only
- No backend
- No real live financial API
- Login/register are placeholders
- Market feed is demo only
