# Vault Broker Dashboard - Template Fused Version

This version is built from the original downloaded Vault template files. It does **not** use a freshly designed custom interface.

## What was done

- Merged the scattered folder-by-folder Vault download into one static project.
- Preserved the original Vault HTML, Tailwind/shadcn-style classes, Next static assets, charts, cards, tables and layout.
- Duplicated existing Vault interfaces to create missing broker dashboard screens.
- Added one small runtime patch file: `broker-nav.js`.
- `broker-nav.js` only aligns navigation, page labels and local links to the broker/investment workflow.

## Main workflow navigation

- Overview: Dashboard, Notifications
- Wallet: Wallet Overview, Deposit Funds, Withdraw Funds, Transactions
- Investments: Investment Plans, Active Investments, Portfolio Management, Dividends & Profits
- Trading: Market Watch, Trading Terminal, Watchlist, Order History, Options Access
- Risk & Reports: Risk Center, Reports & Statements, Analytics
- Account: KYC Verification, Profile, Settings, Support

## Page sources reused from the original template

- `dashboard.html` remains the original dashboard interface.
- `wallet.html` was duplicated from the original dashboard interface.
- `investment-plans.html` and `active-investments.html` were duplicated from the original portfolio interface.
- `trading.html` was duplicated from the original stock detail interface.
- `transactions.html` was duplicated from the original order history interface.
- `risk.html` was duplicated from the original analytics interface.
- `reports.html` was duplicated from the original tax/report interface.
- `deposit.html`, `withdraw.html`, and `options-access.html` were duplicated from the original settings/form interface.
- `kyc.html` was duplicated from the original profile interface.

## How to run

Open `index.html` directly, or serve the folder with:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Notes

This is still a static template prototype. It has no backend, no real trading execution, no wallet processor, and no live market API yet.
